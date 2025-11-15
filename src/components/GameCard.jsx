import "./GameCard.css";

function GameCard({ game, onEdit, onDelete }) {
  const coverSrc = game.cover?.trim() || "/placeholder.jpg";

  return (
    <div className="game-card">
      <img
        src={coverSrc}
        alt={game.name || "Juego"}
        className="game-cover"
        loading="lazy"
      />

      <div className="game-info">
        <h3>{game.name}</h3>
        <p className="genre">🎯 {game.genre}</p>
        <p className="rating">⭐ {game.rating}/5</p>
        <p className="hours">🕒 {game.hoursPlayed} horas</p>
        <span className={`status ${game.status.toLowerCase()}`}>
          {game.status}
        </span>
      </div>

      <div className="game-actions">
        <button className="edit-btn" onClick={() => onEdit(game)}>
          ✏️ Editar
        </button>
        <button className="delete-btn" onClick={() => onDelete(game.id)}>
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
}

export default GameCard;
