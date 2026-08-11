"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeTransactionForm } from "./income-transaction-form"
import { ExpenseTransactionForm } from "./expense-transaction-form"
import { TransferTransactionForm } from "./transfer-transaction-form"
import { Transaction } from "@/types/transaction"

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
  const [isOpen, setIsOpen] = useState(() => initialOpen || false)

  function onSuccess() {
    setIsOpen(false)
    onClose?.()
  }

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(value) => {
          setIsOpen(value)
          onClose?.()
        }}
      >
        {!hideTrigger && (
          <DialogTrigger asChild>
            <Button variant="default">
              <Plus></Plus>{" "}
              <span className="hidden md:inline">Add Transaction</span>
            </Button>
          </DialogTrigger>
        )}

        <DialogContent>
          <DialogHeader className="gap-1">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription></DialogDescription>
            <Tabs
              defaultValue={
                !initialTransaction
                  ? "expense"
                  : initialTransaction?.type === 2
                    ? "income"
                    : initialTransaction?.type === 1
                      ? "expense"
                      : "transfer"
              }
              className="flex flex-col"
            >
              <TabsList className="w-full gap-3 rounded-full bg-muted p-1">
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

              <TabsContent value="income">
                <IncomeTransactionForm
                  transaction={initialTransaction}
                  onSuccess={onSuccess}
                />
              </TabsContent>
              <TabsContent value="expense">
                <ExpenseTransactionForm
                  transaction={initialTransaction}
                  onSuccess={onSuccess}
                />
              </TabsContent>
              <TabsContent value="transfer">
                <TransferTransactionForm
                  transaction={initialTransaction}
                  onSuccess={onSuccess}
                />
              </TabsContent>
            </Tabs>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
