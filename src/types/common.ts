export type FormType = "create" | "update";

export type FormState<T> = {
  open: boolean;
  type: FormType;
  data: Partial<T>;
};
