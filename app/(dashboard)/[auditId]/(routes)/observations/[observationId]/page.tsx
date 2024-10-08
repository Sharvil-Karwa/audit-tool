import prismadb from "@/lib/prismadb";
import { ObservationsForm } from "./components/observation-form";

const ObservationPage = async ({
    params
}:{
    params: {
        observationId: string
    }
}) =>{

    const observation = await prismadb.observation.findUnique({
        where:{
            id: params.observationId
        }
    });

    const references = await prismadb.reference.findMany({
        where:{
            isMain : "true"
        }
    })


    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ObservationsForm initialData={observation} references={references}/>
            </div>
        </div>
    );
}

export default ObservationPage;