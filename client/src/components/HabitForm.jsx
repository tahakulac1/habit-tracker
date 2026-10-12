import { useState } from 'react'

// function that will run when user click enter key or enter button.
function HabitForm({ onAdd}) {
    const [title, setTitle] = useState('') //state that keeps the input on memory(empty string in the beginning '').
    const handleSubmit = (e) => {
        e.preventDefault() // prevent page refresh.

        if (!title.trim()) return // do not allow entring empty sting.
        
        onAdd(title) // send the input to app.jsx .

        setTitle('') // clear the form, make ready for a new habit.
    }
    return (
        <form onSubmit={handleSubmit} className="habit-form">
            <input
              type="text"
              placeholder="Enter a new habit.."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit">Enter</button>
        </form>
    )
}
export default HabitForm