const Task = (props) => {
  const priorityColor = (priority) => {
  if (priority?.high) return 'var(--high)'
  if (priority?.medium) return 'var(--medium)'
  if (priority?.low) return 'var(--low)'
  return null
  }

  if (props.filterTasks.length === 0) {
    return ( 
      <div className="empty-state">
        <p className="empty-state-title">No tasks yet</p>
        <p className="empty-state-subtitle">Add one to get started.</p>
      </div>
    )
  }

  return (
    <div className="task-list"> 
        {props.filterTasks.map(task => 
        <div 
          key={task.id} 
          className={`task-card ${task.completed ? 'completed' : ''}`}
          style={{ '--priority-color': priorityColor(task.priority) }}
        > 
        <input 
          className="task-checkbox"
          type="checkbox" 
          checked= {task.completed} 
          onChange={()=>props.toggleCompleted(task.id)}
        /> 
        <div className = "task-body">
          <span className="task-title">{task.title}</span>
          <span className="task-meta">
            <span>{task.category}</span>
            <span>{task.dueDate}</span> 
          </span>
        </div>
        <div className="task-actions">
          <button className="icon-btn" value = "Edit" onClick={()=>props.editTask(task.id)}>Edit</button> 
          <button className="icon-btn delete" onClick={()=>props.deleteTask(task.id)}>Delete</button> 
        </div>
        </div>)}       
    </div>
  )
}
export default Task