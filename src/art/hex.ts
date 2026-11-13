export function hexPoints(centreX: number, centreY: number, radius: number) {
  const corners = [0, 1, 2, 3, 4, 5].map((index) => {
    const angle = ((index * 60 - 90) * Math.PI) / 180;
    const x = centreX + radius * Math.cos(angle);
    const y = centreY + radius * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });
  const points = corners.join(" ");
  return points;
}
