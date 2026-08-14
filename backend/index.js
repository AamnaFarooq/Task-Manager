const express = require('express')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(cors())

let tasks = [
    {
      "title": "read 10 minutes",
      "dueDate": "2026-08-03",
      "category": "Personal",
      "priority": {
        "high": false,
        "medium": false,
        "low": true
      },
      "status": "Not Started",
      "completed": true,
      "id": "DxYWL64hhZs"
    },
]

const generateId = () => {
    return Math.random().toString(36).slice(2, 13)
}

app.get('/', (request, response) => {
    response.send('<h1>Task Manager</h1>')
})

app.get('/api/tasks', (request, response) => {
    response.json(tasks)
})

app.get('/api/tasks/:id', (request, response) => {
    const id = request.params.id
    const task = tasks.find(task => task.id === id)

    if (task){
        response.json(task)
    } else {
        // if the task doesn't exist
        response.status(404).end()
    }
})

app.delete('/api/tasks/:id', (request, response) => {
    const id = request.params.id
    tasks = tasks.filter(task => task.id !== id)

    response.status(204).end()
})

//recieving data
app.post('/api/tasks', (request, response)=> {
    const body = request.body

    if (!body.title){
        return response.status(400).json({
            error:'title missing'
        })
    }
    const task = {
        title: body.title,
        dueDate: body.dueDate,
        category: body.category,
        priority: body.priority,
        status: "Not Started",
        completed: body.completed ?? false,
        id: generateId(),
    }
    tasks = tasks.concat(task)
    console.log(task)
    response.json(task)
})

//handling finished tasks
app.put('/api/tasks/:id',(request, response) => {
    const body = request.body
    const id = request.params.id

    const task = tasks.find(task => task.id === id)


    const changedTask = {
        ...task, 
        ...body
    }

    tasks = tasks.map(task => task.id === id? changedTask:task)
    response.json(changedTask)

})
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})

