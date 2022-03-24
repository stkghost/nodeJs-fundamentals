const express = require('express');
const { v4: uuidv4 } = require('uuid')
const port = 3333

const app = express();

app.use(express.json())

const customers = []

function verifyExistingAccount(request, response, next) {
  const { cpf } = request.headers

  const customer = customers.find(item => item.cpf === cpf)

  if (!customer) {
    return response.status(400).json({ message: "Conta não encontrada!" })
  }

  request.customer = customer

  return next()
}

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit") {
      return acc + operation.amount
    } else {
      acc - operation.amount
    }
  }, 0)

  return balance

}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;
  const id = uuidv4();

  const alreadyExistis = customers.some(item => item.cpf === cpf)

  if (alreadyExistis) {
    return response.status(400).json({ message: "Este cpf já está cadastrado!" })
  }
  customers.push({
    cpf,
    name,
    id,
    statement: []
  })

  return response.status(201).send()
})


app.get("/statement", verifyExistingAccount, (request, response) => {

  // @ts-ignore
  const { customer } = request
  return response.json(customer.statement)
})

// @ts-ignore
app.post("/deposit", verifyExistingAccount, (request, response) => {
  // @ts-ignore
  const { description, amount } = request.body

  // @ts-ignore
  const { customer } = request

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: 'credit'
  }

  customer.statement.push(statementOperation)

  return response.status(201).send()
})

app.post("/withdraw", verifyExistingAccount, (request, response) => {
  const { amount, description } = request.body
  // @ts-ignore
  const { customer } = request

  const balance = getBalance(customer.statement)
  if (balance < amount) {
    return (response.status(400).json({ error: "Insufficient funds!" }))
  }

  const statementOperation = {
    amount,
    description,
    created_at: new Date(),
    type: 'debit'
  }

  customer.statement.push(statementOperation)
  return (response.status(200).json({ message: "show de bola" })).send()
})

app.listen(port);