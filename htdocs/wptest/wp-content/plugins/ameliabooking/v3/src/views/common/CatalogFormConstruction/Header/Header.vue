<template>
  <div class="am-cat__back-btn">
    <AmButton
      :prefix="arrowLeft"
      category="secondary"
      :type="btnType"
      :size="btnSize"
      @click="goBack"
    >
      {{props.btnString}}
    </AmButton>
  </div>
</template>

<script setup>
import AmButton from '../../../_components/button/AmButton.vue'
import IconComponent from '../../../_components/icons/IconComponent.vue'

import {
  defineComponent
} from "vue"

let props = defineProps({
  btnString: {
    type: String,
    default: ''
  },
  btnType: {
    type: String,
    default: 'plain'
  },
  btnSize: {
    type: String,
    default: 'mini'
  }
})

let arrowLeft = defineComponent({
  components: {IconComponent},
  template: `<IconComponent icon="arrow-left"></IconComponent>`
})

let emits = defineEmits(['click'])

function goBack() {
  emits('click')
}
</script>

<script>
export default {
  name: "MainHeader"
}
</script>

<style lang="scss">
@mixin catalog-header {
  .am-cat {
    &__back-btn {
      width: 100%;
    }
  }
}

// Public
.amelia-v2-booking #amelia-container {
  @include catalog-header;
}

// Admin
#amelia-app-backend-new #amelia-container {
  @include catalog-header;
}
</style>