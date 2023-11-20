import prismadb from "@/lib/prismadb";
import { AdminClient } from "./components/client";
import { AdminColumn } from "./components/coulmns";
import { format } from "date-fns";

const adminsPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const admins = await prismadb.adminAudit.findMany({
        where:{
            auditId: params.auditId,
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedAdmins: AdminColumn[] = admins.map((item)=>({
        id: item.id,
        email: item.email,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <AdminClient data={formattedAdmins}/>
            </div>
        </div>
    )
} 

export default adminsPage;