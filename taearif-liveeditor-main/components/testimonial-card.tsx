"use client"

import { Quote, Star } from "lucide-react"

type Testimonial = {
  id: string
  quote: string
  name: string
  location?: string
  rating?: number // 1-5
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  const rating = Math.max(0, Math.min(5, t.rating ?? 5))
  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      {/* البطاقة مع مساحة إضافية للـ Quote */}
      <div className="relative flex w-full max-w-xl flex-col rounded-2xl border bg-white p-6 shadow-sm ring-1 ring-black/5 h-[200px]">
        {/* علامة الاقتباس خارج البطاقة */}
        <div className="absolute h-[27px] w-[34px] z-20 top-[-15px] left-0 flex justify-center items-center">
          <Quote className="w-full h-full text-emerald-600" />
        </div>
        {/* حد أقصى لعدد الأسطر لتوحيد الارتفاع */}
        <p className="line-clamp-3 text-md leading-6 text-foreground/90">{t.quote}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="text-end">
            <div className="text-md font-extrabold text-foreground">{t.name}</div>
            {t.location ? <div className="text-md text-muted-foreground">{t.location}</div> : null}
          </div>
          <div className="flex items-center gap-1" aria-label={`تقييم ${rating} من 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`size-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
