import LegalPage from "@/components/legal-layout"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "حریم خصوصی | ویترین ساز",
  description: "سیاست‌های حفظ حریم خصوصی و امنیت داده‌های کاربران در ویترین ساز",
}

export default function PrivacyPage() {
  return (
    <LegalPage 
      title="حریم خصوصی"
      content={
        <>
          <p>ما در ویترین ساز به حریم خصوصی شما اهمیت می‌دهیم. در این صفحه توضیح می‌دهیم که چه اطلاعاتی را جمع‌آوری می‌کنیم و چگونه از آن‌ها استفاده می‌کنیم.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">اطلاعات جمع‌آوری شده</h2>
          <p>هنگام ثبت‌نام، ما اطلاعاتی مانند نام، ایمیل و شماره تماس شما را دریافت می‌کنیم تا بتوانیم خدمات بهتری ارائه دهیم.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">استفاده از اطلاعات</h2>
          <p>اطلاعات شما صرفاً برای بهبود تجربه کاربری، اطلاع‌رسانی در مورد آپدیت‌ها و ارائه پشتیبانی استفاده می‌شود.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">امنیت</h2>
          <p>ما از پیشرفته‌ترین پروتکل‌های امنیتی برای محافظت از داده‌های شما استفاده می‌کنیم.</p>
        </>
      }
    />
  )
}
