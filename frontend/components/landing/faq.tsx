"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqs = [
  {
    question: "آیا برای استفاده از ویترین ساز نیاز به دانش فنی دارم؟",
    answer: "خیر، ویترین ساز به گونه‌ای طراحی شده که هر کسی بدون نیاز به دانش فنی می‌تواند وبسایت خود را بسازد. فقط کافی است اطلاعات و تصاویر محصولات خود را وارد کنید.",
  },
  {
    question: "آیا می‌توانم دامنه اختصاصی خود را متصل کنم؟",
    answer: "بله، در پلن‌های حرفه‌ای و سازمانی می‌توانید دامنه اختصاصی خود را به وبسایت متصل کنید. همچنین یک زیردامنه رایگان از vitrinsaz.ir نیز در اختیار شما قرار می‌گیرد.",
  },
  {
    question: "پرداخت هزینه اشتراک چگونه است؟",
    answer: "پرداخت از طریق درگاه‌های امن بانکی انجام می‌شود. می‌توانید اشتراک ماهانه یا سالانه (با تخفیف) انتخاب کنید.",
  },
  {
    question: "آیا امکان سفارش آنلاین وجود دارد؟",
    answer: "بله، مشتریان شما می‌توانند محصولات را مشاهده کرده و از طریق واتساپ یا تلفن سفارش دهند. سیستم سفارش آنلاین کامل به زودی اضافه خواهد شد.",
  },
  {
    question: "آیا می‌توانم قالب را تغییر دهم؟",
    answer: "بله، هر زمان که بخواهید می‌توانید قالب وبسایت خود را عوض کنید یا رنگ‌ها و فونت‌ها را شخصی‌سازی کنید.",
  },
  {
    question: "اگر راضی نباشم چه؟",
    answer: "ما ۷ روز ضمانت بازگشت وجه ارائه می‌دهیم. اگر به هر دلیلی راضی نبودید، می‌توانید درخواست بازگشت وجه دهید.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            سوالات متداول
          </h2>
          <p className="text-lg text-muted-foreground">
            پاسخ سوالات رایج درباره ویترین ساز
          </p>
        </motion.div>

        {/* FAQ Accordion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-right text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}
