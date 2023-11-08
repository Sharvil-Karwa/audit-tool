import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";

export async function POST(
    req: Request,
) {
    try{
        const {userId} = auth(); 
        const body = await req.json(); 
        const {name} = body;
        if(!userId){ 
            return new NextResponse("Unauthorized", {status:401});
        }
        if(!name){ 
            return new NextResponse("Name is required", {status:400});
        } 
        const audit = await prismadb.audit.create({
            data:{
                name,
                recn: 0,
                creatorId: userId
            }
        });
        return NextResponse.json(audit);
    } catch (error){
        console.log('[AUDITS_POST]', error);
        return new NextResponse ("Internal error", {status:500});
    }
} 


export async function GET(req: Request) {
  try {
    const audits = await prismadb.audit.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(audits);
  } catch (error) {
    console.log('[AUDITS_GET]', error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
