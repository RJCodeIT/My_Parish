/**
 * Date utilities for handling intention dates
 */

/**
 * Checks if a given date is a Monday
 * @param dateString Date string in format YYYY-MM-DD
 * @returns boolean
 */
export const isMonday = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date.getDay() === 1; // Monday is 1 in JavaScript Date
};

/**
 * Checks if a given date is a Sunday
 * @param dateString Date string in format YYYY-MM-DD
 * @returns boolean
 */
export const isSunday = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date.getDay() === 0; // Sunday is 0 in JavaScript Date
};

/**
 * Gets the next Monday from a given date
 * @param date Date object
 * @returns Date string in format YYYY-MM-DD
 */
export const getNextMonday = (date: Date = new Date()): string => {
  const dayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday
  const daysToAdd = dayOfWeek === 1 ? 7 : (8 - dayOfWeek) % 7; // If it's already Monday, get next Monday
  
  const nextMonday = new Date(date);
  nextMonday.setDate(date.getDate() + daysToAdd);
  
  return nextMonday.toISOString().split('T')[0];
};

/**
 * Gets the Sunday that ends the week starting from the given Monday
 * @param mondayString Date string in format YYYY-MM-DD (must be a Monday)
 * @returns Date string in format YYYY-MM-DD
 */
export const getSundayFromMonday = (mondayString: string): string => {
  if (!isMonday(mondayString)) {
    throw new Error("Start date must be a Monday");
  }
  
  const monday = new Date(mondayString);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6); // Add 6 days to get to Sunday
  
  return sunday.toISOString().split('T')[0];
};

/**
 * Validates if the date range is exactly one week (Monday to Sunday)
 * @param startDate Start date string in format YYYY-MM-DD
 * @param endDate End date string in format YYYY-MM-DD
 * @returns Object with validation result and error message if any
 */
export const validateWeekRange = (startDate: string, endDate: string): { isValid: boolean; message?: string } => {
  if (!startDate || !endDate) {
    return { isValid: false, message: "Obie daty są wymagane" };
  }
  
  if (!isMonday(startDate)) {
    return { isValid: false, message: "Data początkowa musi być poniedziałkiem" };
  }
  
  if (!isSunday(endDate)) {
    return { isValid: false, message: "Data końcowa musi być niedzielą" };
  }
  
  // Check if the dates are exactly 6 days apart (7 days including both dates)
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays !== 6) {
    return { isValid: false, message: "Zakres dat musi wynosić dokładnie 7 dni (od poniedziałku do niedzieli)" };
  }
  
  return { isValid: true };
};

/**
 * Generates an array of dates for a week starting from Monday
 * @param mondayString Date string in format YYYY-MM-DD (must be a Monday)
 * @returns Array of date strings for the week
 */
export const generateWeekDates = (mondayString: string): string[] => {
  if (!isMonday(mondayString)) {
    throw new Error("Start date must be a Monday");
  }
  
  const monday = new Date(mondayString);
  const weekDates: string[] = [];
  
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);
    weekDates.push(currentDate.toISOString().split('T')[0]);
  }
  
  return weekDates;
};

/**
 * Gets the day name in Polish for a given date
 * @param dateString Date string in format YYYY-MM-DD
 * @returns Polish day name
 */
export const getPolishDayName = (dateString: string): string => {
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();
  
  const polishDays = [
    "Niedziela", 
    "Poniedziałek", 
    "Wtorek", 
    "Środa", 
    "Czwartek", 
    "Piątek", 
    "Sobota"
  ];
  
  return polishDays[dayOfWeek];
};

/**
 * Formats a date string to a Polish format (DD.MM.YYYY)
 * @param dateString Date string in format YYYY-MM-DD
 * @returns Formatted date string
 */
export const formatDateToPolish = (dateString: string): string => {
  const [year, month, day] = dateString.split('-');
  return `${day}.${month}.${year}`;
};
