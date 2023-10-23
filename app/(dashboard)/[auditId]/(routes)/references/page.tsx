import prismadb from "@/lib/prismadb";
import { ReferenceClient } from "./components/client";
import { ReferenceColumn } from "./components/coulmns";
import { format } from "date-fns";

const referencesPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const references = await prismadb.reference.findMany({
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedReferences: ReferenceColumn[] = references.map((item)=>({
        id: item.id,
        reference: item.reference,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
        mainRef: item.mainRef,
        country: item.country
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ReferenceClient data={formattedReferences}/>
            </div>
        </div>
    )
} 

export default referencesPage;