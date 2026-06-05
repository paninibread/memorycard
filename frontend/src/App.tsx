import { useState, useEffect } from "react";

function App() {
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Backlog");

  const fetchGames = () => {
    fetch("http://localhost:3000/games")
      .then((res) => res.json())
      .then(setGames);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const addGame = async () => {
    await fetch("http://localhost:3000/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status }),
    });

    setTitle("");
    fetchGames();
  };

  return (
    <div>
      <h1>memorycard</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Game title"
      />

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Backlog</option>
        <option>Playing</option>
        <option>Completed</option>
      </select>

      <button onClick={addGame}>Add Game</button>

      <ul>
        {games.map((g: any) => (
          <li key={g.id}>
            {g.title} - {g.status} - 
            
            <button
              onClick={async () => {
                await fetch(`http://localhost:3000/games/${g.id}`, {
                  method: "DELETE",
                });
                fetchGames();
              }}
            > Delete </button>  
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;