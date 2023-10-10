"use client";

import Link from "next/link"
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.auditId}`,
      label: 'Overview',
      active: pathname === `/${params.auditId}`,
    },
    {
      href: `/${params.auditId}/departments`,
      label: 'Departments',
      active: pathname === `/${params.auditId}/deparments`,
    },
    {
      href: `/${params.auditId}/equipments`,
      label: 'Equipments',
      active: pathname === `/${params.auditId}/equipments`,
    },
    {
      href: `/${params.auditId}/settings`,
      label: 'Settings',
      active: pathname === `/${params.auditId}/settings`,
    },
  ]

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6 pl-4 lg:pl-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            route.active ? 'text-black dark:text-white' : 'text-muted-foreground'
          )}
        >
          {route.label}
      </Link>
      ))}
    </nav>
  )
};
