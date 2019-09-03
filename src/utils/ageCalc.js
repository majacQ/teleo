// ~52.18 weeks in a year
// add 40 weeks for to account for gestation
// ~4.35 weeks in a month

export const y2w = (x) => x * (365.25 / 7) + 40;
export const w2y = (x) => (x - 40) / (365.25 / 7);
export const m2w = (x) => x * (365.25 / 12 / 7) + 40;
export const w2m = (x) => (x - 40) / (365.25 / 12 / 7);

export const niceAge = (age) => {
  if (age / 7 - 40 < 0) {
    return `${Math.round(age / 7)} Weeks G`;
  }
  const ww = Math.round(age / 7 - 40);
  if (ww < 12) {
    return `${ww} Weeks`;
  }
  const mm = Math.round(w2m(age / 7));
  if (mm < 24) {
    return `${mm} Months`;
  }
  const yy = Math.round(w2y(age / 7));
  return `${yy} Years`;
};
