import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { equipmentId: string } }
  ) {
    try {
      if (!params.equipmentId) {
          return new NextResponse("Equipment id is required", { status: 400 });
      } 
  
      const equipment = await prismadb.equipment.findUnique({
        where: {
          id: params.equipmentId,
        }
      });
    
      return NextResponse.json(equipment);
    } catch (error) {
      console.log('[EQUIPMENT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  


export async function PATCH(
  req: Request,
  { params }: { params: { auditId: string, equipmentId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name, location, type, id } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if(!id){ 
        return new NextResponse("Id is required", {status:400});
    } 
    if(!location){ 
        return new NextResponse("Location is required", {status:400});
    } 
    if(!type){ 
        return new NextResponse("Type is required", {status:400});
    } 
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    } 
    if (!params.equipmentId) {
        return new NextResponse("Equipment id is required", { status: 400 });
    } 

    const auditByCreatorId = await prismadb.audit.findFirst({
        where:{
            id: params.auditId,
            creatorId: userId
        }
    }) 

    if(!auditByCreatorId){
        return new NextResponse("Unauthorized", {status:403});
    } 

    const equipment = await prismadb.equipment.updateMany({
      where: {
        id: params.equipmentId,
      },
      data: {
        name,
        location,
        type,
        id
      }
    });
  
    return NextResponse.json(equipment);
  } catch (error) {
    console.log('[EQUIPMENT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { auditId: string, equipmentId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    }

    if (!params.equipmentId) {
        return new NextResponse("Equipment id is required", { status: 400 });
    } 

    const equipment = await prismadb.equipment.deleteMany({
      where: {
        id: params.equipmentId,
      }
    });
  
    return NextResponse.json(equipment);
  } catch (error) {
    console.log('[EQUIPMENT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
