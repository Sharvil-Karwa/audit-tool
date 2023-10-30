"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { SourceColumn, columns } from "./coulmns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface SourceClientProps{
    data: SourceColumn[]
}

export const SourceClient: React.FC<SourceClientProps> = ({
    data
}) =>{

    const router = useRouter();
    const params = useParams();

    const filters = [
        {
            label : "Source",
            value : "source"
        },
        {
            label : "Date",
            value: "createdAt"
        },
        {
            label: "Id",
            value : "id"
        }
    ]

    return(
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Sources (${data.length})` }
                    description="Manage sources for this Audit"
                /> 
                <Button onClick={()=> router.push(`/${params.auditId}/sources/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" filters={filters}/>
            <Separator />
            <ApiList entityName="sources" entityIdName="sourceId"/>
        </>
    )
}