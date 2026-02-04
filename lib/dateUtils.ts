export const isAdult = (dateString: string): boolean => {
  if (!dateString || dateString.length !== 10) return false;

  const [day, month, year] = dateString.split(".").map(Number);
  if (!day || !month || !year) return false;

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
};

export const getTodayDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
};
