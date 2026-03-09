import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/src/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
        secondary:
          "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
        destructive:
          "border-transparent bg-red-900 text-red-100 hover:bg-red-800",
        outline: "text-zinc-100 border-zinc-800",
        luxury: "border-gold-500/30 bg-gold-500/10 text-gold-400",
        success: "border-green-500/30 bg-green-500/10 text-green-400",
        warning: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & 
  VariantProps<typeof badgeVariants> & {
  children?: React.ReactNode;
};

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
