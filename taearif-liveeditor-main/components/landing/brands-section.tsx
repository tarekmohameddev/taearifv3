export function BrandsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 justify-center">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Trusted by Brands
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our platform is trusted by brands of all sizes.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <img
                alt={`Brand ${i + 1}`}
                className="h-12 object-contain"
                src={`/placeholder.svg?height=48&width=120&text=Brand+${i + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
