export type Customer = {
    id: string; 
  customername?: string;
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
