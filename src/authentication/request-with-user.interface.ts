import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    id: number;
    name: string;
    email: string;
  };
}
