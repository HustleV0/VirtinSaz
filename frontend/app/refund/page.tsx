"use client"

import LegalPage from "@/components/legal-layout"

export default function RefundPage() {
  return (
    <LegalPage 
      title="شرایط بازگشت وجه"
      content={
        <>
          <p>ما به کیفیت خدمات خود اطمینان داریم، با این حال شرایط بازگشت وجه به شرح زیر است:</p>
          <h2 className="text-xl font-bold mt-8 mb-4">مهلت درخواست</h2>
          <p>تا ۷ روز پس از خرید اشتراک، در صورت نارضایتی می‌توانید درخواست بازگشت وجه دهید.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">شرایط بازگشت</h2>
          <p>وجه تنها به حسابی که پرداخت با آن انجام شده است بازگردانده می‌شود.</p>
          <h2 className="text-xl font-bold mt-8 mb-4">فرآیند انجام</h2>
          <p>بررسی درخواست‌های بازگشت وجه بین ۳ تا ۵ روز کاری زمان می‌برد.</p>
        </>
      }
    />
  )
}
