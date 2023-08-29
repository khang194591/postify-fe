import { ProfileDto } from "../users/types";

export type CreatePostDto = {
  title: string;
  content: string;
  published: boolean;
};

export type PostDto = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  author: ProfileDto;
  reactions: Reaction[];
  reacted?: ReactionType;
  createdAt: string;
  updatedAt: string;
  _count?: {
    reactions: number;
  };
};

export enum ReactionEnum {
  LIKE = "LIKE",
  LOVE = "LOVE",
  HAHA = "HAHA",
  WOW = "WOW",
  SAD = "SAD",
  HATE = "HATE",
}

export type ReactionType = keyof typeof ReactionEnum;

export type Reaction = {
  userId: number;
  postId: number;
  type: ReactionType;
};
