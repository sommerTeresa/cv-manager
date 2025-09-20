import { validateDateOrder } from './date-validation.util';

describe('validateDateOrder', () => {
  it('should not throw if endDate is after startDate', () => {
    expect(() => validateDateOrder('2020-01-01', '2020-12-31')).not.toThrow();
  });

  it('should not throw if startDate or endDate is missing', () => {
    expect(() => validateDateOrder(undefined, '2020-12-31')).not.toThrow();
    expect(() => validateDateOrder('2020-01-01', undefined)).not.toThrow();
    expect(() => validateDateOrder(undefined, undefined)).not.toThrow();
  });

  it('should throw if endDate is before startDate', () => {
    expect(() => validateDateOrder('2020-12-31', '2020-01-01')).toThrow(
      'The end date must be after the start date.',
    );
  });
});
