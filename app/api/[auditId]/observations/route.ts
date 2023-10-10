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
        const {observation, reference} = body;
        const auditId = params.auditId; 

        if(!userId){ 
            return new NextResponse("Unauthenticated", {status:401});
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
        
        const observationId = await prismadb.observation.findFirst({
            where:{
                observation: observation,
                reference: reference
            }
        }) 

        if(observationId){
            return new NextResponse("This observation, along with the given reference number, already exists", { status: 400 });
        }

        const Observation = await prismadb.observation.create({
            data:{
                observation,
                reference,
                auditId
            }
        });
        return NextResponse.json(Observation);
    } catch (error){
        console.log('[OBSERVATIONS_POST]', error);
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

        const observations = await prismadb.observation.findMany({
            where:{
                auditId: params.auditId,
            }
        });

        return NextResponse.json(observations);
    } catch (error){
        console.log('[OBSERVATIONS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}