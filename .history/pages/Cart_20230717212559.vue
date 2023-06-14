<template>
  <div id="detailed-cart">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    />
    <SfLoader :loading="loading">
    <div class="detailed-cart">
      <div class="detailed-cart__main">
        <transition name="sf-fade" mode="out-in">
          <div
            v-if="totalItemsInCartWithQuantity"
            key="detailed-cart"
            class="collected-product-list"
          >
            <transition-group name="sf-fade" tag="div">
              <SfCollectedProduct
                v-for="orderLine in orderLines"
                :key="cartGetters.getItemSku(orderLine)"
                :title="cartGetters.getItemName(orderLine)"
                :regular-price="$n(cartGetters.getItemPrice(orderLine).regular, 'currency')"
                :special-price="
                  cartGetters.getItemPrice(orderLine).regular !==
                  cartGetters.getItemPrice(orderLine).special
                    ? cartGetters.getItemPrice(orderLine).special &&
                      $n(cartGetters.getItemPrice(orderLine).special, 'currency')
                    : ''
                "
                :stock="99999"
                :qty="cartGetters.getItemQty(orderLine)"
                @input="updateItemQty(orderLine.id,  $event)"
                :link="localePath(productGetters.getSlug(orderLine.product))"
                class="sf-collected-product--detailed collected-product"
              >
              <template #image>
                <nuxt-link :to="localePath(productGetters.getSlug(orderLine.product))">
                  <SfImage
                    class="sf-product-card__image"
                    :src="$image(
                      productGetters.getCoverImage(orderLine.product),
                      140,
                      236,
                      productGetters.getImageFilename(orderLine.product)
                    )"
                    :alt="productGetters.getName(orderLine.product)"
                    loading="eager"
                    :width="140"
                    :height="236"
                    image-tag="nuxt-img"
                    :nuxt-img-config="{ fit: 'cover', preload: true }"
                  />
                </nuxt-link>
              </template>
                <template #remove>
                  <span class="desktop-only">
                    <SfButton
                      class="sf-button--text custom__text"
                      @click="removeItem(orderLine.id)"
                      >{{ $t("Remove from cart") }}</SfButton
                    >
                  </span>
                  <span class="smartphone-only">
                    <SfButton
                      class="sf-button--text custom-text__mobile"
                      @click="removeItem(orderLine.id)"
                      >
                       X
                      </SfButton
                    >
                  </span>
                </template>

                <template #actions>
                  <div class="actions desktop-only">
                    <SfButton
                      @click="
                        addProductToWishList({ product: orderLine.product })
                      "
                      class="sf-button--text actions__button custom__margin"
                      >{{ $t("Save for later") }}</SfButton
                    >
                    <span class="actions__description">
                      {{
                        $t(
                          "Usually arrives in 5-13 business days. A shipping timeline specific to your destination can be viewed in Checkout."
                        )
                      }}
                    </span>
                  </div>
                </template>

                <template #configuration>
                  <div class="collected-product__properties">
                    <SfProperty
                      v-for="(attribute, key) in cartGetters.getItemAttributes(
                        orderLine,
                        ['color', 'size']
                      )"
                      :key="key"
                      :name="key"
                      :value="attribute"
                    />
                  </div>
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
          <div v-else key="empty-cart" class="empty-cart">
            <SfImage
              :src="require('@storefront-ui/shared/icons/empty_cart.svg')"
              alt="Empty cart"
              class="empty-cart__image"
            />
            <SfHeading
              :title="$t('Your cart is empty')"
              :level="2"
              :description="
                $t(
                  'Looks like you haven\'t added any items to the cart yet. Start shopping to fill it in.'
                )
              "
            />
            <nuxt-link to="/">
              <SfButton
                class="sf-button--full-width color-primary empty-cart__button"
                >{{ $t("Start shopping") }}</SfButton
              >
            </nuxt-link>
          </div>
        </transition>
      </div>
      <div v-if="totalItemsInCartWithQuantity" class="detailed-cart__aside">
        <SfOrderSummary
          :products="orderLines"
          :orderTitle="$t('Totals')"
          :total-items="totalItemsInCartWithQuantity"
          class="oderSummary"
        >
          <template #summary>
            <div v-for="item in summary" :key="item.name" class="mb-3 px-7">
              <SfProperty
                :name="$t(item.name)"
                class="
                  sf-property--full-width sf-property--large
                  my-cart__total-price
                  property-data
                "
              >
                <template #value>
                  <span class="card__text" v-if="item.name === 'Products'">
                    {{ item.value.value }}</span
                  >
                  <span
                    class="card__text"
                    v-else-if="item.name === 'Sub Total'"
                  >
                    <!-- ${{ item.value.value.subtotal.toFixed(2) }} -->
                    </span
                  >
                  <span class="card__text" v-else-if="item.name === 'Shipping'">
                    {{ $t(item.value) }}</span
                  >
                  <span class="card__text" v-else> {{ item.value }}</span>
                </template>
              </SfProperty>
            </div>

            <div class="my-7 px-7">
              <hr />
            </div>
            <div class="mb-5 px-7">
              <SfProperty class="sf-property--full-width sf-property--large">
                <template #name>
                  <span class="card__text">{{ $t("Total Price") }}:</span>
                </template>
                <template #value>
                  <span class="card__text"> {{ $n(amountTotal, 'currency') }}</span>
                </template>
              </SfProperty>
            </div>
          </template>
          <template #promo>
            <div>
              <div>
                <nuxt-link :to="localePath('/checkout/shipping')">
                  <SfButton class="color-primary custom__width">{{
                    $t("GO TO CHECKOUT")
                  }}</SfButton>
                </nuxt-link>
              </div>
              <div class="my-5">
                <SfButton
                  class="color-black custom__width"
                  @click="$router.go(-1)"
                  >{{ $t("GO BACK SHOPPING") }}</SfButton
                >
              </div>
              <div class="mb-3 hidden">
                <div class="custom__row">
                  <div class="mr-4">
                    <img src="../assets/email.svg" />
                  </div>
                  <div>
                    <SfButton class="sf-button--text">
                      {{ $t("Send my basket to email") }}</SfButton
                    >
                  </div>
                </div>
              </div>

              <div class="custom__con">
                <div class="bottom__text">
                  {{ $t("Helpful information") }}: <br />
                  <span class="text-primary">•</span>
                  {{ $t("Questions? Chat with us or call 1.888.282.6060.") }}
                  <br />
                  <span class="text-primary">•</span>
                  {{
                    $t(
                      "Shipping internationally? Choose your destination & currency."
                    )
                  }}<br />
                  <span class="text-primary">•</span>
                  {{ $t("Shipping methods & charges.") }} <br />
                </div>
              </div>
            </div>
          </template>
        </SfOrderSummary>
      </div>
    </div>
    </SfLoader>
  </div>
