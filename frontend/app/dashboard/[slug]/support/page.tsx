"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  Send,
  HelpCircle,
  FileText,
  ExternalLink,
  CheckCircle2,
  Loader2
} from "lucide-react"

const initialFaqs = [
  {
    question: "چگونه می‌توانم منوی خود را ویرایش کنم؟",
    answer: "از بخش محصولات در داشبورد می‌توانید محصولات جدید اضافه کنید، قیمت‌ها را تغییر دهید یا دسته‌بندی‌ها را مدیریت کنید.",
  },
  {
    question: "آیا می‌توانم طرح اشتراک خود را تغییر دهم؟",
    answer: "بله، از بخش اشتراک می‌توانید در هر زمان طرح خود را ارتقا یا تنزل دهید. تغییرات از دوره بعدی اعمال می‌شود.",
  },
  {
    question: "کد QR من کار نمی‌کند، چه کنم؟",
    answer: "مطمئن شوید که کد QR با کیفیت مناسب چاپ شده و آسیب ندیده است. همچنین بررسی کنید که اشتراک شما فعال باشد.",
  },
  {
    question: "چگونه دامنه اختصاصی اضافه کنم؟",
    answer: "در طرح حرفه‌ای، از بخش تنظیمات > دامنه می‌توانید دامنه اختصاصی خود را اضافه و تنظیم کنید.",
  },
]

const initialTickets = [
  {
    id: "#1234",
    subject: "مشکل در آپلود تصویر",
    status: "answered",
    date: "۱۴۰۴/۱۱/۰۵",
  },
  {
    id: "#1198",
    subject: "درخواست فاکتور رسمی",
    status: "closed",
    date: "۱۴۰۴/۱۰/۲۸",
  },
]

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [tickets, setTickets] = useState(initialTickets)
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    category: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.subject || !formData.message) {
      toast.error("لطفاً موضوع و متن پیام را وارد کنید.")
      return
    }

    setIsSending(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSending(false)
      const newTicket = {
        id: `#${Math.floor(1000 + Math.random() * 9000)}`,
        subject: formData.subject,
        status: "pending",
        date: new Date().toLocaleDateString('fa-IR')
      }
      setTickets([newTicket, ...tickets])
      setSubmitted(true)
      toast.success("تیکت شما با موفقیت ثبت شد.")
      setFormData({ subject: "", message: "", category: "" })
      
      // Reset submitted state after 5 seconds to show form again
      setTimeout(() => setSubmitted(false), 5000)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">پشتیبانی</h1>
        <p className="text-muted-foreground mt-1">
          سوالی دارید؟ ما اینجاییم تا کمک کنیم
        </p>
      </div>

      {/* Contact Info */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ایمیل</p>
              <p className="font-medium" dir="ltr">support@vitrinsaz.ir</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">تلفن</p>
              <p className="font-medium" dir="ltr">۰۲۱-۱۲۳۴۵۶۷۸</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">ساعات پاسخگویی</p>
              <p className="font-medium">شنبه تا پنج‌شنبه ۹-۱۸</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* New Ticket Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              ارسال تیکت جدید
            </CardTitle>
            <CardDescription>
              سوال یا مشکل خود را مطرح کنید، در اسرع وقت پاسخ می‌دهیم
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-semibold text-lg mb-2">تیکت شما ثبت شد</h3>
                <p className="text-muted-foreground text-sm">
                  به زودی پاسخ شما را از طریق ایمیل ارسال می‌کنیم
                </p>
                <Button variant="link" onClick={() => setSubmitted(false)} className="mt-4">
                  ارسال تیکت دیگر
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">دسته‌بندی</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(v) => setFormData({...formData, category: v})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technical">مشکل فنی</SelectItem>
                      <SelectItem value="billing">مالی و پرداخت</SelectItem>
                      <SelectItem value="feature">درخواست قابلیت</SelectItem>
                      <SelectItem value="other">سایر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">موضوع</Label>
                  <Input 
                    id="subject" 
                    placeholder="موضوع تیکت را وارد کنید" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">پیام</Label>
                  <Textarea 
                    id="message" 
                    placeholder="توضیحات کامل مشکل یا سوال خود را بنویسید..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="attachment">پیوست (اختیاری)</Label>
                  <Input id="attachment" type="file" />
                  <p className="text-xs text-muted-foreground">
                    حداکثر اندازه فایل: ۵ مگابایت
                  </p>
                </div>

                <Button type="submit" className="w-full gap-2" disabled={isSending}>
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  ارسال تیکت
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Previous Tickets */}
        <Card>
          <CardHeader>
            <CardTitle>تیکت‌های قبلی</CardTitle>
            <CardDescription>
              تاریخچه مکاتبات شما با پشتیبانی
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tickets.length > 0 ? (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                {tickets.map((ticket) => (
                  <div 
                    key={ticket.id}
                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-all cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-muted-foreground">{ticket.id}</span>
                        <Badge 
                          variant={
                            ticket.status === "answered" ? "default" : 
                            ticket.status === "pending" ? "secondary" : "outline"
                          }
                          className={ticket.status === "pending" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" : ""}
                        >
                          {ticket.status === "answered" ? "پاسخ داده شده" : 
                           ticket.status === "pending" ? "در انتظار بررسی" : "بسته شده"}
                        </Badge>
                      </div>
                      <p className="font-medium">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground">{ticket.date}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground border rounded-lg border-dashed">
                هنوز تیکتی ثبت نکرده‌اید
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            سوالات متداول
          </CardTitle>
          <CardDescription>
            پاسخ سریع به سوالات رایج
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {initialFaqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Documentation Link */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <FileText className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">مستندات و راهنما</h3>
                <p className="text-sm text-muted-foreground">
                  راهنمای کامل استفاده از ویترین ساز
                </p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <ExternalLink className="h-4 w-4" />
              مشاهده مستندات
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
