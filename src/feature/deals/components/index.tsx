"use client";
import React from 'react';
import { DealsHeader } from './Deals-Header';
import { Table, TableColumn, Badge } from '@/components/ui/Table';
import { dealsData, DealData } from '../libs/DealsData';

const columns: TableColumn<DealData>[] = [
  { key: 'dealName', title: 'Deal Name', dataIndex: 'dealName', sortable: true },
  { key: 'company', title: 'Company', dataIndex: 'company', sortable: false },
  { key: 'contact', title: 'Contact', dataIndex: 'contact', sortable: false },
  { key: 'stage', title: 'Stage', dataIndex: 'stage', sortable: false, render: (stage) => <Badge variant={stage as any}>{stage}</Badge> },
  { key: 'amount', title: 'Amount', dataIndex: 'amount', sortable: false, render: (amount) => `€${amount.toLocaleString()}` },
  { key: 'owner', title: 'Owner', dataIndex: 'owner', sortable: false, avatar: { srcIndex: 'ownerImage', altIndex: 'owner', size: 32 } },
  { key: 'date', title: 'Closed Date', dataIndex: 'date', sortable: false },
  { key: 'activity', title: 'Last Activity', dataIndex: 'activity', sortable: false },
  { key: 'tags', title: 'Tags', dataIndex: 'tags', sortable: false },


];

const Deals = () => {
  return (
   <div>
    <DealsHeader/>
    <div className='py-8 px-6 xl:w-[1015px] 2xl:w-full  '>
    <Table columns={columns} data={dealsData} selectable={true} />

    </div>
   </div>
  );
};

export default Deals;
