import { UserButton, auth, currentUser } from "@clerk/nextjs";
import { MainNav } from "./main-nav";
import AuditSwitcher from "./audit-switcher";
import { redirect } from "next/navigation";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {

    const {userId} = auth(); 

    if(!userId){
        redirect("/sign-in");
    } 

    const user = await currentUser();
    const email = user ? user.emailAddresses[0].emailAddress : "";

    const audits = await prismadb.adminAudit.findMany({
        where: {
          email
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