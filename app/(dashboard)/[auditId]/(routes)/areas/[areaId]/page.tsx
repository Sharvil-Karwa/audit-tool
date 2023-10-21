import prismadb from "@/lib/prismadb";
import { AreasForm } from "./components/area-form";

const AreaPage = async ({
    params
}:{
    params: {
        areaId: string,
        auditId: string
    }
}) =>{

    const area = await prismadb.area.findUnique({
        where:{
            id: params.areaId
        }
    });

    const observations = await prismadb.observation.findMany() 

    const area_observations = await prismadb.areaObservation.findMany({
        where:{
            areaId: params.areaId
        }
    })


    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <AreasForm initialData={area} observations={observations} area_observations={area_observations}/>
            </div>
        </div>
    );
}

export default AreaPage;