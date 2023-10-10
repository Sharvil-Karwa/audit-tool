import prismadb from "@/lib/prismadb";
import { DepartmentsForm } from "./components/department-form";

const DepartmentPage = async ({
    params
}:{
    params: {
        departmentId: string,
        auditId: string
    }
}) =>{

    const department = await prismadb.department.findUnique({
        where:{
            id: params.departmentId
        }
    });

    const equipments = await prismadb.equipment.findMany({
        where:{
            auditId: params.auditId
        }
    })


    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <DepartmentsForm initialData={department} equipments={equipments}/>
            </div>
        </div>
    );
}

export default DepartmentPage;