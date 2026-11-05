import Link from "next/link"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-transparent font-semibold whitespace-nowrap transition-[background-color,color,box-shadow,transform] duration-200 outline-none select-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-sm hover:bg-primary-hover",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary-hover",
        outline:
          "border-2 border-ink/80 bg-transparent text-ink hover:bg-ink hover:text-white",
        soft: "bg-white text-ink shadow-sm ring-1 ring-border hover:bg-muted",
        ghost: "text-ink hover:bg-muted",
        ink: "bg-ink text-white hover:bg-ink/85",
        link: "rounded-md px-0 text-secondary underline underline-offset-4 hover:text-secondary-hover",
      },
      size: {
        default: "min-h-11 px-5 text-base",
        sm: "min-h-10 px-4 text-sm",
        lg: "min-h-13 px-7 text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type Variants = VariantProps<typeof buttonVariants>

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & Variants) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

/** A link styled as a button. Use for navigation; use Button for actions. */
function ButtonLink({
  className,
  variant = "default",
  size = "default",
  external,
  ...props
}: React.ComponentProps<typeof Link> & Variants & { external?: boolean }) {
  const classes = cn(buttonVariants({ variant, size, className }))
  if (external) {
    const { href, ...rest } = props
    return (
      <a
        href={String(href)}
        className={classes}
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      />
    )
  }
  return <Link className={classes} {...props} />
}

export { Button, ButtonLink, buttonVariants }
