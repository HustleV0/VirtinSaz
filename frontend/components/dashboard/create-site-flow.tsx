"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/hooks/use-auth"
import { Layout, Palette, Check, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Category {
  id: number
  name: string
  slug: string
}

interface Theme {
  id: number
  name: string
  slug: string
  preview_image: string
  description: string
}

export function CreateSiteFlow() {
  const router = useRouter()
  const { token, updateUser, user } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: user?.restaurant_name || "",
    slug: "",
    category_id: "",
    theme_id: "",
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [themes, setThemes] = useState<Theme[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (formData.category_id) {
      fetchThemes(formData.category_id)
    }
  }, [formData.category_id])

  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/site-categories/")
      const data = await res.json()
      setCategories(data)
    } catch (error) {
      toast.error("خطا در دریافت دسته‌بندی‌ها")
    }
  }

  const fetchThemes = async (categoryId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/api/themes/?category_id=${categoryId}`)
      const data = await res.json()
      setThemes(data)
    } catch (error) {
      toast.error("خطا در دریافت قالب‌ها")
    }
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name) return toast.error("نام سایت الزامی است")
      if (!formData.slug) return toast.error("آدرس سایت الزامی است")
      setStep(2)
    } else if (step === 2) {
      if (!formData.category_id) return toast.error("انتخاب دسته‌بندی الزامی است")
      setStep(3)
    }
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (!formData.theme_id) return toast.error("انتخاب قالب الزامی است")
    
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/site/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          category: formData.category_id,
          theme: formData.theme_id
        })
      })

      if (res.ok) {
        const siteData = await res.json()
        toast.success("سایت شما با موفقیت ساخته شد! حالا می‌توانید آن را شخصی‌سازی کنید.")
        
        // Update user state to reflect they now have a site
        if (user) {
          updateUser({
            ...user,
            has_site: true,
            site_slug: siteData.slug,
            restaurant_name: siteData.name
          })
        }
        
        router.refresh()
      } else {
        const errorData = await res.json()
        if (errorData.detail) {
          toast.error(errorData.detail)
        } else {
          // Join all error messages from all fields
          const messages = Object.values(errorData).flat()
          if (messages.length > 0) {
            toast.error(messages[0] as string)
          } else {
            toast.error("خطا در ساخت سایت")
          }
        }
      }
    } catch (error) {
      toast.error("خطا در برقراری ارتباط")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-2 w-8 rounded-full transition-colors",
                    step >= i ? "bg-primary" : "bg-muted"
                  )} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">گام {step} از ۳</span>
          </div>
          <CardTitle className="text-2xl">ساخت اولین وبسایت</CardTitle>
          <CardDescription>
            {step === 1 && "نام و آدرس اینترنتی وبسایت خود را انتخاب کنید"}
            {step === 2 && "نوع کسب‌وکارتان را مشخص کنید"}
            {step === 3 && "ظاهر وبسایت خود را انتخاب کنید"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام رستوران یا کافه</Label>
                <Input
                  id="name"
                  placeholder="مثلا: کافه لذت"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">آدرس اینترنتی (Slug)</Label>
                <div className="flex items-center gap-2" dir="ltr">
                  <span className="text-muted-foreground">.menusaz.ir</span>
                  <Input
                    id="slug"
                    placeholder="my-restaurant"
                    className="text-left"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  />
                </div>
                <p className="text-xs text-muted-foreground">فقط حروف انگلیسی، اعداد و خط تیره</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, category_id: cat.id.toString() })}
                  className={cn(
                    "relative cursor-pointer rounded-xl border-2 p-4 transition-all hover:bg-accent",
                    formData.category_id === cat.id.toString() ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{cat.name}</span>
                    {formData.category_id === cat.id.toString() && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              {themes.length > 0 ? (
                themes.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => setFormData({ ...formData, theme_id: tpl.id.toString() })}
                    className={cn(
                      "relative cursor-pointer overflow-hidden rounded-xl border-2 transition-all hover:shadow-md",
                      formData.theme_id === tpl.id.toString() ? "border-primary" : "border-border"
                    )}
                  >
                    <div className="aspect-video bg-muted">
                      {tpl.preview_image && (
                        <img 
                          src={`http://localhost:8000${tpl.preview_image}`} 
                          alt={tpl.name} 
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium">{tpl.name}</p>
                    </div>
                    {formData.theme_id === tpl.id.toString() && (
                      <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
                  قالبی در این دسته‌بندی یافت نشد
                </div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              <ArrowRight className="ml-2 h-4 w-4" />
              مرحله قبلی
            </Button>
          ) : (
            <div />
          )}
          
          {step < 3 ? (
            <Button onClick={handleNext}>
              مرحله بعدی
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading || !formData.theme_id}>
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  در حال ساخت...
                </>
              ) : (
                "تایید و ساخت سایت"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
