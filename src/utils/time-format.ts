export const formatTimeMinutesSeconds = (totalSeconds: number) => {
  const safeTotal = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeTotal / 60);
  const seconds = safeTotal % 60;
  return {
    minutes,
    seconds,
    display: `${minutes}m ${seconds}s`,
  };
};
