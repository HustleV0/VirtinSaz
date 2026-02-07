"use client"

import LegalPage from "@/components/legal-layout"

export default function TermsPage() {
  return (
    <LegalPage 
      title="شرایط استفاده"
      content={
        <>
          <p>با استفاده از خدمات ویترین ساز، شما موافقت خود را با شرایط زیر اعلام می‌کنید:</p>
          <h2 className="text-xl font-bold mt-8 mb-4">قوانین کلی</h2>
          <p>استفاده از ویترین ساز باید مطابق با قوانین جمهوری اسلامی ایران باشد.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">مالکیت معنوی</h2>
          <p>تمامی حقوق مادی و معنوی پلتفرم ویترین ساز متعلق به این شرکت است.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">تعهدات کاربر</h2>
          <p>کاربر متعهد می‌شود که اطلاعات صحیح را در سامانه وارد کرده و از سوءاستفاده از امکانات پلتفرم خودداری کند.</p>
        </>
      }
    />
  )
}
