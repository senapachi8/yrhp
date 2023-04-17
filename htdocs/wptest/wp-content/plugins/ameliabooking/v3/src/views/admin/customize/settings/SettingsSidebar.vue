<template>
  <div class="am-cs">
    <SidebarCardTemplate
      :back-btn-visibility="settingsComponents[componentKey].backBtnVisibility"
      :heading-icon="settingsComponents[componentKey].headingIcon"
      :heading-text="settingsComponents[componentKey].headingText"
      @click="handleClick"
    >
      <component :is="settingsComponents[componentKey].component" :sub-step="settingsComponents[componentKey].subStep"></component>
    </SidebarCardTemplate>
    <div v-if="settingsComponents[componentKey].globalColors" class="am-cs__global-colors" @click="handleClick('colors')">
      {{amLabels.change_colors}} <span class="am-icon-settings"></span>
    </div>

    <AmButton
      v-if="componentKey === 'colors' && colorsExtension.visibility"
      custom-class="am-cs__colors-btn"
      @click="handleClick('colors', 0, colorsExtension.goTo)"
    >
      {{ colorsExtension.string }}
    </AmButton>
  </div>
</template>

<script setup>
// Templates
import SidebarCardTemplate from './template/SidebarCardTemplate.vue'
// Segments
import CustomizationOrder from './segments/CustomizationOrder.vue'
import CustomizationOptions from './segments/CustomizationOptions.vue'
import CustomizationLabels from './segments/CustomizationLabels.vue'
// * Parts
// Common
import CustomizationGlobal from './parts/CustomizationGlobal.vue'
import CustomizationSidebar from './parts/CustomizationSidebar.vue'
import CustomizationColors from './parts/CustomizationColors.vue'
import CustomizationFonts from './parts/CustomizationFonts.vue'
import CustomizationMenu from './menu/CustomizationMenu.vue'

// Step by step
import CustomizationServices from './parts/CustomizationServices.vue'
import CustomizationBringing from './parts/CustomizationBringing.vue'
import CustomizationPackages from './parts/CustomizationPackages.vue'
import CustomizationPackageInfo from './parts/CustomizationPackageInfo.vue'
import CustomizationPackageAppointments from './parts/CustomizationPackageAppointments.vue'
import CustomizationPackageAppointmentsList from './parts/CustomizationPackageAppointmentsList.vue'
import CustomizationExtras from './parts/CustomizationExtras.vue'
import CustomizationDateAndTime from './parts/CustomizationDateAndTime.vue'
import CustomizationRecurringPopup from './parts/CustomizationRecurringPopup.vue'
import CustomizationRecurring from './parts/CustomizationRecurring.vue'
import CustomizationRecurringSummary from './parts/CustomizationRecurringSummary.vue'
import CustomizationInfo from './parts/CustomizationInfo.vue'
import CustomizationPayment from './parts/CustomizationPayment.vue'
import CustomizationCongrats from './parts/CustomizationCongrats.vue'

// Catalog
import CustomizeCategories from './parts/CustomizationCategories.vue'
import CustomizeCategoryItems from './parts/CustomizationCategoryItems.vue'
import CustomizeCategoryService from './parts/CustomizationCategoryService.vue'
import CustomizeCategoryPackage from './parts/CustomizationCategoryPackage.vue'

// * Plugin Licence
let licence = inject('licence')

// * Components
import AmButton from '../../../_components/button/AmButton.vue'

// * Import from Vue
import {
  ref,
  markRaw,
  inject,
  computed
} from 'vue'

// * Labels
let amLabels = inject('labels')

// * Url Params
let urlParams = new URLSearchParams(window.location.search)

let pageRenderKey = inject('pageRenderKey')
let bookableType = inject('bookableType')
let { componentKey, handleClick } = inject('sidebarFunctionality')

let colorsExtension = computed(() => {
  let options = {
    goTo: '',
    visibility: false,
    string: ''
  }

  if (pageRenderKey.value === 'cbf') {
    options.goTo = 'sbsNew'
    options.visibility = true
    options.string = 'Go to Booking Form Colors'
    return options
  }

  if (urlParams.get('current') !== pageRenderKey.value) {
    if (pageRenderKey.value === 'sbsNew') {
      options.goTo = urlParams.get('current')
      options.visibility = true
      options.string = 'Go to Catalog Form Colors'
      return options
    }
  }

  return options
})

