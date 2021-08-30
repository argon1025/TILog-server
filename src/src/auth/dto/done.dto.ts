import { Users } from 'src/entities/Users';

export type Done = (err: Error, users: Users) => void;
