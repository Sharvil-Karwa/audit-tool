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
  { params }: { params: { auditId: string, departmentId: string } }
) {
  try {
    const {userId} = auth(); 
    const body = await req.json(); 
    const {name, equipments} = body;
    const auditId = params.auditId; 

    if(!userId){ 
        return new NextResponse("Unauthenticated", {status:401});
    }
    if(!name){ 
        return new NextResponse("Name is required", {status:400});
    } 

    const auditByCreatorId = await prismadb.audit.findFirst({
        where:{
            id: auditId,
            creatorId: userId
        }
    }) 

    if(!auditByCreatorId){
        return new NextResponse("Unauthorized", {status:403});
    } 

    // await prismadb.department.update({
    //   where: {
    //     id: params.departmentId,
    //   },
    //   data: {
    //     name,
    //     equipments: {
    //       deleteMany: {},
    //     }
    //   }
    // });


    const department = await prismadb.department.update({
      where:{
        id: params.departmentId
      },
      data:{
        name,
        equipments:{
          createMany:{
            data:[
              ...equipments.map((equipment:{url:string})=>equipment)
            ]
          }
        }
      }
    })

    return NextResponse.json(department);
  } catch (error) {
    console.log('[DEPARTMENT_PATCH]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
};


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

    const auditByCreatorId = await prismadb.audit.findFirst({
      where:{
          id: params.auditId,
          creatorId: userId
      }
     }) 

      if(!auditByCreatorId){
          return new NextResponse("Unauthorized", {status:403});
      } 

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
