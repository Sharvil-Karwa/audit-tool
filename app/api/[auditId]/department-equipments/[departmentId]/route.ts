import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";
import { any } from "zod";

export async function GET(
    req: Request,
  { params }: { params: { auditId: string, departmentId: string } }
) {
    try{
        if (!params.auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
        }

        if (!params.departmentId) {
            return new NextResponse("Department id is required", { status: 400 });
        }

        const department_equipments = await prismadb.departmentEquipment.findMany({
            where:{
                auditId: params.auditId,
                departmentId: params.departmentId
            }
        });

        return NextResponse.json(department_equipments);
    } catch (error){
        console.log('[DEPARTMENTS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}