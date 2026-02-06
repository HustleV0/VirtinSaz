"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, CreditCard, Trash2, Check } from "lucide-react"

const paymentProviders = [
  { id: "zarinpal", name: "زرین‌پال", logo: "Z" },
  { id: "mellat", name: "به‌پرداخت ملت", logo: "M" },
  { id: "parsian", name: "پارسیان", logo: "P" },
  { id: "idpay", name: "آیدی‌پی", logo: "I" },
]

interface Gateway {
  id: string
  provider: string
  merchantId: string
  isActive: boolean
  isDefault: boolean
}

export default function PaymentsPage() {
  const [gateways, setGateways] = useState<Gateway[]>([
    {
      id: "1",
      provider: "zarinpal",
      merchantId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      isActive: true,
      isDefault: true,
    },
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    provider: "",
    merchantId: "",
  })

  const getProviderInfo = (providerId: string) => {
    return paymentProviders.find((p) => p.id === providerId)
  }

  const handleAddGateway = () => {
    const newGateway: Gateway = {
      id: String(gateways.length + 1),
      provider: formData.provider,
      merchantId: formData.merchantId,
      isActive: true,
      isDefault: gateways.length === 0,
    }
    setGateways([...gateways, newGateway])
    setIsDialogOpen(false)
    setFormData({ provider: "", merchantId: "" })
    toast.success("درگاه پرداخت با موفقیت اضافه شد")
  }

  const handleDelete = (id: string) => {
    setGateways(gateways.filter((g) => g.id !== id))
    toast.success("درگاه پرداخت حذف شد")
  }

  const toggleActive = (id: string) => {
    setGateways(
      gateways.map((g) => (g.id === id ? { ...g, isActive: !g.isActive } : g))
    )
    const gateway = gateways.find(g => g.id === id)
    toast.success(`درگاه ${getProviderInfo(gateway?.provider || "")?.name} ${!gateway?.isActive ? 'فعال' : 'غیرفعال'} شد`)
  }

  const setDefault = (id: string) => {
    setGateways(
      gateways.map((g) => ({ ...g, isDefault: g.id === id }))
    )
    const gateway = gateways.find(g => g.id === id)
    toast.success(`درگاه ${getProviderInfo(gateway?.provider || "")?.name} به عنوان درگاه پیش‌فرض انتخاب شد`)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">درگاه پرداخت</h1>
          <p className="text-muted-foreground">
            درگاه‌های پرداخت خود را مدیریت کنید
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              افزودن درگاه
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>افزودن درگاه پرداخت</DialogTitle>
              <DialogDescription>
                درگاه پرداخت جدید برای دریافت پرداخت از مشتریان
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>درگاه پرداخت</Label>
                <Select
                  value={formData.provider}
                  onValueChange={(value) =>
                    setFormData({ ...formData, provider: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب درگاه" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentProviders.map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="merchantId">شناسه پذیرنده (Merchant ID)</Label>
                <Input
                  id="merchantId"
                  value={formData.merchantId}
                  onChange={(e) =>
                    setFormData({ ...formData, merchantId: e.target.value })
                  }
                  placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                  dir="ltr"
                  className="font-mono text-left"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                انصراف
              </Button>
              <Button
                onClick={handleAddGateway}
                disabled={!formData.provider || !formData.merchantId}
              >
                افزودن
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Gateways List */}
      {gateways.length > 0 ? (
        <div className="space-y-4">
          {gateways.map((gateway) => {
            const provider = getProviderInfo(gateway.provider)
            return (
              <Card key={gateway.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                        {provider?.logo}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{provider?.name}</h3>
                          {gateway.isDefault && (
                            <Badge>پیش‌فرض</Badge>
                          )}
                          {!gateway.isActive && (
                            <Badge variant="secondary">غیرفعال</Badge>
                          )}
                        </div>
                        <p className="font-mono text-sm text-muted-foreground" dir="ltr">
                          {gateway.merchantId.slice(0, 8)}...{gateway.merchantId.slice(-4)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={gateway.isActive}
                          onCheckedChange={() => toggleActive(gateway.id)}
                        />
                        <Label className="text-sm">فعال</Label>
                      </div>
                      {!gateway.isDefault && gateway.isActive && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDefault(gateway.id)}
                        >
                          <Check className="ml-1 h-4 w-4" />
                          پیش‌فرض
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(gateway.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-semibold">هنوز درگاهی اضافه نکرده‌اید</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              برای دریافت پرداخت از مشتریان، یک درگاه پرداخت اضافه کنید
            </p>
            <Button
              variant="outline"
              className="mt-4 bg-transparent"
              onClick={() => setIsDialogOpen(true)}
            >
              افزودن درگاه پرداخت
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>راهنمای اتصال درگاه</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">زرین‌پال</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              برای دریافت شناسه پذیرنده، به پنل زرین‌پال مراجعه کنید و از بخش
              &quot;درگاه پرداخت&quot; کد Merchant را کپی کنید.
            </p>
          </div>
          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium">به‌پرداخت ملت</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              شناسه ترمینال و کلید رمزنگاری را از پنل به‌پرداخت دریافت کنید.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
