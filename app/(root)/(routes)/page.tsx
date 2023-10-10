"use client"

import { useAuditModal } from "@/hooks/use-audit-modal";
import { useEffect } from "react";

const SetupPage = () => {

    const onOpen = useAuditModal((state)=> state.onOpen);
    const isOpen = useAuditModal((state)=> state.isOpen);

    useEffect(()=>{
        if(!isOpen){
            onOpen();
        }
    }, [isOpen, onOpen]);

    return null;
  }
  
export default SetupPage;