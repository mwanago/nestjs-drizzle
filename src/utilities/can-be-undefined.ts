import { ValidateIf } from 'class-validator';

export function CanBeUndefined() {
  return ValidateIf((data, value) => value !== undefined);
}
