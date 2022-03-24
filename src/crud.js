const express = require('express')

/**
 * POST: CREATE
 * GET: READ
 * PUT: UPDATE
 * PATCH: UPDATE - Partial Update
 * DELETE:  DELETE
 */

const app = express()

app.use(express.json())

app.get("/courses", (request, response) => {

  const query = request.query
  console.log(query)

  return response.json([
    "curso 1",
    "curso 2",
    "curso 3",
    "curso 4",
  ])
})

app.post("/courses", (request, response) => {

  const body = request.body
  console.log(body)
  return response.json([
    "curso 1",
    "curso 2",
    "curso 3",
    "curso 4",
    "curso 5",
  ])
})

app.put("/courses/:id", (request, response) => {

  if (request.params.id === "1") {
    return response.json({
      id: request.params.id,
      cursos: [
        "curso Novo",
        "curso 2",
        "curso 3",
        "curso 4",
        "curso 5",
      ]
    })
  } else {
    return response.json("Curso não encontrado")
  }
})


app.patch("/courses/:id", (request, response) => {
  return response.json([
    "curso Novo",
    "curso Mais novo ainda",
    "curso 3",
    "curso 4",
    "curso 5",
  ])
})

app.delete("/courses/:id", (request, response) => {
  return response.json([
    "curso Novo",
    "curso Mais novo ainda",
    "curso 4",
    "curso 5",
  ])
})

app.listen(3333)