import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { areaId: string } }
  ) {
    try {
      if (!params.areaId) {
          return new NextResponse("Area id is required", { status: 400 });
      } 
  
      const area = await prismadb.area.findUnique({
        where: {
          id: params.areaId,
        }
      });
    
      return NextResponse.json(area);
    } catch (error) {
      console.log('[AREA_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };

  export async function PATCH(
    req: Request,
    { params }: { params: { auditId: string; areaId: string } }
  ) {
    try {
      const { userId } = auth();
      const body = await req.json();
      const { area, observations } = body;
      const auditId = params.auditId;
      const areaId = params.areaId;
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
      if (!auditId) {
        return new NextResponse("Audit id is required", { status: 400 });
      } 
      if(!area){
        return new NextResponse("Area is required", { status: 400 });
      }
  
      const auditByCreatorId = await prismadb.audit.findFirst({
        where: {
          id: auditId,
          creatorId: userId,
        },
      });
  
      if (!auditByCreatorId) {
        return new NextResponse("Unauthorized", { status: 403 });
      }
  
      // Update the area's name
      const updatedArea = await prismadb.area.update({
        where: {
          id: areaId,
        },
        data: {
          area
        },
      });
  
      // Ensure that observations is an array of strings (observation IDs)
      if (!Array.isArray(observations)) {
        return new NextResponse(
          "Observations should be an array of observation IDs",
          { status: 400 }
        );
      }
  
      // Remove existing areaObservation relations for the area
      await prismadb.areaObservation.deleteMany({
        where: {
          areaId,
        },
      });
  
      // Associate observation with the area
      for (const observationId of observations) {
        await prismadb.areaObservation.create({
          data: {
            areaId: params.areaId,
            observationId: observationId.id,
            auditId
          },
        });
      }
  
      return NextResponse.json(updatedArea);
    } catch (error) {
      console.error("[AREAS_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
  
  
  

export async function DELETE(
    req: Request,
    { params }: { params: { auditId: string, areaId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.auditId) {
        return new NextResponse("Audit id is required", { status: 400 });
      }
  
      if (!params.areaId) {
          return new NextResponse("Area id is required", { status: 400 });
      } 
  
      const area_observations = await prismadb.areaObservation.deleteMany({
        where:{
          areaId: params.areaId
        }
      });

      const area = await prismadb.area.deleteMany({
        where: {
          id: params.areaId,
        }
      });
    
      return NextResponse.json(area);
    } catch (error) {
      console.log('[AREA_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };