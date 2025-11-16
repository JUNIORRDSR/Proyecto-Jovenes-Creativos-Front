"use client";

import { useState } from "react";
import "./Library.css";
import GameCard from "../components/GameCard.jsx";
import GameForm from "../components/GameForm.jsx";

function Library({ games, addGame, editGame, deleteGame }) {
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [filterGenre, setFilterGenre] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("");

  const uniqueGenres = [...new Set(games.map((g) => g.genre))];

  const handleAddClick = () => {
    setEditingGame(null);
    setShowForm(true);
  };

  const handleEditClick = (game) => {
    setEditingGame(game);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGame(null);
  };

  const handleFormSubmit = async (data) => {
    const payload = {
      ...data,
      rating: Number(data.rating) || 0,
      hoursPlayed: Number(data.hoursPlayed) || 0,
    };

    try {
      if (editingGame) {
        await editGame({ ...payload, id: editingGame.id });
      } else {
        await addGame(payload);
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error guardando el juego:", error);
    }
  };

  const handleDeleteGame = async (id) => {
    try {
      await deleteGame(id);
    } catch (error) {
      console.error("Error eliminando el juego:", error);
    }
  };

  let filteredGames = [...games];

  if (filterGenre) filteredGames = filteredGames.filter((g) => g.genre === filterGenre);
  if (filterStatus) filteredGames = filteredGames.filter((g) => g.status === filterStatus);

  if (sortBy === "rating") filteredGames.sort((a, b) => b.rating - a.rating);
  if (sortBy === "hours") filteredGames.sort((a, b) => b.hoursPlayed - a.hoursPlayed);
  if (sortBy === "name") filteredGames.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="library-page">
      <header className="library-header">
        <h1 className="library-title">📚 Mi Biblioteca de Juegos</h1>
          <button className="add-game-btn" onClick={handleAddClick}>
            ➕ Agregar Juego
          </button>
      </header>

      {/* Filtros */}
      <div className="library-filters">
        <div className="filter-group">
          <label>Filtrar por Género:</label>
          <select value={filterGenre} onChange={(e) => setFilterGenre(e.target.value)}>
            <option value="">Todos los géneros</option>
            {uniqueGenres.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Filtrar por Estado:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Todos los estados</option>
            <option value="Completado">Completado</option>
            <option value="Jugando">Jugando</option>
            <option value="Pendiente">Pendiente</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Ordenar por:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sin ordenar</option>
            <option value="name">Nombre (A-Z)</option>
            <option value="rating">Puntuación (Mayor a Menor)</option>
            <option value="hours">Horas Jugadas (Mayor a Menor)</option>
          </select>
        </div>
      </div>

      {/* Juegos */}
      {filteredGames.length > 0 ? (
        <div className="games-grid">
          {filteredGames.map((g) => (
            <GameCard key={g.id} game={g} onEdit={handleEditClick} onDelete={handleDeleteGame} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">🎮</div>
          <h2>No hay juegos para mostrar</h2>
          <p>
            {games.length === 0
              ? "Agrega tu primer juego para comenzar tu colección"
              : "No se encontraron juegos con los filtros aplicados"}
          </p>
          {games.length === 0 && (
            <button className="add-game-btn" onClick={handleAddClick}>
              ➕ Agregar Primer Juego
            </button>
          )}
        </div>
      )}

      {/* Formulario de agregar/editar */}
      {showForm && (
        <GameForm
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
          editingGame={editingGame}
        />
      )}
    </div>
  );
}

export default Library;
