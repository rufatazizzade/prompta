import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
