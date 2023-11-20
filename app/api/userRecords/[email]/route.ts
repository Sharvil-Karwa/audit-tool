import prismadb from "@/lib/prismadb";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
  { params }: { params: { email: string } }
) {
    try{
        const user = await prismadb.user.findFirst({
            where:{
                email: params.email
            }
        }) 
        if(!user) return new NextResponse ("EMAIL Required", {status:500});
        const records = await prismadb.record.findMany({
            where:{
                user: params.email
            },
            orderBy:{
                createdAt: 'desc'
            }
        }) 
        return NextResponse.json(records);
    } catch (error){
        console.log('[USER_AUDITS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}
