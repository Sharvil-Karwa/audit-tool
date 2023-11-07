import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";



export async function GET(
  req: Request,
  { params }: { params: { auditId: string } }
) {
  try{


    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    } 
    const audit = await prismadb.audit.findFirst({
      where:{
        id: params.auditId
      },
      select: {
        id: true,
        name: true,
      },
    }) 
    return NextResponse.json(audit);
  } catch(error){
    console.log('[AUDIT_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { auditId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    }


    const audit = await prismadb.audit.updateMany({
      where: {
        id: params.auditId,
        creatorId: userId,
      },
      data: {
        name
      }
    });
  
    return NextResponse.json(audit);
  } catch (error) {
    console.log('[AUDIT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { auditId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    }

    await prismadb.department.deleteMany({
      where: {
        auditId: params.auditId
      }
    })

    
    await prismadb.equipment.deleteMany({
      where: {
        auditId: params.auditId
      }
    })

    const audit = await prismadb.audit.deleteMany({
      where: {
        id: params.auditId,
        creatorId: userId
      }
    });
  
    return NextResponse.json(audit);
  } catch (error) {
    console.log('[AUDIT_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
