import { create } from "zustand";
import { ProfileDto } from "../users/types";

type AuthState = {
  profile?: ProfileDto;
  fetchFromStorage: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  profile: localStorage.getItem("profile")
    ? (JSON.parse(localStorage.getItem("profile") ?? "") as ProfileDto)
    : undefined,
  fetchFromStorage() {
    const profileString = localStorage.getItem("profile");
    if (profileString) {
      set({ profile: JSON.parse(profileString) as ProfileDto });
    } else {
      set({ profile: undefined });
    }
  },
}));
