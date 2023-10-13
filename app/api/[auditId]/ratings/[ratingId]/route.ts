import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { ratingId: string } }
  ) {
    try {
      if (!params.ratingId) {
          return new NextResponse("Rating id is required", { status: 400 });
      } 
  
      const rating = await prismadb.rating.findUnique({
        where: {
          id: params.ratingId,
        }
      });
    
      return NextResponse.json(rating);
    } catch (error) {
      console.log('[RATING_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  


export async function PATCH(
  req: Request,
  { params }: { params: { auditId: string, ratingId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { rating } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }
    if (!rating) {
      return new NextResponse("Rating is required", { status: 400 });
    }
    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    } 
    if (!params.ratingId) {
        return new NextResponse("Rating id is required", { status: 400 });
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

    const Rating = await prismadb.rating.updateMany({
      where: {
        id: params.ratingId,
      },
      data: {
        rating
      }
    });
  
    return NextResponse.json(Rating);
  } catch (error) {
    console.log('[RATING_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { auditId: string, ratingId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    }

    if (!params.ratingId) {
        return new NextResponse("Rating id is required", { status: 400 });
    } 


    const rating = await prismadb.rating.deleteMany({
      where: {
        id: params.ratingId,
      }
    });
  
    return NextResponse.json(rating);
  } catch (error) {
    console.log('[RATING_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
