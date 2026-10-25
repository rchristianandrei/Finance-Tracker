"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeTransactionForm } from "./income-transaction-form"
import { ExpenseTransactionForm } from "./expense-transaction-form"
import { TransferTransactionForm } from "./transfer-transaction-form"
import { Transaction } from "@/types/transaction"
import { CreateCategoryDialog } from "@/components/category/create-category-dialog"
import { useIsMobile } from "@/hooks/use-mobile"

export function NewCreateTransactionDialog({
  hideTrigger,
  initialOpen,
  title,
  initialTransaction,
  onClose,
}: {
  hideTrigger?: boolean
  initialOpen?: boolean
  title: string
  initialTransaction?: Transaction
  onClose?: () => void
}) {
  const isMobile = useIsMobile()
  const [isOpen, setIsOpen] = useState(() => initialOpen || false)
  const [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] =
    useState(false)

  function onAddCategoryClick() {
    setIsOpen(false)
    setIsCreateCategoryDialogOpen(true)
  }

  function onSuccess() {
    setIsOpen(false)
    onClose?.()
  }

  const defaultTab = !initialTransaction
    ? "expense"
    : initialTransaction.type === 2
      ? "income"
      : initialTransaction.type === 1
        ? "expense"
        : "transfer"

  return (
    <>
      <Sheet
        open={isOpen}
        onOpenChange={(value) => {
          setIsOpen(value)
          if (!value) onClose?.()
        }}
      >
        {!hideTrigger && (
          <SheetTrigger asChild>
            <Button variant="default">
              <Plus />
              <span className="hidden md:inline">Add Transaction</span>
            </Button>
          </SheetTrigger>
        )}

        {/* Mobile: slide up from the bottom */}
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={
            isMobile
              ? "flex h-[90dvh] max-h-[90dvh] flex-col gap-0 overflow-hidden rounded-t-2xl px-4 pb-[env(safe-area-inset-bottom)]"
              : "flex w-full flex-col gap-0 overflow-hidden px-6 sm:max-w-sm"
          }
        >
          <SheetHeader className="shrink-0 gap-1 text-left">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription className="sr-only">
              Create or edit a transaction.
            </SheetDescription>
          </SheetHeader>

          <Tabs
            key={defaultTab}
            defaultValue={defaultTab}
            className="flex min-h-0 flex-1 flex-col"
          >
            <TabsList className="mt-4 w-full shrink-0 gap-3 rounded-full bg-muted p-1">
              <TabsTrigger
                value="income"
                className="flex-1 rounded-full data-[state=active]:bg-green-600! data-[state=active]:text-white!"
              >
                Income
              </TabsTrigger>

              <TabsTrigger
                value="expense"
                className="flex-1 rounded-full data-[state=active]:bg-red-500! data-[state=active]:text-white!"
              >
                Expense
              </TabsTrigger>

              <TabsTrigger
                value="transfer"
                className="flex-1 rounded-full data-[state=active]:bg-white! data-[state=active]:text-black!"
              >
                Transfer
              </TabsTrigger>
            </TabsList>

            <div className="min-h-0 flex-1 overflow-y-auto">
              <TabsContent value="income" className="mt-4">
                <IncomeTransactionForm
                  transaction={initialTransaction}
                  onAddCategoryClick={onAddCategoryClick}
                  onSuccess={onSuccess}
                />
              </TabsContent>

              <TabsContent value="expense" className="mt-4">
                <ExpenseTransactionForm
                  transaction={initialTransaction}
                  onAddCategoryClick={onAddCategoryClick}
                  onSuccess={onSuccess}
                />
              </TabsContent>

              <TabsContent value="transfer" className="mt-4">
                <TransferTransactionForm
                  transaction={initialTransaction}
                  onSuccess={onSuccess}
                />
              </TabsContent>
            </div>
          </Tabs>
        </SheetContent>
      </Sheet>

      {isCreateCategoryDialogOpen && (
        <CreateCategoryDialog
          onClose={() => {
            setIsCreateCategoryDialogOpen(false)
            setIsOpen(true)
          }}
        />
      )}
    </>
  )
}
