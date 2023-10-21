import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { recordId: string } }
  ) {
    try {
      if (!params.recordId) {
          return new NextResponse("Record id is required", { status: 400 });
      } 
  
      const record = await prismadb.record.findUnique({
        where: {
          id: params.recordId,
        }
      });
    
      return NextResponse.json(record);
    } catch (error) {
      console.log('[RECORD_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  

export async function DELETE(
  req: Request,
  { params }: { params: { auditId: string, recordId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    }

    if (!params.recordId) {
        return new NextResponse("Record id is required", { status: 400 });
    } 


    const record = await prismadb.record.deleteMany({
      where: {
        id: params.recordId,
      }
    });
  
    return NextResponse.json(record);
  } catch (error) {
    console.log('[RECORD_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