</template>
<script>
import {
  SfCollectedProduct,
  SfButton,
  SfImage,
  SfProperty,
  SfHeading,
  SfBreadcrumbs,
  SfOrderSummary,
  SfLoader
} from '@storefront-ui/vue';
import { ref } from '@nuxtjs/composition-api';
import { computed, onMounted } from '@nuxtjs/composition-api';
import {
  useUser,
  cartGetters,
  productGetters,
  useWishlist,
  useCartRedis
} from '@vue-storefront/odoo';
import { useUiState, useUiNotification } from '~/composables';
import { onSSR } from '@vue-storefront/core';
export default {
  name: 'DetailedCart',
  components: {
    SfCollectedProduct,
    SfBreadcrumbs,
    SfImage,
    SfButton,
    SfHeading,
    SfProperty,
    SfOrderSummary,
    SfLoader
  },
  setup(_, { root }) {
    // simple test submodule 3
    const { isAuthenticated } = useUser();
    const { cart, loading, load, removeItem, updateItemQty, totalItemsInCartWithQuantity, amountTotal } = useCartRedis();
    const { isCartSidebarOpen, toggleCartSidebar } = useUiState();

    const orderLines = computed(() => cart.value.orderLines);

    const { send } = useUiNotification();
    const { addItem: addItemToWishlist } = useWishlist();

    onSSR(async () => {
      await load();
    });

    const addProductToWishList = (orderLine) => {
      addItemToWishlist({
        product: {
          ...orderLine.product,
          firstVariant: { id: orderLine.product.id }
        }
      });
      send({ message: 'Product added to wishlist', type: 'info' });
    };

    const summary = ref([
      {
        name: 'Products',
        value: totalItemsInCartWithQuantity
      },
      {
        name: 'Sub Total',
        value: amountTotal
      },
      {
        name: 'Shipping',
        value: 'Free'
      }
    ]);
    const breadcrumbs = [
      {
        text: root.$t('Home'),
        link: '/'
      },
      {
        text: root.$t('Cart'),
        link: '#'
      }
    ];

    return {
      loading,
      isAuthenticated,
      orderLines,
      updateItemQty,
      amountTotal,
      isCartSidebarOpen,
      toggleCartSidebar,
      removeItem,
      breadcrumbs,
      totalItemsInCartWithQuantity,
      summary,
      cartGetters,
      addProductToWishList,
      productGetters
    };
  }
};
</script>
<style lang="scss" scoped>
#detailed-cart {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
    padding: 0 var(--spacer-sm);
  }
}
.breadcrumbs {
  padding: var(--spacer-base) 0;
}
.sf-order-summary {
  &__heading {
    --heading-title-margin: 0 0 var(--spacer-xl) 0;
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-title-margin: 0 0 var(--spacer-xl) 30px;
    --heading-title-font-size: var(--h3-font-size);
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
    }
  }
  &__property {
    margin: var(--spacer-base) 0;
    --property-name-font-weight: var(--font-weight--medium);
    --property-value-font-weight: var(--font-weight--bold);
    &:last-of-type {
      margin: var(--spacer-base) 0 var(--spacer-xl);
      --property-name-color: var(--c-text);
    }
  }
  &__divider {
    --divider-border-color: var(--c-white);
    --divider-margin: var(--spacer-xl) 0 0 0;
  }
  &__promo-code {
    &-input {
      --input-background: var(--c-white);
      --input-label-font-size: var(--font-size--base);
      flex: 1;
    }
    &-button {
      --button-height: 1.875rem;
    }
  }
  &__characteristics {
    &-item {
      margin: var(--spacer-base) 0;
      &:last-of-type {
        margin: 0;
      }
    }
  }
}
.detailed-cart {
  &__main {
    padding: 0 var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
  }
  &__aside {
    box-sizing: border-box;
    width: 100%;
    background: var(--c-light);
    padding: var(--spacer-base) var(--spacer-sm);
  }
  @include for-desktop {
    display: flex;
    &__main {
      flex: 1;
    }
    &__aside {
      flex: 0 0 26.8125rem;
      order: 1;
      margin: 0 0 0 var(--spacer-xl);
      padding: var(--spacer-xl) 26px var(--spacer-xl) 26px;
    }
  }
}
.collected-product {
  --collected-product-padding: var(--spacer-sm) 0;
  --collected-product-actions-display: flex;
  border: 1px solid var(--c-light);
  border-width: 1px 0 0 0;
  &:first-of-type {
    border-top: none;
  }
  &__properties {
    --property-value-font-weight: var(--font-weight--normal);
    margin: var(--spacer-sm) 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 2;
  }
  @include for-mobile {
    --collected-product-remove-bottom: var(--spacer-sm);
  }
  @include for-desktop {
    --collected-product-padding: var(--spacer-lg) 0;
  }
}
.actions {
  &__button {
    display: block;
    margin: 0 0 var(--spacer-xs) 0;
    color: var(--c-text);
    &:hover {
      color: var(--c-text-muted);
    }
  }
  &__description {
    font-family: var(--font-family--primary);
    font-size: var(--font-size--sm);
    font-weight: var(--font-weight--light);
    color: var(--c-text-muted);
    position: absolute;
    bottom: 0;
    padding-bottom: var(--spacer-lg);
  }
}

.custom__text {
  color: #72757e;
}
.custom-text__mobile {
  color: #72757e;
  text-decoration: none;
  font-size: 20px;
}
.custom__text:hover {
  color: #5ece7b;
}
hr {
  height: 1px;
  background-color: white;
  border: none;
}
.card__text {
  color: black;
  font-size: 16px;

  font-family: Raleway;
  font-style: normal;
  font-weight: 600;
}

.custom__width {
  width: 100%;
}

.bottom__text {
  /* Desktop Bullet Text */

  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  font-size: 16px;
  line-height: 35px;
  /* or 137% */

  /* Black Secondary */

  color: #43464e;
}

.custom__col {
  display: flex;
  align-items: flex-start;
}

.custom__row {
  display: flex;
  justify-content: center;
  align-items: center;
}

.empty-cart {
  --heading-title-color: var(--c-primary);
  --heading-title-margin: 0 0 var(--spacer-base) 0;
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__image {
    --image-width: 13.1875rem;
    margin: var(--spacer-2xl) 0;
  }
  @include for-desktop {
    &__image {
      --image-width: 22rem;
    }
    &__button {
      --button-width: 20.9375rem;
    }
  }
}
</style>
