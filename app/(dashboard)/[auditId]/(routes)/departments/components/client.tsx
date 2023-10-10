"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { DepartmentColumn, columns } from "./coulmns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface DepartmentClientProps{
    data: DepartmentColumn[]
}

export const DepartmentClient: React.FC<DepartmentClientProps> = ({
    data
}) =>{

    const router = useRouter();
    const params = useParams();


    return(
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Departments (${data.length})` }
                    description="Manage departments for this Audit"
                /> 
                <Button onClick={()=> router.push(`/${params.auditId}/departments/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name"/>
            <Separator />
            <ApiList entityName="departments" entityIdName="departmentId"/>
        </>
    )
}