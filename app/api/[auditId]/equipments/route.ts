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
        const {name, location, type, id} = body;
        const auditId = params.auditId; 

        if(!userId){ 
            return new NextResponse("Unauthenticated", {status:401});
        }
        if(!name){ 
            return new NextResponse("Name is required", {status:400});
        } 
        if(!id){ 
            return new NextResponse("Id is required", {status:400});
        } 
        if(!location){ 
            return new NextResponse("Location is required", {status:400});
        } 
        if(!type){ 
            return new NextResponse("Type is required", {status:400});
        } 
        if (!auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
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
        
        const equipmentId = await prismadb.equipment.findFirst({
            where:{
                id:id
            }
        }) 

        if(equipmentId){
            return new NextResponse("Equipment with this ID already exists", { status: 400 });
        }

        const equipment = await prismadb.equipment.create({
            data:{
                name,
                type,
                location,
                id,
                auditId
            }
        });
        return NextResponse.json(equipment);
    } catch (error){
        console.log('[EQUIPMENTS_POST]', error);
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

        const equipments = await prismadb.equipment.findMany({
            where:{
                auditId: params.auditId,
            }
        });

        return NextResponse.json(equipments);
    } catch (error){
        console.log('[EQUIPMENTS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}