<template>
  <Layout>
    <router-view v-slot="{ Component, route }">
      <transition :name="transitionName" :duration="300">
        <keep-alive include="AnonymousPasteView">
          <component :is="Component" :key="route.path"/>
        </keep-alive>
      </transition>
    </router-view>
  </Layout>
</template>

<script lang="ts">

import {computed, defineComponent} from "vue";
import Layout from "./components/Layout.vue";
import {nav} from "./ts/globals";
import AnonymousPasteView from "./components/views/AnonymousPasteView.vue";

export default defineComponent({
  components: {Layout, AnonymousPasteView},
  setup() {
    const transitionName = computed(() => {
      switch (nav.value) {
        case "LANDING":
          return null;
        case "BACK":
          return 'backward';
        case "FORWARD":
        case "LINK":
          return 'forward';
      }
    })
    return {
      transitionName,
      AnonymousPasteView
    }
  }
})

</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;1,200;1,300;1,400;1,500;1,600;1,700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap');

@import "src/scss/global.scss";

:root {
  --blue-color: #1c80cf;
  --orange-color: #f57c00;
  --red-color: rgb(215, 26, 33);
  --background-color: rgb(230, 230, 230);
  --site-max-width: 1280px;
}

body {
  margin: 0;
  font-family: 'Montserrat', sans-serif;
  font-weight: 400;
  font-size: 14px;
  background-color: var(--background-color);
}

body, html {
  height: 100%;
}

#app {
  height: 100%;
}

.jp-font {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 300;
}

a, span.link {
  text-decoration: none;
  position: relative;
  cursor: pointer;
  color: #0d4582;

  &:hover:after {
    content: '';
    position: absolute;
    bottom: -2px;
    border-bottom: 1px solid #0d4582;
    left: 0;
    right: 0;
  }
}

.tippy-box[data-theme~='jpasteme-word'] {
  background-color: black;

  .tippy-content {
    padding: 5px;
  }
}

body {
  ::-webkit-scrollbar {
    width: 9px;
    height: 9px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
  }

  ::-webkit-scrollbar-track {
    background: rgb(230, 230, 230);
    border-radius: 10px;
  }
}

</style>

<style lang="scss" scoped>

@import "src/scss/global.scss";

::v-deep(.comp) {
  transform: none;
  opacity: 1;
}

::v-deep(.comp) {
  &.forward-enter-active, &.forward-leave-active, &.backward-enter-active, &.backward-leave-active {
    transition: 0.3s opacity, 0.3s transform;
  }

  &.forward-enter-from {
    opacity: 0;
    transform: translate(150px, 0);
  }

  &.forward-leave-to {
    opacity: 0;
    transform: translate(-150px, 0);
  }

  &.backward-enter-from {
    opacity: 0;
    transform: translate(-150px, 0);
  }

  &.backward-leave-to {
    opacity: 0;
    transform: translate(150px, 0);
  }
}
</style>
