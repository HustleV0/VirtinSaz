"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Camera } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://dash.vofino.ir"

export default function GlobalProfilePage() {
  const { user } = useAuth()

  const avatarUrl = user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}${user.avatar}`) : null

  return (
    <div className="max-w-4xl mx-auto space-y-6" dir="rtl">
      <div>
        <h1 className="text-2xl font-bold">پروفایل کاربری</h1>
        <p className="text-muted-foreground">مدیریت اطلاعات شخصی و تصویر پروفایل</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>اطلاعات حساب</CardTitle>
          <CardDescription>این اطلاعات در بخش‌های مختلف پنل نمایش داده می‌شود</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || "/placeholder-user.jpg"} />
                <AvatarFallback>{user?.full_name?.slice(0, 2) || "U"}</AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 text-center sm:text-right space-y-1">
              <h3 className="text-xl font-bold">{user?.full_name}</h3>
              <p className="text-sm text-muted-foreground">{user?.phone_number}</p>
              <Button variant="outline" size="sm" className="mt-2">تغییر تصویر</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 text-right">
              <Label>نام و نام خانوادگی</Label>
              <Input defaultValue={user?.full_name} className="text-right" />
            </div>
            <div className="space-y-2 text-right">
              <Label>شماره همراه</Label>
              <Input defaultValue={user?.phone_number} dir="ltr" className="text-left" disabled />
            </div>
            <div className="space-y-2 text-right">
              <Label>ایمیل</Label>
              <Input defaultValue={user?.email || ""} dir="ltr" className="text-left" placeholder="example@gmail.com" />
            </div>
          </div>

          <div className="flex justify-start">
            <Button>ذخیره تغییرات</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
