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
        
        const existingUser = await prismadb.user.findFirst({
            where:{
                email,
                auditId
            }
        }) 

        if(existingUser){
            return new NextResponse("User with this email already exists", { status: 400 });
        } 

        const user = await prismadb.user.create({
            data:{
                email,
                auditId: params.auditId
            }
        });

        await prismadb.userAudit.create({
            data:{
                email: email,
                auditId: params.auditId,
                name: auditAdmin.name
            }
        })

        return NextResponse.json(user);
    } catch (error){
        console.log('[USERS_POST]', error);
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

        const users = await prismadb.user.findMany({
            where:{
                auditId: params.auditId,
            }
        });

        return NextResponse.json(users);
    } catch (error){
        console.log('[USERS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}