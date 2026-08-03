const Filter = (props) => {
  return (
      <div className="filter-bar">
        <input  value={props.value} onChange={props.onChange} placeholder="Search tasks…"/>
        <button type="button" className={`filter-btn ${props.activeFilter === 'all' ? 'active' : ''}`} onClick={props.showAllTasks}>All</button>
        <button type="button" className={`filter-btn ${props.activeFilter === 'active' ? 'active' : ''}`} onClick={props.showActiveTasks}>Active</button>
        <button type="button" className={`filter-btn ${props.activeFilter === 'completed' ? 'active' : ''}`} onClick={props.showCompletedTasks}>Completed</button>
      </div>
  )
}
export default Filter