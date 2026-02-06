"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Globe, Instagram, Send, Phone, Loader2, ExternalLink, Check } from "lucide-react"
import { api } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"
import Image from "next/image"

export default function SettingsPage() {
  const { user, updateUser } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [site, setSite] = useState<any>(null)
  const [themes, setThemes] = useState<any[]>([])
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    instagram: "",
    telegram: "",
    whatsapp: "",
    primaryColor: "#000000",
    showPrices: true,
    isPublished: true,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const siteData = await api.get("/site/me/")
        setSite(siteData)
        if (siteData.logo) {
          setLogoPreview(siteData.logo)
        }
        if (siteData.cover_image) {
          setCoverPreview(siteData.cover_image)
        }
        setSettings({
          name: siteData.name,
          description: siteData.settings?.description || "",
          address: siteData.settings?.address || "",
          phone: siteData.settings?.phone || "",
          email: siteData.settings?.email || "",
          instagram: siteData.settings?.instagram || "",
          telegram: siteData.settings?.telegram || "",
          whatsapp: siteData.settings?.whatsapp || "",
          primaryColor: siteData.settings?.primaryColor || "#000000",
          showPrices: siteData.settings?.showPrices ?? true,
          isPublished: siteData.settings?.isPublished ?? true,
        })

        if (siteData.category) {
          const themesData = await api.get(`/themes/?category_id=${siteData.category}`)
          setThemes(themesData)
        }
      } catch (error) {
        toast.error("خطا در بارگذاری اطلاعات")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleSave = async (data: any = {}) => {
    setIsSaving(true)
    try {
      const formData = new FormData()
      
      const updatedSettings = {
        ...settings,
        ...(data.settings || {})
      }
      
      formData.append("name", data.name || settings.name)
      formData.append("settings", JSON.stringify(updatedSettings))
      
      if (logoFile) {
        formData.append("logo", logoFile)
      }
      
      if (coverFile) {
        formData.append("cover_image", coverFile)
      }

      if (data.theme_id) {
        formData.append("theme_id", data.theme_id.toString())
      }

      const updatedSite = await api.patch("/site/settings/", formData)
      setSite(updatedSite)
      if (updatedSite.logo) {
        setLogoPreview(updatedSite.logo)
      }
      if (updatedSite.cover_image) {
        setCoverPreview(updatedSite.cover_image)
      }
      
      // Update auth context if name changed
      if (user && updatedSite.name !== user.restaurant_name) {
        updateUser({
          ...user,
          restaurant_name: updatedSite.name
        })
      }

      toast.success("تنظیمات با موفقیت ذخیره شد")
    } catch (error: any) {
      toast.error(error.message || "خطا در ذخیره تنظیمات")
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setCoverPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const changeTheme = async (themeId: number) => {
    if (themeId === site.theme) return
    handleSave({ theme_id: themeId })
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">در حال بارگذاری...</div>
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">تنظیمات وبسایت</h1>
        <p className="text-muted-foreground">
          اطلاعات و تنظیمات وبسایت خود را مدیریت کنید
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-6" dir="rtl">
        <TabsList className="w-full justify-start md:w-auto">
          <TabsTrigger value="general">اطلاعات کلی</TabsTrigger>
          <TabsTrigger value="social">شبکه‌های اجتماعی</TabsTrigger>
          <TabsTrigger value="appearance">ظاهر</TabsTrigger>
          <TabsTrigger value="themes">انتخاب قالب</TabsTrigger>
          <TabsTrigger value="domain">دامنه</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات کلی</CardTitle>
              <CardDescription>
                اطلاعات اصلی رستوران یا کافه خود را وارد کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              {/* Logo Upload */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-right block">لوگو</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 overflow-hidden rounded-lg border border-dashed border-border bg-muted flex items-center justify-center relative">
                      {logoPreview ? (
                        <Image 
                          src={logoPreview} 
                          alt="Logo Preview" 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById("logo-upload")?.click()}
                      >
                        آپلود لوگو
                      </Button>
                      <input 
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-right block">تصویر بنر (کاور)</Label>
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-40 overflow-hidden rounded-lg border border-dashed border-border bg-muted flex items-center justify-center relative">
                      {coverPreview ? (
                        <Image 
                          src={coverPreview} 
                          alt="Cover Preview" 
                          fill 
                          className="object-cover"
                        />
                      ) : (
                        <Upload className="h-6 w-6 text-muted-foreground" />
                      )}
                    </div>
                    <div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => document.getElementById("cover-upload")?.click()}
                      >
                        آپلود بنر
                      </Button>
                      <input 
                        id="cover-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-right block">نام وبسایت</Label>
                <Input
                  id="name"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                  className="text-right"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-right block">شماره تماس</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  dir="ltr"
                  className="text-left"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-right block">توضیحات</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) =>
                    setSettings({ ...settings, description: e.target.value })
                  }
                  rows={3}
                  className="text-right"
                />
              </div>

              <Button onClick={() => handleSave()} disabled={isSaving}>
                {isSaving && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                ذخیره تغییرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links */}
        <TabsContent value="social">
          <Card>
            <CardHeader className="text-right">
              <CardTitle>شبکه‌های اجتماعی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="flex items-center gap-2 justify-end">
                  اینستاگرام
                  <Instagram className="h-4 w-4" />
                </Label>
                <Input
                  id="instagram"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telegram" className="flex items-center gap-2 justify-end">
                  تلگرام
                  <Send className="h-4 w-4" />
                </Label>
                <Input
                  id="telegram"
                  value={settings.telegram}
                  onChange={(e) => setSettings({ ...settings, telegram: e.target.value })}
                  dir="ltr"
                  className="text-left"
                />
              </div>
              <Button onClick={() => handleSave()} disabled={isSaving}>
                ذخیره تغییرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <Card>
            <CardHeader className="text-right">
              <CardTitle>ظاهر وبسایت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              <div className="space-y-2">
                <Label htmlFor="primaryColor" className="text-right block">رنگ اصلی</Label>
                <div className="flex items-center gap-3 justify-end">
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) =>
                      setSettings({ ...settings, primaryColor: e.target.value })
                    }
                    dir="ltr"
                    className="w-32 text-left font-mono"
                  />
                  <input
                    type="color"
                    id="primaryColor"
                    value={settings.primaryColor}
                    onChange={(e) =>
                      setSettings({ ...settings, primaryColor: e.target.value })
                    }
                    className="h-10 w-20 cursor-pointer rounded-lg border border-border p-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-border p-4 text-right">
                <div className="flex-1">
                  <p className="font-medium">نمایش قیمت‌ها</p>
                </div>
                <Switch
                  checked={settings.showPrices}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showPrices: checked })
                  }
                />
              </div>

              <Button onClick={() => handleSave()} disabled={isSaving}>
                ذخیره تغییرات
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Templates */}
        <TabsContent value="themes">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {themes.map((theme) => (
              <Card 
                key={theme.id} 
                className={`overflow-hidden cursor-pointer transition-all ${theme.id === site.theme ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
                onClick={() => changeTheme(theme.id)}
              >
                <div className="relative aspect-video">
                  <Image
                    src={theme.preview_image || "/placeholder.svg"}
                    alt={theme.name}
                    fill
                    className="object-cover"
                  />
                  {theme.id === site.theme && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{theme.name}</CardTitle>
                  <CardDescription>{theme.tag || "قالب پیش‌فرض"}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Domain */}
        <TabsContent value="domain">
          <Card>
            <CardHeader className="text-right">
              <CardTitle>آدرس وبسایت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-right">
              <div className="rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div className="text-right">
                      <p className="font-medium">آدرس فعلی</p>
                      <p className="text-sm text-muted-foreground" dir="ltr">
                        {site?.owner_phone || "your-site"}.menusaz.ir
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2" asChild>
                    <a href={`/preview/${site?.id}`} target="_blank" rel="noopener noreferrer">
                      مشاهده
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
