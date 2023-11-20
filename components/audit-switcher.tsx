"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Briefcase} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useAuditModal } from "@/hooks/use-audit-modal"
import { useParams, useRouter } from "next/navigation"

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface AuditSwitcherProps extends PopoverTriggerProps {
  items: Record<string, any>[];
}

export default function AuditSwitcher({ className, items = [] }: AuditSwitcherProps) {
  const auditModal = useAuditModal();
  const params = useParams();
  const router = useRouter();

  const formattedItems = items.map((item) => ({
    label: item.name,
    value: item.auditId
  }));

  console.log("fornatted items", formattedItems)

  const currentAudit = formattedItems.find((item) => item.value === params.auditId);

  const [open, setOpen] = React.useState(false)

  const onAuditSelect = (audit: { value: string, label: string }) => {
    setOpen(false);
    router.push(`/${audit.value}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select an audit"
          className={cn("w-[200px] justify-between", className)}
        >
          <Briefcase className="mr-2 h-4 w-4" />
          <span className="truncate max-w[100px]">{currentAudit?.label}</span>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Search audit..." />
            <CommandEmpty>No audit found.</CommandEmpty>
            <CommandGroup heading="Audits">
              {formattedItems.map((audit) => (
                <CommandItem
                  key={audit.value}
                  onSelect={() => onAuditSelect(audit)}
                  className="text-sm"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  {audit.label}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      currentAudit?.value === audit.value
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                  auditModal.onOpen()
                }}
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create Audit
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
