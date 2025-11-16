import "./ReviewCard.css";
import StarRating from "./StarRating.jsx";

function ReviewCard({ review }) {
  const readableDate = review.date
    ? new Date(review.date).toLocaleDateString("es-ES")
    : new Date().toLocaleDateString("es-ES");
  return (
    <div className="review-card">
      <div className="review-header">
        <h3 className="review-game-name">{review.gameName || review.name}</h3>
        <div className="review-rating">
          <StarRating value={review.rating} size="small" showValue />
        </div>
      </div>

      <div className="review-content">
        <p className="review-text">{review.review}</p>
      </div>

      <div className="review-footer">
        <span className="review-date">📅 {readableDate}</span>
      </div>
    </div>
  );
}

export default ReviewCard;
