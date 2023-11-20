"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { RecordColumn, columns } from "./coulmns"
import { DataTable } from "@/components/ui/data-table-record"
import { ApiList } from "@/components/ui/api-list"

interface RecordClientProps{
    data: RecordColumn[]
}

export const RecordClient: React.FC<RecordClientProps> = ({
    data
}) =>{

    const router = useRouter();
    const params = useParams();


    return(
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Records (${data.length})` }
                    description="Manage records for this Audit"
                /> 
            </div>
            <Separator />
            <ApiList entityName="record" entityIdName="recordId"/>
            <Separator />
            <DataTable columns={columns} data={data} />
        </>
    )
}