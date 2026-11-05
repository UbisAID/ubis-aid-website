import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Entry point to the live chat. Set NEXT_PUBLIC_CHAT_URL to your chat
 * provider (e.g. a hosted chat page or widget URL). Until then the button
 * falls back to the other contact channels further down the page.
 */
export function ChatLauncher({
  chatUrl,
  labels,
}: {
  chatUrl: string;
  labels: { start: string; hours: string };
}) {
  const href = chatUrl || "#kanaler";
  return (
    <div className="flex flex-col items-start gap-4">
      <a
        href={href}
        className={cn(buttonVariants({ size: "lg" }), "w-full text-xl sm:w-auto")}
        rel={chatUrl ? "noopener" : undefined}
      >
        <MessageCircle aria-hidden="true" className="size-6" />
        {labels.start}
      </a>
      <p className="text-muted-foreground">{labels.hours}</p>
    </div>
  );
}
