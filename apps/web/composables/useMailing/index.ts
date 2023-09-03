import { sdk } from '@/sdk.config';

export const useMailing: any = () => {
  const loading = ref(false);
  const mailingList = useState<any[]>('mailingList');
  const mailingContacts = useState<any[]>('mailingContacts');
  const sendSubscription = async (email: string) => {
    // const { data } = await sdk.odoo.subscribeNewsLetter({
    //   email: email,
    // });
    // return data.newsletterSubscribe;
  };

  const getMailingLists = async () => {
    loading.value = true;
    try {
      const { data } = await sdk.odoo.getMailingLists();
      mailingList.value = data?.mailingLists?.mailingLists;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const getMailingContacts = async () => {
    loading.value = true;

    try {
      const { data } = await sdk.odoo.getMailingContacts();
      mailingContacts.value = data?.mailingContacts?.mailingContacts;
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }
  };

  const userAddMultipleMailing = async (mailings: any) => {
    loading.value = true;

    try {
      // const response = await sdk.odoo.addMultipleMailings({ mailings });
      // const { data } = response;
      // if (data) {
      //   return data;
      // }
    } catch (error) {
      console.log(error);
    } finally {
      loading.value = false;
    }

    return {
      loading,
      sendSubscription,
      mailingList,
      mailingContacts,
      getMailingLists,
      getMailingContacts,
      userAddMultipleMailing,
    };
  };
};
