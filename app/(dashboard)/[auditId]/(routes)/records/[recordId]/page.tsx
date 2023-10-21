import prismadb from "@/lib/prismadb";
import { RecordsForm } from "./components/record";

const RecordPage = async ({
    params
}:{
    params: {
        recordId: string
    }
}) =>{

    const record = await prismadb.record.findUnique({
        where:{
            id: params.recordId
        }
    });


    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RecordsForm initialData={record} />
            </div>
        </div>
    );
}

export default RecordPage;