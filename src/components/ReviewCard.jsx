import "./ReviewCard.css";

function ReviewCard({ review }) {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} className={index < rating ? "star filled" : "star"}>
        ★
      </span>
    ));
  };

  return (
    <div className="review-card">
      <div className="review-header">
        <h3 className="review-game-name">{review.gameName}</h3>
        <div className="review-rating">{renderStars(review.rating)}</div>
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
