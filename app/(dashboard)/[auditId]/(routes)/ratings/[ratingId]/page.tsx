import prismadb from "@/lib/prismadb";
import { RatingsForm } from "./components/rating-form";

const RatingPage = async ({
    params
}:{
    params: {
        ratingId: string,
        auditId: string
    }
}) =>{

    const rating = await prismadb.rating.findUnique({
        where:{
            id: params.ratingId
        }
    });  

    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <RatingsForm initialData={rating}/>
            </div>
        </div>
    );
}

export default RatingPage;