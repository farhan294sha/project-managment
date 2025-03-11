import { createGlobalState } from ".";

export function useTaskDialoge(
  id: string,
  taskType: "UPDATE" | "DISPLAY" | "CREATE",
) {
  return createGlobalState<boolean>(`taskDialoge-${id}-${taskType}`, false)();
}

export function useTaskDeleteAlert(id: string) {
  return createGlobalState<boolean>(`delete-alter${id}`, false)();
}
