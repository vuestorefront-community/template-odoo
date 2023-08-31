import { sdk } from '@/sdk.config';
import '@erpgap/odoo-sdk-api-client';

export const useNewsletter: any = () => {
  const loading = ref(false);

  const sendSubscription = async (email: string) => {
    // const { data } = await sdk.odoo.subscribeNewsLetter({
    //   email: email,
    // });
    // return data.newsletterSubscribe;
  };

  return {
    loading,
    sendSubscription,
  };
};
