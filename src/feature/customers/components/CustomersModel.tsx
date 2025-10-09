"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/libs/utils"
import Modal from "@/components/ui/Modal"
import CustomerForm from "./CustomersForm"
import { useCustomersStore } from "../stores/useCustomersStore"
import { Customer } from "../types/types"
import toast from "react-hot-toast"

type DealSlideOverProps = {
  open: boolean
  onClose: () => void
  mode?: 'add' | 'edit'
  customer?: Customer
}

export default function CustomerSlideOver({ open, onClose, mode = 'add', customer }: DealSlideOverProps) {
  const { addCustomer, updateCustomer } = useCustomersStore();

  const handleSubmit = async (values: any) => {
    try {
      if (mode === 'edit' && customer) {
        toast.loading("Updating customer...", { id: "update-customer" });
        await updateCustomer(customer.id, values);
        toast.success("Customer updated successfully!", { id: "update-customer" });
      } else {
        toast.loading("Creating customer...", { id: "create-customer" });
        await addCustomer(values);
        toast.success("Customer created successfully!", { id: "create-customer" });
      }
      onClose();
    } catch (error) {
      const errorMessage = mode === 'edit' ? "Failed to update customer. Please try again." : "Failed to create customer. Please try again.";
      const toastId = mode === 'edit' ? "update-customer" : "create-customer";
      toast.error(errorMessage, { id: toastId });
      console.error(`Error ${mode === 'edit' ? 'updating' : 'creating'} customer:`, error);
    }
  }
  return (
    <Modal open={open} onClose={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="deal-slide-title"
        className={cn(
          "pointer-events-auto fixed right-0 top-0 h-full bg-card border-l border-[var(--border-gray)] shadow-xl flex flex-col bg-white",
          "transition-transform duration-300 will-change-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ width: "400px" }}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-4 p-4 border-b border-[var(--border-gray)]">
          <h2 id="deal-slide-title" className="text-base font-semibold leading-[28px] text-pretty">
            {mode === 'edit' ? 'Update Customer' : 'Add New Customer'}
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </button>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto ">
          <CustomerForm
            onCancel={onClose}
            onSubmit={(values) => handleSubmit(values)}
            mode={mode}
            initialData={customer}
          />
        </div>
      </aside>
    </Modal>
  )
}
