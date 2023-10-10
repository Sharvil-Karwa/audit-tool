import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";
import { any } from "zod";

export async function GET(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{
        if (!params.auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
        }

        const departments = await prismadb.department.findMany({
            where:{
                auditId: params.auditId,
            }
        });

        return NextResponse.json(departments);
    } catch (error){
        console.log('[DEPARTMENTS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}

export async function POST(
    req: Request,
    { params }: { params: { auditId: string } }
  ) {
    try {


      const { userId } = auth();
      const body = await req.json();
      const { name, equipments } = body;
      const auditId = params.auditId;

  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 401 });
      }
      if (!name) {
        return new NextResponse("Name is required", { status: 400 });
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


  
      const existingDepartment = await prismadb.department.findFirst({
        where: {
          name,
          auditId,
        },
      });
  
      if (existingDepartment) {
        return new NextResponse(
          "Department with this name already exists for this audit",
          { status: 400 }
        );
      }


  
      const createdDepartment = await prismadb.department.create({
        data: {
          name,
          auditId,
        },
      });


  
      // Ensure that equipments is an array of strings (equipment IDs)
      if (!Array.isArray(equipments)) {
        return new NextResponse("Equipments should be an array of equipment IDs", { status: 400 });
      }


  
      // Associate equipment with the department
      for (const equipmentId of equipments) {
        await prismadb.departmentEquipment.create({
          data: {
            departmentId: createdDepartment.id,
            equipmentId: equipmentId.id,
            auditId
          },
        });
      }

      return NextResponse.json(createdDepartment);
    } catch (error) {
      console.error("[DEPARTMENTS_POST]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
  