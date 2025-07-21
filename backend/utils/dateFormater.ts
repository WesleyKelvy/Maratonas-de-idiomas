// This make a date like: "12-01-25"
export const dateFormaterToDDMMYY = (date: Date): string =>
  date.toISOString().slice(0, 10).split('').reverse().join();

// Slice takes YY-MM-DD part
// Split separetes all characters, so reverse and join all of them.
