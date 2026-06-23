import { useAccount } from "@/providers/account-provider"
import { Card, CardHeader, CardTitle } from "./ui/card"

export function ShowSelectedAccount() {
  const { selectedAccount } = useAccount()
  return (
    <Card className="">
      <CardHeader>
        <p className="text-xs text-muted-foreground">Selected account</p>
        <CardTitle>{selectedAccount?.name}</CardTitle>
      </CardHeader>
    </Card>
  )
}
