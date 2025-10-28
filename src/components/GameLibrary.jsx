// src/components/GameLibrary.jsx
import React, { useState, useMemo } from "react";
import GameCard from "./GameCard";
import "./GameLibrary.css";

export default function GameLibrary() {
  const [games, setGames] = useState([
    {
      id: 1,
      name: "God of War", // usamos 'name' igual que en GameCard
      genre: "Acción/Aventura",
      hoursPlayed: 25,
      rating: 5,
      status: "Completado",
      cover: "https://wallpapers.com/images/hd/god-of-war-3d-kratos-n1im6er87u3hisap.webp"
    },
    {
      id: 2,
      name: "Cyberpunk 2077",
      genre: "RPG",
      hoursPlayed: 45,
      rating: 4,
      status: "Jugando",
      cover: "https://wallpapers.com/images/hd/cyberpunk-2077-male-and-female-v-63386du3wmsbho7d.webp"
    }
  ]);

  const [editingGame, setEditingGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [genreFilter, setGenreFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [sortOption, setSortOption] = useState("default");

  const genres = useMemo(
    () => ["Todos", ...new Set(games.map((g) => g.genre))],
    [games]
  );

  const openAdd = () => {
    setEditingGame({
      id: Date.now(),
      name: "",
      genre: "",
      cover: "",
      hoursPlayed: 0,
      rating: 1,
      status: "Pendiente",
    });
    setModalOpen(true);
  };

  const openEdit = (game) => {
    setEditingGame({ ...game });
    setModalOpen(true);
  };

  const handleSave = (game) => {
    setGames((prev) => {
      const exists = prev.some((g) => g.id === game.id);
      if (exists) return prev.map((g) => (g.id === game.id ? game : g));
      return [game, ...prev];
    });
    setModalOpen(false);
    setEditingGame(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar este juego?")) {
      setGames((prev) => prev.filter((g) => g.id !== id));
    }
  };

  const displayed = games
    .filter((g) => (genreFilter === "Todos" ? true : g.genre === genreFilter))
    .filter((g) => (statusFilter === "Todos" ? true : g.status === statusFilter))
    .sort((a, b) => {
      if (sortOption === "rating") return b.rating - a.rating;
      if (sortOption === "hours") return b.hoursPlayed - a.hoursPlayed;
      if (sortOption === "title") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <section className="library">
      <div className="library-top">
        <h2>📚 Mi Biblioteca de Juegos</h2>
        <button className="add-btn" onClick={openAdd}>
          ➕ Agregar Juego
        </button>
      </div>

      <div className="filters">
        <div className="filter">
          <label>Filtrar por Género:</label>
          <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="filter">
          <label>Filtrar por Estado:</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option>Todos</option>
            <option>Completado</option>
            <option>Jugando</option>
            <option>Pendiente</option>
          </select>
        </div>

        <div className="filter">
          <label>Ordenar por:</label>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="default">Sin ordenar</option>
            <option value="rating">Puntuación</option>
            <option value="hours">Horas jugadas</option>
            <option value="title">Título (A → Z)</option>
          </select>
        </div>
      </div>

      <div className="game-grid">
        {displayed.length ? (
          displayed.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onEdit={() => openEdit(game)}
              onDelete={() => handleDelete(game.id)}
            />
          ))
        ) : (
          <p className="no-results">No hay juegos que coincidan con los filtros.</p>
        )}
      </div>
    </section>
  );
}
