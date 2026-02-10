"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRight, Upload, X } from "lucide-react"
import { api } from "@/lib/api"

export default function NewProductPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [availableTags, setAvailableTags] = useState<any[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    price: "",
    discount_percentage: "0",
    badge: "",
    is_available: true,
    is_popular: false,
    tag_ids: [] as number[],
  })
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, tags] = await Promise.all([
          api.get("/menu/categories/"),
          api.get("/menu/tags/"),
        ])
        setCategories(cats)
        setAvailableTags(tags)
      } catch (error) {
        toast.error("خطا در بارگذاری اطلاعات")
      }
    }
    fetchData()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.category) {
      toast.error("لطفا دسته‌بندی را انتخاب کنید")
      return
    }
    
    setIsLoading(true)
    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description)
      data.append("category", formData.category)
      data.append("price", formData.price)
      data.append("discount_percentage", formData.discount_percentage)
      data.append("badge", formData.badge)
      data.append("is_available", String(formData.is_available))
      data.append("is_popular", String(formData.is_popular))
      
      selectedTagIds.forEach(id => {
        data.append("tag_ids", id.toString())
      })

      if (selectedFile) {
        data.append("image", selectedFile)
      }

      await api.post("/menu/products/", data)
      toast.success("محصول جدید با موفقیت اضافه شد")
      router.push("/dashboard/cafe/menu")
    } catch (error) {
      toast.error("خطا در ذخیره محصول")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/cafe/menu">
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">افزودن محصول جدید</h1>
          <p className="text-muted-foreground">
            محصول جدید به منو اضافه کنید
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>اطلاعات محصول</CardTitle>
                <CardDescription>
                  اطلاعات اصلی محصول را وارد کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">نام محصول</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="مثال: کاپوچینو"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="توضیحات محصول را بنویسید..."
                    rows={4}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">دسته‌بندی</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData({ ...formData, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="badge">تگ محصول (Badge)</Label>
                    <Input
                      id="badge"
                      value={formData.badge}
                      onChange={(e) =>
                        setFormData({ ...formData, badge: e.target.value })
                      }
                      placeholder="مثال: جدید، ویژه"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>قیمت‌گذاری</CardTitle>
                <CardDescription>
                  قیمت محصول را تعیین کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="price">قیمت (تومان)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      placeholder="۵۰۰۰۰"
                      required
                      dir="ltr"
                      className="text-left"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount">درصد تخفیف</Label>
                    <Input
                      id="discount"
                      type="number"
                      value={formData.discount_percentage}
                      onChange={(e) =>
                        setFormData({ ...formData, discount_percentage: e.target.value })
                      }
                      placeholder="۰"
                      dir="ltr"
                      className="text-left"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags (M2M) */}
            <Card>
              <CardHeader>
                <CardTitle>برچسب‌ها</CardTitle>
                <CardDescription>
                  برچسب‌های سیستمی را انتخاب کنید
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Button
                      key={tag.id}
                      type="button"
                      variant={selectedTagIds.includes(tag.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleTag(tag.id)}
                      className="rounded-full"
                    >
                      {tag.name}
                    </Button>
                  ))}
                  {availableTags.length === 0 && (
                    <p className="text-sm text-muted-foreground">هیچ برچسبی تعریف نشده است.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>تصویر محصول</CardTitle>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  id="product-image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Label
                  htmlFor="product-image"
                  className="relative flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:border-primary hover:bg-muted overflow-hidden"
                >
                  {imagePreview ? (
                    <>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Upload className="h-10 w-10 text-white" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground text-center px-4">
                        برای آپلود تصویر کلیک کنید
                      </p>
                    </>
                  )}
                </Label>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="mt-2 w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setSelectedFile(null)
                      setImagePreview(null)
                    }}
                  >
                    <X className="h-4 w-4 ml-2" />
                    حذف تصویر
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>وضعیت</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">موجود</p>
                    <p className="text-sm text-muted-foreground">
                      نمایش در منو
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_available}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_available: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">محبوب</p>
                    <p className="text-sm text-muted-foreground">
                      نمایش در بخش محبوب‌ها
                    </p>
                  </div>
                  <Switch
                    checked={formData.is_popular}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_popular: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "در حال ذخیره..." : "ذخیره محصول"}
              </Button>
              <Link href="/dashboard/cafe/menu">
                <Button type="button" variant="outline" className="w-full bg-transparent">
                  انصراف
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
