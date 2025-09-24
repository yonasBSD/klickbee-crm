"use client"
import React from 'react'
import { Table } from '@/components/ui/Table';

import { ProspectHeader } from './ProspectHeader'
import { prospectsData } from '../libs/prospectsdata'
import { TableColumn } from '@/components/ui/Table'
import { Contact } from '../types/types'

export const prospectsColumns: TableColumn<Contact>[] = [
  {
    key: 'name',
    title: 'Name',
    dataIndex: 'name',
    sortable: true,
  },
  {
    key: 'company',
    title: 'Company',
    dataIndex: 'company',
    sortable: true,
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
  render: (status?: Contact['status']) => {
  const cls: Record<NonNullable<Contact['status']>, string> = {
    New: 'bg-[#E4E4E7] text-[#3F3F46]',
    Cold: 'bg-[#DBEAFE] text-[#1D4ED8]',
    'Warm Lead': 'bg-[#FEF3C7] text-[#92400E]',
    Qualified: 'bg-green-100 text-green-700',
    Converted: 'bg-teal-100 text-teal-700',
    'Not Interested': 'bg-[#FEE2E2] text-[#B91C1C]',
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

export default function Prospects () {
  return (
    <div>
      <ProspectHeader/>
       <div className='py-8 px-6 xl:w-[1015px] 2xl:w-full'>
            <div className='rounded-lg border border-[var(--border-gray)] bg-white shadow-sm'>
             
                <Table columns={prospectsColumns} data={prospectsData} selectable={true} />
            </div>
          </div>
         </div>
  )
}

