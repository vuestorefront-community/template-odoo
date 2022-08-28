/* eslint-disable camelcase */
import { extend } from 'vee-validate';
import { min, email, required, digits, max, confirmed } from 'vee-validate/dist/rules';
import { Plugin } from '@nuxt/types';

const veeValidatePlugin : Plugin = ({ app }) => {
  extend('min', {
    ...min,
    message: field => `${app.i18n.t('This field must have be')} ${field} ${app.i18n.t('digits')}`
  });

  extend('confirmed', {
    ...confirmed,
    message: field => app.i18n.t('This field must have be checked').toString()
  });

  extend('max', {
    ...max,
    message: field => `${app.i18n.t('This field must have be')} ${field}`
  });

  extend('email', {
    ...email,
    message: app.i18n.t('This field must be an email')?.toString()
  });

  extend('digits', {
    ...digits,
    message: field => `${app.i18n.t('This field must have')} ${field} ${app.i18n.t('digits')}`
  });

  extend('required', {
    ...required,
    message: app.i18n.t('This field is required.')?.toString()
  });

};

export default veeValidatePlugin;
