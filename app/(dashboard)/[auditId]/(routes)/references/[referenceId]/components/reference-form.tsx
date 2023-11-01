"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, ObsRef, Observation, Reference} from "@prisma/client"
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
import prismadb from "@/lib/prismadb"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const formSchema = z.object({
  reference: z.string().min(1),
  mainRef: z.string().optional(),
  country: z.string().optional(),
  observations: z.array(z.string()).optional(),
});

type ReferencesFormValues = z.infer<typeof formSchema>

interface ReferencesFormProps {
  initialData: Reference | null;
  references: Reference[];
  observations: Observation[];
  refobs: ObsRef[];
};

export const ReferencesForm: React.FC<ReferencesFormProps> = ({
  initialData,
  references,
  observations,
  refobs
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [main, setMain] = useState(false);
  const [mainRef, setMainRef] = useState("");

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
        observations: refobs
        ? refobs.map((refobservation) => refobservation.obsId)
        : [],
    }
  });

  const onSubmit = async (data: ReferencesFormValues) => {
    const refData = {
      "reference": data.reference,
      "mainRef" : main ? data.reference : data.mainRef,
      "country" : data.country ? data.country : "USA",
    } 
    if (!data.observations) {
      data.observations = [];
    }
    if(!main && !data.mainRef){
      toast.error("Choose main reference")
      return;
    }
    try { 
      setLoading(true);
      let selectedObservationIds: String[] = []

      if(data.observations){
        data.observations.forEach((da)=>{
          selectedObservationIds.push(da)
        })
      }

      

      if(initialData){
        await axios.patch(`/api/${params.auditId}/references/${params.referenceId}`, {
          "reference": refData.reference,
          "mainRef" : refData.mainRef,
          "country" : refData.country,
          "isMain": (refData.reference == refData.mainRef) ? "true" : "false",
          "observations": selectedObservationIds
        });
      } else {
        await axios.post(`/api/${params.auditId}/references`, {
          "reference": refData.reference,
          "mainRef" : refData.mainRef,
          "country" : refData.country,
          "isMain": (refData.reference == refData.mainRef) ? "true" : "false",
          "observations": selectedObservationIds
        });
      }
      router.refresh();
      router.push(`/${params.auditId}/references`)
      toast.success(toastMessage);

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

  const refobsids: String[] = []

  for(const ro of refobs){
    refobsids.push(ro.obsId)
  }

  // Add the selected observations to prevselectedobs based on refobs
  const prevselectedobs: Observation[] = observations.filter((observation) =>
    refobs.some((refobservation) => refobservation.obsId === observation.id)
  );


  const [currobs, setCurrobs] = useState(prevselectedobs);

  const prevnotselectedobs: Observation[] = observations.filter((observation) =>
    !refobs.some((refobservation) => refobservation.obsId === observation.id)
  );

  const [mainrefobs, setMainrefobs] = useState<Observation[]>([]);

  useEffect(() => {
    if (initialData?.mainRef) {
      const selectedMainRefObs = observations.filter(
        (observation) => observation.reference === initialData.mainRef
      );
      setMainrefobs(selectedMainRefObs);
    }
  }, []);

  const updateMainRefObs = () => {
    const selectedMainRef = form.getValues('mainRef');

    // Filter the observations whose reference matches the selected main reference
    const selectedMainRefObs = observations.filter(
      (observation) => observation.reference === selectedMainRef
    );

    // Log the selected main reference observations
    console.log('Selected Main Reference Observations:', selectedMainRefObs);

    // Update the mainrefobs state
    setMainrefobs(selectedMainRefObs);
  };


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
          {!main && (
        <FormField
          control={form.control}
          name="mainRef"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main Reference</FormLabel>
              <Select
                disabled={loading}
                onValueChange={(newValue) => {
                  // Update the form values when the mainRef is changed
                  form.setValue('mainRef', newValue);

                  // Call the updateMainRefObs function when mainRef changes
                  updateMainRefObs();
                }}
                value={form.getValues('mainRef')}
                defaultValue={form.getValues('mainRef')}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      defaultValue={field.value}
                      placeholder="Select the main reference"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {references.map((reference) => (
                    <SelectItem key={reference.id} value={reference.reference}>
                      {reference.reference}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
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
         
              {
                !main && <FormField
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
              }

          {
            !main && <FormField
            control={form.control}
            name="observations"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Main Reference Observations</FormLabel>
                {mainrefobs &&
                    mainrefobs.map((observation) => (
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
                        </label>
                        {observation.observation}
                      </div>
                    ))}
                <FormMessage />
              </FormItem>
            )}
          />
          }

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

