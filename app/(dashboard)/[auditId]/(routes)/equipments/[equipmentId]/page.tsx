import prismadb from "@/lib/prismadb";
import { EquipmentsForm } from "./components/equipment-form";

const EquipmentPage = async ({
    params
}:{
    params: {
        equipmentId: string
    }
}) =>{

    const equipment = await prismadb.equipment.findUnique({
        where:{
            id: params.equipmentId
        }
    });


    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <EquipmentsForm initialData={equipment} />
            </div>
        </div>
    );
}

export default EquipmentPage;