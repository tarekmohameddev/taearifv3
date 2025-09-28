import { Card, CardContent } from "@/components/ui/card";

export function PortfolioSection() {
  return (
    <section
      id="portfolio"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted justify-center"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Our Portfolio
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Check out some of the amazing websites built with our platform.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <img
                  alt={`Portfolio item ${i + 1}`}
                  className="aspect-video object-cover w-full"
                  src={`/placeholder.svg?height=300&width=400&text=Project+${i + 1}`}
                />
                <div className="p-4">
                  <h3 className="text-lg font-bold">Project {i + 1}</h3>
                  <p className="text-sm text-muted-foreground">
                    A beautiful website built with our platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
