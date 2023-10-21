"use client";

import { useAuditModal } from "@/hooks/use-audit-modal";
import { Modal } from "../ui/modal";

import * as z from "zod"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const formSchema = z.object({
    name: z.string().min(1),
});

export const AuditModal = () =>{ 

    const auditModal = useAuditModal();
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
        },
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try{
            setLoading(true);
            const response = await axios.post('/api/audits', values);
            window.location.assign(`/${response.data.id}`);
        } catch (error){
            toast.error("Audit already exists");
            console.log(error);
        } finally{
            setLoading(false);
        }
    };

    return(
        <Modal
            title="Add Audit"
            description="Add a new audit"
            isOpen={auditModal.isOpen}
            onClose={auditModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Audit Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                            <Button  variant="outline" onClick={auditModal.onClose} disabled={loading}>
                                Cancel
                            </Button>
                            <Button  type="submit" disabled={loading}>
                                Continue
                            </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </Modal>
    )
}