let sbsNewSettingsObj = ref({
  menu: {
    component: markRaw(CustomizationMenu),
    backBtnVisibility: false
  },
  global: {
    headingText: amLabels.cb_global_settings_heading,
    component: markRaw(CustomizationGlobal),
    backBtnVisibility: true
  },
  sidebar: {
    headingText: amLabels.cb_sidebar,
    component: markRaw(CustomizationSidebar),
    backBtnVisibility: true
  },
  fonts: {
    headingText: amLabels.fonts,
    component: markRaw(CustomizationFonts),
    backBtnVisibility: true
  },
  colors: {
    headingText: amLabels.colors,
    component: markRaw(CustomizationColors),
    backBtnVisibility: true
  },
  order: {
    headingText: amLabels.cb_field_order_heading,
    component: markRaw(CustomizationOrder),
    backBtnVisibility: true
  },
  options: {
    headingText: amLabels.options,
    component: markRaw(CustomizationOptions),
    backBtnVisibility: true
  },
  labels: {
    headingText: amLabels.labels,
    component: markRaw(CustomizationLabels),
    backBtnVisibility: true
  },
  services: {
    headingText: amLabels.csb_services,
    component: markRaw(CustomizationServices),
    backBtnVisibility: true,
    globalColors: true,
  },
  bringing: {
    headingText: amLabels.bringing_anyone,
    component: markRaw(CustomizationBringing),
    backBtnVisibility: true,
    globalColors: true,
  },
  packages: {
    headingText: amLabels.cpb_package,
    component: markRaw(CustomizationPackages),
    backBtnVisibility: true,
    subStep: computed(() => bookableType.value !== 'package'),
    globalColors: true,
  },
  packageInfo: {
    headingText: amLabels.cpb_package_info,
    component: markRaw(CustomizationPackageInfo),
    backBtnVisibility: true,
    globalColors: true,
  },
  packageAppointments: {
    headingText: amLabels.cpb_appointments_preview,
    component: markRaw(CustomizationPackageAppointments),
    backBtnVisibility: true,
    globalColors: true,
  },
  packageAppointmentsList: {
    headingText: amLabels.cpb_booking_overview,
    component: markRaw(CustomizationPackageAppointmentsList),
    backBtnVisibility: true,
    globalColors: true,
  },
  extras: {
    headingText: amLabels.csb_extras,
    component: markRaw(CustomizationExtras),
    backBtnVisibility: true,
    globalColors: true,
  },
  dateAndTime: {
    headingText: amLabels.csb_date_time,
    component: markRaw(CustomizationDateAndTime),
    backBtnVisibility: true,
    globalColors: true,
  },
  recurringPopup: {
    headingText: amLabels.recurring_popup,
    component: markRaw(CustomizationRecurringPopup),
    backBtnVisibility: true,
    subStep: true,
    globalColors: true,
  },
  recurring: {
    headingText: amLabels.csb_recurring,
    component: markRaw(CustomizationRecurring),
    backBtnVisibility: true,
    globalColors: true,
  },
  recurringSummary: {
    headingText: amLabels.scb_recurring_summary,
    component: markRaw(CustomizationRecurringSummary),
    backBtnVisibility: true,
    globalColors: true,
  },
  info: {
    headingText: amLabels.csb_info_step,
    component: markRaw(CustomizationInfo),
    backBtnVisibility: true,
    globalColors: true,
  },
  payment: {
    headingText: amLabels.csb_payment,
    component: markRaw(CustomizationPayment),
    backBtnVisibility: true,
    globalColors: true,
  },
  congrats: {
    headingText: amLabels.cb_congratulations_heading,
    component: markRaw(CustomizationCongrats),
    backBtnVisibility: true,
    globalColors: true,
  }
})

let cbfSettingsObj = ref({
  menu: {
    component: markRaw(CustomizationMenu),
    backBtnVisibility: false
  },
  global: {
    headingText: amLabels.cb_global_settings_heading,
    component: markRaw(CustomizationGlobal),
    backBtnVisibility: true
  },
  fonts: {
    headingText: amLabels.fonts,
    component: markRaw(CustomizationFonts),
    backBtnVisibility: true
  },
  colors: {
    headingText: amLabels.colors,
    component: markRaw(CustomizationColors),
    backBtnVisibility: true
  },
  order: {
    headingText: amLabels.cb_field_order_heading,
    component: markRaw(CustomizationOrder),
    backBtnVisibility: true
  },
  options: {
    headingText: amLabels.options,
    component: markRaw(CustomizationOptions),
    backBtnVisibility: true
  },
  labels: {
    headingText: amLabels.labels,
    component: markRaw(CustomizationLabels),
    backBtnVisibility: true
  },
  categories: {
    headingText: amLabels.csb_categories,
    component: markRaw(CustomizeCategories),
    backBtnVisibility: true,
    globalColors: true,
  },
  categoryItems: {
    headingText: !licence.isBasic && !licence.isLite ? amLabels.csb_category_items : amLabels.csb_category_services,
    component: markRaw(CustomizeCategoryItems),
    backBtnVisibility: true,
    globalColors: true,
  },
  categoryService: {
    headingText: amLabels.csb_category_service,
    component: markRaw(CustomizeCategoryService),
    backBtnVisibility: true,
    globalColors: true,
  },
  categoryPackage: {
    headingText: amLabels.csb_category_package,
    component: markRaw(CustomizeCategoryPackage),
    backBtnVisibility: true,
    globalColors: true,
  }
})

let settingsComponents = computed(() => {
  if (pageRenderKey.value === 'cbf') return cbfSettingsObj.value

  return sbsNewSettingsObj.value
})
</script>

<script>
export default {
  name: "SettingsSidebar"
}
</script>

<style lang="scss">
@mixin am-cs-block {
  // am - amelia
  // cs - customize settings
  .am-cs {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &__inner {
      padding: 16px;
      border-bottom: 1px solid $shade-250;

      &:last-child {
        border-bottom: none;
      }
    }

    &__card {
      margin-bottom: 8px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    &-part {
      padding: 0 0 16px;

      &__heading {
        font-size: 14px;
        font-weight: 500;
        font-style: normal;
        line-height: 1.42857;
        color: $shade-900;
        padding: 0 16px 8px;
      }
    }

    &__global-colors {
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: flex-end;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: $shade-900;
      padding: 6px 16px 24px;
      background-color: $am-white;

      span {
        font-size: 24px;
        margin-left: 8px;
      }
    }

    &__colors-btn {
      display: flex;
      align-self: center;
      justify-self: center;
      width: calc(100% - 24px);
      margin-bottom: 12px !important;
    }
  }

  .am-dialog-cs {
    --am-h-psb: 100%;
    .el-drawer {
      &__header {
        height: 100px;
        margin: 0;
        padding-top: 48px;
      }

      &__body {
        padding: 0;
      }
    }

    .am-wrapper-sidebar {
      @include media-breakpoint-down(400px) {
        width: 320px;
      }
    }
  }
}

#amelia-app-backend-new {
  @include am-cs-block;
}

</style>