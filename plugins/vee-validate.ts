/* eslint-disable camelcase */
import { extend } from 'vee-validate';
import { min, email, required, digits, max, confirmed } from 'vee-validate/dist/rules';
import { Plugin } from '@nuxt/types';

const veeValidatePlugin : Plugin = ({ i18n }) => {
  extend('min', {
    ...min,
    message: field => `${i18n.t('This field must have be')} ${field} ${i18n.t('digits')}`
  });

  extend('confirmed', {
    ...confirmed,
    message: field => i18n.t('This field must have be checked').toString()
  });

  extend('max', {
    ...max,
    message: field => `${i18n.t('This field must have be')} ${field}`
  });

  extend('email', {
    ...email,
    message: i18n.t('This field must be an email')?.toString()
  });

  extend('digits', {
    ...digits,
    message: field => `${i18n.t('This field must have')} ${field} ${i18n.t('digits')}`
  });

  extend('required', {
    ...required,
    message: i18n.t('This field is required.')?.toString()
  });

};

export default veeValidatePlugin;
