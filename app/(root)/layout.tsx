import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // const audit = await prismadb.audit.findFirst({
  //   where: {
  //     creatorId: userId,
  //   }
  // });

  const user = await currentUser();
  const email = user ? user.emailAddresses[0].emailAddress : ""

  const audit = await prismadb.adminAudit.findFirst({
    where:{
      email
    }
  })

  if (audit) {
    redirect(`/${audit.auditId}`);
  };

  return (
    <>
      {children}
    </>
  );
};
