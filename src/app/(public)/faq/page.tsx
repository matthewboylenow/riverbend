import type { Metadata } from "next";
import FAQClient from "./FAQClient";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Camp Riverbend — registration, transportation, daily schedule, lunch, health and safety, and more.",
};

export default function FAQPage() {
  return <FAQClient />;
}
