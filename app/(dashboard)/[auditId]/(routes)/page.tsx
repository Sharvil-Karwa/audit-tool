import prismadb from "@/lib/prismadb";

interface DashboardPageProps {
    params: {
      auditId: string;
    };
  };
  
  const DashboardPage: React.FC<DashboardPageProps> = async ({ 
    params
  }) => {

    const audit = await prismadb.audit.findFirst({
        where:{
            id: params.auditId
        }
    })

    return(
        <div>
        </div>
    );
} 

export default DashboardPage;