"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, Equipment} from "@prisma/client"
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
  name: z.string().min(2),
  type: z.string().optional(),
  location: z.string().optional(),
  id: z.string().min(2),
});

type EquipmentsFormValues = z.infer<typeof formSchema>

interface EquipmentsFormProps {
  initialData: Equipment | null;
};

export const EquipmentsForm: React.FC<EquipmentsFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit equipment' : 'Create equipment';
  const description = initialData ? 'Edit an equipment.' : 'Add a new equipment';
  const toastMessage = initialData ? 'Equipment updated.' : 'Equipment created.';
  const action = initialData ? 'Save changes' : 'Create';


  const form = useForm<EquipmentsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        name: '',
        type: '', 
        location: '',
        id: '',
    }
  });

  const onSubmit = async (data: EquipmentsFormValues) => {
    try { 
      setLoading(true);
      if(initialData){ 
        await axios.patch(`/api/${params.auditId}/equipments/${params.equipmentId}`, data);
      } else {
        await axios.post(`/api/${params.auditId}/equipments`, data);
      }
      router.refresh();
      router.push(`/${params.auditId}/equipments`)
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Equipment with this ID already exists');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.auditId}/equipments/${params.equipmentId}`);
      router.refresh();
      router.push(`/${params.auditId}/equipments`);
      toast.success('Equipment deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all departments using this equipment first.');
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
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Id</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Equipment id" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Equipment name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Equipment location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Equipment type" {...field} />
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
