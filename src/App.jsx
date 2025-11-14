import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar.jsx";
import Library from "./pages/Library.jsx";
import Reviews from "./pages/Reviews.jsx";
import Stats from "./components/Stats.jsx";
import "./index.css";
import "./theme.css";

function App() {
  const [games, setGames] = useState([
    {
      id: 1,
      name: "Cyberpunk 2077",
      genre: "Acción",
      cover: "https://wallpapers.com/images/hd/cyberpunk-2077-male-and-female-v-63386du3wmsbho7d.webp",
      rating: 4.5,
      status: "Jugando",
      hoursPlayed: 45,
    },
    {
      id: 2,
      name: "God of War",
      genre: "Aventura",
      cover: "https://wallpapers.com/images/hd/god-of-war-3d-kratos-n1im6er87u3hisap.webp",
      rating: 5,
      status: "Completado",
      hoursPlayed: 25,
    },
  ]);


  const addGame = (newGame) => setGames((prev) => [...prev, newGame]);

  const editGame = (updatedGame) =>
    setGames((prev) =>
      prev.map((g) => (g.id === updatedGame.id ? updatedGame : g))
    );

  const deleteGame = (id) =>
    setGames((prev) => prev.filter((g) => g.id !== id));


  useEffect(() => {
    fetch("https://6909419a2d902d0651b32224.mockapi.io/games")
      .then((response) => response.json())
      .then((data) => {
        // Normalizar rating y hoursPlayed
        const cleanedGames = data.map((g) => ({
          ...g,
          rating: Math.min(Math.max(Number(g.rating) || 0, 0), 5),
          hoursPlayed: Number(g.hoursPlayed) || 0, 
        }));

        setGames(cleanedGames);
      })
      .catch((error) => console.error("Error fetching games:", error));
  }, []);

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
