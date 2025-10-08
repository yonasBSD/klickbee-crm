export type Customer = {
  id: string;
  userId: string;
  fullName: string;
  company: string;
  email?: string;
  phone?: string;
  status: 'Active' | 'FollowUp' | 'inactive';
  tags: string[];
  notes?: string;
  files?: any;
  ownerId: string;
  owner: {
    id: string;
    name?: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
};
