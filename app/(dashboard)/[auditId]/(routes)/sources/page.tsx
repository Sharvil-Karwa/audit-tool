import prismadb from "@/lib/prismadb";
import { SourceClient } from "./components/client";
import { SourceColumn } from "./components/coulmns";
import { format } from "date-fns";

const sourcesPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const sources = await prismadb.source.findMany({
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedSources: SourceColumn[] = sources.map((item)=>({
        id: item.id,
        source: item.source,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SourceClient data={formattedSources}/>
            </div>
        </div>
    )
} 

export default sourcesPage;