import { User } from "./user.entity";

export interface Url {
    id?: string;
    originalUrl: string;
    shortCode: string;
    owner: string | User;
    clicks: number;
    createdAt?: Date;
    updatedAt?: Date;
  }