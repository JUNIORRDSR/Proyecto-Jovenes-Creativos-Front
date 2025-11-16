"use client";
import { useEffect, useMemo, useState } from "react";
import "./Reviews.css";
import ReviewCard from "../components/ReviewCard.jsx";
import ReviewForm from "../components/ReviewForm.jsx";
import { REVIEWS_ENDPOINT } from "../api/config.js";

const normalizeReview = (review) => ({
  ...review,
  rating: Number(review?.rating) || 0,
  date: review?.date || review?.createdAt || new Date().toISOString(),
});

const asArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.items)) return payload.items;
  return null;
};

function Reviews({ games = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState("");

  const handleAddReview = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const loadReviews = useMemo(
    () => async () => {
      setIsLoadingReviews(true);
      try {
        const response = await fetch(REVIEWS_ENDPOINT);
        if (!response.ok) throw new Error("No se pudo obtener las reseñas");
        const payload = await response.json();
        const collection = asArray(payload);
        if (!collection) {
          throw new Error("Formato de respuesta inválido para reseñas");
        }
        setReviews(collection.map(normalizeReview));
        setReviewsError("");
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviewsError(
          error?.message || "No se pudieron cargar las reseñas. Intenta nuevamente."
        );
      } finally {
        setIsLoadingReviews(false);
      }
    },
    []
  );

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmitReview = async (reviewData) => {
    const payload = {
      gameId: reviewData.gameId,
      gameName: reviewData.gameName,
      review: reviewData.review,
      rating: Number(reviewData.rating) || 0,
    };

    try {
      const response = await fetch(REVIEWS_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("No se pudo crear la reseña");
      const created = normalizeReview(await response.json());
      setReviews((prev) => [created, ...prev]);
      handleCloseForm();
    } catch (error) {
      console.error("Error creando reseña:", error);
    }
  };

  return (
    <div className="reviews-page">
      <div className="reviews-header">
        <h1 className="reviews-title">⭐ Mis Reseñas</h1>
        <button className="add-review-btn" onClick={handleAddReview}>
          ✍️ Escribir Reseña
        </button>
      </div>

      {isLoadingReviews && (
        <p className="reviews-loading">Cargando reseñas...</p>
      )}

      {!isLoadingReviews && reviewsError && (
        <div className="reviews-error">
          <p>{reviewsError}</p>
        </div>
      )}

      {!isLoadingReviews && !reviewsError && reviews.length > 0 ? (
        <div className="reviews-grid">
          {reviews.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      ) : (
        !isLoadingReviews && !reviewsError && (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>Aún no hay reseñas</h2>
            <button className="add-review-btn" onClick={handleAddReview}>
              ✍️ Escribir Primera Reseña
            </button>
          </div>
        )
      )}

      {/* 🔧 Aquí pasamos correctamente los juegos */}
      {showForm && (
        <ReviewForm games={games} onSubmit={handleSubmitReview} onCancel={handleCloseForm} />
      )}
    </div>
  );
}

export default Reviews;
