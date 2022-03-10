<template>
  <div :class="['readings', {light}]" v-if="clipped.length > 0" :style="cssVariables">
    <div class="reading" v-for="reading in clipped">
      <div class="romaji">{{ reading.type === 'kun' ? reading.romaji.toLowerCase() : reading.romaji }}
        {{ Math.round(reading.count) }}%
      </div>
      <div class="outline">
        <div class="inner" :style="{width: reading.count + '%'}"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent, PropType} from "vue";
import {ReadingStat} from "../ts/schema";

export default defineComponent({
  components: {},
  props: {
    readings: Array as PropType<ReadingStat[]>,
    light: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: 3
    }
  },
  setup(props, context) {
    const sorted = computed(() => {
      if (props.readings) {
        return [...props.readings].filter(r => r.count && r.count > 0).sort((a, b) => a.count > b.count ? -1 : 1);
      } else {
        return [];
      }
    })
    const clipped = computed(() => sorted.value.slice(0, props.max));
    const cssVariables = computed(() => {
      return {
        '--line-bg-color': props.light ? 'rgba(0,0,0,0.15)' : 'rgba(255, 255, 255, 0.3)',
        '--text-color': props.light ? 'black' : 'white'
      };
    })
    return {
      clipped,
      cssVariables
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.readings {
  //background-color: rgba(255, 255, 255, 0.20);
  //order-radius: 5px;
  //border: 1px solid rgba(255, 255, 255, 0.25);
  position: relative;
  color: var(--text-color);

  .icon {
    position: absolute;
    left: 3px;
    top: 3px;
  }

  &.light {
    .reading {
      font-size: 14px;
      padding: 4px 0;
    }
  }

  .reading {
    font-size: 11px;

    .romaji {
      display: flex;
      justify-content: center;
      line-height: 28px;
    }

    .outline {
      height: 2px;
      background-color: var(--line-bg-color);
      position: relative;

      .inner {
        position: absolute;
        height: 100%;
        left: 0;
        top: 0;
        background-color: var(--orange-color);
      }
    }
  }
}
</style>