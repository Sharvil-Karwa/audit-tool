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
        const audits = await prismadb.userAudit.findMany({
            where:{
                email: user.email
            }
        }) 
        return NextResponse.json(audits);
    } catch (error){
        console.log('[USER_AUDITS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}
