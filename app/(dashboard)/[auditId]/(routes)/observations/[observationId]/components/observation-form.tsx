"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, Observation, Reference} from "@prisma/client"
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

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import prismadb from "@/lib/prismadb"


const formSchema = z.object({
  observation: z.string().min(2),
  reference: z.string().optional()
});

type ObservationsFormValues = z.infer<typeof formSchema>

interface ObservationsFormProps {
  initialData: Observation | null;
  references: Reference[]
};

export const ObservationsForm: React.FC<ObservationsFormProps> = ({
  initialData,
  references
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit observation' : 'Create observation';
  const description = initialData ? 'Edit an observation.' : 'Add a new observation';
  const toastMessage = initialData ? 'Observation updated.' : 'Observation created.';
  const action = initialData ? 'Save changes' : 'Create';


  const form = useForm<ObservationsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        observation: '',
        reference: ''
    }
  });

  const onSubmit = async (data: ObservationsFormValues) => {
    try { 
      setLoading(true);      
      const obsData = {
        "observation" : data.observation,
        "reference" : data.reference
      } 
      console.log(obsData)
      if(initialData){
        await axios.patch(`/api/${params.auditId}/observations/${params.observationId}`, obsData);
      } else {
        await axios.post(`/api/${params.auditId}/observations`, obsData);
      }
      router.refresh();
      router.push(`/${params.auditId}/observations`)
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Observation already exists');
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.auditId}/observations/${params.observationId}`);
      router.refresh();
      router.push(`/${params.auditId}/observations`);
      toast.success('Observation deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all departments using this observation first.');
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
          <div className="grid grid-cols-1 gap-8">
          <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observation</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Observation" {...field} className="h-[100px]"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select reference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {references.map((reference) => (
                        <SelectItem key={reference.id} value={reference.reference}>{reference.reference}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
