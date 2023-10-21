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

        const areas = await prismadb.area.findMany();

        return NextResponse.json(areas);
    } catch (error){
        console.log('[AREAS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}

export async function POST(
    req: Request,
    { params }: { params: { auditId: string } }
  ) {
    try {


      const body = await req.json();
      const { area, observations } = body;
      const auditId = params.auditId;

  
      
      if (!area) {
        return new NextResponse("Area is required", { status: 400 });
      }
      if (!auditId) {
        return new NextResponse("Audit id is required", { status: 400 });
      }

      
  
      const auditByCreatorId = await prismadb.audit.findFirst({
        where: {
          id: auditId,
        },
      });
  
      if (!auditByCreatorId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }


  
      const existingArea = await prismadb.area.findFirst({
        where: {
          area,
          auditId,
        },
      });
  
      if (existingArea) {
        return new NextResponse(
          "Area with this name already exists for this audit",
          { status: 400 }
        );
      }


  
      const createdArea = await prismadb.area.create({
        data: {
          area,
          auditId,
        },
      });


  
      // Ensure that observations is an array of strings (observation IDs)
      if (!Array.isArray(observations)) {
        return new NextResponse("Observations should be an array of observation IDs", { status: 400 });
      }


  
      // Associate observation with the area
      for (const observationId of observations) {
        await prismadb.areaObservation.create({
          data: {
            areaId: createdArea.id,
            observationId: observationId.id,
            auditId,
            area_name: createdArea.area,
            obs: observationId.observation,
            reference: observationId.reference
          },
        });
      }

      return NextResponse.json(createdArea);
    } catch (error) {
      console.error("[AREAS_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
  