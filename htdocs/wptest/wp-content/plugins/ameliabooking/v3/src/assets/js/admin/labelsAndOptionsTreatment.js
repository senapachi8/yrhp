import {reactive} from "vue";
import deepMerge from "deepmerge";

const globalLabels = reactive(window.wpAmeliaLabels)

// * Set description for specific label on customize
let labelsDetails = {
  sbsNew: {
    infoStep: {
      input: {
        enter_first_name: globalLabels.csb_placeholder,
        enter_first_name_warning: globalLabels.csb_mandatory,
        enter_last_name: globalLabels.csb_placeholder,
        enter_last_name_warning: globalLabels.csb_mandatory,
        enter_email: globalLabels.csb_placeholder,
        enter_valid_email_warning: globalLabels.csb_mandatory,
        enter_phone: globalLabels.csb_placeholder,
        enter_phone_warning: globalLabels.csb_mandatory,
      }
    }
  }
}

// * Specify which label to delete from customize
let basicLabelsTreatment = {
  cbf: {
    categoryItemsList: {
      filterBlock: [
        'filter_all',
        'filter_packages',
        'filter_services'
      ],
      page: [
        'package',
        'packages',
        'save',
        'expires_at',
        'expires_after',
        'expires_day',
        'expires_days',
        'expires_week',
        'expires_weeks',
        'expires_month',
        'expires_months',
        'without_expiration',
        'in_package'
      ],
      employeeDialog: [
        'book_package'
      ]
    },
    categoryService: {
      packBlock: [
        'remove',
        'service_available_in_package',
        'save',
        'more_packages',
        'less_packages',
        'expires_at',
        'expires_after',
        'expires_day',
        'expires_days',
        'expires_week',
        'expires_weeks',
        'expires_month',
        'expires_months',
        'without_expiration',
        'in_package'
      ]
    },
  }
}

let liteLabelsTreatment = deepMerge(
  basicLabelsTreatment,
  {
    cbf: {
      categoryItemsList: {
        filterBlock: [
          'filter_employee',
          'filter_location',
        ],
        page: [
          'multiple_locations',
          'view_employees',
        ],
        employeeDialog: [
          'remove',
          'employee_info',
          'book_service',
        ],
      },
      categoryService: {
        header: [
          'multiple_locations',
        ],
        page: [
          'tab_employees',
        ],
      },
    },
    sbsNew: {
      initStep: {
        input: [
          'location',
          'select_location',
          'please_select_location',
          'employee_colon',
          'select_employee',
          'please_select_employee'
        ],
        employeeDescription: [
          'remove',
          'employee_information',
          'select_this_employee',
        ],
      },
      paymentStep: {
        summarySegment: [
          'coupon',
          'add_coupon_btn',
          'summary_person',
          'summary_persons',
          'summary_recurrence',
          'summary_recurrences',
          'summary_extras',
          'summary_extras_subtotal',
          'summary_package',
          'subtotal',
          'discount_amount_colon',
          'paying_now',
          'paying_later',
          'full_amount_consent'
        ],
        paymentSegment: [
          'payment_method',
          'on_site',
          'card_number_colon',
          'expires_date_colon',
          'payment_protected_policy',
          'payment_wc_mollie_sentence'
        ],
      },
      congratulations: {
        content: [
          'congrats_package',
          'congrats_location'
        ],
        footer: [
          'congrats_panel'
        ],
      },
    }
  }
)

// * Specify which option to delete from customize
let basicOptionsTreatment = {
  cbf: {
    categoriesList: ['packages'],
    categoryItemsList: [
      'filterButtons',
      'packageBadge',
      'packagePrice',
      'packageCategory',
      'packageDuration',
      'packageCapacity',
      'packageLocation',
      'packageServices'
    ],
    categoryService: [
      'servicePackages',
      'packagePrice',
      'packageCategory',
      'packageDuration',
      'packageCapacity',
      'packageLocation',
      'packageServices'
    ],
  }
}

let liteOptionsTreatment = deepMerge(
  basicOptionsTreatment,
  {
    cbf: {
      categoryItemsList: [
        'filterEmployee',
        'filterLocation',
        'serviceCapacity',
        'serviceLocation',
        'cardEmployeeBtn',
        'dialogEmployeeBtn',
        'filterButtons',
      ],
      categoryService: [
        'serviceCapacity',
        'serviceLocation',
        'serviceEmployees',
        'serviceEmployeePrice',
      ],
    },
    sbsNew: {
      initStep: [
        'employee',
        'location',
      ],
    },
  },
)

function useLicenceMenuClass (step, licence) {
  if (licence.isLite) {
    if (['extrasStep', 'recurringStep', 'recurringSummary'].includes(step)) {
      return 'am-lite-version'
    }
  }

  return ''
}

export {
  labelsDetails,
  liteLabelsTreatment,
  basicLabelsTreatment,
  basicOptionsTreatment,
  liteOptionsTreatment,
  useLicenceMenuClass,
}
