function isNowNight(): boolean {
  const now = new Date();
  const month = now.getMonth();
  const hour = now.getHours();
  if (month > 4 && month <= 10) {
    return hour < 5 || hour >= 21;
  }
  return hour < 6 || hour >= 20;
}

export function useDarkMode() {
  return {
    isNowNight,
  };
}
