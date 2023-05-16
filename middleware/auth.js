export default function ({ app, redirect }) {
  console.log(app.$cookies.get("odoo-user"))
  if (!app.$cookies.get("odoo-user")) {
    return redirect("/");
  }
}
