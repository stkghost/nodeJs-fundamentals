const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers

  const user = users.find(item => item.username === username)

  if (!user) {
    return response.status(400).json({ error: "Usuário não encontrado!" })
  }

  request.user = user
  return next()
}

function alreadyExistis(request, response, next) {
  const { username } = request.body

  const alreadyExistis = users.some(user => user.username === username)
  if (alreadyExistis) {
    return response.status(400).json({ message: "Usuário já cadastrado!" })
  }

  return next()
}

app.post("/user", alreadyExistis, (request, response) => {
  const { name, username } = request.body
  const id = uuidv4()

  const user = {
    name,
    username,
    id,
    todos: []
  }
  users.push(user)

  return response.status(201).json({ message: "Usuário cadastrado com sucesso!" })
});

app.get("/user", checksExistsUserAccount, (request, response) => {
  // @ts-ignore
  const { user } = request

  return response.status(200).json(user)
})

//================================================================

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // @ts-ignore
  const { user } = request

  const { title, deadline } = request.body

  const todo = {
    title,
    deadline,
    done: false,
    id: user.todos.length + 1
  }

  user.todos.push(todo)
  return response.status(201).json(user)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // @ts-ignore
  const { user } = request

  return response.status(200).json(user.todos)
});


app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // @ts-ignore
  const { user } = request
  const { id } = request.params
  const { title, deadline } = request.body

  let index = user.todos.findIndex((todo) => todo.id == id)
  const hasTodo = user.todos.some((todo) => todo.id == id)

  const todo = {
    id: user.todos[index].id,
    title,
    done: user.todos[index].done,
    deadline
  }

  user.todos[index] = todo
  console.log(user.todos[index], 'alr')

  if (!hasTodo) {
    return response.status(400).json({ error: "Nenhum Todo encontrado!" })
  }

  return response.status(200).json(user.todos)

});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // @ts-ignore
  const { user } = request
  const { id } = request.params
  const { done } = request.body

  let index = user.todos.findIndex((todo) => todo.id == id)
  const hasTodo = user.todos.some((todo) => todo.id == id)

  const todo = {
    id: user.todos[index].id,
    title: user.todos[index].title,
    done: done,
    deadline: user.todos[index].deadline
  }

  user.todos[index] = todo

  if (!hasTodo) {
    return response.status(400).json({ error: "Nenhum Todo encontrado!" })
  }

  return response.status(200).json(user.todos)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // @ts-ignore
  const { user } = request
  const { id } = request.params

  const filtered = user.todos.filter(todo => todo.id != id)

  user.todos = filtered
  console.log(filtered)

  return response.status(200).json(user)

});

module.exports = app;

app.listen(3333)