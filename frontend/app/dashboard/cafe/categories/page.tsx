"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [categoriesData, productsData] = await Promise.all([
        api.get("/menu/categories/"),
        api.get("/menu/products/")
      ])
      setCategories(categoriesData)
      setProducts(productsData)
    } catch (error) {
      toast.error("خطا در دریافت اطلاعات")
    } finally {
      setIsLoading(false)
    }
  }

  const getProductCount = (categoryId: number) => {
    return products.filter((p) => p.category === categoryId).length
  }

  const handleOpenDialog = (category?: any) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || "",
      })
    } else {
      setEditingCategory(null)
      setFormData({ name: "", description: "" })
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (editingCategory) {
        const updated = await api.patch(`/menu/categories/${editingCategory.id}/`, formData)
        setCategories(categories.map((c) => c.id === updated.id ? updated : c))
        toast.success("دسته‌بندی با موفقیت ویرایش شد")
      } else {
        const created = await api.post("/menu/categories/", {
          ...formData,
          order: categories.length + 1
        })
        setCategories([...categories, created])
        toast.success("دسته‌بندی جدید با موفقیت اضافه شد")
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast.error("خطا در ذخیره اطلاعات")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) return
    try {
      await api.delete(`/menu/categories/${id}/`)
      setCategories(categories.filter((c) => c.id !== id))
      toast.success("دسته‌بندی حذف شد")
    } catch (error) {
      toast.error("خطا در حذف دسته‌بندی")
    }
  }

  const toggleActive = async (category: any) => {
    try {
      const updated = await api.patch(`/menu/categories/${category.id}/`, {
        is_active: !category.is_active
      })
      setCategories(categories.map((c) => c.id === updated.id ? updated : c))
      toast.success(`${category.name} ${updated.is_active ? 'فعال' : 'غیرفعال'} شد`)
    } catch (error) {
      toast.error("خطا در تغییر وضعیت")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">دسته‌بندی‌ها</h1>
          <p className="text-muted-foreground">
            {categories.length} دسته‌بندی
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4" />
              افزودن دسته‌بندی
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "ویرایش دسته‌بندی" : "افزودن دسته‌بندی"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "اطلاعات دسته‌بندی را ویرایش کنید"
                  : "دسته‌بندی جدید برای محصولات ایجاد کنید"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام دسته‌بندی</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="مثال: نوشیدنی گرم"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">توضیحات</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="توضیح کوتاه..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                انصراف
              </Button>
              <Button onClick={handleSave}>
                {editingCategory ? "ذخیره تغییرات" : "افزودن"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">لیست دسته‌بندی‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`flex items-center gap-4 rounded-lg border border-border p-4 transition-colors ${
                  !category.is_active ? "opacity-50" : ""
                }`}
              >
                {/* Drag Handle */}
                <button className="cursor-grab text-muted-foreground hover:text-foreground">
                  <GripVertical className="h-5 w-5" />
                </button>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{category.name}</h3>
                    {!category.is_active && (
                      <Badge variant="secondary">غیرفعال</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {category.description || "بدون توضیحات"}
                  </p>
                </div>

                {/* Product Count */}
                <div className="text-center">
                  <p className="text-lg font-semibold">
                    {getProductCount(category.id)}
                  </p>
                  <p className="text-xs text-muted-foreground">محصول</p>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                      <Pencil className="ml-2 h-4 w-4" />
                      ویرایش
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toggleActive(category)}>
                      {category.is_active ? (
                        <>
                          <EyeOff className="ml-2 h-4 w-4" />
                          غیرفعال کردن
                        </>
                      ) : (
                        <>
                          <Eye className="ml-2 h-4 w-4" />
                          فعال کردن
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="ml-2 h-4 w-4" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">
                هنوز دسته‌بندی ایجاد نکرده‌اید
              </p>
              <Button
                variant="outline"
                className="mt-4 bg-transparent"
                onClick={() => handleOpenDialog()}
              >
                افزودن اولین دسته‌بندی
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

