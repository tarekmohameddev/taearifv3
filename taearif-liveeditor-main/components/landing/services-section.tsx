import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Layout, ShieldCheck } from "lucide-react";

export function ServicesSection() {
  return (
    <section
      id="services"
      className="w-full py-12 md:py-24 lg:py-32 bg-muted justify-center"
    >
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Our Services
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We provide a comprehensive suite of services to help you build and
              manage your online presence.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          <Card>
            <CardHeader className="pb-2">
              <Globe className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Multi-Tenancy Websites</CardTitle>
              <CardDescription>
                Create and manage multiple websites from a single dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Our platform allows you to create and manage multiple websites
                with unique domains, content, and designs.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <Layout className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Content Management</CardTitle>
              <CardDescription>
                Easily manage your website content with our intuitive CMS.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Update your website content, images, and settings without any
                technical knowledge.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <ShieldCheck className="h-12 w-12 mb-2 text-primary" />
              <CardTitle>Secure & Reliable</CardTitle>
              <CardDescription>
                Your websites are secure and always available.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                We provide top-notch security and reliability to ensure your
                websites are always available and secure.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
