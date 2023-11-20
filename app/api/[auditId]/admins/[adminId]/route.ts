import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { adminId: string, auditId: string} }
  ) {
    try {
      if (!params.adminId) {
          return new NextResponse("Admin id is required", { status: 400 });
      } 
  
      const admin = await prismadb.adminAudit.findUnique({
        where: {
          id: params.adminId,
          auditId: params.auditId
        }
      });
    
      return NextResponse.json(admin);
    } catch (error) {
      console.log('[ADMIN_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };
  


export async function PATCH(
  req: Request,
  { params }: { params: { auditId: string, adminId: string } }
) {
  try {
        const {userId} = auth(); 
        const body = await req.json(); 
        const {email} = body;
        const auditId = params.auditId; 

        if(!userId){ 
            return new NextResponse("Unauthenticated", {status:401});
        }
        
        if(!email){ 
            return new NextResponse("Email is required", {status:400});
        } 
     
        const auditAdmin = await prismadb.adminAudit.findFirst({
            where:{
                id: params.adminId,
                auditId
            }
        }) 

        if(!auditAdmin){
            return new NextResponse("Unauthorized", {status:403});
        } 
        
        const admin = await prismadb.adminAudit.updateMany({
            where: {
                id: params.adminId,
            },
            data: {
                email,
            }
        });
  
    return NextResponse.json(admin);
  } catch (error) {
    console.log('[ADMIN_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


export async function DELETE(
  req: Request,
  { params }: { params: { auditId: string, adminId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.auditId) {
      return new NextResponse("Audit id is required", { status: 400 });
    }

    if (!params.adminId) {
        return new NextResponse("Admin id is required", { status: 400 });
    } 

    const admin = await prismadb.audit.findFirst({
      where:{
        creatorId: userId,
        id: params.auditId
      }
    }) 

    if(!admin){
      return new NextResponse("Unauthorized", { status: 403 });
    }
    
    const delAdmin = await prismadb.adminAudit.deleteMany({
      where:{
        id: params.adminId
      }
    })
  
    return NextResponse.json(delAdmin);
  } catch (error) {
    console.log('[ADMIN_DELETE]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};
