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
import { useState } from "react"
import { toast } from "sonner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IncomeTransactionForm } from "./income-transaction-form"
import { ExpenseTransactionForm } from "./expense-transaction-form"
import { TransferTransactionForm } from "./transfer-transaction-form"

export function NewCreateTransactionDialog() {
  const [isOpen, setIsOpen] = useState(false)

  async function onSubmit(values: any) {
    try {
      toast.success("Transaction created successfully")

      setIsOpen(false)
    } catch (err) {
      toast.error("Failed to create transaction")
      throw err
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus></Plus>{" "}
            <span className="hidden md:inline">Add Transaction</span>
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader className="gap-1">
            <DialogTitle>Create Transaction</DialogTitle>
            <DialogDescription></DialogDescription>
            <Tabs defaultValue="income" className="flex flex-col">
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
                <IncomeTransactionForm />
              </TabsContent>
              <TabsContent value="expense">
                <ExpenseTransactionForm />
              </TabsContent>
              <TabsContent value="transfer">
                <TransferTransactionForm />
              </TabsContent>
            </Tabs>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
