import prismadb from "@/lib/prismadb";
import {NextResponse} from "next/server";

export async function POST(
    req: Request,
) {
    try{
        const body = await req.json();
        const {area, observation} = body;

        const ar = await prismadb.area.findFirst({
            where:{
                area: area
            }
        }) 

        if(!ar){
            return new NextResponse ("Area doesnot exist", {status:500});
        }

        const obs = await prismadb.observation.findFirst({
            where: {
                observation:observation
            }
        })

        if(!obs){
            return new NextResponse ("Observation doesnot exist", {status:500});
        }

        const arobs = await prismadb.areaObservation.findFirst({
            where: {
                area_name: ar.area,
                obs: obs.observation
            }
        })

        if(arobs){
            return new NextResponse ("Area-Observation already exists", {status:500});
        }

        await prismadb.areaObservation.create({
            data: {
                observationId: obs.id,
                areaId: ar.id,
                obs: obs.observation,
                area_name: ar.area
            },
          });

    } catch (error){
        console.log('[AREA_OBSERVATIONS_POST]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}
