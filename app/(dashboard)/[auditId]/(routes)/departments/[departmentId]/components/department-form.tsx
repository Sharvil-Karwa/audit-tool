"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import {Audit, Department, Equipment} from "@prisma/client"
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
  equipments: Equipment[] | null;
};

export const DepartmentsForm: React.FC<DepartmentsFormProps> = ({
  initialData,
  equipments,
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
  
  let curr_equipments: Equipment[] = [];

  { equipments && equipments.forEach((equipment) => {
    if (equipment.depId === params.departmentId) {
      curr_equipments.push(equipment);
    }
  });
}

  

  const form = useForm<DepartmentsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name || '',
      equipments: []
    },
  });
  

  const onSubmit = async (data: DepartmentsFormValues) => {
    try { 
      setLoading(true); 
      let finalEquip: String[] = []
      if(data.equipments){
        data.equipments.forEach((eq)=>{
          finalEquip.push(eq)
        })
      }
      if(curr_equipments){
        curr_equipments.forEach((eq)=>{
          finalEquip.push(eq.id)
        })
      }
      const depData = {
        "name" : data.name,
        "equipments" : finalEquip ? finalEquip : []
      }
      if(initialData){
        await axios.patch(`/api/${params.auditId}/departments/${params.departmentId}`, depData);
      } else {
        await axios.post(`/api/${params.auditId}/departments`, data);
      }
      router.refresh();
      router.push(`/${params.auditId}/departments`)
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Department with this name already exists');
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
      {equipments && equipments
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
                  const updatedEquipments = field.value ?? [];
                  const isEquipmentInCurr = curr_equipments.some(currEquipment => currEquipment.id === equipment.id);

                  if (updatedEquipments.includes(equipment.id)) {
                    updatedEquipments.splice(updatedEquipments.indexOf(equipment.id), 1);

                    if (isEquipmentInCurr) {
                      // Remove the equipment from curr_equipments
                      curr_equipments = curr_equipments.filter(currEquipment => currEquipment.id !== equipment.id);
                    }
                  } else {
                    updatedEquipments.push(equipment.id);

                    if (isEquipmentInCurr) {
                      // Add the equipment to curr_equipments
                      curr_equipments.push(equipment);
                    }
                  }

                  form.setValue("equipments", updatedEquipments);
                }}
                checked={(curr_equipments.some(currEquipment => currEquipment.id === equipment.id) || (field.value ?? []).includes(equipment.id))}
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