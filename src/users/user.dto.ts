export class AddressDto {
  street: string;
  city: string;
  country: string;
}

export class UserDto {
  email: string;
  name: string;
  password: string;
  phoneNumber?: string;
  address?: AddressDto;
}
