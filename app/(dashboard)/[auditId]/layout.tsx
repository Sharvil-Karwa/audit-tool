import { redirect } from 'next/navigation';
import { auth, currentUser } from '@clerk/nextjs';

// import Navbar from '@/components/navbar'
import prismadb from '@/lib/prismadb';
import Navbar from '@/components/navbar';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { auditId: string }
}) {
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

  
  if (!adminAudit) {
    redirect('/');
  };

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
