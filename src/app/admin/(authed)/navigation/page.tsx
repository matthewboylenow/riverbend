import type { Metadata } from "next";
import NavigationEditor from "./NavigationEditor";

export const metadata: Metadata = {
  title: "Navigation",
};

export default function NavigationAdminPage() {
  return <NavigationEditor />;
}
