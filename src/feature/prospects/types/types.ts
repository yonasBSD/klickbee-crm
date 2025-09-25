export type Contact = {
    id: string; 
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  owner?: string;
  ownerAvatar?: string;
  status ?:
    | 'New'
    | 'Cold'
    | 'Warm Lead'
    | 'Qualified'
    | 'Converted'
    | 'Not Interested';
  lastContact ?: string;
  tags ?: string;
};
