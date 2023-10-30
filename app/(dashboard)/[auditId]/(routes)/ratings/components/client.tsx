"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { RatingColumn, columns } from "./coulmns"
import { DataTable } from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list"

interface RatingClientProps{
    data: RatingColumn[]
}

const filters = [
    {
        label : "Rating",
        value : "rating"
    },
    {
        label : "Id",
        value: "id"
    }
]

export const RatingClient: React.FC<RatingClientProps> = ({
    data
}) =>{

    const router = useRouter();
    const params = useParams();

    return(
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`Ratings (${data.length})` }
                    description="Manage ratings for this Audit"
                /> 
                <Button onClick={()=> router.push(`/${params.auditId}/ratings/new`)}>
                    <Plus className="mr-2 h-4 w-4"/>
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" filters={filters}/>
            <Separator />
            <ApiList entityName="ratings" entityIdName="ratingId"/>
        </>
    )
}