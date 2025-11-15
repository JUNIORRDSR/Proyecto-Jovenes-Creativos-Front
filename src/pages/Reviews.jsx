"use client";
import { useState } from "react";
import "./Reviews.css";
import ReviewCard from "../components/ReviewCard.jsx";
import ReviewForm from "../components/ReviewForm.jsx";

function Reviews({ games = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]);

  const handleAddReview = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleSubmitReview = (reviewData) => {
    const newReview = {
      id: Date.now(),
      gameName: reviewData.gameName || reviewData.name,
      review: reviewData.review,
      rating: reviewData.rating,
      date: new Date().toLocaleDateString("es-ES"),
    };
    setReviews([newReview, ...reviews]);
    handleCloseForm();
  };

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1 className="reviews-title">⭐ Mis Reseñas</h1>
        <button className="add-review-btn" onClick={handleAddReview}>
          ✍️ Escribir Reseña
        </button>
      </div>

      {reviews.length > 0 ? (
        <div className="reviews-grid">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h2>Aún no hay reseñas</h2>
          <button className="add-review-btn" onClick={handleAddReview}>
            ✍️ Escribir Primera Reseña
          </button>
        </div>
      )}

      {/* 🔧 Aquí pasamos correctamente los juegos */}
      {showForm && (
        <ReviewForm games={games} onSubmit={handleSubmitReview} onCancel={handleCloseForm} />
      )}
    </div>
  );
}

export default Reviews;
