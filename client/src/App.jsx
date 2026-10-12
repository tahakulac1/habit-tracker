import { useState, useEffect } from 'react'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import './App.css'

const API_URL = 'http://localhost:3000'

function App(){
  const [habits, setHabits] = useState([])

  useEffect(() => {
    fetch(`${API_URL}/habits`)
    .then((res) => res.json())
    .then((data) => setHabits(data))
    .catch((err) => console.error('Error fetching habits:', err))
  }, [])

  const addHabit = async (title) => {
    try {
      const res = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title}),
      })
      const newHabit = await res.json()
      setHabits([...habits, newHabit])
    } catch (err) {
      console.error("Error adding habit:", err )
    }
  }

  const toggleHabit = async (id) => {
    try {
      const res = await fetch(`${API_URL}/habits/${id}`, {
        method: 'PUT',
      })
      const updatedHabit = await res.json()
      setHabits(habits.map((h) => (h.id === id ? updatedHabit : h)))
    } catch (err) {
      console.error('Error updating habit:', err)
    }
  }

  const deleteHabit = async (id) => {
    try {
      await fetch(`${API_URL}/habits/${id}`, {
        method: 'DELETE',
      })
      setHabits(habits.filter((h) => h.id !== id))
    } catch (err) {
      console.error('Error deleting habit', err)
    }
  }
  return (
    <div className="app-container">
     <h1> Habit Tracker</h1>
     <HabitForm onAdd={addHabit} />
     <HabitList 
       habits={habits}
       onToggle={toggleHabit}
       onDelete={deleteHabit}
       />
    </div>
  )
}
export default App