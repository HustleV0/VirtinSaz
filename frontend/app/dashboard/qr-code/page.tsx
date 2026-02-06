"use client"

import { useState, useMemo } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Download, QrCode, Palette, Settings2, ExternalLink, Copy, Check } from "lucide-react"

export default function QRCodePage() {
  const [size, setSize] = useState([256])
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [copied, setCopied] = useState(false)
  const [format, setFormat] = useState("png")

  // Stable QR pattern
  const qrPattern = useMemo(() => {
    return Array.from({ length: 49 }).map((_, i) => {
      const isCorner = (i < 3 || (i >= 4 && i < 7) || i === 7 || i === 13 || i === 14 || i === 20 || 
        i === 28 || i === 34 || i === 35 || i === 41 || i === 42 || i >= 46)
      return { isCorner, isDark: isCorner || Math.random() > 0.5 }
    })
  }, [])

  const websiteUrl = "https://menusaz.ir/r/cafe-nazeri"

  const handleCopyLink = () => {
    navigator.clipboard.writeText(websiteUrl)
    setCopied(true)
    toast.success("لینک منو کپی شد")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = (type: string) => {
    toast.success(`در حال آماده‌سازی فایل ${type.toUpperCase()}...`)
    setTimeout(() => {
      toast.success("دانلود آغاز شد")
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">کد QR</h1>
        <p className="text-muted-foreground mt-1">
          کد QR منوی خود را دانلود کنید و روی میزها قرار دهید
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              پیش‌نمایش کد QR
            </CardTitle>
            <CardDescription>
              مشتریان با اسکن این کد به منوی شما دسترسی پیدا می‌کنند
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-6">
            <div 
              className="p-6 rounded-xl border-2 border-dashed border-border"
              style={{ backgroundColor: bgColor }}
            >
              {/* QR Code Placeholder - In production, use a QR library */}
              <div 
                className="grid grid-cols-7 gap-1"
                style={{ width: size[0], height: size[0] }}
              >
                {qrPattern.map((cell, i) => (
                  <div
                    key={i}
                    className="rounded-sm transition-colors duration-300"
                    style={{
                      backgroundColor: cell.isDark ? fgColor : bgColor,
                      aspectRatio: "1/1",
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="w-full space-y-3">
              <Label className="text-sm text-muted-foreground">لینک منو</Label>
              <div className="flex gap-2">
                <Input 
                  value={websiteUrl} 
                  readOnly 
                  className="font-mono text-sm"
                  dir="ltr"
                />
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              تنظیمات کد QR
            </CardTitle>
            <CardDescription>
              ظاهر کد QR را مطابق برند خود سفارشی کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="style" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="style">
                  <Palette className="h-4 w-4 ml-2" />
                  استایل
                </TabsTrigger>
                <TabsTrigger value="download">
                  <Download className="h-4 w-4 ml-2" />
                  دانلود
                </TabsTrigger>
              </TabsList>

              <TabsContent value="style" className="space-y-6 mt-6">
                {/* Size */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>اندازه</Label>
                    <span className="text-sm text-muted-foreground">{size[0]}px</span>
                  </div>
                  <Slider
                    value={size}
                    onValueChange={setSize}
                    min={128}
                    max={512}
                    step={32}
                  />
                </div>

                {/* Foreground Color */}
                <div className="space-y-3">
                  <Label>رنگ کد</Label>
                  <div className="flex gap-3">
                    <Input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-3">
                  <Label>رنگ پس‌زمینه</Label>
                  <div className="flex gap-3">
                    <Input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="font-mono"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Preset Colors */}
                <div className="space-y-3">
                  <Label>رنگ‌های پیشنهادی</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { fg: "#000000", bg: "#ffffff", name: "کلاسیک" },
                      { fg: "#1a1a2e", bg: "#f5f5f5", name: "مدرن" },
                      { fg: "#2d3436", bg: "#dfe6e9", name: "خاکستری" },
                      { fg: "#6c5ce7", bg: "#ffffff", name: "بنفش" },
                    ].map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setFgColor(preset.fg)
                          setBgColor(preset.bg)
                        }}
                        className="gap-2"
                      >
                        <div 
                          className="w-4 h-4 rounded border"
                          style={{ backgroundColor: preset.fg }}
                        />
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="download" className="space-y-6 mt-6">
                {/* Format Selection */}
                <div className="space-y-3">
                  <Label>فرمت فایل</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="png">PNG (پیشنهادی)</SelectItem>
                      <SelectItem value="svg">SVG (برداری)</SelectItem>
                      <SelectItem value="pdf">PDF (چاپ)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Download Buttons */}
                <div className="space-y-3">
                  <Button className="w-full gap-2" onClick={() => handleDownload(format)}>
                    <Download className="h-4 w-4" />
                    دانلود کد QR
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full gap-2 bg-transparent"
                    onClick={() => handleDownload(format)}
                  >
                    <Download className="h-4 w-4" />
                    دانلود با لوگو
                  </Button>
                </div>

                {/* Usage Tips */}
                <div className="rounded-lg bg-muted p-4 space-y-2">
                  <p className="font-medium text-sm">نکات استفاده:</p>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>برای چاپ با کیفیت بالا از فرمت SVG یا PDF استفاده کنید</li>
                    <li>حداقل اندازه پیشنهادی برای چاپ: 3x3 سانتی‌متر</li>
                    <li>از کنتراست مناسب بین رنگ کد و پس‌زمینه اطمینان حاصل کنید</li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Table Cards Section */}
      <Card>
        <CardHeader>
          <CardTitle>کدهای QR میزها</CardTitle>
          <CardDescription>
            برای هر میز یک کد QR اختصاصی ایجاد کنید (قابلیت پلن حرفه‌ای)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 p-4 rounded-lg border bg-card hover:border-primary/50 transition-colors"
              >
                <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-10 w-10 text-muted-foreground" />
                </div>
                <span className="font-medium">میز {i + 1}</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-transparent"
                  onClick={() => handleDownload("png")}
                >
                  دانلود
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
