import { useState, useEffect } from 'react'
import './App.css'

type Character = {
  character_id: number
  name: string
  franchise: string
}


type Turn = {
    event: string
    attacker?: string
    defender?: string
    damage_dealt?: number
    defender_health?: number
    winner?: string|null

}

function App() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [fighter1Id, setFighter1Id] = useState<number | null>(null)
  const [fighter2Id, setFighter2Id] = useState<number | null>(null)
    const [turns, setTurns] = useState<Turn[]>([])


  useEffect(() => {  fetch("http://localhost:8000/characters")
      .then(response => response.json())
      .then(data => setCharacters(data)) }, [])


  const startFight = async () => {
      setTurns([])
      const response = await fetch("http://localhost:8000/fight", {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify({character1_id: fighter1Id, character2_id: fighter2Id})
  })
        const reader = response.body!.getReader()
        const decoder = new TextDecoder()
        let buffer = ""

        while (true) {
            const { value, done } = await reader.read()
            if (done) break
            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop()!
            for(const line of lines) {
                const turn = JSON.parse(line)
                setTurns(prev => [...prev, turn])
            }
        }





        }



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
        </div>
        <div>
          {turns.map((turn, i) => (
              <p key={i}>
                  {turn.event === "fight_over"
                      ? `Winner: ${turn.winner ?? "Draw"}`
                      : `${turn.attacker} hits ${turn.defender} for ${turn.damage_dealt}`}
              </p>
          ))}
        </div>
      </div>


  )
}

export default App
