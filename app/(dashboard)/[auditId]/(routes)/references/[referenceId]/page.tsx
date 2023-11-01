import prismadb from "@/lib/prismadb";
import { ReferencesForm } from "./components/reference-form";

const ReferencePage = async ({
    params
}:{
    params: {
        referenceId: string,
        auditId: string
    }
}) =>{

    const reference = await prismadb.reference.findUnique({
        where:{
            id: params.referenceId
        }
    });  

    const references = await prismadb.reference.findMany({
        where:{
            isMain: "true"
        }
    })

    const refObs = await prismadb.obsRef.findMany({
        where: {
            refId: params.referenceId
        }
    })

    const observations = await prismadb.observation.findMany()

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ReferencesForm observations={observations} refobs={refObs} initialData={reference} references={references}/>
            </div>
        </div>
    );
}

export default ReferencePage;