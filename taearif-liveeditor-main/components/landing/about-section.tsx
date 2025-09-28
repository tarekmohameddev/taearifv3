export function AboutSection() {
  return (
    <section
      id="about"
      className="w-full py-12 md:py-24 lg:py-32 justify-center"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                About Our Platform
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                We're on a mission to make website management simple and
                efficient for businesses of all sizes.
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                 Taearif platform was built with the modern business in
                mind. We understand the challenges of managing multiple online
                presences, and we've created a solution that simplifies the
                process.
              </p>
              <p className="text-muted-foreground">
                With our platform, you can create and manage multiple websites,
                each with its own unique domain, content, and design, all from a
                single dashboard. This means less time spent on technical
                details and more time focused on growing your business.
              </p>
              <p className="text-muted-foreground">
                We're committed to providing a secure, reliable, and
                user-friendly platform that empowers businesses to establish and
                grow their online presence with ease.
              </p>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              alt="About Us"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              src="/placeholder.svg?height=550&width=550"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
