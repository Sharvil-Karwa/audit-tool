import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { sourceId: string } }
  ) {
    try {
      if (!params.sourceId) {
          return new NextResponse("Source id is required", { status: 400 });
      } 
  
      const source = await prismadb.source.findUnique({
        where: {
          id: params.sourceId,
        }
      });
    
      return NextResponse.json(source);
    } catch (error) {
      console.log('[SOURCE_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  


export async function PATCH(
  req: Request,
  { params }: { params: { auditId: string, sourceId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { source } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!source) {
      return new NextResponse("Source is required", { status: 400 });
    }
    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    } 
    if (!params.sourceId) {
        return new NextResponse("Source id is required", { status: 400 });
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

    const Source = await prismadb.source.updateMany({
      where: {
        id: params.sourceId,
      },
      data: {
        source
      }
    });
  
    return NextResponse.json(Source);
  } catch (error) {
    console.log('[SOURCE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { auditId: string, sourceId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    }

    if (!params.sourceId) {
        return new NextResponse("Source id is required", { status: 400 });
    } 


    const source = await prismadb.source.deleteMany({
      where: {
        id: params.sourceId,
      }
    });
  
    return NextResponse.json(source);
  } catch (error) {
    console.log('[SOURCE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
