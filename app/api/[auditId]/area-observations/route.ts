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

        const area_observations = await prismadb.areaObservation.findMany();

        return NextResponse.json(area_observations);
    } catch (error){
        console.log('[AREA_OBSERVATIONS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}

export async function POST(
    req: Request,
) {
    try{
        const body = await req.json();
        const {areaId,
            observationId,
            auditId,
            area_name,
            obs,
            reference} = body;

        await prismadb.areaObservation.create({
            data: {
                areaId,
                observationId,
                auditId,
                area_name,
                obs,
                reference
            },
          });

    } catch (error){
        console.log('[AREA_OBSERVATIONS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}