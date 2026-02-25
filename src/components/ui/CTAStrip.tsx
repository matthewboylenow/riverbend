import { Container } from "./Container";
import { Phone, ArrowRight, FileText } from "lucide-react";
import { EXTERNAL_LINKS } from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface CTAStripProps {
  variant?: "red" | "charcoal" | "forest";
  className?: string;
}

export function CTAStrip({ variant = "red", className }: CTAStripProps) {
  const bgStyles = {
    red: "bg-camp-red",
    charcoal: "bg-charcoal",
    forest: "bg-forest",
  };

  return (
    <section className={cn(bgStyles[variant], "py-0", className)}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/15">
          {/* Visit CTA */}
          <a
            href="tel:9085802267"
            className="group flex items-center gap-4 py-8 md:pr-8 text-white transition-all duration-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-caption text-white/70 text-[0.65rem] mb-0.5">Want to Visit?</p>
              <p className="font-semibold text-sm group-hover:underline underline-offset-2">
                Call us: 908-580-CAMP
              </p>
            </div>
          </a>

          {/* Apply CTA */}
          <a
            href={EXTERNAL_LINKS.camperApp}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 py-8 md:px-8 text-white transition-all duration-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
              <FileText className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-caption text-white/70 text-[0.65rem] mb-0.5">Ready to Join?</p>
              <p className="font-semibold text-sm group-hover:underline underline-offset-2">
                Apply Now!
              </p>
            </div>
            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
          </a>

          {/* Inquiry CTA */}
          <a
            href={EXTERNAL_LINKS.inquiryForm}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 py-8 md:pl-8 text-white transition-all duration-300"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 transition-colors">
              <ArrowRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-caption text-white/70 text-[0.65rem] mb-0.5">Interested?</p>
              <p className="font-semibold text-sm group-hover:underline underline-offset-2">
                Request More Information
              </p>
            </div>
          </a>
        </div>
      </Container>
    </section>
  );
}
