import prismadb from "@/lib/prismadb";
import { EquipmentClient } from "./components/client";
import { EquipmentColumn } from "./components/coulmns";
import { format } from "date-fns";

const equipmentsPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const equipments = await prismadb.equipment.findMany({
        where:{
            auditId: params.auditId
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedEquipments: EquipmentColumn[] = equipments.map((item)=>({
        id: item.id,
        name: item.name,
        location: item.location,
        type: item.type,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <EquipmentClient data={formattedEquipments}/>
            </div>
        </div>
    )
} 

export default equipmentsPage;