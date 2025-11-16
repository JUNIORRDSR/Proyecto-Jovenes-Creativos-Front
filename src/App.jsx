import { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Library from "./pages/Library.jsx";
import Reviews from "./pages/Reviews.jsx";
import Stats from "./components/Stats.jsx";
import "./index.css";
import "./theme.css";

const API_BASE_URL = "http://localhost:4000";
const GAMES_ENDPOINT = `${API_BASE_URL}/api/games`;

const normalizeGame = (game) => ({
  ...game,
  rating: Math.min(Math.max(Number(game?.rating) || 0, 0), 5),
  hoursPlayed: Number(game?.hoursPlayed) || 0,
});

function App() {
  const [games, setGames] = useState([]);

  const loadGames = useMemo(
    () => async () => {
      try {
        const response = await fetch(GAMES_ENDPOINT);
        if (!response.ok) throw new Error("No se pudo obtener la lista de juegos");
        const data = await response.json();
        setGames(data.map(normalizeGame));
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    },
    []
  );

  const addGame = async (newGame) => {
    try {
      const response = await fetch(GAMES_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newGame),
      });
      if (!response.ok) throw new Error("No se pudo crear el juego");
      const created = normalizeGame(await response.json());
      setGames((prev) => [...prev, created]);
      return created;
    } catch (error) {
      console.error("Error adding game:", error);
      throw error;
    }
  };

  const editGame = async (updatedGame) => {
    try {
      const response = await fetch(`${GAMES_ENDPOINT}/${updatedGame.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedGame),
      });
      if (!response.ok) throw new Error("No se pudo actualizar el juego");
      const saved = normalizeGame(await response.json());
      setGames((prev) => prev.map((g) => (g.id === saved.id ? saved : g)));
      return saved;
    } catch (error) {
      console.error("Error editing game:", error);
      throw error;
    }
  };

  const deleteGame = async (id) => {
    try {
      const response = await fetch(`${GAMES_ENDPOINT}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok && response.status !== 204) {
        throw new Error("No se pudo eliminar el juego");
      }
      setGames((prev) => prev.filter((g) => g.id !== id));
    } catch (error) {
      console.error("Error deleting game:", error);
      throw error;
    }
  };

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  return (
    <Router>
      <NavBar />
      <main className="main-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Stats games={games} />
                <Library
                  games={games}
                  addGame={addGame}
                  editGame={editGame}
                  deleteGame={deleteGame}
                />
              </>
            }
          />
          <Route path="/reviews" element={<Reviews games={games} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
