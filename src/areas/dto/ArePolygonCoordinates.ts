import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  isLatitude,
  isLongitude,
} from 'class-validator';

@ValidatorConstraint()
export class ArePolygonCoordinates implements ValidatorConstraintInterface {
  validate(value: unknown) {
    // Coordinates must be an array of polygons.
    if (!Array.isArray(value) || value.length === 0) {
      return false;
    }

    // Test each polygon
    for (const polygon of value) {
      if (!this.validatePolygon(polygon)) {
        return false;
      }
    }

    return true;
  }
  validatePolygon(polygon: unknown) {
    // Polygons must be an array of coordinates.
    if (!Array.isArray(polygon)) {
      return false;
    }

    // Test every coordinate
    for (const coordinates of polygon) {
      if (!this.validateCoordinates(coordinates)) {
        return false;
      }
    }

    return true;
  }
  validateCoordinates(coordinates: unknown) {
    // Coordinates need to be arrays with two elements
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return false;
    }

    const [longitude, latitude] = coordinates;

    return isLongitude(longitude) && isLatitude(latitude);
  }
  defaultMessage({ property }: ValidationArguments) {
    return `${property} must be valid GeoJSON polygon coordinates`;
  }
}
