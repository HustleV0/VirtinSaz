"use client"

import React, { useEffect, useState } from "react"
import { useRequirePlugin } from "@/hooks/use-require-plugin"
import { api } from "@/lib/api"
import { formatPrice } from "@/lib/mock-data"
import { 
  Card, 
  CardContent, 
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
import { Loader2, ShoppingBag } from "lucide-react"

export default function OrdersPage() {
  const { isLoading: isPluginLoading } = useRequirePlugin("order")
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isPluginLoading) return
    const fetchOrders = async () => {
      try {
        const data = await api.get("/orders/")
        setOrders(data)
      } catch (error) {
        console.error("Failed to fetch orders", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchOrders()
  }, [isPluginLoading])

  if (isLoading || isPluginLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">سفارشات</h1>
          <p className="text-muted-foreground">
            {orders.length} سفارش ثبت شده
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            لیست سفارشات اخیر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>شناسه سفارش</TableHead>
                <TableHead>تاریخ</TableHead>
                <TableHead>مبلغ کل</TableHead>
                <TableHead>وضعیت</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString('fa-IR')}</TableCell>
                  <TableCell>{formatPrice(order.total_amount)} تومان</TableCell>
                  <TableCell>
                    <Badge variant={order.status === 'paid' || order.status === 'delivered' ? 'default' : 'secondary'}>
                      {order.status === 'paid' ? 'پرداخت شده' : 
                       order.status === 'delivered' ? 'تحویل شده' : 
                       order.status === 'pending' ? 'در انتظار پرداخت' :
                       order.status === 'canceled' ? 'لغو شده' : order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    هنوز سفارشی ثبت نشده است.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
