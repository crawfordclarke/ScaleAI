import { useState, useEffect } from 'react'
import './App.css'

type Character = {
  character_id: number
  name: string
  franchise: string
}

function App() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [fighter1Id, setFighter1Id] = useState<number | null>(null)
  const [fighter2Id, setFighter2Id] = useState<number | null>(null)
  const [result, setResult] = useState<string>("")


  useEffect(() => {  fetch("http://localhost:8000/characters")
      .then(response => response.json())
      .then(data => setCharacters(data)) }, [])


  const startFight = () => {fetch("http://localhost:8000/fight", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({character1_id: fighter1Id, character2_id: fighter2Id})
  }).then(response => response.text())
      .then(text => setResult(text))}


  return (
      <div>
        <h1>ScaleAI</h1>
        <select value={fighter1Id ?? ""} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFighter1Id(Number(e.target.value))}>
            <option value="" disabled>— Select a fighter —</option>
          {characters.map(character => (
              <option key={character.character_id} value={character.character_id}>
                {character.name}
              </option>
          ))}
        </select>
        <select value={fighter2Id ?? ""} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFighter2Id(Number(e.target.value))}>
            <option value="" disabled>— Select a fighter —</option>
          {characters.map(character => (
              <option key={character.character_id} value={character.character_id}>
                {character.name}
              </option>
          ))}
        </select>
        <p>Fighter 1: {fighter1Id} | Fighter 2: {fighter2Id}</p>
        <div>
            <button disabled={fighter1Id== null || fighter2Id ==null}
                    onClick={startFight}
            >
                Fight!
            </button>
        </div><pre>{result}</pre>
      </div>


  )
}

export default App
