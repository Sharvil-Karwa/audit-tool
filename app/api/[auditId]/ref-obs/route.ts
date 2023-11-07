import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";
import { any } from "zod";

export async function GET(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{
        if (!params.auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
        }

        const ref_obs = await prismadb.obsRef.findMany();

        return NextResponse.json(ref_obs);
    } catch (error){
        console.log('[REFERENCES_OBSERVATIONS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}

export async function POST(
    req: Request,
) {
    try{
        const body = await req.json();
        const {refId, obsId} = body;

        const ref = await prismadb.reference.findFirst({
            where:{
              id: refId
            }
          }) 
      
          if(!ref) return new NextResponse("Reference is required", { status: 400 });
      


        await prismadb.obsRef.create({
            data: {
                obsId,
                refId,
                reference: ref.reference,
                country: ref.country
            },
          });

    } catch (error){
        console.log('[REFERENCES_OBSERVATIONS_POST]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}