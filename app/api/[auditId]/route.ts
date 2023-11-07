import prismadb from "@/lib/prismadb";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
  { params }: { params: { auditId: string } }
) {
    try{
        if (!params.auditId) {
            return new NextResponse("Audit id is required", { status: 400 });
        }

        const audit = await prismadb.audit.findFirst({
            where:{
                id: params.auditId
            }
        }) 

        if(!audit){
            return new NextResponse ("Audit not found", {status:400});
        }

        const departments = await prismadb.department.findMany({
            where:{
                auditId: params.auditId
            }
        });
        const equipments = await prismadb.equipment.findMany(
            {
                where:{
                    auditId: params.auditId
                }
            }
        );
        const areas = await prismadb.area.findMany();
        const observations = await prismadb.observation.findMany();
        const areaobs = await prismadb.areaObservation.findMany();
        const sources = await prismadb.source.findMany();
        const ratings = await prismadb.rating.findMany(
            {
                where:{
                    auditId: params.auditId
                }
            }
        );
        const references = await prismadb.reference.findMany();
        const obsref = await prismadb.obsRef.findMany();
        const name = audit.name;

        const resposne = {
            "departments" : departments,
            "equipments" : equipments,
            "areas": areas,
            "areaObs": areaobs,
            "observation": observations,
            "sources": sources,
            "ratings": ratings,
            "references": references,
            "obsRef": obsref,
            "auditId": params.auditId,
            "auditName" : name
        }

        return NextResponse.json(resposne);
    } catch (error){
        console.log('[AREAS_GET]', error);
        return new NextResponse ("Internal error", {status:500});
    }
}
