// src/models/models.ts
export interface Todo {
  id: number;
  todo: string;
  isDone: boolean;
  owner: string;
  status: 'todo' | 'doing' | 'complete';
}