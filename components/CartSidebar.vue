<template>
  <div id="cart">
    <SfSidebar
      :visible="isCartSidebarOpen"
      position="right"
      :title="$t('My Cart')"
      class="sf-sidebar--right"
      @close="toggleCartSidebar"
    >
      <template #content-top>
        <SfProperty
          v-if="totalItems"
          class="sf-property--large cart-summary desktop-only"
          :name="$t('Total items')"
          :value="totalItems"
        />
      </template>
      <transition name="sf-fade" mode="out-in">
        <div v-if="totalItems" key="my-cart" class="my-cart">
          <div class="collected-product-list">
            <transition-group name="sf-fade" tag="div">
              <SfCollectedProduct
                data-cy="collected-product-cart-sidebar"
                v-for="product in products"
                :key="cartGetters.getItemSku(product)"
                :image="
                  $image(
                    cartGetters.getItemImage(product),
                    140,
                    236,
                    cartGetters.getItemImageFilename(product)
                  )
                "
                :title="cartGetters.getItemName(product)"
                :regular-price="
                  $n(cartGetters.getItemPrice(product).regular, 'currency')
                "
                :special-price="
                  cartGetters.getItemPrice(product).regular !==
                  cartGetters.getItemPrice(product).special
                    ? cartGetters.getItemPrice(product).special &&
                      $n(cartGetters.getItemPrice(product).special, 'currency')
                    : ''
                "
                :stock="99999"
                :qty="cartGetters.getItemQty(product)"
                @input="updateItemQty({ product, quantity: $event })"
                @click:remove="removeItem({ product })"
                class="collected-product"
              >
                <template #configuration>
                  <div class="collected-product__properties">
                    <SfProperty
                      v-for="(attribute, key) in cartGetters.getItemAttributes(
                        product,
                        ['color', 'size']
                      )"
                      :key="key"
                      :name="key"
                      :value="attribute"
                    />
                  </div>
                </template>
                <template #actions>
                  <SfButton
                    class="sf-button--text desktop-only"
                    @click="addProductToWishList({ product: product.product })"
                  >
                    {{ $t("Save for later") }}
                  </SfButton>
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
        </div>
        <div v-else key="empty-cart" class="empty-cart">
          <div class="empty-cart__banner">
            <SfImage
              alt="Empty bag"
              class="empty-cart__image"
              src="/icons/empty-cart.svg"
            />
            <SfHeading
              :title="$t('Your bag is empty')"
              :level="2"
              class="empty-cart__heading"
              :description="$t('EmptyCart')"
            />
          </div>
        </div>
      </transition>
      <template #content-bottom>
        <transition name="sf-fade">
          <div v-if="totalItems">
            <SfProperty
              :name="$t('Total price')"
              class="
                sf-property--full-width sf-property--large
                my-cart__total-price
              "
            >
              <template #value>
                <SfPrice :regular="$n(totals.subtotal, 'currency')" />
              </template>
            </SfProperty>

            <nuxt-link :to="localePath('/checkout/shipping')">
              <SfButton
                class="sf-button--full-width color-primary mb-4"
                @click="toggleCartSidebar"
                >{{ $t("GO TO CHECKOUT") }}</SfButton
              >
            </nuxt-link>
            <nuxt-link :to="localePath('/cart')">
              <SfButton
                class="sf-button--full-width color-secondary"
                @click="toggleCartSidebar"
              >
                {{ $t("SEE CART DETAILS") }}
              </SfButton>
            </nuxt-link>
          </div>
          <div v-else>
            <nuxt-link to="/">
              <SfButton
                class="sf-button--full-width color-primary"
                @click="toggleCartSidebar"
                >{{ $t("Go back shopping") }}</SfButton
              >
          </nuxt-link>
          </div>
        </transition>
      </template>
    </SfSidebar>
  </div>
</template>
<script>
import {
  SfSidebar,
  SfHeading,
  SfButton,
  SfIcon,
  SfProperty,
  SfPrice,
  SfCollectedProduct,
  SfImage
} from '@storefront-ui/vue';
import { computed } from '@nuxtjs/composition-api';
import {
  useCart,
  useUser,
  cartGetters,
  useWishlist
} from '@vue-storefront/odoo';
import { useUiState, useUiNotification } from '~/composables';
import { onSSR } from '@vue-storefront/core';

export default {
  name: 'Cart',
  components: {
    SfSidebar,
    SfButton,
    SfHeading,
    SfIcon,
    SfProperty,
    SfPrice,
    SfCollectedProduct,
    SfImage
  },
  setup() {
    const { isCartSidebarOpen, toggleCartSidebar } = useUiState();
    const { cart, removeItem, updateItemQty } = useCart();
    const { isAuthenticated } = useUser();
    const products = computed(() => cartGetters.getItems(cart.value));
    const totals = computed(() => cartGetters.getTotals(cart.value));
    const cartItems = computed(() => {
      return cartGetters.getItems(cart.value).map((item) => {
        return item.quantity
      })
    })
    const totalItems = computed(() => {
      let array = cartItems.value
      let sum = 0
      array.forEach((num) => {
        sum += num;
      })
      return sum
    });
    const { addItem: addItemToWishlist } = useWishlist();
    const { send } = useUiNotification();
    onSSR(async () => {
      // await loadCart();
    });

    const addProductToWishList = (product) => {
      addItemToWishlist({
        product: { ...product.product, firstVariant: product.product.id }
      });
      send({ message: "Product added to wishlist", type: 'info' });
    };

    return {
      isAuthenticated,
      products,
      removeItem,
      updateItemQty,
      isCartSidebarOpen,
      toggleCartSidebar,
      totals,
      totalItems,
      cartGetters,
      addProductToWishList
    };
  }
};
</script>

<style lang="scss" scoped>
#cart {
  @include for-desktop {
    & > * {
      --sidebar-bottom-padding: var(--spacer-base);
      --sidebar-content-padding: var(--spacer-base);
    }
  }
}
.cart-summary {
  margin-top: var(--spacer-xl);
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    margin: 0;
  }
  &__total-price {
    --price-font-size: var(--font-size--xl);
    --price-font-weight: var(--font-weight--medium);
    margin: 0 0 var(--spacer-base) 0;
  }
}
.empty-cart {
  --heading-description-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-weight--semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  &__heading {
    padding: 0 var(--spacer-base);
  }
  &__image {
    --image-width: 13.1875rem;
    margin: 0 0 var(--spacer-xl) 7.5rem;
    @include for-desktop {
      --image-width: 23.3125rem;
      margin: 0 0 var(--spacer-2xl) 7.5rem;
    }
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-size--xl);
    --heading-title-margin: 0 0 var(--spacer-sm) 0;
  }
}
.collected-product-list {
  flex: 1;
}
.collected-product {
  margin: 0 0 var(--spacer-sm) 0;
  --image-height: 12.5rem;
  &__properties {
    margin: var(--spacer-xs) 0 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    flex: 2;
    &:first-child {
      margin-bottom: 8px;
    }
  }
  &__actions {
    transition: opacity 150ms ease-in-out;
  }
  &__save,
  &__compare {
    --button-padding: 0;
    &:focus {
      --cp-save-opacity: 1;
      --cp-compare-opacity: 1;
    }
  }
  &__save {
    opacity: var(--cp-save-opacity, 0);
  }
  &__compare {
    opacity: var(--cp-compare-opacity, 0);
  }
  &:hover {
    --cp-save-opacity: 1;
    --cp-compare-opacity: 1;
    @include for-desktop {
      .collected-product__properties {
        display: none;
      }
    }
  }
}
</style>
