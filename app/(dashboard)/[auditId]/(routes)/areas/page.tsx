import prismadb from "@/lib/prismadb";
import { AreaClient } from "./components/client";
import { AreaColumn } from "./components/coulmns";
import { format } from "date-fns";

const areasPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const areas = await prismadb.area.findMany({
        orderBy:{
            updatedAt: 'desc'
        }
    })

    const formattedAreas: AreaColumn[] = areas.map((item)=>({
        id: item.id,
        area: item.area,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <AreaClient data={formattedAreas}/>
            </div>
        </div>
    )
} 

export default areasPage;