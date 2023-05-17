export default function ({ app, redirect }) {
  if (!app.$cookies.get("odoo-user")) {
    return redirect("/");
  }
}
