import prismadb from "@/lib/prismadb";
import { ObservationClient } from "./components/client";
import { ObservationColumn } from "./components/coulmns";
import { format } from "date-fns";

const observationsPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const observations = await prismadb.observation.findMany({
        orderBy:{
            updatedAt: 'desc'
        }
    })

    const formattedObservations: ObservationColumn[] = observations.map((item)=>({
        id: item.id,
        observation: item.observation,
        reference: item.reference,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ObservationClient data={formattedObservations}/>
            </div>
        </div>
    )
} 

export default observationsPage;