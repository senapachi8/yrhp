<template>

  <div class="am-whatsapp-placeholders">
    <el-alert
      type="warning"
      show-icon
      title=""
      :description="$root.labels['whatsapp_notice_'+name]"
      class="am-whatsapp-placeholders-notice-warn"
      :closable="false"
    />

    <el-form ref="whatsappPlaceholders" :model="{whatsappPlaceholders: whatsappPlaceholders}" :rules="rules" @submit.prevent="onSubmit">
      <div v-for="(placeholder, index) in whatsappPlaceholders" :key="index">
        <el-row>
          <p v-html="$root.labels.placeholder + ' {{' + (index+1) + '}}:'">
          </p>
        </el-row>
        <el-row type="flex" style="gap: 30px">
          <el-col :span="12">
            <el-form-item :prop="'whatsappPlaceholders.'+index+'.type'">
              <el-select
                :placeholder="$root.labels.choose_type"
                filterable
                v-model="placeholder.type"
                @change="changeType(index)"
              >
                <el-option
                  v-for="item in allPlaceholders"
                  :key="item"
                  :label="$root.labels[item]"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :prop="'whatsappPlaceholders.'+index+'.value'">
              <el-select
                :placeholder="$root.labels.choose_ph"
                filterable
                v-model="placeholder.value"
              >
                <el-option
                  v-for="item in getPlaceholders(placeholder)"
                  :key="item.value"
                  :label="$root.labels[item]"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col class="am-whatsapp-placeholders-notice-info" v-if="isMultipleRowsPh(placeholder.value)">
            <el-alert
              type="info"
              show-icon
              title=""
              :description="$root.labels.whatsapp_notice_ph"
              :closable="false"
            />
          </el-col>
        </el-row>
      </div>
    </el-form>

  </div>
</template>

<script>
import placeholdersMixin from '../../../../js/backend/mixins/placeholdersMixin'

export default {
  mixins: [placeholdersMixin],

  props: {
    whatsappPlaceholders: {
      default: () => [],
      type: Array
    },
    allPlaceholders: {
      default: () => [],
      type: Array
    },
    allPlaceholderTypes: {
      default: () => ({}),
      type: Object
    },
    name: {
      default: '',
    },
    rules: {
      default: () => ({}),
      type: Object
    },
    notification: {
      default: () => ({}),
      type: Object
    }
  },


  methods: {
    changeType(index) {
      this.whatsappPlaceholders[index].value = this.allPlaceholderTypes[this.whatsappPlaceholders[index].type][0].value
      if (typeof this.$refs.whatsappPlaceholders !== 'undefined') {
        this.$refs.whatsappPlaceholders.clearValidate()
      }
    },

    isMultipleRowsPh(ph) {
      return ['%number_of_persons%', '%coupon_used%', '%booked_customer%', '%employee_name_email_phone%', '%event_period_date%', '%event_period_date_time%'].includes(ph) || ph.includes('coupon')
    },

    getPlaceholders(placeholder) {
      if (!placeholder.type) {
        return this.allPlaceholderTypes[placeholder.type]
      }
      let placeholders = JSON.parse(JSON.stringify(this.allPlaceholderTypes[placeholder.type]));
      if (this.notification.name && (this.notification.name.includes('rejected') || this.notification.name.includes('canceled'))) {
        placeholders = placeholders.filter(p => !p.value.includes('payment_link'))
      }

      if (this.notification.entity === 'appointment') {
        if (['customer_package_purchased', 'customer_package_canceled', 'provider_package_purchased', 'provider_package_canceled'].includes(this.notification.name)) {
          placeholders = placeholders.filter(p => !p.value.includes('event_deposit') && !p.value.includes('appointment_deposit'))
        } else {
          placeholders = placeholders.filter(p => !p.value.includes('event_deposit') && !p.value.includes('package_deposit'))
        }
      } else if (this.notification.entity === 'event') {
        placeholders = placeholders.filter(p => !p.value.includes('appointment_deposit') && !p.value.includes('package_deposit'))
      }

      return this.notification.name && this.notification.name.includes('rescheduled') ? placeholders : placeholders.filter(p => !p.value.includes('initial'))
    }
  }

}
</script>
