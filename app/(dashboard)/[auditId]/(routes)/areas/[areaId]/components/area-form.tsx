"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, Area, AreaObservation, Observation} from "@prisma/client"
import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

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

const formSchema = z.object({
  area: z.string().min(2),
  // observations: z.array(z.object({ url: z.string() })).optional()
  observations: z.array(z.string()).optional(),
});

type AreasFormValues = z.infer<typeof formSchema>

interface AreasFormProps {
  initialData: Area | null;
  observations: Observation[];
  area_observations: AreaObservation[] | null;
};

export const AreasForm: React.FC<AreasFormProps> = ({
  initialData,
  observations,
  area_observations
}) => {


  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit area' : 'Create area';
  const description = initialData ? 'Edit an area.' : 'Add a new area';
  const toastMessage = initialData ? 'Area updated.' : 'Area created.';
  const action = initialData ? 'Save changes' : 'Create';

  const form = useForm<AreasFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      area: initialData?.area || '',
      observations: area_observations
        ? area_observations.map((deptEquip) => deptEquip.observationId)
        : [],
    },
  });
  
  


  const onSubmit = async (data: AreasFormValues) => {
    console.log(data);
  
    // Check if the 'observations' field is falsy (which includes undefined), and if so, set it to an empty array
    if (!data.observations) {
      data.observations = [];
    }
  
    try {
      setLoading(true);
  
      // Fetch observation details based on selected observation IDs
      const selectedObservationIds = data.observations;
      const selectedObservations = selectedObservationIds.map((observationId) => {
        return observations.find((observation) => observation.id === observationId);
      });
  
      if (initialData) {
        // Update area with selected observation details in the PATCH request
        await axios.patch(`/api/${params.auditId}/areas/${params.areaId}`, {
          area: data.area,
          observations: selectedObservations, // Include the selected observation details
        });
      } else {
        // Create area with selected observation details in the POST request
        await axios.post(`/api/${params.auditId}/areas`, {
          area: data.area,
          observations: selectedObservations, // Include the selected observation details
        });
      }
  
      router.refresh();
      router.push(`/${params.auditId}/areas`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Area already exists');
    } finally {
      setLoading(false);
    }
  };
  
  

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.auditId}/areas/${params.areaId}`);
      router.refresh();
      router.push(`/${params.auditId}/areas`);
      toast.success('Area deleted.');
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
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Area name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          <FormField 
  control={form.control}
  name="observations"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Observations</FormLabel>
      {observations.map((observation) => (
        <div key={observation.id}>
          <label>
            <input
              type="checkbox"
              name="observations"
              value={observation.id}
              onChange={() => {
                const updatedObservations = (field.value ?? []).includes(observation.id)
                  ? field.value?.filter((id) => id !== observation.id) ?? []
                  : [...(field.value ?? []), observation.id];
                form.setValue("observations", updatedObservations);
              }}
              checked={(field.value ?? []).includes(observation.id)}
            />
            {observation.observation} <span className="font-bold">{observation.reference}</span>
          </label>
        </div>
      ))}
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