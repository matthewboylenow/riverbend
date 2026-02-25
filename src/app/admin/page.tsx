import type { Metadata } from "next";
import Link from "next/link";
import { Users, Package, ShoppingCart, UserCog } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard",
};

const quickLinks = [
  {
    title: "Staff",
    description: "Manage directors & senior staff",
    href: "/admin/staff",
    icon: Users,
    count: 18,
  },
  {
    title: "Products",
    description: "Manage store inventory",
    href: "/admin/products",
    icon: Package,
    count: 24,
  },
  {
    title: "Orders",
    description: "View and manage orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    count: 0,
  },
  {
    title: "Users",
    description: "Manage admin accounts",
    href: "/admin/users",
    icon: UserCog,
    count: 1,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="group block p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-stone/30 hover:border-camp-red/20"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-camp-red/10 text-camp-red group-hover:bg-camp-red group-hover:text-white transition-all duration-300">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-2xl font-bold text-charcoal">
                  {link.count}
                </span>
              </div>
              <h3 className="font-semibold text-charcoal text-sm">{link.title}</h3>
              <p className="text-xs text-bark mt-0.5">{link.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
