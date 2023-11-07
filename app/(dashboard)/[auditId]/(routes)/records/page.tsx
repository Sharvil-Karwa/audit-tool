import prismadb from "@/lib/prismadb";
import { RecordClient } from "./components/client";
import { RecordColumn } from "./components/coulmns";
import { format } from "date-fns";

const recordsPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const records = await prismadb.record.findMany({
        where:{
            auditId: params.auditId
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedRecords: RecordColumn[] = records.map((item)=>({
        id: item.id,
        department: item.department,
        equipment: item.equipment,
        eq_id: item.eq_id,
        rating: item.rating,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        type: item.type,
        location: item.location,
        area: item.area,
        reference: item.reference,
        refCountry: item.refCountry,
        comment: item.comment,
        source: item.source,
        observation: item.observation,
        user: item.user
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RecordClient data={formattedRecords}/>
            </div>
        </div>
    )
} 

export default recordsPage;