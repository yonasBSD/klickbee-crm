export type Companie = {
  id: string; 
  industry?: string;
  website?: string;
  companyname?: string;
  email?: string;
  phone?: string;
  owner?: string;
  ownerAvatar?: string;
  status ?:
    | 'Active'
    | 'Follow Up'
    | 'inactive'
  lastContact ?: string;
  tags ?: string;
};
