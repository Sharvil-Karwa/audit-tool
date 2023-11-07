import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";

export async function POST(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{
        const body = await req.json(); 
        const {observation, reference} = body;
        const auditId = params.auditId; 

        if (!auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
        }
        
        const currObs = await prismadb.observation.findFirst({
            where: {
                observation: observation
            }
        }) 

        if(currObs){
            return NextResponse.json(currObs)
        }

        const Observation = await prismadb.observation.create({
            data:{
                observation,
                reference: reference,
                auditId,
            }
        }); 

        const ref = await prismadb.reference.findFirst({
            where:{
                mainRef: reference
            }
        })

          if(ref) { await prismadb.obsRef.create({
              data:{
                  obsId: Observation.id,
                  refId: ref?.id,
                  reference: ref.reference,
                  country: ref.country
              }
            })
        }
        
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
        const observations = await prismadb.observation.findMany();

        return NextResponse.json(observations);
    } catch (error){
        console.log('[OBSERVATIONS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}