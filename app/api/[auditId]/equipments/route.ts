import prismadb from "@/lib/prismadb";
import { auth, currentUser } from "@clerk/nextjs";
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
        if (!auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
        }
        const curruser = await currentUser();
        const adminemail = curruser ? curruser.emailAddresses[0].emailAddress : "";

        const auditAdmin = await prismadb.adminAudit.findFirst({
            where:{
                auditId,
                email: adminemail
            }
        }) 

        if(!auditAdmin){
            return new NextResponse("Unauthorized", {status:403});
        } 
        
        const equipmentId = await prismadb.equipment.findFirst({
            where:{
                id:id,
                auditId: params.auditId
            }
        }) 

        if(equipmentId){
            return new NextResponse("Equipment already exists", { status: 400 });
        } 

        const assigned = false;
        const depId = "";

        const equipment = await prismadb.equipment.create({
            data:{
                name,
                type: type ? type : "",
                location: location ? location : "",
                id,
                auditId,
                assigned,
                depId
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