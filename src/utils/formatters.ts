export const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(value);

export const formatShiftTime = (value: number) => {
  const hour = Math.floor(value);
  const minutes = Math.round((value - hour) * 60);
  return `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};
