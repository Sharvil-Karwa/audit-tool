import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { referenceId: string } }
  ) {
    try { 
      if (!params.referenceId) {
          return new NextResponse("Reference id is required", { status: 400 });
      } 
  
      const reference = await prismadb.reference.findUnique({
        where: {
          id: params.referenceId,
        }
      });
    
      return NextResponse.json(reference);
    } catch (error) {
      console.log('[REFERENCE_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  


export async function PATCH(
  req: Request,
  { params }: { params: { auditId: string, referenceId: string } }
) {
  try {
    const body = await req.json();

    const { reference, mainRef, country, isMain } = body;

    if (!reference) {
      return new NextResponse("Reference is required", { status: 400 });
    }
   
    if (!params.referenceId) {
        return new NextResponse("Reference id is required", { status: 400 });
    } 


    const Reference = await prismadb.reference.updateMany({
      where: {
        id: params.referenceId,
      },
      data: {
        reference,
        mainRef,
        country,
        isMain
      }
    });
  
    return NextResponse.json(Reference);
  } catch (error) {
    console.log('[REFERENCE_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { auditId: string, referenceId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }


    if (!params.referenceId) {
        return new NextResponse("Reference id is required", { status: 400 });
    } 


    const reference = await prismadb.reference.deleteMany({
      where: {
        id: params.referenceId,
      }
    });
  
    return NextResponse.json(reference);
  } catch (error) {
    console.log('[REFERENCE_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
