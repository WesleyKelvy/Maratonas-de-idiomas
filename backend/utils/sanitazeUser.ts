import { User } from 'src/User/entities/user.entity';

export type SanitedUser = {
  name: string;
  birthdate: string;
  city: string;
  email: string;
  occupation: string;
  role: string;
};

export const sanitazeUser = (user: User): SanitedUser => {
  return {
    name: user.name,
    email: user.email,
    city: user.city,
    occupation: user.occupation,
    birthdate: user.birthdate,
    role: user.role,
  };
};
