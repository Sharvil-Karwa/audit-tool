import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

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

  const audit = await prismadb.audit.findFirst({ 
    where: {
      id: params.auditId,
      creatorId: userId,
    }
   });

  if (!audit) {
    redirect('/');
  };

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};
