import "./ReviewCard.css";
import StarRating from "./StarRating.jsx";

function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-header">
        <h3 className="review-game-name">{review.gameName}</h3>
        <div className="review-rating">
          <StarRating value={review.rating} size="small" showValue />
        </div>
      </div>

      <div className="review-content">
        <p className="review-text">{review.review}</p>
      </div>

      <div className="review-footer">
        <span className="review-date">📅 {review.date}</span>
      </div>
    </div>
  );
}

export default ReviewCard;
