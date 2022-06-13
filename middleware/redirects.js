import redirects from '../customRoutes/redirects.json';

export default async ({ app, redirect }) => {
  const currentPath = app.context.route.fullPath;
  const route = redirects.find(item => item.from === currentPath);

  if (route) {
    redirect(301, route.to);
  }
};

