export interface ProfileType {
  email: string;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export type UpdateProfileType = Omit<ProfileType, 'email'>;
