import prismadb from "@/lib/prismadb";
import { DepartmentClient } from "./components/client";
import { DepartmentColumn } from "./components/coulmns";
import { format } from "date-fns";

const departmentsPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const departments = await prismadb.department.findMany({
        where:{
            auditId: params.auditId
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedDepartments: DepartmentColumn[] = departments.map((item)=>({
        id: item.id,
        name: item.name,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <DepartmentClient data={formattedDepartments}/>
            </div>
        </div>
    )
} 

export default departmentsPage;