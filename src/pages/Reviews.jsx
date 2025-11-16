"use client";
import { useEffect, useMemo, useState } from "react";
import "./Reviews.css";
import ReviewCard from "../components/ReviewCard.jsx";
import ReviewForm from "../components/ReviewForm.jsx";
import { REVIEWS_ENDPOINT } from "../api/config.js";

const normalizeReview = (review) => ({
  ...review,
  id: review?.id || review?._id,
  gameId: review?.gameId,
  rating: Number(review?.rating) || 0,
  date: review?.date || review?.createdAt || new Date().toISOString(),
});

const extractReviewArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  const candidateKeys = ["data", "results", "items", "reviews"];
  for (const key of candidateKeys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  return null;
};

function Reviews({ games = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [reviewsError, setReviewsError] = useState("");
  const [editingReview, setEditingReview] = useState(null);

  const handleAddReview = () => {
    setEditingReview(null);
    setShowForm(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingReview(null);
  };

  const loadReviews = useMemo(
    () => async () => {
      setIsLoadingReviews(true);
      try {
        const response = await fetch(REVIEWS_ENDPOINT);
        if (!response.ok) throw new Error("No se pudo obtener las reseñas");
        const payload = await response.json();
        const collection = extractReviewArray(payload);
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
      cover: reviewData.cover,
    };

    const isEditing = Boolean(editingReview?.id);
    const url = isEditing
      ? `${REVIEWS_ENDPOINT}/${editingReview.id}`
      : REVIEWS_ENDPOINT;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok)
        throw new Error(
          isEditing ? "No se pudo actualizar la reseña" : "No se pudo crear la reseña"
        );
      const saved = normalizeReview(await response.json());
      setReviews((prev) => {
        if (isEditing) {
          return prev.map((r) => (r.id === saved.id ? saved : r));
        }
        return [saved, ...prev];
      });
      handleCloseForm();
    } catch (error) {
      console.error("Error guardando reseña:", error);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const response = await fetch(`${REVIEWS_ENDPOINT}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok && response.status !== 204) {
        throw new Error("No se pudo eliminar la reseña");
      }
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error eliminando reseña:", error);
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
            <ReviewCard
              key={r.id}
              review={r}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
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
        <ReviewForm
          games={games}
          onSubmit={handleSubmitReview}
          onCancel={handleCloseForm}
          editingReview={editingReview}
        />
      )}
    </div>
  );
}

export default Reviews;
