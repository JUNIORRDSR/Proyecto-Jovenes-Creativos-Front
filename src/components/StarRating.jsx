import "./StarRating.css";

function StarRating({ value = 0, size = "medium", showValue = false }) {
  const clamped = Math.min(Math.max(Number(value) || 0, 0), 5);
  const percentage = (clamped / 5) * 100;

  return (
    <div className={`star-rating ${size}`}>
      <div className="star-rating-shape">
        <div className="star-rating-base">
          {[...Array(5)].map((_, index) => (
            <span key={`base-${index}`}>★</span>
          ))}
        </div>
        <div
          className="star-rating-fill"
          style={{ width: `${percentage}%` }}
        >
          {[...Array(5)].map((_, index) => (
            <span key={`fill-${index}`}>★</span>
          ))}
        </div>
      </div>
      {showValue && (
        <span className="star-rating-number">{clamped.toFixed(1)} / 5</span>
      )}
    </div>
  );
}

export default StarRating;
