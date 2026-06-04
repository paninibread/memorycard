import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pool from "./db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API working");
});

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

app.listen(3000, () => {
  console.log("Server running on port 3000");
});