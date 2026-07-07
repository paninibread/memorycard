import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../App.css";

function App() {
  const [games, setGames] = useState([]);
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("Backlog");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchGames = () => {
    fetch("http://localhost:3000/games")
      .then((res) => res.json())
      .then(setGames);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const addGame = async () => {
    const response = await fetch("http://localhost:3000/games", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, status }),
    });

    const newGame = await response.json();

    setTitle("");
    setStatus("Backlog");
    
    navigate(`/games/${newGame.id}`); // Navigate to the new game's details page after adding it
  };

  return (
    <div>

      <button onClick={() => setShowModal(true)}> + Add Game</button>

      <ul>
        {games.map((g: any) => (
          <li key={g.id}>
            
            <Link to={`/games/${g.id}`}>{g.title} </Link> 
            - {g.status}
          </li>
        ))}
      </ul>

      {showModal && (
        <div className="overlay">
          <div className="popup">
            <h2> Add Game </h2>
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
            <div className="popup-buttons">
              <button onClick= {async () => {
                await addGame();
                setShowModal(false);
              }}>
                + Add Game 
              </button>
              <button onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
}

export default App;