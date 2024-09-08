import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Duration } from 'luxon';

@ValidatorConstraint()
export class IsIsoInterval implements ValidatorConstraintInterface {
  validate(value: unknown) {
    if (typeof value !== 'string') {
      return false;
    }
    const interval = Duration.fromISO(value);
    return interval.isValid;
  }
  defaultMessage({ property }: ValidationArguments) {
    return `${property} must be a valid ISO duration`;
  }
}
