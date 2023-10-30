"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { EquipmentColumn, columns } from "./coulmns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface EquipmentClientProps{
    data: EquipmentColumn[]
}

const filters = [
    {
        label: "Equipment",
        value: "name"
    }, 
    {
        label: "Type",
        value: "type"
    },
    {
        label: "Id",
        value: "id"
    },
    {
        label: "Location",
        value: "location"
    },
    {
        label: "Date",
        value: "createdAt"
    },
]


export const EquipmentClient: React.FC<EquipmentClientProps> = ({
    data
}) =>{

    const router = useRouter();
    const params = useParams();


    return(
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Equipments (${data.length})` }
                    description="Manage equipments for this Audit"
                /> 
                <Button onClick={()=> router.push(`/${params.auditId}/equipments/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" filters={filters}/>
            <Separator />
            <ApiList entityName="equipments" entityIdName="equipmentId"/>
        </>
    )
}