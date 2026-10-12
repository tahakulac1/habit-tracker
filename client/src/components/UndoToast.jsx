function UndoToast({ habit , onUndo }) {
    if(!habit) return null

    return (
        <div className="undo-toast">
            <span>
                <strong>{habit.title}</strong> deleted.
            </span>
            <button onClick={onUndo}>Undo</button>
        </div>
    )
}

export default UndoToast