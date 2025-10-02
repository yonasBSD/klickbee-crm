'use client';
import React from 'react';
import DetailModal from '@/components/detailPage'; // the reusable modal we built earlier
import { DealData } from '../libs/DealsData';
import { Badge } from '@/components/ui/Table';

interface DealDetailProps {
  isOpen: boolean;
  deal: DealData | null;
  onClose: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function DealDetail({
  isOpen,
  deal,
  onClose,
  onDelete,
  onEdit,
}: DealDetailProps) {
  if (!deal) return null;

  const details = [
    { label: 'Company', value: deal.company },
    { label: 'Contact', value: deal.contact },
    { label: 'Stage', value: (<Badge variant={deal.stage}>{deal.stage}</Badge>) },
    { label: 'Amount', value: `$${deal.amount.toLocaleString()}` },
    {
      label: 'Owner',
      value: (
        <span className="flex items-center gap-2">
          {deal.ownerImage && (
            <img
              src={deal.ownerImage}
              alt={deal.owner}
              className="w-6 h-6 rounded-full"
            />
          )}
          {deal.owner}
        </span>
      ),
    },
    deal.priority && { label: 'Tags', value: deal.priority },
    deal.date && { label: 'Closed Date', value: deal.date },
    { label: 'Notes', value: deal.notes },

  ].filter(Boolean) as { label: string; value: React.ReactNode }[];

  return (
    <DetailModal
      isOpen={isOpen}
      title={deal.dealName}
      details={details}
      onClose={onClose}
      onDelete={onDelete ? () => onDelete(deal.id) : undefined}
      onEdit={onEdit ? () => onEdit(deal.id) : undefined}
    />
  );
}
