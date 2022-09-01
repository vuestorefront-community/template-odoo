const path = require('path');
import productRoutes from './customRoutes/products.json';
import categoryRoutes from './customRoutes/categories.json';
export function getRoutes(themeDir = __dirname) {
  return [
    {
      name: 'home',
      path: '/',
      component: path.resolve(themeDir, 'pages/Home.vue')
    },
    ...productRoutes.map(item => ({
      name: item.name,
      path: item.path,
      component: path.resolve(themeDir, 'pages/Product.vue')
    })),
    ...categoryRoutes.map(item => ({
      name: item.name,
      path: item.path,
      component: path.resolve(themeDir, 'pages/Category.vue')
    })),
    {
      name: 'cart',
      path: '/cart',
      component: path.resolve(themeDir, 'pages/Cart.vue')
    },
    {
      name: 'checkout',
      path: '/checkout',
      component: path.resolve(themeDir, 'pages/Checkout.vue'),
      children: [
        {
          path: 'shipping',
          name: 'shipping',
          component: path.resolve(themeDir, 'pages/Checkout/Shipping.vue')
        },
        {
          path: 'billing',
          name: 'billing',
          component: path.resolve(themeDir, 'pages/Checkout/Billing.vue')
        },
        {
          path: 'payment',
          name: 'payment',
          component: path.resolve(themeDir, 'pages/Checkout/Payment.vue')
        },
        {
          path: 'thank-you',
          name: 'thank-you',
          component: path.resolve(themeDir, 'pages/Checkout/ThankYou.vue')
        }
      ]
    },
    {
      name: 'my-profile',
      path: '/my-account',
      component: path.resolve(themeDir, 'pages/MyAccount.vue')
    }
  ];
}
