export const formatDateToHumanReadable = (date: string): string => {
  if (!date) return "";
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return "";

  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};
