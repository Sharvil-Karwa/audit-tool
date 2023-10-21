import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

export async function POST(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{




        const body = await req.json(); 
        const {
            auditId,
            user , 
            department ,
            equipment ,
            eq_id ,
            type ,
            location ,
            area ,
            reference ,
            comment ,
            rating ,
            source ,
            observation
        } = body;

        const Record = await prismadb.record.create({
            data:{
                auditId,
            user , 
            department ,
            equipment ,
            eq_id ,
            type ,
            location ,
            area ,
            reference ,
            comment ,
            rating ,
            source,
            observation
            }
        });
        return NextResponse.json( {
            headers: corsHeaders
          });
    } catch (error){
        console.log('[RECORDS_POST]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}

export async function GET(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{
        // const {userId} = auth(); 
        // if(!userId){ 
        //     return new NextResponse("Unauthenticated", {status:401});
        // }

        if (!params.auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
        } 

        // const auditByCreatorId = await prismadb.audit.findFirst({
        //     where:{
        //         id: params.auditId,
        //         creatorId: userId
        //     }
        // }) 

        // if(!auditByCreatorId){
        //     return new NextResponse("Unauthorized", {status:403});
        // } 

        const records = await prismadb.record.findMany({
            where:{
                auditId: params.auditId
            }
        });

        return NextResponse.json(records);
    } catch (error){
        console.log('[RECORDS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}