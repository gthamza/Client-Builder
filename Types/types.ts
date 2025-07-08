export type Task = {
  id: number;
  title: string;
  description: string;
  assignee: { name: string; initials: string };
  priority: string;
  dueDate: string;
  status: string;
  completed: boolean;
  column: string;
};
