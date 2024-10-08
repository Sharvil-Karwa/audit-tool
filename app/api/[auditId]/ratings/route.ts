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
        const {rating} = body;
        const auditId = params.auditId; 

        if(!userId){ 
            return new NextResponse("Unauthenticated", {status:401});
        }
        if(!rating){ 
            return new NextResponse("Rating is required", {status:400});
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

        const Rating = await prismadb.rating.create({
            data:{
                rating,
                auditId
            }
        });
        return NextResponse.json(Rating);
    } catch (error){
        console.log('[RATINGS_POST]', error);
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

        const ratings = await prismadb.rating.findMany({
            where:{
                auditId: params.auditId,
            }
        });

        return NextResponse.json(ratings);
    } catch (error){
        console.log('[RATINGS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}