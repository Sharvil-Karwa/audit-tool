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

        const audit = await prismadb.audit.findFirst({
            where:{
                id: params.auditId
            }
        }) 

        if(!audit){
            return new NextResponse("Audit id is required", { status: 400 });
        }

        let n = audit.recn;

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
            observation,
            refCountry
        } = body;

        const userAudit = await prismadb.userAudit.findFirst({
            where:{
                email: user
            }
        }) 

        if(!userAudit){
            return new NextResponse("Unauthorized", { status: 403 });
        }

        const duplicateRec = await prismadb.record.findFirst({
            where:{
                user,
                auditName: audit.name,
                auditId,
                eq_id,
                area,
                observation,
                reference,
                comment
            }
        })

        if(duplicateRec){
            return NextResponse.json(duplicateRec);
        }

        const Record = await prismadb.record.create({
            data:{
            auditName: audit.name,
            id: n+1,
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
            observation,
            refCountry
            }
        });
        await prismadb.audit.update({
            where:{
                id: params.auditId
            }, data:{
                recn: n + 1
            }
        })
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