export type userAccountManagement = {
  accountVerified?: boolean;
  resetToken?: string;
  confirmationCode?: string;
  resetTokenExpiration?: Date;
  resetRequestedAt?: Date;
  passwordHash?: string;
};
