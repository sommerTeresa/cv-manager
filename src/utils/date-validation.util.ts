export function validateDateOrder(startDate?: string, endDate?: string): void {
  if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
    throw new Error('The end date must be after the start date.');
  }
}
