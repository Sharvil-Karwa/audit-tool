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

    const references = await prismadb.reference.findMany()

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ReferencesForm initialData={reference} references={references}/>
            </div>
        </div>
    );
}

export default ReferencePage;