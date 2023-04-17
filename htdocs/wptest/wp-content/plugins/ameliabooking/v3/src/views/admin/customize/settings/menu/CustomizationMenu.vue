<template>
  <div class="am-cs-menu">
    <div class="am-cs-menu__inner">
      <div class="am-cs-menu__inner-header">
        <span class="am-icon-settings"></span>
        {{amLabels.settings}}
      </div>
      <AmSettingsCard
        :header="amLabels.cb_global_settings_heading"
        :content="amLabels.csb_global_settings_content"
        @click="handleClick('global')"
      ></AmSettingsCard>
    </div>
    <div v-if="pageRenderKey === 'sbsNew'" class="am-cs-menu__inner">
      <div class="am-cs-menu__inner-header">
        <span class="am-icon-box"></span>
        {{amLabels.cb_section}}
      </div>
      <AmSettingsCard
        :header="amLabels.cb_sidebar"
        :content="amLabels.csb_sidebar_content"
        @click="handleClick('sidebar')"
      ></AmSettingsCard>
    </div>
    <div class="am-cs-menu__inner">
      <div class="am-cs-menu__inner-header">
        <span class="am-icon-steps"></span>
        {{amLabels.steps}}
      </div>
      <AmSettingsCard
        v-for="card in settingsCardArray"
        :key="card.heading"
        class="am-cs-menu__card"
        :header="card.heading"
        :content="card.content"
        @click="handleClick(card.trigger, card.index, card.goToPage)"
      ></AmSettingsCard>
    </div>
  </div>
</template>

<script setup>
import AmSettingsCard from "../../../../_components/settings-card/AmSettingsCard";
// * import from Vue
import {
  ref,
  inject,
  computed
} from 'vue';

// * Plugin Licence
let licence = inject('licence')

let pageRenderKey = inject('pageRenderKey')

let { handleClick, parentPath } = inject('sidebarFunctionality')
parentPath.value = 'menu'

// * Labels
let amLabels = inject('labels')

let serviceAppointmentArray = [
  {
    heading: amLabels.csb_services,
    content: amLabels.csb_services_content,
    trigger: 'services',
    index: 0,
  },
  {
    heading: amLabels.csb_extras,
    content: amLabels.csb_extras_content,
    trigger: 'extras',
    index: 1
  },
  {
    heading: amLabels.csb_date_time,
    content: amLabels.csb_date_time_content,
    trigger: 'dateAndTime',
    index: 2
  },
  {
    heading: amLabels.csb_recurring,
    content: amLabels.csb_recurring_content,
    trigger: 'recurring',
    index: 3
  },
  {
    heading: amLabels.scb_recurring_summary,
    content: amLabels.scb_recurring_summary_content,
    trigger: 'recurringSummary',
    index: 4
  },
  {
    heading: amLabels.csb_info_step,
    content: amLabels.csb_info_step_content,
    trigger: 'info',
    index: 5
  },
  {
    heading: amLabels.csb_payment,
    content: amLabels.csb_payment_content,
    trigger: 'payment',
    index: 6
  },
  {
    heading: amLabels.cb_congratulations_heading,
    content: amLabels.cpb_congratulations_content,
    trigger: 'congrats',
    index: 7
  }
]

let packagesAppointmentArray = [
  {
    heading: amLabels.cpb_package,
    content: amLabels.cpb_package_content,
    trigger: 'packages',
    index: 0
  },
  {
    heading: amLabels.cpb_package_info,
    content: amLabels.cpb_package_info_content,
    trigger: 'packageInfo',
    index: 1
  },
  {
    heading: amLabels.cpb_appointments_preview,
    content: amLabels.cpb_appointments_preview_content,
    trigger: 'packageAppointments',
    index: 2
  },
  {
    heading: amLabels.cpb_booking_overview,
    content: amLabels.cpb_booking_overview_content,
    trigger: 'packageAppointmentsList',
    index: 3
  },
  {
    heading: amLabels.csb_info_step,
    content: amLabels.csb_info_step_content,
    trigger: 'info',
    index: 4
  },
  {
    heading: amLabels.csb_payment,
    content: amLabels.csb_payment_content,
    trigger: 'payment',
    index: 5
  },
  {
    heading: amLabels.cb_congratulations_heading,
    content: amLabels.cpb_congratulations_content,
    trigger: 'congrats',
    index: 6
  }
]

let bookableType = inject('bookableType')

// * sbs - Step By Step
let sbsMenuCards = computed(() => {
  if (bookableType.value === 'package') {
    return packagesAppointmentArray
  }

  return serviceAppointmentArray
})

// * cbf - Catalog Booking Form
let cbfMenuArr = ref([
  {
    heading: amLabels.csb_categories,
    content: amLabels.csb_categories_content,
    trigger: 'categories',
    index: 0,
  },
  {
    heading: !licence.isBasic && !licence.isLite ? amLabels.csb_category_items : amLabels.csb_category_services,
    content: !licence.isBasic && !licence.isLite ? amLabels.csb_category_items_content : amLabels.csb_category_services_content,
    trigger: 'categoryItems',
    index: 1,
  },
  {
    heading: amLabels.csb_category_service,
    content: amLabels.csb_category_service_content,
    trigger: 'categoryService',
    index: 2,
  },
  {
    heading: amLabels.csb_category_package,
    content: amLabels.csb_category_package_content,
    trigger: 'categoryPackage',
    index: 3,
  },
  {
    heading: amLabels.booking_form,
    content: amLabels.booking_form_content,
    goToPage: 'sbsNew',
  }
])

if (licence.isBasic || licence.isLite) {
  cbfMenuArr.value.splice(3, 1)
}

if (licence.isLite) {
  serviceAppointmentArray.splice(4, 1)
  serviceAppointmentArray.splice(3, 1)
  serviceAppointmentArray.splice(1, 1)
}

let cbfMenuCards = computed(() => {
  return cbfMenuArr.value
})

let settingsCardArray = computed(() => {
  if (pageRenderKey.value === 'cbf') return cbfMenuCards.value

  return sbsMenuCards.value
})
</script>

<script>
export default {
  name: "CustomizationMenu"
}
</script>

<style lang="scss">
@mixin am-cs-menu-block {
  // am - amelia
  // cs - customize settings
  .am-cs-menu {
    &__inner {
      position: relative;
      padding: 16px;
      border-bottom: 1px solid $shade-250;

      &:last-child {
        border-bottom: none;
      }

      &-header {
        display: flex;
        align-items: center;
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 1.55555;
        color: $shade-800;
        margin-bottom: 16px;

        span {
          font-size: 24px;
          margin-right: 8px;
        }
      }
    }

    &__card {
      margin-bottom: 8px;

      $count: 30;
      @for $i from 0 through $count {
        &:nth-child(#{$i + 1}) {
          animation: 400ms cubic-bezier(.45,1,.4,1.2) #{$i*70}ms am-animation-slide-up;
          animation-fill-mode: both;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// admin
#amelia-app-backend-new {
  @include am-cs-menu-block;
}
</style>
