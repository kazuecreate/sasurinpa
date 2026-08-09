import { redirect } from "next/navigation";

/** 管理画面のトップは受講生管理へ送る。 */
export default function AdminHome() {
  redirect("/admin/students");
}
