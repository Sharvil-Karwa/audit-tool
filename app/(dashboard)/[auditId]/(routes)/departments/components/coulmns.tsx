"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type DepartmentColumn = {
  id: string
  name: string
  createdAt: string
}

export const columns: ColumnDef<DepartmentColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    id: "actions",
    cell: ({row})=> <CellAction data={row.original} />
  }
]
