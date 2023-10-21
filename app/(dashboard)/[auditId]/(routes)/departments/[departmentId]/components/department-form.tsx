"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, Department, DepartmentEquipment, Equipment} from "@prisma/client"
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
  name: z.string().min(2),
  // equipments: z.array(z.object({ url: z.string() })).optional()
  equipments: z.array(z.string()).optional(),
});

type DepartmentsFormValues = z.infer<typeof formSchema>

interface DepartmentsFormProps {
  initialData: Department | null;
  equipments: Equipment[];
  department_equipments: DepartmentEquipment[] | null;
};

export const DepartmentsForm: React.FC<DepartmentsFormProps> = ({
  initialData,
  equipments,
  department_equipments
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
    defaultValues: {
      name: initialData?.name || '',
      equipments: department_equipments
        ? department_equipments.map((deptEquip) => deptEquip.equipmentId)
        : [],
    },
  });
  
  


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
      toast.error('Department already exists');
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
<FormField 
  control={form.control}
  name="equipments"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Equipments</FormLabel>
      {equipments
        .filter((equipment) => 
          !equipment.assigned || equipment.depId === params.departmentId
        )
        .map((equipment) => (
          <div key={equipment.id}>
            <label>
              <input
                type="checkbox"
                name="equipments"
                value={equipment.id}
                onChange={() => {
                  let updatedEquipments = field.value ?? [];
                  if (updatedEquipments.includes(equipment.id)) {
                    updatedEquipments = updatedEquipments.filter(id => id !== equipment.id);
                  } else {
                    updatedEquipments = [...updatedEquipments, equipment.id];
                  }
                  form.setValue("equipments", updatedEquipments);
                }}
                checked={(field.value ?? []).includes(equipment.id)}
              />
              {equipment.name} ({equipment.id}-{equipment.location}-{equipment.type})
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