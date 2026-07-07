import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pool from "./db.js";

dotenv.config();

const app = express();

// Middleware: cors and JSON parsing middleware are used to handle cross-origin requests and parse incoming JSON data in the request body.
app.use(cors());
app.use(express.json());

// Routes: The server defines several routes to handle different API endpoints for managing games. Each route corresponds to a specific HTTP method (GET, POST, DELETE, PUT) and performs the necessary database operations using SQL queries.  

app.get("/", (req, res) => {
  res.send("API working");
});

// Display all games: Displays all games in the database, ordered by creation date. The server handles this request by querying the database and returning the game data as JSON.
app.get("/games", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM games ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Add a new game: Allows users to add a new game to the database. The server handles this request by inserting a new game entry into the database and returning the created game data.
app.post("/games", async (req, res) => {
  try {
    const { title, status } = req.body;

    const result = await pool.query(
      "INSERT INTO games (title, status) VALUES ($1, $2) RETURNING *",
      [title, status]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a game: Allows users to delete a game from the database. The server handles this request by removing the game entry from the database.
app.delete("/games/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM games WHERE id = $1", [id]);
    res.json({ message: "Game deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Edit a game: Uses a pop-up prompt to get the new title and status from the user, then sends a PUT request to update the game in the database. The server handles this request by updating the game entry in the database and returning the updated game data.
app.put("/games/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, status } = req.body;

    const result = await pool.query(
      "UPDATE games SET title = $1, status = $2 WHERE id = $3 RETURNING *",
      [title, status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get game details: Retrieves the details of a specific game based on its ID. The server handles this request by querying the database for the game entry and returning the game data as JSON.
app.get("/games/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM games WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Game not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});