import prismadb from "@/lib/prismadb";
import { UserClient } from "./components/client";
import { UserColumn } from "./components/coulmns";
import { format } from "date-fns";

const usersPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const users = await prismadb.user.findMany({
        where:{
            auditId: params.auditId,
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedUsers: UserColumn[] = users.map((item)=>({
        id: item.id,
        username: item.username,
        email: item.email,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <UserClient data={formattedUsers}/>
            </div>
        </div>
    )
} 

export default usersPage;