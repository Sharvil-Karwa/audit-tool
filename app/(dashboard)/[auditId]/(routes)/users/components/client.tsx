"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { UserColumn, columns } from "./coulmns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface UserClientProps{
    data: UserColumn[]
}

export const UserClient: React.FC<UserClientProps> = ({
    data
}) =>{

    const router = useRouter();
    const params = useParams();

    const filters = [
        {
            label : "Username",
            value : "username"
        },
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
                    title={`Users (${data.length})` }
                    description="Manage users for this Audit"
                /> 
                <Button onClick={()=> router.push(`/${params.auditId}/users/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="username" filters={filters}/>
            <Separator />
            <ApiList entityName="users" entityIdName="userId"/>
        </>
    )
}