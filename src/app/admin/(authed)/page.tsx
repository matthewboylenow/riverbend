import type { Metadata } from "next";
import Link from "next/link";
import { Users, Package, ShoppingCart, UserCog, Tag } from "lucide-react";
import { db } from "@/lib/db";
import { staffMembers, products, orders, adminUsers, categories } from "@/lib/db/schema";
import { count, eq, sql } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

async function getCounts() {
  const [staffCount, productCount, orderCount, userCount, categoryCount, pendingCount] = await Promise.all([
    db.select({ n: count() }).from(staffMembers).where(eq(staffMembers.isActive, true)),
    db.select({ n: count() }).from(products).where(eq(products.isActive, true)),
    db.select({ n: count() }).from(orders),
    db.select({ n: count() }).from(adminUsers),
    db.select({ n: count() }).from(categories),
    db.select({ n: count() }).from(orders).where(sql`${orders.status} IN ('pending', 'pending_invoice')`),
  ]);
  return {
    staff: staffCount[0]?.n ?? 0,
    products: productCount[0]?.n ?? 0,
    orders: orderCount[0]?.n ?? 0,
    pendingOrders: pendingCount[0]?.n ?? 0,
    users: userCount[0]?.n ?? 0,
    categories: categoryCount[0]?.n ?? 0,
  };
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const tiles = [
    { title: "Staff", description: "Manage directors & senior staff", href: "/admin/staff", icon: Users, count: counts.staff },
    { title: "Products", description: "Manage store inventory", href: "/admin/products", icon: Package, count: counts.products },
    { title: "Categories", description: "Shop categories", href: "/admin/categories", icon: Tag, count: counts.categories },
    { title: "Orders", description: `${counts.pendingOrders} pending`, href: "/admin/orders", icon: ShoppingCart, count: counts.orders },
    { title: "Users", description: "Manage admin accounts", href: "/admin/users", icon: UserCog, count: counts.users },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-charcoal mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {tiles.map((link) => {
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
                <span className="text-2xl font-bold text-charcoal">{link.count}</span>
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
