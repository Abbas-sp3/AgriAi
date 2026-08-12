import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingLeaf({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center p-4", className)}>
      <Leaf className="h-8 w-8 text-primary animate-leaf-grow" />
    </div>
  );
}
