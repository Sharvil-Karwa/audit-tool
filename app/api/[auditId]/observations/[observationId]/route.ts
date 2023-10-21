import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { observationId: string } }
  ) {
    try {
      if (!params.observationId) {
          return new NextResponse("Observation id is required", { status: 400 });
      } 
  
      const observation = await prismadb.observation.findUnique({
        where: {
          id: params.observationId,
        }
      });
    
      return NextResponse.json(observation);
    } catch (error) {
      console.log('[OBSERVATION_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  


export async function PATCH(
  req: Request,
  { params }: { params: { auditId: string, observationId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { observation, reference, id } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    } 
    if (!params.observationId) {
        return new NextResponse("Observation id is required", { status: 400 });
    } 
    if(!observation){
        return new NextResponse("Observation is required", { status: 400 });
    }

    const auditByCreatorId = await prismadb.audit.findFirst({
        where:{
            id: params.auditId,
        }
    }) 

    if(!auditByCreatorId){
        return new NextResponse("Unauthorized", {status:403});
    } 

    const Observation = await prismadb.observation.updateMany({
      where: {
        id: params.observationId,
      },
      data: {
        observation,
        reference
      }
    });
  
    return NextResponse.json(Observation);
  } catch (error) {
    console.log('[OBSERVATION_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { auditId: string, observationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    }

    if (!params.observationId) {
        return new NextResponse("Observation id is required", { status: 400 });
    } 

    const area_observation = await prismadb.areaObservation.deleteMany({
      where:{
        observationId: params.observationId
      }
    })

    const observation = await prismadb.observation.deleteMany({
      where: {
        id: params.observationId,
      }
    });
  
    return NextResponse.json(observation);
  } catch (error) {
    console.log('[OBSERVATION_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
