<template>
  <div class="comp">
    <img src="../../assets/logomini.png" class="logo"/>
    <div class="description">
      <div class="title">A Japanese reading buddy</div>
      <div class="subtitle">
        JPaste.me helps you read Japanese text and assimilate its kanji and vocabulary. Paste your text in the box below
        and hit submit to generate reading aids, kanji and vocabulary listings.
      </div>
    </div>
    <Textarea v-model="text" class="textarea"></Textarea>
    <div @click="submit" class="button p-ripple" v-ripple>Submit</div>
  </div>
</template>

<script lang="ts">

import {defineComponent, ref} from "vue";
import {useRouter} from "vue-router";
import Layout from "../Layout.vue";
import {text as globalText} from "../../ts/globals"

export default defineComponent({
  components: {Layout},
  setup() {
    const router = useRouter();
    const text = ref(globalText.value);

    function submit() {
      globalText.value = text.value;
      router.push({
        path: "/paste/anonymous"
      })
    }

    return {
      text,
      submit
    }
  }
})

</script>

<style lang="scss" scoped>
@import "src/scss/global.scss";

.comp {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.logo {
  width: 100%;
  display: block;
}

.description {
  text-align: center;

  .title {
    font-size: 35px;
    font-weight: 800;
    padding-bottom: 20px;
  }

  .subtitle {
    padding-bottom: 40px;
  }
}

.textarea {
  width: calc(100% - 40px);
  height: 150px;
  margin: 0 20px 20px 20px;

  &:focus {
    box-shadow: none;
    border-width: 2px;
  }
}

.button {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  border-radius: 50%;
  width: 90px;
  height: 90px;
  color: white;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  background-color: var(--red-color);
  position: relative;
  box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.4);

  &:hover:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    top: 0;
    left: 0;
  }
}

</style>
