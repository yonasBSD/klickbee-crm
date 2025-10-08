export interface TaskData {
  id: string;
  taskName: string;
  linkedTo?: string | { name: string };
  assignedTo?: string | { name: string; assignedImage?: string };
  assignedImage?: string;
  status: 'Todo' | 'InProgress' | 'Done' | 'OnHold';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate?: string;
  lastUpdate?: string;
  notes?: string;
  files?: string[];
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}
