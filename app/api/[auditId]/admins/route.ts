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
        const {email} = body;
        const auditId = params.auditId; 

        

        if(!userId){ 
            return new NextResponse("Unauthenticated", {status:401});
        }
        if(!email){ 
            return new NextResponse("Email is required", {status:400});
        } 

        const audit = await prismadb.audit.findFirst({
            where:{
                id: auditId
            }
        })

        if(!audit){
            return new NextResponse("Audit not found", {status:400});
        }
        
        const user = await currentUser();
        const adminemail = user ? user.emailAddresses[0].emailAddress : "";

        const auditAdmin = await prismadb.adminAudit.findFirst({
            where:{
                auditId,
                email: adminemail
            }
        }) 

        if(!auditAdmin){
            return new NextResponse("Unauthorized", {status:403});
        } 
        
        
        const existingAdmin = await prismadb.adminAudit.findFirst({
            where:{
                email,
                auditId
            }
        }) 

        if(existingAdmin){
            return new NextResponse("Admin with this email already exists", { status: 400 });
        } 

        const admin = await prismadb.adminAudit.create({
            data:{
                email,
                auditId,
                name: audit.name
            }
        })

        return NextResponse.json(admin);
    } catch (error){
        console.log('[ADMINS_POST]', error);
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

        const admins = await prismadb.adminAudit.findMany({
            where:{
                auditId: params.auditId,
            }
        });

        return NextResponse.json(admins);
    } catch (error){
        console.log('[ADMINS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}