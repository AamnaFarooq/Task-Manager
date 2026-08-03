const Modal = (props) => {
    const { priorityValue = {} } = props
    
  return (
    <div className="modal-overlay">
        <form className="modal-card" onSubmit = {props.onSubmit}>
            {props.errorMessage && <div className="error-banner">{props.errorMessage}</div>}
            <h1 className="modal-title" >New Task</h1>

            <label className="field-label">Task</label>
            <input value={props.taskValue} onChange={props.taskOnChange}/>

            <label className="field-label">Due Date</label>
            <input type="date" value={props.dateValue} onChange={props.dateOnChange}/>

            <label className="field-label">Category</label>
            <select value={props.categoryValue} onChange={props.categoryOnChange}>
                <option value="">Select a Category</option>
                <option value="School">School</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
            </select>

            <label className="field-label">Priority</label>
            <div className="priority-group">
                <button type="button" className={`priority-btn high ${priorityValue.high ? 'selected' : ''}`} onClick={props.priority} value="High">High</button>
                <button type="button" className={`priority-btn medium ${priorityValue.medium ? 'selected' : ''}`} onClick={props.priority} value="Medium">Medium</button>
                <button type="button" className={`priority-btn low ${priorityValue.low ? 'selected' : ''}`} onClick={props.priority} value="Low">Low</button>
            </div>
            
            <div className="modal-footer">
                <button type="button" className="btn-cancel" value="cancel" onClick={props.onClick}>Cancel</button>
                <button type="submit" className="btn-save" >Save Task</button> 
            </div>
        </form>
    </div>        
        
  )
}
export default Modal