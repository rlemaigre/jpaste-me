<template>
  <div class="pane" :style="{...cssVariables}">
    <div class="header">
      <slot name="header"/>
    </div>
    <div class="content">
      <slot name="content"/>
    </div>
  </div>
</template>

<script lang="ts">

import {computed, defineComponent} from "vue";

export default defineComponent({
  components: {},
  props: {
    color: String
  },
  setup(props, context) {
    const cssVariables = computed(() => {
      return {
        "--header-background-color": props.color
      }
    })
    return {
      cssVariables
    }
  }
})
</script>

<style scoped lang="scss">
@import "src/scss/global.scss";

.pane {
  width: 550px;
  height: 420px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background-color: black;

  .header {
    height: 50px;
    flex: none;
    background-color: var(--header-background-color);
    position: relative;
  }

  .content {
    flex: 1;
    min-height: 0;
  }
}

</style>