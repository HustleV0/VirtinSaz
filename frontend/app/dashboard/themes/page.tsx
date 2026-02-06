"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Eye, Lock, Loader2, Globe } from "lucide-react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { Template } from "@/types"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export default function ThemesPage() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [site, setSite] = useState<any>(null)
  const [selectedThemeId, setSelectedThemeId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isApplying, setIsApplying] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<Template | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteData, templatesData] = await Promise.all([
          api.get("/site/me/"),
          api.get("/templates/")
        ])
        setSite(siteData)
        setTemplates(templatesData)
        setSelectedThemeId(siteData.template)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("خطا در دریافت اطلاعات")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleApply = async () => {
    if (!selectedThemeId || selectedThemeId === site?.template) return
    
    setIsApplying(true)
    try {
      const formData = new FormData()
      formData.append("template_id", selectedThemeId.toString())
      
      const updatedSite = await api.patch("/site/settings/", formData)
      setSite(updatedSite)
      toast.success("قالب با موفقیت تغییر یافت")
    } catch (error: any) {
      toast.error(error.message || "خطا در تغییر قالب")
    } finally {
      setIsApplying(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="mr-2">در حال بارگذاری...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-right">انتخاب قالب</h1>
          <p className="text-muted-foreground text-right">
            قالب مورد نظر خود را انتخاب کنید
          </p>
        </div>
        <Button 
          onClick={handleApply} 
          disabled={selectedThemeId === site?.template || isApplying}
        >
          {isApplying && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          اعمال قالب
        </Button>
      </div>

      {/* Themes Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => {
          const isSelected = selectedThemeId === template.id
          const isCurrent = site?.template === template.id

          return (
            <Card
              key={template.id}
              className={`cursor-pointer overflow-hidden transition-all flex flex-col ${
                isSelected
                  ? "ring-2 ring-primary"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedThemeId(template.id)}
            >
              {/* Theme Preview */}
              <div className="relative aspect-[4/3] bg-muted">
                {template.preview_image ? (
                  <Image 
                    src={template.preview_image} 
                    alt={template.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Globe className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute right-2 top-2 flex flex-col gap-1">
                  {template.tag && (
                    <Badge variant="default" className="text-xs">
                      {template.tag === "New" ? "جدید" : template.tag}
                    </Badge>
                  )}
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                    <Check className="h-4 w-4 text-primary-foreground" />
                  </div>
                )}
              </div>

              {/* Theme Info */}
              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-right">
                    <h3 className="font-semibold">{template.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {template.category_name}
                    </p>
                  </div>
                  {isCurrent && (
                    <Badge variant="outline">فعال</Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 text-right mb-4 flex-1">
                  {template.description || "بدون توضیح"}
                </p>

                {/* Actions */}
                <div className="mt-auto flex gap-2">
                  <Dialog open={isPreviewOpen && previewTheme?.id === template.id} onOpenChange={(open) => {
                    setIsPreviewOpen(open)
                    if (open) setPreviewTheme(template)
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 gap-1"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPreviewTheme(template)
                          setIsPreviewOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                        پیش‌نمایش
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] md:max-w-2xl p-0 overflow-hidden sm:rounded-2xl flex flex-col max-h-[85vh]">
                      <DialogHeader className="p-6 pb-2 border-b">
                        <DialogTitle className="text-xl text-right">{previewTheme?.name}</DialogTitle>
                      </DialogHeader>
                      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20">
                        <div 
                          className="w-full relative rounded-lg border overflow-hidden shadow-sm bg-background"
                        >
                          {previewTheme?.preview_image ? (
                            <img 
                              src={previewTheme.preview_image} 
                              alt={previewTheme.name}
                              className="w-full h-auto object-cover max-h-[50vh]"
                            />
                          ) : (
                            <div className="aspect-video flex items-center justify-center">
                              <p className="text-muted-foreground">تصویری برای پیش‌نمایش یافت نشد</p>
                            </div>
                          )}
                        </div>
                        {previewTheme?.description && (
                          <p className="mt-4 text-right text-muted-foreground">{previewTheme.description}</p>
                        )}
                      </div>
                      <div className="p-4 border-t flex justify-end gap-3 bg-background">
                        <DialogClose asChild>
                          <Button variant="outline" size="sm">بستن</Button>
                        </DialogClose>
                        <Button size="sm" onClick={() => {
                          setSelectedThemeId(template.id)
                          setIsPreviewOpen(false)
                        }}>انتخاب این قالب</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    size="sm"
                    className="flex-1"
                    variant={isSelected ? "default" : "outline"}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedThemeId(template.id)
                    }}
                  >
                    {isSelected ? "انتخاب شده" : "انتخاب"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
