import { useState, useEffect } from 'react'
import './App.css'

type Character = {
  character_id: number
  name: string
  franchise: string
}

function App() {
  const [characters, setCharacters] = useState<Character[]>([])

  useEffect(() => {  fetch("http://localhost:8000/characters")
      .then(response => response.json())
      .then(data => setCharacters(data)) }, [])

  console.log(characters)

  return (
      <div>
        <h1>ScaleAI</h1>
        <select>
          {characters.map(character => (
              <option key={character.character_id} value={character.character_id}>
                {character.name}
              </option>
          ))}
        </select>
      </div>

  )
}

export default App
