"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { ReferenceColumn, columns } from "./coulmns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface ReferenceClientProps{
    data: ReferenceColumn[]
}

export const ReferenceClient: React.FC<ReferenceClientProps> = ({
    data
}) =>{

    const router = useRouter();
    const params = useParams();

    return(
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`References (${data.length})` }
                    description="Manage references for this Audit"
                /> 
                <Button onClick={()=> router.push(`/${params.auditId}/references/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="reference"/>
            <Separator />
            <ApiList entityName="references" entityIdName="referenceId"/>
        </>
    )
}