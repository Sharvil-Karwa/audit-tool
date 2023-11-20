import prismadb from "@/lib/prismadb";
import { AdminsForm } from "./components/admin-form";

const AdminPage = async ({
    params
}:{
    params: {
        adminId: string,
        auditId: string
    }
}) =>{

    const admin = await prismadb.adminAudit.findUnique({
        where:{
            id: params.adminId
        }
    });  

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <AdminsForm initialData={admin}/>
            </div>
        </div>
    );
}

export default AdminPage;