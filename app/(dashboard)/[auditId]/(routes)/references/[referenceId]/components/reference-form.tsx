"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, Reference} from "@prisma/client"
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
import prismadb from "@/lib/prismadb"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  reference: z.string().min(1),
  mainRef: z.string().optional(),
  country: z.string().optional(),
});

type ReferencesFormValues = z.infer<typeof formSchema>

interface ReferencesFormProps {
  initialData: Reference | null;
  references: Reference[] 
};

export const ReferencesForm: React.FC<ReferencesFormProps> = ({
  initialData,
  references
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [main, setMain] = useState(false);

  const title = initialData ? 'Edit reference' : 'Create reference';
  const description = initialData ? 'Edit this reference.' : 'Add a new reference';
  const toastMessage = initialData ? 'Reference updated.' : 'Reference created.';
  const action = initialData ? 'Save changes' : 'Create';

  

  const form = useForm<ReferencesFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        reference: '',
        mainRef: '',
        country: '',
    }
  });

  const onSubmit = async (data: ReferencesFormValues) => {
    const refData = {
      "reference": data.reference,
      "mainRef" : main ? data.reference : data.mainRef,
      "country" : data.country ? data.country : "",
      "isMain" : main ? "true" : "false"
    }
    try { 
      setLoading(true);
      if(initialData){
        await axios.patch(`/api/${params.auditId}/references/${params.referenceId}`, refData);
      } else {
        await axios.post(`/api/${params.auditId}/references`, refData);
      }
      router.refresh();
      router.push(`/${params.auditId}/references`)
    } catch (error: any) {
      toast.error('Fill all the fields');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.auditId}/references/${params.referenceId}`);
      router.refresh();
      router.push(`/${params.auditId}/references`);
      toast.success('Reference deleted.');
    } catch (error: any) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  const handleMainToggle = () => {
    setMain(!main);
  }; 

  console.log(references)

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
            <div className="flex-col space-y-1">
                <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Reference" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

             
             
              <div className="flex space-x-1">
              <label className="text-sm">Main reference</label>
              <input
                type="checkbox"
                checked={main}
                onChange={handleMainToggle}
                disabled={loading}
              />
              </div>
                
            </div>
            {!main && <FormField
                control={form.control}
                name="mainRef"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Reference</FormLabel>
                    <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue defaultValue={field.value} placeholder="Select the main reference" />
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
              />}
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input disabled={loading} placeholder="Country" {...field} />
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
