import { CheckCircle2 } from "lucide-react";

export function WhyChooseUsSection() {
  const reasons = [
    "Easy to use dashboard for managing multiple websites",
    "Customizable themes and templates",
    "Comprehensive content management system",
    "Secure and reliable hosting",
    "Excellent customer support",
    "Regular updates and new features",
  ];

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted justify-center">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Why Choose Us
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We provide a comprehensive solution for managing multiple
                websites with ease.
              </p>
            </div>
            <ul className="grid gap-2">
              {reasons.map((reason, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="Why Choose Us"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              src="/placeholder.svg?height=550&width=550"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
