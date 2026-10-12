import HabitItem from './HabitItem'
function HabitList({ habits, onToggle, onDelete }) {
    if(habits.length === 0) {
        return <p className="empty-message">No habits yet. Add one above</p>
    }
    return (
        <div className="habit-list">
            {habits.map((habit) => (
                <HabitItem
                  key={habit.id}
                  habit={habit}
                  onToggle={onToggle}
                  onDelete={onDelete}
                /> 
            ))}
        </div>
    )
}
export default HabitList