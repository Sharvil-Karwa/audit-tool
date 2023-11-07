import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { userId: string, auditId: string} }
  ) {
    try {
      if (!params.userId) {
          return new NextResponse("User id is required", { status: 400 });
      } 
  
      const user = await prismadb.user.findUnique({
        where: {
          id: params.userId,
          auditId: params.auditId
        }
      });
    
      return NextResponse.json(user);
    } catch (error) {
      console.log('[USER_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  


export async function PATCH(
  req: Request,
  { params }: { params: { auditId: string, userId: string } }
) {
  try {
    const {userId} = auth(); 
        const body = await req.json(); 
        const {email} = body;
        const auditId = params.auditId; 

        if(!userId){ 
            return new NextResponse("Unauthenticated", {status:401});
        }
        // if(!username){ 
        //     return new NextResponse("Username is required", {status:400});
        // } 
        if(!email){ 
            return new NextResponse("Email is required", {status:400});
        } 
        // if (!password) {
        //     return new NextResponse("Password is required", { status: 400 });
        // }

        const auditByCreatorId = await prismadb.audit.findFirst({
            where:{
                id: auditId,
                creatorId: userId
            }
        }) 

        if(!auditByCreatorId){
            return new NextResponse("Unauthorized", {status:403});
        } 
        
        const user = await prismadb.user.updateMany({
        where: {
            id: params.userId,
        },
        data: {
            // username,
            email,
            // password
        }
        });
  
    return NextResponse.json(user);
  } catch (error) {
    console.log('[USER_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { auditId: string, userId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    }

    if (!params.userId) {
        return new NextResponse("User id is required", { status: 400 });
    } 


    await prismadb.userAudit.deleteMany({
      where:{
        id: userId,
        auditId: params.auditId
      }
    })

    const user = await prismadb.user.deleteMany({
      where: {
        id: params.userId,
      }
    });
  
    return NextResponse.json(user);
  } catch (error) {
    console.log('[USER_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
