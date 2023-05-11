const canEnterShipping = (cart) => cart?.order?.orderLines?.length > 0 || false;

const canEnterBiling = (cart) => {
  const checkShippingAddress = cart?.order.partnerShipping.id && cart?.order.partnerShipping.street;
  return canEnterShipping(cart) && checkShippingAddress;
};

const canEnterPayment = (cart) => {
  const checkInvoiceAddress = cart?.order.partnerInvoice.id && cart?.order.partnerInvoice.street;
  return canEnterShipping(cart) && canEnterBiling(cart) && checkInvoiceAddress;
};

export default async ({ app, $vsf, redirect }) => {
  const currentPath = app.context.route.fullPath.split('/checkout/')[1];

  if (!currentPath) return;

<<<<<<< HEAD
  const { data } = await $vsf.$odoo.api.redisSyncCartToOdoo();
  if (!data.cart) return;

  switch (currentPath) {
    case 'shipping':
      if (!canEnterShipping(data.cart)) {
=======
  const { data }  = await $vsf.$odoo.api.cartLoad();
  const { cart } = data
  
  if (!cart) return;

  switch (currentPath) {
    case 'shipping':
      if (!canEnterShipping(cart)) {
>>>>>>> b93150b (16038)
        redirect('/');
      }
      break;
    case 'billing':
<<<<<<< HEAD
      if (!canEnterBiling(data.cart)) {
=======
      if (!canEnterBiling(cart)) {
>>>>>>> b93150b (16038)
        redirect('/');
      }
      break;
    case 'payment':
<<<<<<< HEAD
      if (!canEnterPayment(data.cart)) {
=======
      if (!canEnterPayment(cart)) {
>>>>>>> b93150b (16038)
        redirect('/');
      }
      break;
  }
};
