import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Category } from "@/types/category"

import { Edit, Ellipsis, Trash } from "lucide-react"
import { JSX } from "react"
import { useManageCategories } from "../providers/manage-category-provider"

export function CategoryTable({
  icon,
  title,
  categories,
}: {
  icon: JSX.Element
  title: string
  categories: Category[]
}) {
  const { setUpdateCategoryEvent, setDeleteCategoryEvent } =
    useManageCategories()

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle className="flex gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            <TooltipProvider>
              {categories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell className="max-w-50 truncate font-medium">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="block cursor-help truncate">
                          {category.name}
                        </span>
                      </TooltipTrigger>

                      <TooltipContent>
                        <p>{category.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>

                  <TableCell className="flex justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Ellipsis />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-fit"
                        side={"bottom"}
                        align="end"
                        sideOffset={4}
                      >
                        <DropdownMenuItem
                          onClick={() => setUpdateCategoryEvent(category)}
                        >
                          <Edit />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setDeleteCategoryEvent(category)}
                        >
                          <Trash /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TooltipProvider>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
