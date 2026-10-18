import { useState, useEffect,useRef } from 'react'
import HabitForm from './components/HabitForm'
import HabitList from './components/HabitList'
import UndoToast from './components/UndoToast'
import './App.css'

const API_URL = 'http://localhost:3000'

function App(){
  const [habits, setHabits] = useState([])
  const [deletedHabit, setDeletedHabit] = useState(null)
  const deleteTimerRef = useRef(null)

  useEffect(() => {
    fetch(`${API_URL}/habits`)
    .then((res) => {
        if(!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }
        return res.json()
      })
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
      if(!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }
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
      if(!res.ok) {
        throw new Error(`Request failed with status ${res.status}`)
      }
      const updatedHabit = await res.json()
      setHabits(habits.map((h) => (h.id === id ? updatedHabit : h)))
    } catch (err) {
      console.error('Error updating habit:', err)
    }
  }

  const deleteHabit = (id) => {
    if(deleteTimerRef.current && deletedHabit) {
      clearTimeout(deleteTimerRef.current)
      fetch(`${API_URL}/habits/${deletedHabit.id}`, { method: 'DELETE'})
    }

    const habitToDelete = habits.find((h) => h.id ===id)

    setHabits((prev) => prev.filter((h) => h.id != id))
    setDeletedHabit(habitToDelete)

    deleteTimerRef.current = setTimeout(async () => {
      try {
        await fetch(`${API_URL}/habits/${id}`, {
          method: 'DELETE',
        })
        setDeletedHabit(null)
        deleteTimerRef.current = null
      } catch (err) {
        console.error('Error deleting Habit:', err)
      }
    }, 5000)
  }
  
  const undoDelete = () => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current)
      deleteTimerRef.current = null
    }
    if(deletedHabit) {
      setHabits((prev) => [...prev, deletedHabit])
      setDeletedHabit(null)
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
       <UndoToast habit={deletedHabit} onUndo={undoDelete}/>
    </div>
  )
}
export default App