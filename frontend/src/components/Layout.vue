<template>
  <div class="wrapper">
    <img src="../assets/sky.png" class="sky"/>
    <img src="../assets/bgmini.png" class="bg"/>
    <slot/>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "vue";

export default defineComponent({
  components: {},
  setup() {
    return {}
  }
})

</script>

<style lang="scss" scoped>
@import "src/scss/global.scss";

.wrapper {
  width: 768px;
  margin: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-height: 1024px;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 0;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  overflow: hidden;

  .bg {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: -1;
  }

  .sky {
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
    z-index: -1;
  }
}

</style>
