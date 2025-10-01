import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const [dir, setDir] = React.useState("ltr");
  const progressRef = React.useRef(null);

  React.useEffect(() => {
    if (progressRef.current) {
      setDir(window.getComputedStyle(progressRef.current).direction);
    }
  }, []);

  const translateValue =
    dir === "rtl" ? 100 - (value ?? 0) : -(100 - (value ?? 0));

  return (
    <ProgressPrimitive.Root
      ref={(el) => {
        progressRef.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(${translateValue}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
