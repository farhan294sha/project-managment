import { createGlobalState } from ".";

export const useSearchQuery = createGlobalState<string | null>(
  "searchTask",
  null,
);
