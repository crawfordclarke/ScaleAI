import { useState, useEffect } from 'react'
import './App.css'
import './index.css'

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
    narration?: string
    fighter1?: string
    fighter1_max_health?: number
    fighter2?: string
    fighter2_max_health?: number

}

function App() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [fighter1Id, setFighter1Id] = useState<number | null>(null)
  const [fighter2Id, setFighter2Id] = useState<number | null>(null)
    const [turns, setTurns] = useState<Turn[]>([])
    const [max_health, setMaxHealth] = useState<{fighter1:number; fighter2: number} | null>(null)

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
                console.log(turn)
                if(turn.event === "fight_start") {
                    setMaxHealth({fighter1: turn.fighter1_max_health, fighter2: turn.fighter2_max_health})
                }else{
                    setTurns(prev => [...prev, turn])
                }
            }
        }





        }



  return (
      <div className="min-h-screen bg-scale-paper">
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-4">
        <h1 className="font-display text-scale-red text-5xl -skew-x-6 tracking-[3px] [-webkit-text-stroke:1.5px_black]">ScaleAI</h1>
        <div className="flex items-center justify-center gap-4">
        <select className='border-2 border-scale-ink rounded-lg px-4 py-2 font-body bg-scale-paper text-scale-ink' value={fighter1Id ?? ""} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFighter1Id(Number(e.target.value))}>
            <option value="" disabled>— Select a fighter —</option>
          {characters.map(character => (
              <option key={character.character_id} value={character.character_id}>
                {character.name}
              </option>
          ))}
        </select>

        <span className='font-display text-3xl -rotate-6'>
            VS
        </span>
        <select className='border-2 border-scale-ink rounded-lg px-4 py-2 font-body bg-scale-paper text-scale-ink' value={fighter2Id ?? ""} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFighter2Id(Number(e.target.value))}>
            <option value="" disabled>— Select a fighter —</option>
          {characters.map(character => (
              <option key={character.character_id} value={character.character_id}>
                {character.name}
              </option>
          ))}
        </select>
        </div>
        <div>
            <button className="border-2 border-scale-ink rounded-lg px-4 py-2 font-body bg-scale-paper text-scale-ink hover:bg-gray-200 transition-colors" disabled={fighter1Id== null || fighter2Id ==null}
                    onClick={startFight}
            >
                Fight!
            </button>
        </div>
          <div className="flex flex-col gap-2">
              {turns.map((turn, i) => (
                  <div key={i} className="border-2 border-scale-ink rounded-2xl px-4 py-3 flex items-center justify-between font-body animate-slide-in">
                      {turn.event === "fight_over" ? (
                          <span className="w-full text-center">Winner: {turn.winner ?? "Draw"}</span>
                      ) : (
                          <>
                              <span>{turn.narration ?? `${turn.attacker} hits ${turn.defender}`}</span>
                              <span className="font-display text-2xl text-scale-amber">-{turn.damage_dealt}</span>
                          </>
                      )}
                  </div>
              ))}
          </div>
        </div>
      </div>
  )}




export default App;
