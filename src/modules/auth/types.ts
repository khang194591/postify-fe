import { ProfileDto } from "../users/types";

export type SignUpDto = {
  fName: string;
  lName: string;
  email: string;
  password: string;
};

export type SignInDto = {
  email: string;
  password: string;
};

export type AuthResponse = {
  accessToken: string;
  profile: ProfileDto;
};
