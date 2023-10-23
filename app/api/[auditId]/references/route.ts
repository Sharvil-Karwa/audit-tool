import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";

export async function POST(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{ 
        const body = await req.json(); 
        const {reference, mainRef, country, isMain} = body;

        if(!reference){ 
            return new NextResponse("Reference is required", {status:400});
        } 
        
        const Reference = await prismadb.reference.create({
            data:{
                reference,
                mainRef,
                country,
                isMain
            }
        });
        return NextResponse.json(Reference);
    } catch (error){
        console.log('[REFERENCES_POST]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}

export async function GET(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{

        const references = await prismadb.reference.findMany();

        return NextResponse.json(references);
    } catch (error){
        console.log('[REFERENCES_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}