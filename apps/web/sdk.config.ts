import { initSDK, buildModule } from '@vue-storefront/sdk';
import {
  OdooModule,
  OdooModuleType
} from '@erpgap/odoo-sdk';

const sdkConfig = {
  odoo: buildModule<OdooModuleType>(OdooModule, {
    apiUrl: 'http://localhost:8181/odoo'
  })
};

export const sdk = initSDK<typeof sdkConfig>(sdkConfig);
