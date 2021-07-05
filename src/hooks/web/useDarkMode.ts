function isNowNight(): boolean {
  const now = new Date();
  const month = now.getMonth();
  const hour = now.getHours();
  if (month > 4 && month <= 10) {
    return hour < 6 || hour >= 19;
  }
  return hour < 7 || hour >= 18;
}

export function useDarkMode() {
  return {
    isNowNight,
  };
}
