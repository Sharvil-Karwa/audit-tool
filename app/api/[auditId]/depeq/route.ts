import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";


export async function POST(
    req: Request,
    { params }: { params: { auditId: string } }
  ) {
    try {


      const { userId } = auth();
      const body = await req.json();
      const { name, equipmentId } = body;
      const auditId = params.auditId;

  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
      if (!name) {
        return new NextResponse("Name is required", { status: 400 });
      }
      if (!equipmentId) {
        return new NextResponse("Equipment id is required", { status: 400 });
      }
      if (!auditId) {
        return new NextResponse("Audit id is required", { status: 400 });
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

      const dep = await prismadb.department.findFirst({
        where:{
            name
        }
      }) 

      if (!dep) {
        return new NextResponse("Department does not exist", { status: 400 });
      }

      const eq = await prismadb.equipment.findFirst({
        where:{
            id: equipmentId
        }
      }) 

      if (!eq) {
        return new NextResponse("Equipment id does not exist", { status: 400 });
      }

      await prismadb.equipment.updateMany({
        where:{
            id: equipmentId
        },
        data:{
            assigned: true,
            depId: dep.id
        }
      }) 

    } catch (error) {
      console.error("[DEPARTMENTS_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
  