"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { AdminColumn, columns } from "./coulmns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface AdminClientProps{
    data: AdminColumn[]
}

export const AdminClient: React.FC<AdminClientProps> = ({
    data
}) =>{

    const router = useRouter();
    const params = useParams();

    const filters = [
        {
            label : "Date",
            value: "createdAt"
        },
        {
            label: "Email",
            value : "email"
        }
    ]

    return(
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Admins (${data.length})` }
                    description="Manage admins for this Audit"
                /> 
                <Button onClick={()=> router.push(`/${params.auditId}/admins/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" filters={filters}/>
            <Separator />
            <ApiList entityName="admins" entityIdName="adminId"/>
        </>
    )
}