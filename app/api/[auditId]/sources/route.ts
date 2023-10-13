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
        const {source} = body;
        const auditId = params.auditId; 

        if(!userId){ 
            return new NextResponse("Unauthenticated", {status:401});
        }
        if(!source){ 
            return new NextResponse("Source is required", {status:400});
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

        const Source = await prismadb.source.create({
            data:{
                source,
                auditId
            }
        });
        return NextResponse.json(Source);
    } catch (error){
        console.log('[SOURCES_POST]', error);
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

        const sources = await prismadb.source.findMany({
            where:{
                auditId: params.auditId,
            }
        });

        return NextResponse.json(sources);
    } catch (error){
        console.log('[SOURCES_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}