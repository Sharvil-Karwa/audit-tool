import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';

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

  const audit = await prismadb.audit.findFirst({
    where: {
      creatorId: userId,
    }
  });

  if (audit) {
    redirect(`/${audit.id}`);
  };

  return (
    <>
      {children}
    </>
  );
};
