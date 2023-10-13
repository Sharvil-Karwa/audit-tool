import prismadb from "@/lib/prismadb";
import { SourcesForm } from "./components/source-form";

const SourcePage = async ({
    params
}:{
    params: {
        sourceId: string,
        auditId: string
    }
}) =>{

    const source = await prismadb.source.findUnique({
        where:{
            id: params.sourceId
        }
    });  

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SourcesForm initialData={source}/>
            </div>
        </div>
    );
}

export default SourcePage;