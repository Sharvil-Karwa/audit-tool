"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, Department, Equipment} from "@prisma/client"
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

const formSchema = z.object({
  name: z.string().min(2),
  // equipments: z.array(z.object({ url: z.string() })).optional()
  equipments: z.array(z.string()).optional(),
});

type DepartmentsFormValues = z.infer<typeof formSchema>

interface DepartmentsFormProps {
  initialData: Department | null;
  equipments: Equipment[]
};

export const DepartmentsForm: React.FC<DepartmentsFormProps> = ({
  initialData,
  equipments
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit department' : 'Create department';
  const description = initialData ? 'Edit an department.' : 'Add a new department';
  const toastMessage = initialData ? 'Department updated.' : 'Department created.';
  const action = initialData ? 'Save changes' : 'Create';


  const form = useForm<DepartmentsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
        name: '',
        equipments: []
    }
  });


  // const onSubmit = async (data: DepartmentsFormValues) => { 
  //   try { 

  //     setLoading(true);
  //     if(initialData){
  //       await axios.patch(`/api/${params.auditId}/departments/${params.departmentId}`, data);
  //     } else {
  //       await axios.post(`/api/${params.auditId}/departments`, data);
  //     }
  //     router.refresh();
  //     router.push(`/${params.auditId}/departments`)
  //     toast.success(toastMessage);
  //   } catch (error: any) {
  //     toast.error('Something went wrong.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const onSubmit = async (data: DepartmentsFormValues) => {
  //   console.log(data);
  
  //   // Check if the 'equipments' field is empty and assign it an empty array if it is
  //   if (!data.equipments) {
  //     data.equipments = [];
  //   }
  
  //   try {
  //     setLoading(true);
  //     if (initialData) {
  //       await axios.patch(`/api/${params.auditId}/departments/${params.departmentId}`, data);
  //     } else {
  //       await axios.post(`/api/${params.auditId}/departments`, data);
  //     }
  //     router.refresh();
  //     router.push(`/${params.auditId}/departments`);
  //     toast.success(toastMessage);
  //   } catch (error: any) {
  //     toast.error('Something went wrong.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const onSubmit = async (data: DepartmentsFormValues) => {
    console.log(data);
  
    // Check if the 'equipments' field is falsy (which includes undefined), and if so, set it to an empty array
    if (!data.equipments) {
      data.equipments = [];
    }
  
    try {
      setLoading(true);
  
      // Fetch equipment details based on selected equipment IDs
      const selectedEquipmentIds = data.equipments;
      const selectedEquipments = selectedEquipmentIds.map((equipmentId) => {
        return equipments.find((equipment) => equipment.id === equipmentId);
      });
  
      if (initialData) {
        // Update department with selected equipment details in the PATCH request
        await axios.patch(`/api/${params.auditId}/departments/${params.departmentId}`, {
          name: data.name,
          equipments: selectedEquipments, // Include the selected equipment details
        });
      } else {
        // Create department with selected equipment details in the POST request
        await axios.post(`/api/${params.auditId}/departments`, {
          name: data.name,
          equipments: selectedEquipments, // Include the selected equipment details
        });
      }
  
      router.refresh();
      router.push(`/${params.auditId}/departments`);
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
      await axios.delete(`/api/${params.auditId}/departments/${params.departmentId}`);
      router.refresh();
      router.push(`/${params.auditId}/departments`);
      toast.success('Department deleted.');
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Department name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField 
              control={form.control}
              name="equipments"
              render={({field})=>(
                <FormItem>
                  <FormLabel>Equipments</FormLabel>
                  <Select disabled={loading} onValueChange={field.onChange}>
                  <FormControl>
                      <SelectTrigger>
                        <SelectValue  placeholder="Select an equipment" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {equipments.map((equipment) => (
                        <SelectItem key={equipment.id} value={equipment.id}>{equipment.name} ({equipment.id}-{equipment.location}-{equipment.type})</SelectItem>
                      ))}
                    </SelectContent> 
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
          {initialData && <FormField 
                              control={form.control}
                              name="equipments"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Equipments</FormLabel>
                                  {equipments.map((equipment) => (
                                    <div key={equipment.id}>
                                      <label>
                                        <input
                                          type="checkbox"
                                          name="equipments"
                                          value={equipment.id}
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;
                                            const equipmentId = e.target.value;
                                            const updatedEquipments = isChecked
                                              ? [...(field.value || []), equipmentId]
                                              : (field.value || []).filter((id) => id !== equipmentId);
                                            field.onChange(updatedEquipments);
                                          }}
                                          checked={field.value ? field.value.includes(equipment.id) : false}
                                        />
                                        {equipment.name} ({equipment.id}-{equipment.location}-{equipment.type})
                                      </label>
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
