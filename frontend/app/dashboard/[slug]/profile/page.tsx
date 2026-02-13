"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Upload, UtensilsCrossed } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || "https://dash.vofino.ir"

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    restaurant_name: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        restaurant_name: user.restaurant_name || "",
      })
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return

    setIsLoading(true)
    try {
      const data = await api.patch("/accounts/profile/", formData)
      updateUser(data)
      toast.success("اطلاعات پروفایل با موفقیت به‌روزرسانی شد")
    } catch (error: any) {
      toast.error(error.message || "خطا در به‌روزرسانی اطلاعات")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !token) return

    if (file.size > 1024 * 1024) {
      toast.error("حجم فایل نباید بیشتر از ۱ مگابایت باشد")
      return
    }

    const formDataObj = new FormData()
    formDataObj.append("avatar", file)

    setIsLoading(true)
    try {
      const data = await api.patch("/accounts/profile/", formDataObj)
      updateUser(data)
      toast.success("آواتار با موفقیت تغییر کرد")
    } catch (error: any) {
      toast.error(error.message || "خطا در آپلود آواتار")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  const avatarUrl = user.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${API_BASE_URL}${user.avatar}`) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">پروفایل کاربری</h1>
        <p className="text-muted-foreground">اطلاعات شخصی و رستوران خود را مدیریت کنید</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>اطلاعات حساب</CardTitle>
            <CardDescription>نام، ایمیل و مشخصات رستوران خود را ویرایش کنید</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-border">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl || ""} />
                  <AvatarFallback className="text-2xl">{user.full_name?.slice(0, 2) || "کاربر"}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Upload className="ml-2 h-4 w-4" />
                    تغییر آواتار
                  </Button>
                  <p className="text-xs text-muted-foreground">JPG یا PNG. حداکثر ۱ مگابایت</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">نام و نام خانوادگی</Label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="full_name" 
                      value={formData.full_name} 
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="pr-10" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">ایمیل</Label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pr-10" 
                      dir="ltr"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number">شماره تماس</Label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="phone_number" 
                      value={formData.phone_number}
                      disabled
                      className="pr-10 bg-muted" 
                      dir="ltr"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">شماره تماس قابل تغییر نیست</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="restaurant_name">نام رستوران</Label>
                  <div className="relative">
                    <UtensilsCrossed className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input 
                      id="restaurant_name" 
                      value={formData.restaurant_name}
                      onChange={(e) => setFormData({...formData, restaurant_name: e.target.value})}
                      className="pr-10" 
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>وضعیت حساب</CardTitle>
              <CardDescription>اطلاعات اشتراک و فعالیت</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">نوع حساب:</span>
                <span className="font-medium text-primary">رایگان</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">تاریخ عضویت:</span>
                <span className="font-medium">بهمن ۱۴۰۲</span>
              </div>
              <Button variant="outline" className="w-full" disabled>
                ارتقا به حرفه‌ای
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
