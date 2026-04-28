import React from 'react'

const Popup = () => {
  return (
    <div className="popup-overlay">
          <div className="popup-content bg-red-400">
            <h2>Popup Title</h2>
            <button onClick={() => setIsOpen(false)}>Close</button>
          </div>
        </div>
  )
}

export default Popup