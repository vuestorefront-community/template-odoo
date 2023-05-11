<template>
  <SfTabs :open-tab="1">
    <SfTab title="My orders">
      <div v-if="currentOrder">
        <SfButton
          class="sf-button--text all-orders"
          @click="currentOrder = null"
          >All Orders</SfButton
        >
        <div class="highlighted highlighted--total">
          <SfProperty
            :name="$t('Order ID')"
            :value="orderGetters.getId(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('Date')"
            :value="orderGetters.getDate(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('Status')"
            :value="orderGetters.getStatus(currentOrder)"
            class="sf-property--full-width property"
          />
          <SfProperty
            :name="$t('Total')"
            :value="$n(orderGetters.getPrice(currentOrder), 'currency')"
            class="sf-property--full-width property"
          />
        </div>
        <SfTable class="products">
          <SfTableHeading>
            <SfTableHeader class="products__name">{{
              $t('Product')
            }}</SfTableHeader>
            <SfTableHeader>{{ $t('Quantity') }}</SfTableHeader>
            <SfTableHeader>{{ $t('Price') }}</SfTableHeader>
          </SfTableHeading>
          <SfTableRow
            v-for="(item, i) in orderGetters.getItems(currentOrder)"
            :key="i"
          >
            <SfTableData class="products__name">
              <nuxt-link :to="productGetters.getSlug(item.product)">
                {{ orderGetters.getItemName(item) }}
              </nuxt-link>
            </SfTableData>
            <SfTableData>{{ orderGetters.getItemQty(item) }}</SfTableData>
            <SfTableData>{{
              $n(orderGetters.getItemPrice(item), 'currency')
            }}</SfTableData>
          </SfTableRow>
        </SfTable>
      </div>
      <div v-else>
        <p class="message">
          {{ $t('Details and status orders') }}
        </p>
        <div v-if="orders.length === 0" class="no-orders">
          <p class="no-orders__title">
            {{ $t('You currently have no orders') }}
          </p>
        </div>
        <SfTable v-else class="orders">
          <SfTableHeading>
            <SfTableHeader
              v-for="(tableHeader, index) in tableHeaders"
              :key="index"
              >{{ $t(tableHeader) }}</SfTableHeader
            >
            <SfTableHeader class="orders__element--right">
              <span class="smartphone-only">{{ $t('Download') }}</span>
              <SfButton
                class="desktop-only sf-button--text orders__download-all"
                @click="downloadOrders()"
              >
                {{ $t('Download all') }}
              </SfButton>
            </SfTableHeader>
          </SfTableHeading>
          <SfTableRow v-for="order in orders" :key="orderGetters.getId(order)">
            <SfTableData>{{ orderGetters.getId(order) }}</SfTableData>
            <SfTableData>{{ orderGetters.getDate(order) }}</SfTableData>
            <SfTableData>{{
              $n(orderGetters.getPrice(order), 'currency')
            }}</SfTableData>
            <SfTableData>
              <span :class="getStatusTextClass(order)">{{
                orderGetters.getStatus(order)
              }}</span>
            </SfTableData>
            <SfTableData class="orders__view orders__element--right">
              <SfButton
                class="sf-button--text smartphone-only"
                @click="downloadOrder(order)"
              >
                {{ $t('Download') }}
              </SfButton>
              <SfButton
                class="sf-button--text desktop-only"
                @click="currentOrder = order"
              >
                {{ $t('View details') }}
              </SfButton>
            </SfTableData>
          </SfTableRow>
        </SfTable>
        <p>{{ $t('Total orders') }} - {{ totalOrders }}</p>
      </div>
    </SfTab>
  </SfTabs>
</template>

<script>
import { SfTabs, SfTable, SfButton, SfProperty } from '@storefront-ui/vue';
import { computed, ref } from '@nuxtjs/composition-api';
import {
  useUserOrder,
  orderGetters,
  productGetters
} from '@vue-storefront/odoo';
import { AgnosticOrderStatus } from '@vue-storefront/core';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'order-history',
  components: {
    SfTabs,
    SfTable,
    SfButton,
    SfProperty
  },
  setup() {
    const { orders, search } = useUserOrder();
    const currentOrder = ref(null);

    onSSR(async () => {
      await search();
    });

    const tableHeaders = ['Order ID', 'Payment date', 'Amount', 'Status'];

    const getStatusTextClass = (order) => {
      const status = orderGetters.getStatus(order);
      switch (status) {
        case AgnosticOrderStatus.Open:
          return 'text-warning';
        case AgnosticOrderStatus.Complete:
          return 'text-success';
        default:
          return '';
      }
    };

    const downloadFile = (file, name) => {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';

      const url = window.URL.createObjectURL(file);
      a.href = url;
      a.download = name;
      a.click();
      window.URL.revokeObjectURL(url);
    };

    const downloadOrders = async () => {
      downloadFile(
        new Blob([JSON.stringify(orders.value)], { type: 'application/json' }),
        'orders.json'
      );
    };

    const downloadOrder = async (order) => {
      downloadFile(
        new Blob([JSON.stringify(order)], { type: 'application/json' }),
        'order ' + orderGetters.getId(order) + '.json'
      );
    };

    return {
      tableHeaders,
      orders: computed(() => (orders ? orders.value : [])),
      totalOrders: computed(() => orderGetters.getOrdersTotal(orders.value)),
      getStatusTextClass,
      orderGetters,
      downloadOrder,
      downloadOrders,
      currentOrder,
      productGetters
    };
  }
};
</script>

<style lang='scss' scoped>
@import '~/assets/css/account/orderHistory.scss';
</style>
