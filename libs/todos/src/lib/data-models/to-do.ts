export type ToDo = {
  id: string;
  user: string;
  description: string;
  completed: boolean;
  createdAt: number; // as Date().getTime()
  completedAt?: number;
  dueDate?: number;
  isImportant?: boolean;
};

export interface TodosApi {
  isLoading: boolean;
  value: ToDo[];
}
