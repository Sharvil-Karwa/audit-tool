"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type ObservationColumn = {
  id: string
  observation: string
  createdAt: string
  reference: string
}

export const columns: ColumnDef<ObservationColumn>[] = [
  {
    accessorKey: "observation",
    header: "Observation",
  },
  {
    accessorKey: "reference",
    header: "Reference"
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
