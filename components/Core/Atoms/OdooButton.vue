<template>
  <SfButton :class="classes" v-bind="$props" @click="$emit('click')">
    <span style="grid-column-start: 2" class="pr-3"><slot /> </span>
    <div v-show="loading" class="lds-ring">
      <div />
      <div />
      <div />
      <div />
    </div>
  </SfButton>
</template>

<script lang="ts">
import { SfButton } from '@storefront-ui/vue';
import {
  defineComponent,
  PropType,
  ComputedRef,
  computed,
} from '@nuxtjs/composition-api';
import {
  ButtonColor,
  ButtonShape,
  ButtonSize,
  ButtonType,
} from '@vue-storefront/odoo-api';
export default defineComponent({
  components: {
    SfButton,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    link: {
      type: [String, Object],
      default: null,
    },
    styleType: {
      type: String as PropType<ButtonType>,
      default: ButtonType.Primary,
    },
    shape: {
      type: String as PropType<ButtonShape>,
      default: ButtonShape.Round,
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: ButtonSize.Small,
    },
    color: {
      type: String as PropType<ButtonColor>,
      default: ButtonColor.Green,
    },
  },
  emits: ['click'],
  setup(props) {
    const typeClasses: ComputedRef<string> = computed(() => {
      if (
        props.styleType === ButtonType.Primary &&
        props.shape === ButtonShape.Round &&
        props.color === ButtonColor.Green
      ) {
        return 'bg-pine-primary-dark-green__with-hover big-text font-semibold';
      }
      if (
        props.styleType === ButtonType.Primary &&
        props.shape === ButtonShape.Rectangle &&
        props.color === ButtonColor.Green
      ) {
        return 'bg-primary-green';
      }
      if (
        props.styleType === ButtonType.Primary &&
        props.color === ButtonColor.Black
      ) {
        return 'bg-primary-black big-text font-semibold';
      }
      if (
        props.styleType === ButtonType.Tertiary &&
        props.color === ButtonColor.Grey
      ) {
        return 'bg-neutral-600 text-white';
      }
      if (props.styleType === ButtonType.Danger) {
        return 'bg-red-600 text-white';
      }

      switch (props.styleType) {
        case ButtonType.Secondary:
          return 'bg-fern-primary-medium-green__with-hover';
        default:
          break;
      }
    });

    const classes: ComputedRef<string> = computed(
      () =>
        `btn ${
          typeClasses.value
        } ${props.shape.toLowerCase()} ${props.size.toLowerCase()} cursor-pointer`
    );

    return {
      classes,
    };
  },
});
</script>

<style lang="scss" scoped>
.is-disabled--button {
  color: var(--disabled-grey-color);
  background: var(--disabled-grey-background);
}

.lds-ring {
  margin-left: 85%;
  display: inline-block;
  position: absolute;

  width: 16px;
  height: 16px;
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 16px;
  height: 16px;
  //margin: 0px 6px 0px 11px;
  border: 4px solid white;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: white transparent transparent transparent;
}

.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
