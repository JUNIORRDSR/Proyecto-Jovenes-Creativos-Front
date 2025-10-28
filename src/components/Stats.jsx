import React from "react";
import "./Stats.css";

function Stats({ games = [] }) {
  // === Calcular estadísticas principales ===
  const totalGames = games.length;

  // Aseguramos que todos los valores sean números válidos
  const totalHours = games.reduce((sum, g) => sum + Number(g.hoursPlayed || 0), 0);
  const averageHours = totalGames > 0 ? (totalHours / totalGames).toFixed(1) : 0;

  const totalRating = games.reduce((sum, g) => sum + Number(g.rating || 0), 0);
  const averageRating = totalGames > 0 ? (totalRating / totalGames).toFixed(1) : 0;

  // === Calcular estado de juegos ===
  const completed = games.filter((g) => g.status?.toLowerCase() === "completado").length;
  const playing = games.filter((g) => g.status?.toLowerCase() === "jugando").length;
  const pending = games.filter((g) => g.status?.toLowerCase() === "pendiente").length;

  // === Juego más jugado ===
  const mostPlayed =
    games.length > 0
      ? games.reduce((prev, curr) =>
          Number(prev.hoursPlayed || 0) > Number(curr.hoursPlayed || 0) ? prev : curr
        )
      : null;

  return (
    <section className="stats-container">
      <h2 className="stats-heading">📊 ESTADÍSTICAS PERSONALES</h2>

      {/* Grid principal */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div>
            <h3 className="stat-value">{totalGames}</h3>
            <p className="stat-label">Juegos Totales</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏱️</div>
          <div>
            <h3 className="stat-value">{averageHours}h</h3>
            <p className="stat-label">Promedio de Horas</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div>
            <h3 className="stat-value">{averageRating}/5</h3>
            <p className="stat-label">Calificación Media</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🕹️</div>
          <div>
            <h3 className="stat-value">{totalHours}h</h3>
            <p className="stat-label">Horas Totales</p>
          </div>
        </div>
      </div>

      {/* Estado de juegos */}
      <div className="stats-section">
        <h3 className="section-title">Estado de los Juegos</h3>
        <div className="status-grid">
          <div className="status-item completed">
            <span className="status-count">{completed}</span>
            <span className="status-label">Completados</span>
          </div>
          <div className="status-item playing">
            <span className="status-count">{playing}</span>
            <span className="status-label">Jugando</span>
          </div>
          <div className="status-item pending">
            <span className="status-count">{pending}</span>
            <span className="status-label">Pendientes</span>
          </div>
        </div>
      </div>

      {/* Juego más jugado */}
      {mostPlayed && (
        <div className="stats-section">
          <h3 className="section-title">🏆 Juego Más Jugado</h3>
          <div className="most-played">
            <img
              src={mostPlayed.cover || "/placeholder.jpg"}
              alt={mostPlayed.name}
              className="most-played-img"
            />
            <div className="most-played-info">
              <h4>{mostPlayed.name}</h4>
              <p>{mostPlayed.hoursPlayed} horas jugadas</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Stats;
