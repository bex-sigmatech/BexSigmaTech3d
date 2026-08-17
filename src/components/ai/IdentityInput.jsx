import React, { useState } from 'react'
import { useStore } from '../../store/useStore'

export default function IdentityInput() {
  const { submitIdentity } = useStore()
  const [name, setName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalName = name.trim() || 'OPERATOR'
    submitIdentity(finalName)
  }

  return (
    <form className="identity-box interactive" onSubmit={handleSubmit}>
      <div className="identity-prompt">
        System Prompt: Enter Command Name
      </div>
      <div className="identity-input-wrapper">
        <input
          type="text"
          className="identity-input"
          placeholder="e.g. JK"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={15}
          autoFocus
        />
        <button type="submit" className="identity-btn">
          ENTER
        </button>
      </div>
    </form>
  )
}
