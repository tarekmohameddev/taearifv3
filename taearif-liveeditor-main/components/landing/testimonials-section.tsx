import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "CEO, TechStart",
      content:
        "This platform has transformed how we manage our multiple websites. It's intuitive, powerful, and has saved us countless hours.",
      avatar: "SJ",
    },
    {
      name: "Michael Chen",
      role: "Marketing Director, GrowthHub",
      content:
        "The multi-tenancy features are exactly what we needed. We can now manage all our client websites from a single dashboard.",
      avatar: "MC",
    },
    {
      name: "Emily Rodriguez",
      role: "Founder, DesignCraft",
      content:
        "I'm impressed with how easy it is to customize each website while maintaining a consistent brand across all our properties.",
      avatar: "ER",
    },
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 justify-center">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              What Our Customers Say
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't just take our word for it. Here's what our customers have to
              say about our platform.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 mt-8">
          {testimonials.map((testimonial, i) => (
            <Card key={i} className="relative overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${testimonial.avatar}`}
                    />
                    <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
