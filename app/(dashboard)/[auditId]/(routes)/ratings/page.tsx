import prismadb from "@/lib/prismadb";
import { RatingClient } from "./components/client";
import { RatingColumn } from "./components/coulmns";
import { format } from "date-fns";

const ratingsPage = async ({
    params
}:{
    params: {auditId: string}
}) => {

    const ratings = await prismadb.rating.findMany({
        where:{
            auditId: params.auditId
        },
        orderBy:{
            createdAt: 'desc'
        }
    })

    const formattedRatings: RatingColumn[] = ratings.map((item)=>({
        id: item.id,
        rating: item.rating,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RatingClient data={formattedRatings}/>
            </div>
        </div>
    )
} 

export default ratingsPage;