import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import {NextResponse} from "next/server";


export async function GET(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{
        if (!params.auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
        }

        const userAudits = await prismadb.userAudit.findMany();

        return NextResponse.json(userAudits);
    } catch (error){
        console.log('[userAudits_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}