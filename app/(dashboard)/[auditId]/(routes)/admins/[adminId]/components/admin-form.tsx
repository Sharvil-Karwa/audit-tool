"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, AdminAudit} from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { useOrigin } from "@/hooks/use-origin"

const formSchema = z.object({
  email: z.string().min(1),
});

type AdminsFormValues = z.infer<typeof formSchema>

interface AdminsFormProps {
  initialData: AdminAudit | null;
};

export const AdminsForm: React.FC<AdminsFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit admin' : 'Create admin';
  const description = initialData ? 'Edit an admin.' : 'Add a new admin';
  const toastMessage = initialData ? 'Admin updated.' : 'Admin created.';
  const action = initialData ? 'Save changes' : 'Create';


  const form = useForm<AdminsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        email: '',
    }
  });

  const onSubmit = async (data: AdminsFormValues) => {
    try { 
      setLoading(true);
      if(initialData){
        await axios.patch(`/api/${params.auditId}/admins/${params.adminId}`, data);
      } else {
        await axios.post(`/api/${params.auditId}/admins`, data);
      }
      router.refresh();
      router.push(`/${params.auditId}/admins`)
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.auditId}/admins/${params.adminId}`);
      router.refresh();
      router.push(`/${params.auditId}/admins`);
      toast.success('Admin deleted.');
    } catch (error: any) {
      toast.error('Deleting admins is restricted to the audit creator');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>}
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Enter admin email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
      <Separator />
    </>
  );
};
