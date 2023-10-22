import prismadb from "@/lib/prismadb";
import { RecordsForm } from "./components/record";

const RecordPage = async ({
    params
}: {
    params: {
        recordId: string; // Change the type to number
    };
}) => {


    const record = await prismadb.record.findFirst({
        where: {
            id: parseInt(params.recordId, 10) // Pass it as a number
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RecordsForm initialData={record} />
            </div>
        </div>
    );
}

export default RecordPage;
