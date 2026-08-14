require('dotenv').config()

const express = require('express')
const app = express()

const Task = require('./models/task')

app.use(express.json())
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Task Manager</h1>')
})

app.get('/api/tasks', (request, response) => {
    Task.find({}).then(tasks => {
        response.json(tasks)
    })
})

app.get('/api/tasks/:id', (request, response) => {
    const id = request.params.id
    const task = tasks.find(task => task.id === id)
    Task.findById(request.params.id)
        .then(task => {
            if (task){
                response.json(task)
            } else {
            // if the task doesn't exist
                response.status(404).end()
            }
        })
})

app.delete('/api/tasks/:id', (request, response) => {
    Task.findByIdAndDelete(request.params.id)
        .then(() => {
            response.status(204).end()
        })
})

//recieving data
app.post('/api/tasks', (request, response)=> {
    const body = request.body

    if (!body.title){
        return response.status(400).json({
            error:'title missing'
        })
    }
    const task = new Task({
        title: body.title,
        dueDate: body.dueDate,
        category: body.category,
        priority: body.priority,
        status: "Not Started",
        completed: body.completed ?? false
    })
    
    task.save().then(savedTask => {
        response.json(savedTask)
    })
})

//handling finished tasks
app.put('/api/tasks/:id',(request, response) => {
    const body = request.body
    
    Task.findByIdAndUpdate(
        request.params.id,
        body,
        {returnDocument: 'after'}
    ).then(updatedTask => {
        response.json(updatedTask)
    })
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})

