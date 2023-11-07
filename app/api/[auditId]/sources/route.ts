import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";

export async function POST(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{
        const body = await req.json(); 
        const {source} = body;
        const auditId = params.auditId; 

       
        if(!source){ 
            return new NextResponse("Source is required", {status:400});
        } 
        
        const src = await prismadb.source.findFirst({
            where:{
                source
            }
        }) 

        if(src) return NextResponse.json(src)
        

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

        const sources = await prismadb.source.findMany();

        return NextResponse.json(sources);
    } catch (error){
        console.log('[SOURCES_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}