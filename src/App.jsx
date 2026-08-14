import { useState, useEffect } from 'react'
import axios from 'axios'
import Filter from './components/Filter'
import Modal from './components/Modal'
import Task from './components/Task'



const App = () => {
  const [tasks, setTasks] = useState([])
  const [searchTask, setSearchTask] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [newDate, setNewDate] = useState('')
  const [newCategory, setNewCategory] = useState('')
  const [newPriority, setNewPriority] = useState({
    high: false,
    medium: false,
    low: false
  })
  const [editingTask, setEditingTask] = useState(null)
  const [tasksFilter, setTasksFilter] = useState('all')
  const [errorMessage, setErrorMessage] = useState('')

  //reset form
  const clearModal = () => {
    setNewTask('')
    setNewDate('')
    setNewCategory('')
    setNewPriority({
      high: false,
      medium: false,
      low: false
    })
  }

  const showError = message => {
    setErrorMessage(message)

    setTimeout(() => {
      setErrorMessage('')
    }, 5000)
  }
  
  //Get task data from server
  useEffect(() => {
    axios
      .get("http://localhost:3001/api/tasks")
      .then(response => {
        console.log("promise fullfilled")
        setTasks(response.data)
        clearModal()
    })
      .catch(error => {
        console.error(error)
        showError('Could not load tasks.')
      })
  },[])

  //Add Task
  const addTask = (event) => {
    event.preventDefault()
    console.log(event)

    if (!newTask.trim()) {
      showError('Task title is required.')
      return
    }

    if (!newDate) {
      showError('Due date is required.')
      return
    }

    if (!newCategory) {
      showError('Category is required.')
      return
    }

    const hasPriority =
      newPriority.high ||
      newPriority.medium ||
      newPriority.low

    if (!hasPriority) {
      showError('Priority is required.')
      return
    }

    setErrorMessage('')


    const taskObject = {
        title: newTask,
        dueDate: newDate,
        category: newCategory,
        priority: newPriority,
        status: "Not Started",
        completed: false
      }

    // update task if edited
    if (editingTask === null){
      axios
        .post("http://localhost:3001/api/tasks", taskObject)
        .then(response => {
          console.log("promise fullfilled")
          setTasks(tasks.concat(response.data))
          closeModal()
      })
        .catch(error => {
          console.error(error)
          showError('Could not create the task')
        })
    } else {

      axios
        .put(`http://localhost:3001/api/tasks/${editingTask}`, taskObject)
        .then(response => {
          setTasks(tasks.map(task => task.id === editingTask? response.data:task))
          closeModal()
          setEditingTask(null)
          
      })
        .catch(error => {
          console.error(error)
          showError('Could not update the task')
        })
    }
  }
  

  
    // handle checkbox
  const toggleCompletedOf = (id) => {
    //We need to update this uniquly for each note, use put
    const task = tasks.find(t => t.id === id)
    const changedTask = {...task, completed: !task.completed }
    
    axios
      .put(`http://localhost:3001/api/tasks/${id}`, changedTask)
      .then(response => {
        console.log(changedTask)
        setTasks(tasks.map(task => task.id === id? response.data:task))
    })
      .catch(error => {
        console.error(error)
        showError("Could not update the task")
      })
  }

  //Delete task
  const deleteTaskOf = (id) => {
    const removeTask = tasks.filter(task => task.id !== id)

    axios
      .delete(`http://localhost:3001/api/tasks/${id}`)
      .then(response =>{
        console.log('task deleted', response)
        setTasks(removeTask)
      })
      .catch(error => {
        console.error(error)
        showError('Could not delete task')
      })
  }


  //modal behaviour
  const openAddModal = () => {
    clearModal()
    setEditingTask(null)
    setIsModalOpen(true)
  }

  //handle editing task
  const openEditModal = (id) => {
    const changeTask = tasks.find(task => task.id === id)

    setNewTask(changeTask.title)
    setNewDate(changeTask.dueDate)
    setNewCategory(changeTask.category)
    setNewPriority(changeTask.priority)
    setEditingTask(id)    
    setIsModalOpen(true)
  }

  const closeModal = () => {
    clearModal()
    setEditingTask(null)
    setIsModalOpen(false)
  }


  //handle searching for task 
  const handleSearchTask = (event) => {
    console.log("Searching for a task",event.target.value)
    setSearchTask(event.target.value)
  }

  //handle task change
  const handleTaskChange = (event) => {
    console.log("typing in a new task", event.target.value)
    setNewTask(event.target.value)
  }

  //handle date change
  const handleDateChange = (event) => {
    console.log("selecting a new date", event.target.value)
    setNewDate(event.target.value)
  }

  //handle category change
  const handleCategoryChange = (event) => {
    console.log("selecting a new category", event.target.value)
    setNewCategory(event.target.value)
  }

  //handle priority change
  const handlePriorityChange = (event) => {
    if (event.target.value === "High"){
      setNewPriority({high:true, medium:false, low:false})
    }
    else if (event.target.value === "Medium"){
      setNewPriority({high:false, medium:true, low:false})
    }
    else if (event.target.value === "Low"){
      setNewPriority({high:false, medium:false, low:true})
    }
    console.log("selecting a new priority", event.target.value)
  }



  //toggle between all, active, and completed tasks
  let tasksToShow = tasks

  if (tasksFilter === "active") {
    tasksToShow = tasks.filter(task => !task.completed )
  } else if (tasksFilter === "completed") {
    tasksToShow = tasks.filter(task => task.completed)
  }
  
  const filterTasks = tasksToShow.filter(task => task.title.toLowerCase().includes(searchTask.toLowerCase()))

  return (
    <div className="app-shell">
      <h1 className="app-title">Task Manager</h1>
      <Filter 
        value={searchTask} 
        onChange={handleSearchTask} 
        activeFilter={tasksFilter}
        showAllTasks={()=>setTasksFilter('all')} 
        showActiveTasks={()=>setTasksFilter('active')} 
        showCompletedTasks={()=>setTasksFilter('completed')}
      />
      <p className="task-count">{tasks.length} tasks</p>
      <Task filterTasks={filterTasks} toggleCompleted={toggleCompletedOf} editTask={openEditModal} deleteTask={deleteTaskOf}/>
      <button className="add-task-btn" onClick={openAddModal} value="Add Task">+ Add Task</button>
      {isModalOpen && 
        <Modal 
          errorMessage={errorMessage}
          onSubmit = {addTask} 
          onClick = {closeModal} 
          taskValue = {newTask} 
          taskOnChange = {handleTaskChange} 
          dateValue = {newDate} 
          dateOnChange = {handleDateChange} 
          categoryValue = {newCategory} 
          categoryOnChange = {handleCategoryChange} 
          priority = {handlePriorityChange}
          priorityValue={newPriority}
        />}
    </div>
  )
}

export default App 