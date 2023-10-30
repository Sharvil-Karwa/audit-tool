import prismadb from "@/lib/prismadb";
import { UsersForm } from "./components/user-form";

const UserPage = async ({
    params
}:{
    params: {
        userId: string,
        auditId: string
    }
}) =>{

    const user = await prismadb.user.findUnique({
        where:{
            id: params.userId
        }
    });  

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <UsersForm initialData={user}/>
            </div>
        </div>
    );
}

export default UserPage;