"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { 
  ArrowRight, 
  Save, 
  Trash2, 
  ImagePlus, 
  X
} from "lucide-react"
import { api } from "@/lib/api"

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [availableTags, setAvailableTags] = useState<any[]>([])
  const [formData, setFormData] = useState<any>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [product, cats, tags] = await Promise.all([
          api.get(`/menu/products/${id}/`),
          api.get("/menu/categories/"),
          api.get("/menu/tags/"),
        ])
        setFormData({
          ...product,
          category: product.category?.toString(),
          price: product.price?.toString(),
          discount_percentage: product.discount_percentage?.toString(),
        })
        setCategories(cats)
        setAvailableTags(tags)
        setSelectedTagIds(product.tags?.map((t: any) => t.id) || [])
      } catch (error) {
        toast.error("خطا در بارگذاری اطلاعات")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

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

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const data = new FormData()
      data.append("title", formData.title)
      data.append("description", formData.description || "")
      data.append("category", formData.category)
      data.append("price", formData.price)
      data.append("discount_percentage", formData.discount_percentage)
      data.append("badge", formData.badge || "")
      data.append("is_available", String(formData.is_available))
      data.append("is_popular", String(formData.is_popular))
      
      selectedTagIds.forEach(id => {
        data.append("tag_ids", id.toString())
      })

      if (selectedFile) {
        data.append("image", selectedFile)
      }

      await api.patch(`/menu/products/${id}/`, data)
      toast.success("تغییرات با موفقیت ذخیره شد")
    } catch (error) {
      toast.error("خطا در ذخیره تغییرات")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await api.delete(`/menu/products/${id}/`)
      toast.success("محصول با موفقیت حذف شد")
      router.push("/dashboard/products")
    } catch (error) {
      toast.error("خطا در حذف محصول")
    }
  }

  const toggleTag = (tagId: number) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) ? prev.filter(i => i !== tagId) : [...prev, tagId]
    )
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[400px]">در حال بارگذاری...</div>
  }

  if (!formData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-xl font-semibold mb-2">محصول یافت نشد</h2>
        <Button asChild>
          <Link href="/dashboard/products">بازگشت به لیست محصولات</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/products">
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">ویرایش محصول</h1>
            <p className="text-muted-foreground mt-1">{formData.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive hover:text-destructive bg-transparent">
                <Trash2 className="h-4 w-4 ml-2" />
                حذف
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>آیا مطمئن هستید؟</AlertDialogTitle>
                <AlertDialogDescription>
                  این عمل قابل بازگشت نیست. محصول &quot;{formData.title}&quot; برای همیشه حذف خواهد شد.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  حذف محصول
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button className="gap-2" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4" />
            {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات اصلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">نام محصول</Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">توضیحات</Label>
                <Textarea 
                  id="description" 
                  value={formData.description || ""}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="category">دسته‌بندی</Label>
                  <Select 
                    value={formData.category?.toString()}
                    onValueChange={(value) => setFormData({...formData, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="badge">تگ محصول (Badge)</Label>
                  <Input 
                    id="badge" 
                    value={formData.badge || ""} 
                    onChange={(e) => setFormData({...formData, badge: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>قیمت‌گذاری</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">قیمت (تومان)</Label>
                  <Input 
                    id="price" 
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    dir="ltr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">درصد تخفیف</Label>
                  <Input 
                    id="discount" 
                    type="number"
                    value={formData.discount_percentage}
                    onChange={(e) => setFormData({...formData, discount_percentage: e.target.value})}
                    dir="ltr"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>برچسب‌های سیستم</CardTitle>
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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>وضعیت</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>موجود</Label>
                  <p className="text-sm text-muted-foreground">
                    آیا این محصول موجود است؟
                  </p>
                </div>
                <Switch 
                  checked={formData.is_available} 
                  onCheckedChange={(checked) => setFormData({...formData, is_available: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>محبوب</Label>
                  <p className="text-sm text-muted-foreground">
                    نمایش در بخش محبوب‌ها
                  </p>
                </div>
                <Switch 
                  checked={formData.is_popular} 
                  onCheckedChange={(checked) => setFormData({...formData, is_popular: checked})}
                />
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">تاریخ ایجاد</span>
                  <span>{new Date(formData.created_at).toLocaleDateString('fa-IR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image */}
          <Card>
            <CardHeader>
              <CardTitle>تصویر محصول</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="file"
                id="product-image"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Label
                htmlFor="product-image"
                className="relative aspect-square rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary/50 transition-colors overflow-hidden"
              >
                {imagePreview || formData.image ? (
                  <>
                    <img
                      src={imagePreview || formData.image}
                      alt={formData.title}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <ImagePlus className="h-8 w-8 text-white" />
                    </div>
                  </>
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">آپلود تصویر</span>
                  </>
                )}
              </Label>
              {(imagePreview || formData.image) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setSelectedFile(null)
                    setImagePreview(null)
                    setFormData({ ...formData, image: null })
                  }}
                >
                  <Trash2 className="h-4 w-4 ml-2" />
                  حذف تصویر
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
