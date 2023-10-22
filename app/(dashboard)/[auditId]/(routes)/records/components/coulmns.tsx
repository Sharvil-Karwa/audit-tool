"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type RecordColumn = {
  id: number
  department: string
  equipment: string
  eq_id: string
  rating: string
  createdAt: string
}

export const columns: ColumnDef<RecordColumn>[] = [
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "equipment",
    header: "Equipment"
  },
  {
    accessorKey: "eq_id",
    header: "Equipment ID"
  },
  {
    accessorKey: "rating",
    header: "Rating"
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({row})=> <CellAction data={row.original} />
  }
]
