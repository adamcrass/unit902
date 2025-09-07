// src/utils/shopUtils.jsx
export function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <>
      {"★".repeat(fullStars)}
      {hasHalfStar && "☆"}
      {"☆".repeat(emptyStars)}
    </>
  );
}
