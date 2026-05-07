import type { Metadata } from "next";
import SettingsForm from "./SettingsForm";

export const metadata: Metadata = {
  title: "Site Settings",
};

export default function SettingsPage() {
  return <SettingsForm />;
}
