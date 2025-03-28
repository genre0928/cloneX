export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days >= 30) {
    return "오래 전";
  }

  if (days > 0) {
    return `${days}일 전`;
  }

  if (hours > 0) {
    return `${hours}시간 전`;
  }

  if (minutes > 0) {
    return `${minutes}분 전`;
  }

  if (seconds > 0) {
    return `${seconds}초 전`;
  }

  return "방금전";
};
