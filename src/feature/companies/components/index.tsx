"use client"
import React from 'react'
import { Table, TableColumn } from '@/components/ui/Table';
import { Companie } from '../types/types';
import { companiesData } from '../libs/companiesData';
import { CompaniesHeader } from './CompaniesHeader';

export const customerColumns: TableColumn<Companie>[] = [
    {
      key: 'companyname',
      title: 'Company Name',
      dataIndex: 'companyname',
      sortable: true,
    },
  {
    key: 'industry',
    title: ' Industry',
    dataIndex: 'industry',
    sortable: false,
  },
  {
    key: 'website',
    title: ' Website',
    dataIndex: 'website',
    sortable: false,
  },
  
  {
    key: 'email',
    title: 'Email',
    dataIndex: 'email',
    sortable: false,
  },
  {
    key: 'phone',
    title: 'Phone',
    dataIndex: 'phone',
    sortable: false,
  },
  {
    key: 'owner',
    title: 'Owner',
    dataIndex: 'owner',
    avatar: { srcIndex: 'ownerAvatar', altIndex: 'owner', size: 32 },
  },
  {
    key: 'status',
    title: 'Status',
    dataIndex: 'status',
  render: (status?: Companie['status']) => {
  const cls: Record<NonNullable<Companie['status']>, string> = {
    Active: 'bg-green-100 text-green-700',
    'Follow Up': 'bg-[#FEF3C7] text-[#92400E]',
    'inactive': 'bg-[#FEE2E2] text-[#B91C1C]',
 
  };

  const classes = status ? cls[status] : 'bg-gray-100 text-gray-500'; 

  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${classes}`}>
      {status ?? 'Unknown'}
    </span>
  );
},

  },
  {
    key: 'lastContact',
    title: 'Last Contact',
    dataIndex: 'lastContact',
    sortable: true,
  },
  {
    key: 'tags',
    title: 'Tags',
    dataIndex: 'tags',
    sortable: false,
  },
]


export default function Companies () {
  return (
    <div>
      <CompaniesHeader/>
 <div className='py-8 px-6 xl:w-[1015px] 2xl:w-full'>
            <div className='rounded-lg border border-[var(--border-gray)] bg-white shadow-sm'>
             
                <Table columns={customerColumns} data={companiesData} selectable={true} />
            </div>
          </div>
    </div>
  )
}

