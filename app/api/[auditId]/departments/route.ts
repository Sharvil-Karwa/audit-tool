import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";

export async function POST(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{
        const {userId} = auth(); 
        const body = await req.json(); 
        const {name, equipments} = body;
        const auditId = params.auditId; 

        if(!userId){ 
            return new NextResponse("Unauthenticated", {status:401});
        }
        if(!name){ 
            return new NextResponse("Name is required", {status:400});
        } 

        const auditByCreatorId = await prismadb.audit.findFirst({
            where:{
                id: auditId,
                creatorId: userId
            }
        }) 

        if(!auditByCreatorId){
            return new NextResponse("Unauthorized", {status:403});
        } 
        
        const departmentId = await prismadb.department.findFirst({
            where:{
                name
            }
        }) 

        if(departmentId){
            return new NextResponse("Department with this name already exists", { status: 400 });
        }

        const department = await prismadb.department.create({
            data:{
                name,
                equipments: {
                    createMany: {
                      data: [
                        ...equipments.map((equipment: { url: string }) => equipment),
                      ],
                    },
                },
                auditId
            }
        });
        return NextResponse.json(department);
    } catch (error){
        console.log('[DEPARTMENTS_POST]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}

export async function GET(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{
        if (!params.auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
        }

        const departments = await prismadb.department.findMany({
            where:{
                auditId: params.auditId,
            }
        });

        return NextResponse.json(departments);
    } catch (error){
        console.log('[DEPARTMENTS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}