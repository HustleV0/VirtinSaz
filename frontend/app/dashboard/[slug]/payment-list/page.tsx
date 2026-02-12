"use client"

import React, { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingUp, Calendar, Hash } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface Payment {
  id: number
  status: string
  provider: string
  transaction_id: string
  amount: number
  created_at: string
}

export default function PaymentListPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [totalSum, setTotalSum] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const data = await api.get('/orders/payment-list/')
        setPayments(data.payments)
        setTotalSum(data.total_sum)
      } catch (error) {
        console.error("Failed to fetch payments", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPayments()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none">موفق</Badge>
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">در انتظار</Badge>
      case 'failed':
        return <Badge variant="destructive">ناموفق</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + " تومان"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR')
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight">پرداختی‌ها</h1>
        <p className="text-muted-foreground">مشاهده و مدیریت تمام پرداخت‌های وبسایت شما.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-primary/[0.02] border-primary/20">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              مجموع درآمدهای موفق
            </CardDescription>
            <CardTitle className="text-2xl font-bold text-primary">
              {loading ? <Skeleton className="h-8 w-32" /> : formatPrice(totalSum)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <Hash className="h-4 w-4" />
              تعداد کل تراکنش‌ها
            </CardDescription>
            <CardTitle className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : payments.length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" />
            تاریخچه پرداخت‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : payments.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">شناسه تراکنش</TableHead>
                    <TableHead className="text-right">درگاه</TableHead>
                    <TableHead className="text-right">مبلغ</TableHead>
                    <TableHead className="text-right">تاریخ</TableHead>
                    <TableHead className="text-right">وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-mono text-xs">{payment.transaction_id || "---"}</TableCell>
                      <TableCell>{payment.provider}</TableCell>
                      <TableCell className="font-bold">{formatPrice(payment.amount)}</TableCell>
                      <TableCell className="text-muted-foreground">{formatDate(payment.created_at)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">هنوز هیچ تراکنشی ثبت نشده است.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
