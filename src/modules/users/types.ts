export type ProfileDto = {
  fullName: string;
  fName: string;
  lName: string;
  userId: number;
  role: Role;
};

export enum Role {
  USER = "USER",
  MODERATOR = "MODERATOR",
  ADMINISTRATOR = "ADMINISTRATOR",
}
