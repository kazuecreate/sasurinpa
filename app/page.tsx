import { redirect } from "next/navigation";

import { getSessionProfile } from "@/lib/session";

/** トップに来たら、ログイン状態とロールを見て振り分ける。 */
export default async function Home() {
  const profile = await getSessionProfile();

  if (!profile) redirect("/login");

  redirect(profile.role === "admin" ? "/admin" : "/dashboard");
}
