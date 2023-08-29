import { create } from "zustand";
import { FormState } from "../../types/common";
import { PostDto } from "./types";
import apiClient from "../../config/axios";
import { notification } from "antd";

type PostState = {
  over: boolean;
  loading: boolean;
  formState: FormState<PostDto>;
  patchForm: (state: Partial<FormState<PostDto>>) => void;
  postList: PostDto[];
  setPostList: (items: PostDto[]) => void;
  fetchPostList: () => Promise<void>;
  fetchNextPostList: () => Promise<void>;
};

const usePostStore = create<PostState>((set, get) => ({
  over: false,
  loading: false,
  formState: {
    open: false,
    type: "create",
    data: {},
  },
  patchForm({ open = true, type = "create", data = {} }) {
    set((state) => ({ ...state, formState: { open, type, data } }));
  },
  postList: [],
  setPostList(items) {
    set((state) => ({ ...state, postList: items }));
  },
  async fetchPostList() {
    set((state) => ({ ...state, loading: true }));
    const response = await apiClient.get(`/posts`);
    if (response.success) {
      set((state) => ({ ...state, postList: response.data.items }));
    } else {
      notification.error({ message: response.message });
    }
    set((state) => ({ ...state, loading: false }));
  },
  async fetchNextPostList() {
    set((state) => ({ ...state, loading: true }));

    const [prev] = get().postList.slice(-1);

    const response = await apiClient.get(`/posts?cursor=${prev.id}`);
    if (response.success) {
      if (response.data.items.length === 0) {
        set((state) => ({ ...state, over: true }));
      }
      set((state) => ({
        ...state,
        postList: [...get().postList, ...response.data.items],
      }));
    } else {
      notification.error({ message: response.message });
    }
    set((state) => ({ ...state, loading: false }));
  },
}));

export default usePostStore;
