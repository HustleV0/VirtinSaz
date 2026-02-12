"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { User, Shield, Bell, CreditCard } from "lucide-react"

export default function GlobalSettingsPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">تنظیمات حساب کاربری</h1>
        <p className="text-muted-foreground">
          مدیریت اطلاعات حساب، امنیت و نوتیفیکیشن‌های پنل
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="w-full justify-start md:w-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            پروفایل
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            امنیت
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            اطلاع‌رسانی
          </TabsTrigger>
          <TabsTrigger value="billing" className="gap-2">
            <CreditCard className="h-4 w-4" />
            صورت‌حساب
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات شخصی</CardTitle>
              <CardDescription>اطلاعات اصلی حساب کاربری شما</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>نام و نام خانوادگی</Label>
                  <Input defaultValue={user?.full_name} className="text-right" />
                </div>
                <div className="space-y-2">
                  <Label>شماره تماس</Label>
                  <Input defaultValue={user?.phone_number} dir="ltr" className="text-left" disabled />
                </div>
              </div>
              <div className="space-y-2">
                <Label>ایمیل</Label>
                <Input defaultValue={user?.email || ""} dir="ltr" className="text-left" />
              </div>
              <Button>ذخیره تغییرات</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>امنیت حساب</CardTitle>
              <CardDescription>تغییر رمز عبور و تنظیمات امنیتی</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>رمز عبور فعلی</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>رمز عبور جدید</Label>
                <Input type="password" />
              </div>
              <Button variant="outline">تغییر رمز عبور</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
