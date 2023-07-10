<template>
  <SfTopBar class="topbar">
    <template #left>
      <SfButton class="sf-button--text">{{ $t('Help & FAQs') }}</SfButton>
    </template>
    <template #center>
      <p>{{ $t('Download') }}</p>
      <SfButton class="topbar__button sf-button--text">{{ $t('Find out more') }}</SfButton>
    </template>
    <template #right>
      <LocaleSelector />
    </template>
  </SfTopBar>
</template>

<script>
import { SfButton, SfTopBar } from '@storefront-ui/vue';
import LocaleSelector from './LocaleSelector';

export default {
  components: {
    SfTopBar,
    SfButton,
    LocaleSelector
  }
};

</script>
<style lang="scss" scoped>
.topbar {
  position: relative;
  &__button {
    margin: 0 0 0 var(--spacer-xs);
  }
}
</style>


<!-- <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 38px;
          "
        >
          <SfInput
            id="email-smartphone"
            name="email-smartphone"
            class="sf-input--outline"
            type="text"
            placeholder="Type your email address"
            style="
              width: 242px;
              min-height: auto;
              height: 32px;
              font-size: 16px;
              color: #43464e;
              background-color: #f1f2f3;
              --input-border-color: #f1f2f3;
            "
          />
          <SfButton style="width: 116px; height: 32px">Subscribe</SfButton>
        </div> -->