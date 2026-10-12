function HabitItem({ habit, onToggle, onDelete }) {
    return (
        <div className="habit-item">
            <span
            style={{
                textDecoration: habit.completed ? 'line-through' : 'none',
                opacity: habit.completed ? 0.6 : 1,
                }}
                >
                    {habit.title}
                </span>

                <div className="habit-actions">
                    <button onClick={() => onToggle(habit.id)}>
                        {habit.completed ? 'Undo' : 'Done'}
                    </button>

                    <button onClick={() => onDelete(habit.id)}>
                        Delete
                    </button>
                </div>
            </div>        

    )
}
export default HabitItem