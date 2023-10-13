"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, Source} from "@prisma/client"
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
  source: z.string().min(2),
});

type SourcesFormValues = z.infer<typeof formSchema>

interface SourcesFormProps {
  initialData: Source | null;
};

export const SourcesForm: React.FC<SourcesFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit source' : 'Create source';
  const description = initialData ? 'Edit an source.' : 'Add a new source';
  const toastMessage = initialData ? 'Source updated.' : 'Source created.';
  const action = initialData ? 'Save changes' : 'Create';


  const form = useForm<SourcesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        source: '',
    }
  });

  const onSubmit = async (data: SourcesFormValues) => {
    try { 
      setLoading(true);
      if(initialData){
        await axios.patch(`/api/${params.auditId}/sources/${params.sourceId}`, data);
      } else {
        await axios.post(`/api/${params.auditId}/sources`, data);
      }
      router.refresh();
      router.push(`/${params.auditId}/sources`)
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
      await axios.delete(`/api/${params.auditId}/sources/${params.sourceId}`);
      router.refresh();
      router.push(`/${params.auditId}/sources`);
      toast.success('Source deleted.');
    } catch (error: any) {
      toast.error('Something went wrong');
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
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Source" {...field} />
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
