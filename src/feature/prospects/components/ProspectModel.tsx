"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/libs/utils"
import Modal from "@/components/ui/Modal"
import ProspectForm from "./ProspectForm"
import { useProspectsStore } from "../stores/useProspectsStore"

type ProspectSlideOverProps = {
  open: boolean
  onClose: () => void
}

export default function ProspectSlideOver({ open, onClose }: ProspectSlideOverProps) {
  const { addProspect } = useProspectsStore();

  const handleSubmit = async (values: any) => {
    try {
      // Convert form values to match the store's expected format
      const prospectData = {
        fullName: values.fullName,
        company: values.company,
        email: values.email || null,
        phone: values.phone || null,
        status: values.status,
        tags: values.tags || [],
        notes: values.notes || null,
      };

      await addProspect(prospectData);
      onClose();
    } catch (err) {
      console.error("Error creating prospect:", err);
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="prospect-slide-title"
        className={cn(
          "pointer-events-auto fixed right-0 top-0 h-full bg-card border-l border-[var(--border-gray)] shadow-xl flex flex-col bg-white",
          "transition-transform duration-300 will-change-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
        style={{ width: "400px" }}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-4 p-4 border-b border-[var(--border-gray)]">
          <h2 id="prospect-slide-title" className="text-base font-semibold leading-[28px] text-pretty">
            Add New Prospect
          </h2>
          <button onClick={onClose} aria-label="Close">
            <X className="size-4" />
          </button>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto ">
          <ProspectForm
            onCancel={onClose}
            onSubmit={(values) => handleSubmit(values)}
          />
        </div>
      </aside>
    </Modal>
  )
}
