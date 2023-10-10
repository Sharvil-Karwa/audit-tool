import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";


export async function GET(
    req: Request,
    { params }: { params: { departmentId: string } }
  ) {
    try {
      if (!params.departmentId) {
          return new NextResponse("Department id is required", { status: 400 });
      } 
  
      const department = await prismadb.department.findUnique({
        where: {
          id: params.departmentId,
        }
      });
    
      return NextResponse.json(department);
    } catch (error) {
      console.log('[DEPARTMENT_GET]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };

  export async function PATCH(
    req: Request,
    { params }: { params: { auditId: string; departmentId: string } }
  ) {
    try {
      const { userId } = auth();
      const body = await req.json();
      const { name, equipments } = body;
      const auditId = params.auditId;
      const departmentId = params.departmentId;
  
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
  
      // Update the department's name
      const updatedDepartment = await prismadb.department.update({
        where: {
          id: departmentId,
        },
        data: {
          name,
        },
      });
  
      // Ensure that equipments is an array of strings (equipment IDs)
      if (!Array.isArray(equipments)) {
        return new NextResponse(
          "Equipments should be an array of equipment IDs",
          { status: 400 }
        );
      }
  
      // Remove existing departmentEquipment relations for the department
      await prismadb.departmentEquipment.deleteMany({
        where: {
          departmentId,
        },
      });
  
      // Associate equipment with the department
      for (const equipmentId of equipments) {
        await prismadb.departmentEquipment.create({
          data: {
            departmentId: params.departmentId,
            equipmentId: equipmentId.id,
            auditId
          },
        });
      }
  
      return NextResponse.json(updatedDepartment);
    } catch (error) {
      console.error("[DEPARTMENTS_PATCH]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }
  
  
  

export async function DELETE(
    req: Request,
    { params }: { params: { auditId: string, departmentId: string } }
  ) {
    try {
      const { userId } = auth();
  
      if (!userId) {
        return new NextResponse("Unauthenticated", { status: 403 });
      }
  
      if (!params.auditId) {
        return new NextResponse("Audit id is required", { status: 400 });
      }
  
      if (!params.departmentId) {
          return new NextResponse("Department id is required", { status: 400 });
      } 
  
      const department_equipments = await prismadb.departmentEquipment.deleteMany({
        where:{
          departmentId: params.departmentId
        }
      });

      const department = await prismadb.department.deleteMany({
        where: {
          id: params.departmentId,
        }
      });
    
      return NextResponse.json(department);
    } catch (error) {
      console.log('[DEPARTMENT_DELETE]', error);
      return new NextResponse("Internal error", { status: 500 });
    }
  };