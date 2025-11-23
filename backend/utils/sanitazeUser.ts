import { User } from 'src/User/entities/user.entity';

export type SanitedUser = {
  id: string;
  name: string;
  birthdate: string;
  city: string;
  email: string;
  occupation: string;
  role: string;
  accountVerified: boolean;
};

export const sanitazeUser = (user: User): SanitedUser => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    city: user.city,
    occupation: user.occupation,
    birthdate: user.birthdate,
    role: user.role,
    accountVerified: user.accountVerified,
  };
};
