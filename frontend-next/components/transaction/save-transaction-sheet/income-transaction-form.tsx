"use client"

import { useEffect, useMemo } from "react"
import { useCategory } from "@/providers/category-provider"
import { AccountController } from "./components/account-controller"
import { useSaveTransaction } from "./save-transation-provider"
import { DescriptionController } from "./components/description-controller"
import { AmountAndDateController } from "./components/amount-and-date-controller"
import { CategoryController } from "./components/category-controller"

export function IncomeTransactionForm() {
  const { form, currentType, selectedToAccount, selectedCategory } =
    useSaveTransaction()
  const { categories } = useCategory()

  const incomeCategories = useMemo(
    () => categories.filter((c) => c.type === 2),
    [categories]
  )

  useEffect(() => {
    if (selectedCategory?.type === 2) return
    form.setValue("categoryId", 0)
  }, [currentType])

  return (
    <>
      <AccountController name="toAccountId" account={selectedToAccount} />
      <CategoryController categories={incomeCategories} />
      <DescriptionController />
      <AmountAndDateController />
    </>
  )
}
