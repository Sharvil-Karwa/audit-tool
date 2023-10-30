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
        const {email, username, password} = body;
        const auditId = params.auditId; 

        if(!userId){ 
            return new NextResponse("Unauthenticated", {status:401});
        }
        if(!username){ 
            return new NextResponse("Username is required", {status:400});
        } 
        if(!email){ 
            return new NextResponse("Email is required", {status:400});
        } 
        if (!password) {
            return new NextResponse("Password is required", { status: 400 });
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
        
        const existingUser = await prismadb.user.findFirst({
            where:{
                email: email,
                auditId: params.auditId
            }
        }) 

        if(existingUser){
            return new NextResponse("User with this email already exists", { status: 400 });
        } 

        const user = await prismadb.user.create({
            data:{
                username,
                email,
                password,
                auditId: params.auditId
            }
        });
        return NextResponse.json(user);
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