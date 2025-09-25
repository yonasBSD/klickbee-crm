import { Customer } from "../types/types";

export const customersData: Customer[] = [
  {
    id: '1',
    customername: 'Sophie Lambert',
    companyname: 'Groupe Orion',
    email: 'sophie@orion.fr',
    phone: '+33 6 12 34 56 78',
    owner: 'Claire Brunet',
    ownerAvatar: 'https://i.pravatar.cc/32?img=1',
    status: 'Active',
    lastContact: 'Aug 15 - Call',
    tags: 'Contract, High Priority',
  },
  {
    id: '2',
    customername: 'Marc Lefebvre',
    companyname: 'AEC Partners',
    email: 'marc.lefeb@aec.com',
    phone: '+1 415 889 3321',
    owner: 'Claire Brunet',
    ownerAvatar: 'https://i.pravatar.cc/32?img=2',
    status: 'Follow Up',
    lastContact: 'Jul 30 - Email',
    tags: 'SaaS, New Prospect',
  },
  {
    id: '3',  // even if data is duplicated, id must be unique
    customername: 'Marc Lefebvre',
    companyname: 'AEC Partners',
    email: 'marc.lefeb@aec.com',
    phone: '+1 415 889 3321',
    owner: 'Claire Brunet',
    ownerAvatar: 'https://i.pravatar.cc/32?img=2',
    status: 'Active',
    lastContact: 'Jul 30 - Email',
    tags: 'SaaS, New Prospect',
  },
  {
    id: '4',  // even if data is duplicated, id must be unique
    customername: 'Marc Lefebvre',
    companyname: 'AEC Partners',
    email: 'marc.lefeb@aec.com',
    phone: '+1 415 889 3321',
    owner: 'Claire Brunet',
    ownerAvatar: 'https://i.pravatar.cc/32?img=2',
    status: 'inactive',
    lastContact: 'Jul 30 - Email',
    tags: 'SaaS, New Prospect',
  },
  {
    id: '5',  // even if data is duplicated, id must be unique
    customername: 'Marc Lefebvre',
    companyname: 'AEC Partners',
    email: 'marc.lefeb@aec.com',
    phone: '+1 415 889 3321',
    owner: 'Claire Brunet',
    ownerAvatar: 'https://i.pravatar.cc/32?img=2',
    status: 'Follow Up',
    lastContact: 'Jul 30 - Email',
    tags: 'SaaS, New Prospect',
  },
  {
    id: '6',  // even if data is duplicated, id must be unique
    customername: 'Marc Lefebvre',
    companyname: 'AEC Partners',
    email: 'marc.lefeb@aec.com',
    phone: '+1 415 889 3321',
    owner: 'Claire Brunet',
    ownerAvatar: 'https://i.pravatar.cc/32?img=2',
    status: 'inactive',
    lastContact: 'Jul 30 - Email',
    tags: 'SaaS, New Prospect',
  },
 
];
