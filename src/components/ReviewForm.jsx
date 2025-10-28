import { useState } from "react";
import "./ReviewForm.css";

function ReviewForm({ games, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({ gameId: "", review: "", rating: 0 });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStarClick = (rating) => setFormData({ ...formData, rating });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.gameId) newErrors.gameId = "Debes seleccionar un juego";
    if (!formData.review.trim()) newErrors.review = "La reseña no puede estar vacía";
    else if (formData.review.trim().length < 10) newErrors.review = "La reseña debe tener al menos 10 caracteres";
    if (formData.rating === 0) newErrors.rating = "Debes calificar el juego";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedGame = games.find((game) => game.id === Number(formData.gameId));
      onSubmit({ ...selectedGame, review: formData.review, rating: formData.rating });
    }
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h2>✍️ Escribir Reseña</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="gameId">Selecciona un Juego *</label>
            <select id="gameId" name="gameId" value={formData.gameId} onChange={handleChange}>
            <option value="">-- Elige un juego --</option>
            {games.map((game) => (
              <option key={game.id} value={game.id}>
                {game.name}
              </option>
            ))}
          </select>
            {errors.gameId && <span className="error-message">{errors.gameId}</span>}
          </div>

          <div className="form-group">
          <label>Calificación *</label>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                className={star <= formData.rating ? "star filled" : "star"}
              >
                ★
              </span>
            ))}
            </div>
            {errors.rating && <span className="error-message">{errors.rating}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="review">Tu Reseña *</label>
          <textarea
              id="review"
            name="review"
              rows="6"
              placeholder="Escribe tu opinión sobre el juego..."
            value={formData.review}
            onChange={handleChange}
          />
            <span className="character-count">{formData.review.length} caracteres</span>
            {errors.review && <span className="error-message">{errors.review}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Publicar Reseña
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewForm;
