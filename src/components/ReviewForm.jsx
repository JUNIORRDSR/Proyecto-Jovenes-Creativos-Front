import { useEffect, useMemo, useState } from "react";
import "./ReviewForm.css";
import StarRating from "./StarRating.jsx";

const emptyForm = { gameId: "", review: "", rating: 0 };

function ReviewForm({ games, onSubmit, onCancel, editingReview }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const initialFormData = useMemo(() => {
    if (!editingReview) return emptyForm;
    return {
      gameId: String(editingReview.gameId ?? editingReview?.game?._id ?? ""),
      review: editingReview.review || "",
      rating: Number(editingReview.rating) || 0,
    };
  }, [editingReview]);

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingInput = (value) => {
    const parsed = Math.min(Math.max(parseFloat(value) || 0, 0), 5);
    setFormData((prev) => ({ ...prev, rating: Number(parsed.toFixed(1)) }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.gameId) newErrors.gameId = "Debes seleccionar un juego";
    if (!formData.review.trim()) newErrors.review = "La reseña no puede estar vacía";
    else if (formData.review.trim().length < 10) newErrors.review = "La reseña debe tener al menos 10 caracteres";
    if (Number(formData.rating) <= 0) newErrors.rating = "Debes calificar el juego";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const selectedGame = games.find((game) => String(game.id) === formData.gameId);
      onSubmit({
        id: editingReview?.id,
        gameId: selectedGame ? String(selectedGame.id) : formData.gameId,
        gameName:
          selectedGame?.name || editingReview?.gameName || editingReview?.name || "Juego desconocido",
        review: formData.review,
        rating: Number(formData.rating),
        cover: selectedGame?.cover || editingReview?.cover,
      });
    }
  };

  return (
    <div className="review-form-overlay">
      <div className="review-form-container">
        <div className="review-form-header">
          <h2>{editingReview ? "✏️ Editar Reseña" : "✍️ Escribir Reseña"}</h2>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="gameId">Selecciona un Juego *</label>
            <select id="gameId" name="gameId" value={formData.gameId} onChange={handleChange}>
            <option value="">-- Elige un juego --</option>
            {games.map((game) => (
              <option key={game.id} value={String(game.id)}>
                {game.name}
              </option>
            ))}
          </select>
            {errors.gameId && <span className="error-message">{errors.gameId}</span>}
          </div>

          <div className="form-group">
          <label>Calificación *</label>
          <div className="rating-control">
            <StarRating value={formData.rating} size="large" showValue />
            <div className="rating-inputs">
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleRatingInput(e.target.value)}
              />
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={(e) => handleRatingInput(e.target.value)}
              />
            </div>
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
