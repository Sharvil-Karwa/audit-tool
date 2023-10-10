import { UserButton, auth } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import AuditSwitcher from "./audit-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {

    const {userId} = auth();

    if(!userId){
        redirect("/sign-in");
    } 

    const audits = await prismadb.audit.findMany({
        where: {
          creatorId: userId
        }
      });

    return(
        <div className="border-b">
            <div className="flex h-16 items-center px-4">
                <AuditSwitcher items={audits}/>
                <MainNav />
                <div className="ml-auto flex items-center space-x-4">
                    <UserButton afterSignOutUrl="/"/>
                </div>
            </div>
        </div>
    )
} 

export default Navbar;