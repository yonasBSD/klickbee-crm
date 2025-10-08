"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/Button"
import UploadButton from "@/components/ui/UploadButton"
import { useUserStore } from "@/feature/user/store/userStore"
import SearchableDropdown from "@/components/ui/SearchableDropdown"
import toast from "react-hot-toast"

type TodoFormValues = {
    taskName: string
    linkedTo: string
    assignedTo: string
    status: string
    priority: string
    dueDate: string
    notes: string
    files: File[]
}


const schema = Yup.object({
    taskName: Yup.string().trim().required("Task name is required"),
    linkedTo: Yup.string().trim().required("Company/Contact is required"),
    assignedTo: Yup.string().trim(),
    status: Yup.string().required("Status is required"),
    priority: Yup.string().required("Priority is required"),
    dueDate: Yup.string().nullable(),
    notes: Yup.string(),
    files: Yup.array().of(Yup.mixed<File>()),
})


const initialValues: TodoFormValues = {
    taskName: "",
    linkedTo: "",
    assignedTo: "",
    status: "",
    priority: "",
    dueDate: "",
    notes: "",
    files: [],
}

export default function TodoForm({
    onSubmit,
    onCancel,
}: {
    onSubmit: (values: TodoFormValues) => void
    onCancel: () => void
}) {
    const [uploading, setUploading] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const form = new FormData();
        for (let i = 0; i < files.length; i++) form.append("file", files[i]);

        setUploading(true);
        try {
            const res = await fetch("/api/uploadFile", { method: "POST", body: form });
            if (res.ok) {
                const json = await res.json();
                setUploadedFiles(prev => [...prev, ...json.files]);
                toast.success("Files uploaded successfully!");
            } else {
                toast.error("Upload failed. Please try again.");
            }
        } catch (error) {
            toast.error("Upload failed. Please check your connection and try again.");
        } finally {
            setUploading(false);
        }
    };
    const { users, loading: usersLoading, fetchUsers } = useUserStore();

useEffect(() => {
    if (users.length === 0) {
        fetchUsers();
    }
}, [users]);

const userOptions = users.map((user: any) => ({
    id: user.id,
    value: user.id,
    label: user.name || user.email
}));

    return (
        <Formik<TodoFormValues>
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={async (vals, { setSubmitting, resetForm }) => {
                try {
                    const payload = {
                        ...vals,
                        files: uploadedFiles
                    };

                    onSubmit(payload);
                    toast.success("Task saved successfully!");
                    resetForm();
                } catch (error: any) {
                    toast.error("Failed to save task. Please try again.");
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ isSubmitting, isValid, dirty, values, setFieldValue, resetForm }) => (
                <Form className="flex min-h-full flex-col gap-4">
                    {/* Fields container */}
                    <div className="px-4 py-4 flex flex-col gap-4 ">
                        <FieldBlock name="taskName" label="Task Name">
                            <Field
                                id="taskName"
                                name="taskName"
                                placeholder="Add a name"
                                className="w-full font-medium rounded-md shadow-sm border border-[var(--border-gray)] bg-background px-3 py-2 outline-none focus:ring-1 focus:ring-gray-400 focus:outline-none"
                            />
                        </FieldBlock>

                        <FieldBlock name="linkedTo" label="Linked To">
                            <Field name="linkedTo">
                                {({ field, form }: any) => (
                                    <SearchableDropdown
                                        name="linkedTo"
                                        value={field.value || ""}
                                        options={userOptions}
                                        onChange={(val) => {
                                            form.setFieldValue("linkedTo", val);
                                            form.setFieldTouched("linkedTo", true);
                                        }}
                                        placeholder="Select User"
                                        showIcon={false}
                                        maxOptions={20}
                                    />
                                )}
                            </Field>
                        </FieldBlock>

                        <FieldBlock name="assignedTo" label="Assigned To">
                            <Field name="assignedTo">
                                {({ field, form }: any) => (
                                    <SearchableDropdown
                                        name="assignedTo"
                                        value={field.value || ""}
                                        options={userOptions}
                                        onChange={(val) => {
                                            form.setFieldValue("assignedTo", val);
                                            form.setFieldTouched("assignedTo", true);
                                        }}
                                        placeholder="Select User"
                                        showIcon={false}
                                        maxOptions={20}
                                    />
                                )}
                            </Field>
                        </FieldBlock>

                        <div className="grid grid-cols-2 gap-3">
                            <FieldBlock name="status" label="Status">
                                <Field
                                    as="select"
                                    id="status"
                                    name="status"
                                    className="w-full text-sm rounded-md shadow-sm border  border-[var(--border-gray)] bg-background px-3 py-2 outline-none focus:ring-1 focus:ring-gray-400 focus:outline-none"
                                >
                                    <option value="" disabled>Select Status</option>
                                    <option value="to-do">Todo</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="on-hold">On Hold</option>
                                    <option value="done">Done</option>
                                </Field>
                            </FieldBlock>

                            <FieldBlock name="priority" label="Priority">
                                <Field
                                    as="select"
                                    id="priority"
                                    name="priority"
                                    className="w-full text-sm rounded-md shadow-sm border  border-[var(--border-gray)] bg-background px-3 py-2 outline-none focus:ring-1 focus:ring-gray-400 focus:outline-none"
                                >
                                    <option value="" disabled>Select Priority</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                    <option value="medium">Medium</option>
                                    <option value="low">Low</option>
                                </Field>
                            </FieldBlock>
                        </div>

                        <FieldBlock name="dueDate" label="Due Date">
                            <Field
                                id="dueDate"
                                name="dueDate"
                                type="date"
                                className="w-full rounded-md text-sm shadow-sm border  border-[var(--border-gray)] bg-background px-3 py-2 outline-none focus:ring-1 focus:ring-gray-400 focus:outline-none"
                            />
                        </FieldBlock>
                        <FieldBlock name="notes" label="Notes">
                            <Field
                                as="textarea"
                                id="notes"
                                name="notes"
                                rows={4}
                                placeholder="Add any internal notes or context..."
                                className="w-full text-sm resize-y shadow-sm rounded-md border  border-[var(--border-gray)] bg-background px-3 py-2 outline-none focus:ring-1 focus:ring-gray-400 focus:outline-none"
                            />
                        </FieldBlock>
                        <UploadButton values={values.files} setValue={(values) => setFieldValue('files', values)} uploading={uploading} uploadFile={(e) => handleFileChange(e)} />
                    </div>

                    {/* Footer: sticky to panel bottom */}
                    <div className="mt-auto  border-t border-[var(--border-gray)] p-4 flex items-center gap-3">
                        <Button
                            type="button"
                            className="flex-1"
                            onClick={() => {
                                resetForm()
                                onCancel()
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1 bg-black text-white" >
                            Save Task
                        </Button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}

function FieldBlock({
    name,
    label,
    children,
}: {
    name: string
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={name} className="text-sm font-medium">
                {label}
            </label>
            {children}
            <ErrorMessage name={name} component="div" className="text-sm text-red-600" />
        </div>
    )
}

