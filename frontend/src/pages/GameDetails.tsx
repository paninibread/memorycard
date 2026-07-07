import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../App.css";


function GameDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/games/${id}`);
        if (!response.ok) {
          throw new Error("Game not found");
        }
        const game = await response.json();
        setGame(game);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (!game) {
    return <p>Loading game details...</p>;
  }

  const updateGame = async () => {
    try {
      const response = await fetch(`http://localhost:3000/games/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, status: newStatus }),
      });
      if (!response.ok) {
        throw new Error("Failed to update game");
      }
      const updatedGame = await response.json();
      setGame(updatedGame);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating game:", error);
    }
  };

  const deleteGame = async () => {
    try {
      const response = await fetch(`http://localhost:3000/games/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete game");
      }
    } catch (error) {
      console.error("Error deleting game:", error);
    }
    navigate("/"); // Navigate back to the home page after deletion
  };

  return (
    <div>
      <h1>Game Details</h1>
      <p>Game ID: {id}</p>
      <p>Game Title: {game?.title}</p>
      <p>Game Status: {game?.status}</p>

      <button onClick={() => {
        setNewTitle(game.title);
        setNewStatus(game.status);
        setShowEditModal(true);
      }}>
        Edit Game
      </button>
      <button onClick={async () => {
        await deleteGame();
      }}>
        Delete Game
      </button>

      <div>
        <Link to="/">Back to Games</Link>
      </div>
    
      {showEditModal && (
        <div className="overlay">
          <div className="popup">
            <h2> Edit Game </h2>
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option>Backlog</option>
              <option>Playing</option>
              <option>Completed</option>
            </select>
            <div className="popup-buttons">
              <button onClick= {async () => {
                await updateGame();
              }}>
                Save Game 
              </button>
              <button onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>

  );
}

export default GameDetails;