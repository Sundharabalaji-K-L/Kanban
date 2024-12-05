// src/models/models.ts
export interface Task {
  id: number;
  todo: string;
  description: string
  owner: string;
  status: 'todo' | 'doing' | 'complete';
}

