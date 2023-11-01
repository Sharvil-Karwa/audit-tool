"use client"

import React, { useState } from "react";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Download, MoveDown, Table, Trash } from "lucide-react";
import { Audit } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import { ApiAlert } from "@/components/ui/api-alert";
import { useOrigin } from "@/hooks/use-origin";
import * as XLSX from "xlsx";
import { useDropzone } from "react-dropzone";
import prismadb from "@/lib/prismadb";
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const formSchema = z.object({
  name: z.string().min(2),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData: Audit;
}

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData,
}) => {
  const params = useParams();
  const router = useRouter();
  const origin = useOrigin();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedData1, setUploadedData1] = useState<any>(null);
  const [uploadedData2, setUploadedData2] = useState<any>(null);
  const [uploadedData3, setUploadedData3] = useState<any>(null);
  const [uploadedData4, setUploadedData4] = useState<any>(null);



  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const downloadTemplate = () => {
    const DepartmentData = [
      ["department"]
    ];

    const EquipmentData = [
      ["equip_id", "equipment", "type", "location"],
    ];

    const ratingData = [
      ["rating"],
    ]; 

    const depEquipData = [
      ["department", "eq_id"],
    ]; 

    const wb = XLSX.utils.book_new();
    const departmentWS = XLSX.utils.aoa_to_sheet(DepartmentData);
    const equipmentWS = XLSX.utils.aoa_to_sheet(EquipmentData);
    const ratingWS = XLSX.utils.aoa_to_sheet(ratingData);
    const depEqWS = XLSX.utils.aoa_to_sheet(depEquipData);

    XLSX.utils.book_append_sheet(wb, departmentWS, "Sheet1");
    XLSX.utils.book_append_sheet(wb, equipmentWS, "Sheet2");
    XLSX.utils.book_append_sheet(wb, ratingWS, "Sheet3");
    XLSX.utils.book_append_sheet(wb, depEqWS, "Sheet4");

    // Create a blob and trigger the download
    XLSX.writeFile(wb, "audit_template.xlsx");
  };

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/audits/${params.auditId}`, data);
      router.refresh();
      toast.success('Audit updated.');
    } catch (error: any) {
      toast.error('Audit already exists');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/audits/${params.auditId}`);
      router.refresh();
      router.push('/');
      toast.success('Audit deleted.');
    } catch (error: any) {
      toast.error('Make sure you removed all departments, equipment, etc first.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.error("Invalid file. Please upload a valid Excel file.");
      return;
    }
  
    const file = acceptedFiles[0];
    const reader = new FileReader();
  
    reader.onload = async (event) => {
      const data = event.target?.result as ArrayBuffer;
  
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName1 = workbook.SheetNames[0];
      const sheet1 = workbook.Sheets[sheetName1];
      const sheetName2= workbook.SheetNames[1];
      const sheet2 = workbook.Sheets[sheetName2];
      const sheetName3= workbook.SheetNames[2];
      const sheet3 = workbook.Sheets[sheetName3];
      const sheetName4= workbook.SheetNames[3];
      const sheet4 = workbook.Sheets[sheetName4];
      const sheetData1: string[][] = XLSX.utils.sheet_to_json(sheet1, { header: 1 });
      const sheetData2: string[][] = XLSX.utils.sheet_to_json(sheet2, { header: 1 });
      const sheetData3: string[][] = XLSX.utils.sheet_to_json(sheet3, { header: 1 });
      const sheetData4: string[][] = XLSX.utils.sheet_to_json(sheet4, { header: 1 });
  
      setUploadedData1(sheetData1);
      setUploadedData2(sheetData2);
      setUploadedData3(sheetData3);
      setUploadedData4(sheetData4);


  
      // Extract unique department names
      const departmentColumn = sheetData1.map((row) => row[0]);
      const equipmentIdColumn = sheetData2.map((row) => row[0]);
      const equipmentColumn = sheetData2.map((row) => row[1]);
      const typeColumn = sheetData2.map((row) => row[2]);
      const locationColumn = sheetData2.map((row) => row[3]);
      const ratingColumn = sheetData3.map((row) => row[0]);
      const depCol = sheetData4.map((row)=>row[0]);
      const eqidCol = sheetData4.map((row)=>row[1]);

      const uniqueDepartments = Array.from(new Set(departmentColumn));
      const uniqueRatings = Array.from(new Set(ratingColumn));

  
      // Log unique departments
      console.log("Unique Departments:", uniqueDepartments);
      console.log("Unique Departments:", equipmentColumn);
      console.log("Unique Departments:", typeColumn);
      console.log("Unique Departments:", locationColumn);
      console.log("Unique Departments:", equipmentIdColumn);
      
  
      // Create departments in the database
      for (const dep of uniqueDepartments.slice(1)) {
        try {
          await axios.post(`/api/${params.auditId}/departments`, {
            "name": dep,
            "auditId" : params.auditId,
            "equipments": []
          });
        } catch (error) {
          console.error(`Error creating department "${dep}":`, error);
          // Optionally, you can continue the loop here without breaking:
          continue;
        }
      }

      for (const rating of uniqueRatings.slice(1)) {
        try {
          await axios.post(`/api/${params.auditId}/ratings`, {
            "rating": rating
          });
        } catch (error) {
          console.error(`Error creating rating "${rating}":`, error);
          // Optionally, you can continue the loop here without breaking:
          continue;
        }
      }

      for(let i=1;i<equipmentIdColumn.length;i++){
        try {
          await axios.post(`/api/${params.auditId}/equipments`, {
            "name" : equipmentColumn[i],
            "type" : typeColumn[i] ? typeColumn[i] : "",
            "location": locationColumn[i] ? locationColumn[i]: "",
            "id" : equipmentIdColumn[i],
          });
        } catch (error) {
          console.error(`Error creating equipment of id "${equipmentIdColumn[i]}":`, error);
          continue;
        }
      }

      for(let i=1;i<depCol.length;i++){
        try{
          await axios.post(`/api/${params.auditId}/depeq`,{
            "name": depCol[i],
            "equipmentId": eqidCol[i]
          }) 
        } 
        catch(error){
          continue;
        }
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  
  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title="Audit settings" description="Manage audit preferences" />
        <div className="flex-col space-y-2">
        <Button
          disabled={loading}
          size="sm"
          variant="secondary"
          onClick={downloadTemplate}
        >
          Download Template <Download className="ml-3"/>
        </Button>

        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <Button>
            <Table className="mr-2"/> Upload Excel
          </Button>
        </div>
        </div>

        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                    <Input disabled={loading} placeholder="Audit name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        variant="public"
        description={`${origin}/api/${params.auditId}`}
      />
    </>
  );
};
