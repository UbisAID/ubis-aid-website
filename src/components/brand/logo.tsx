import Image from "next/image";
import { cn } from "@/lib/utils";
import logo from "../../../public/brand/ubis-aid-logo.png";
import mark from "../../../public/brand/ubis-aid-mark.png";

/*
 * Ubis AID logo. The artwork is navy and red on a transparent background,
 * so it must only be placed on light surfaces (cream, white, light tints).
 * Never put it on bg-ink, bg-secondary, bg-primary or photos.
 */

/** Full logo: emblem + "Ubis AID" wordmark. */
export function Logo({ alt, className, priority }: { alt: string; className?: string; priority?: boolean }) {
  return (
    <Image
      src={logo}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      sizes="120px"
      className={cn("h-12 w-auto", className)}
    />
  );
}

/** Emblem only (boat in the circle), for tight spaces. */
export function LogoMark({ alt = "", className }: { alt?: string; className?: string }) {
  return <Image src={mark} alt={alt} sizes="48px" className={cn("size-12", className)} />;
}
