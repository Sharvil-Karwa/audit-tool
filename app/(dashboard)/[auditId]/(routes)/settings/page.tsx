import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

import { SettingsForm } from "./components/settings-form";

const SettingsPage = async ({
  params
}: {
  params: { auditId: string }
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  
  const user = await currentUser();
  const email = user ? user.emailAddresses[0].emailAddress : "";

  const adminAudit = await prismadb.adminAudit.findFirst({
    where:{
      auditId: params.auditId,
      email
    }
  })

  const audit = await prismadb.audit.findFirst({
    where:{
      id: params.auditId
    }
  })

  if(!audit){
    redirect('/');
  }
  
  if (!adminAudit) {
    redirect('/');
  };

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm offline_val={audit.offline} initialData={adminAudit} />
      </div>
    </div>
  );
}

export default SettingsPage;
