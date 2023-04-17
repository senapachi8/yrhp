<template>
  <div>
    <div class="am-dialog-scrollable" :class="{'am-edit':resource.id !== 0}">

      <!-- Dialog Header -->
      <div class="am-dialog-header">
        <el-row>
          <el-col :span="16">
            <h2 v-if="resource.id != 0">{{ $root.labels.edit_resource }}</h2>
            <h2 v-else>{{ $root.labels.new_resource }}</h2>
          </el-col>
          <el-col :span="8" class="align-right">
            <el-button @click="closeDialog" class="am-dialog-close" size="small" icon="el-icon-close"></el-button>
          </el-col>
        </el-row>
      </div>

      <!-- Form -->
      <el-form :model="resource" ref="resource" :rules="rules" label-position="top" @submit.prevent="onSubmit">

        <!-- Name -->
        <el-form-item prop="name">
          <label slot="label">
            {{ $root.labels.name }}:
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.resource_name_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </label>
          <el-input
            v-model="resource.name"
            :placeholder="$root.labels.resource_name_ph"
            @input="clearValidation()"
            @change="trimProperty(resource, 'name')"
          >
          </el-input>
        </el-form-item>

        <!-- Quantity -->
        <el-form-item :label="$root.labels.resource_quantity + ':'">
          <el-input-number v-model="resource.quantity" :min="1" auto-complete="off" @input="clearValidation()"></el-input-number>
        </el-form-item>

        <el-form-item>
          <el-radio
            :label="true"
            @change="changeResourceSharing()"
            v-model="sharedResource"
            style="margin-bottom: 10px;"
          >
            {{ $root.labels.resource_shared }}
            <el-tooltip placement="top">
              <div slot="content" v-html="$root.labels.resource_shared_tooltip"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </el-radio>
          <el-radio
            :label="false"
            @change="changeResourceSharing()"
            v-model="sharedResource"
            style="margin-bottom: 10px;"
          >
            {{ locations.length ? $root.labels.resource_separate1 : $root.labels.resource_separate2 }}
            <el-tooltip placement="top">
              <div slot="content" v-html="locations.length ? $root.labels.resource_separate_tooltip1 : $root.labels.resource_separate_tooltip2"></div>
              <i class="el-icon-question am-tooltip-icon"></i>
            </el-tooltip>
          </el-radio>
        </el-form-item>

        <el-form-item v-if="locations.length" style="margin-left: 27px;">
          <el-radio
            label="service"
            v-model="resource.shared"
            :disabled="sharedResource"
            style="margin-bottom: 10px;"
          >
            {{ $root.labels.service }}
          </el-radio>
          <el-radio
            label="location"
            v-model="resource.shared"
            :disabled="sharedResource"
            style="margin-bottom: 10px;"
          >
            {{ $root.labels.location }}
          </el-radio>
        </el-form-item>

        <hr>

        <label>
          {{ $root.labels.resource_included_in }}
        </label>

        <!-- Services -->
        <el-form-item :label="$root.labels.services+':'" v-if="services.length">
          <el-select
            v-model="selectedEntities.services"
            :placeholder="$root.labels.all_services"
            multiple
            filterable
            value-key="id"
            clearable
            collapse-tags
            @change="selectEntity('services')"
          >
            <div class="am-drop-parent"
                 :class="{'am-resource-all-selected': allEntitiesSelected.services}"
                 @click="selectAllEntities('services')"
            >
              <span>{{ $root.labels.all_services }}</span>
            </div>
            <div
              v-for="category in categories"
              :key="category.id">
              <div
                class="am-drop-parent"
                @click="selectAllInCategory(category)"
              >
                <span>{{ category.name }}</span>
              </div>
              <el-option
                v-for="service in category.serviceList"
                :key="service.id"
                :label="service.name"
                :value="service"
                class="am-drop-child"
              >
              </el-option>
            </div>
          </el-select>
        </el-form-item>

        <!-- Locations -->
        <el-form-item :label="$root.labels.locations+':'" v-if="locations.length">
          <el-select
            v-model="selectedEntities.locations"
            :placeholder="$root.labels.all_locations"
            multiple
            filterable
            value-key="id"
            clearable
            collapse-tags
            @change="selectEntity('locations')"
          >
            <div class="am-drop-parent"
                 :class="{'am-resource-all-selected': allEntitiesSelected.locations}"
                 @click="selectAllEntities('locations')"
            >
              <span>{{ $root.labels.all_locations }}</span>
            </div>
            <el-option
              v-for="item in locations"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <!-- Employees -->
        <el-form-item :label="$root.labels.employees+':'" v-if="employees.length">
          <el-select
            v-model="selectedEntities.employees"
            :placeholder="$root.labels.all_employees"
            multiple
            filterable
            clearable
            value-key="id"
            collapse-tags
            @change="selectEntity('employees')"
          >
            <div class="am-drop-parent"
                 :class="{'am-resource-all-selected': allEntitiesSelected.employees}"
                 @click="selectAllEntities('employees')"
            >
              <span>{{ $root.labels.all_employees }}</span>
            </div>
            <el-option
              v-for="item in employees"
              :key="item.id"
              :label="item.firstName + ' ' + item.lastName"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </div>

    <dialog-actions
      formName="resource"
      urlName="resources"
      :isNew="resource.id === 0"
      :entity="resource"
      :getParsedEntity="getParsedEntity"
      :hasIcons="true"
      :updateStash="true"

      :status="{
          on: 'visible',
          off: 'hidden'
        }"

      :buttonText="{
          confirm: {
            status: {
              yes: resource.status === 'visible' ? $root.labels.visibility_hide : $root.labels.visibility_show,
              no: $root.labels.no
            }
          }
        }"

      :action="{
          haveAdd: true,
          haveEdit: true,
          haveStatus: true,
          haveRemove: $root.settings.capabilities.canDelete === true,
          haveRemoveEffect: false,
          haveDuplicate: true
        }"

      :message="{
          success: {
            save: $root.labels.resource_saved,
            remove: $root.labels.resource_deleted,
            show: $root.labels.resource_visible,
            hide: $root.labels.resource_hidden
          },
          confirm: {
            remove: $root.labels.confirm_delete_resource,
            show: $root.labels.confirm_show_resource,
            hide: $root.labels.confirm_hide_resource,
            duplicate: $root.labels.confirm_duplicate_resource
          }
        }"
    >
    </dialog-actions>
  </div>
</template>

<script>
import DialogActions from '../parts/DialogActions.vue'
import imageMixin from '../../../js/common/mixins/imageMixin'
import notifyMixin from '../../../js/backend/mixins/notifyMixin'
import helperMixin from '../../../js/backend/mixins/helperMixin'

export default {

  mixins: [imageMixin, notifyMixin, helperMixin],

  props: {
    passedResource: null,
    categories: {
      type: Array,
      default: () => ([])
    },
    services: {
      type: Array,
      default: () => ([])
    },
    locations: {
      type: Array,
      default: () => ([])
    },
    employees: {
      type: Array,
      default: () => ([])
    },
    entitiesRelations: {
      type: Object,
      default: () => ({})
    },
    settings: {
      type: Object,
      default: () => ({})
    }
  },

  data () {
    return {
      resource: null,
      rules: {
        name: [
          {required: true, message: this.$root.labels.resource_name_required, trigger: 'submit'}
        ]
      },
      sharedResource: !this.passedResource.shared,
      nonSharedEntityTypes: [
        {
          label: 'Disabled',
          value: 'disabled'
        },
        {
          label: 'Service',
          value: 'service'
        },
        {
          label: 'Location',
          value: 'location'
        }
      ],
      selectedEntities: {
        services: [],
        locations: [],
        employees: []
      },
      allEntitiesSelected: {
        services: false,
        locations: false,
        employees: false,
      }
    }
  },

  created () {
    this.resource = JSON.parse(JSON.stringify(this.passedResource))
  },

  mounted () {
    ['services', 'locations', 'employees'].forEach(entity => {
      this.selectedEntities[entity] = this.resource[entity]
      if (this.resource.id !== 0 && this.resource[entity].length === 0) {
        this.selectedEntities[entity] = this[entity]
        this.allEntitiesSelected[entity] = true
      }
    })
  },

  methods: {
    selectAllEntities (type) {
      this.allEntitiesSelected[type] = !this.allEntitiesSelected[type]
      this.selectedEntities[type] = this.allEntitiesSelected[type] ? this[type] : []
    },

    selectEntity (type) {
      this.allEntitiesSelected[type] = false
    },

    changeResourceSharing () {
      if (!this.sharedResource) {
        this.resource.shared = !this.resource.shared ? 'service' : this.resource.shared
      } else {
        this.resource.shared = null
      }
    },

    selectAllInCategory (category) {
      let services = category.serviceList
      let servicesIds = services.map(service => service.id)
      let selectedServicesIds = this.selectedEntities.services.map(s => s.id)

      // Deselect all services if they are already selected
      if (_.isEqual(_.intersection(servicesIds, selectedServicesIds), servicesIds)) {
        selectedServicesIds = _.difference(selectedServicesIds, servicesIds)
      } else {
        selectedServicesIds = _.uniq(selectedServicesIds.concat(servicesIds))
      }

      this.selectedEntities.services = this.services.filter(s => selectedServicesIds.includes(s.id))
    },

    filteredCategories() {
      let filtered = []
      this.categories.forEach(category => {
          if (this.filteredServices(category).length > 0) {
            filtered.push(category)
          }
        }
      )
      return filtered
    },

    filteredServices () {
      return this.services.filter(service =>
        (!this.selectedEntities.employees.length ? true : (this.selectedEntities.employees.filter(e => e.id in this.entitiesRelations && service.id in this.entitiesRelations[e.id]).length > 0)) &&
        (!this.selectedEntities.locations.length ? true
          : this.filteredEmployees().filter(employee =>
            (employee.id in this.entitiesRelations && service.id in this.entitiesRelations[employee.id] &&
              this.selectedEntities.locations.some(loc => this.entitiesRelations[employee.id][service.id].indexOf(loc.id) !== -1))
          ).length > 0)
      )
    },

    filteredEmployees () {
      return this.employees.filter(employee =>
        employee.serviceList.filter(service =>
          service.status === 'visible' &&
          (!this.selectedEntities.services.length ? true : (employee.id in this.entitiesRelations && service.id in this.entitiesRelations[employee.id] &&
            this.selectedEntities.services.map(s => s.id).indexOf(service.id) !== -1)) &&
          (!this.selectedEntities.locations.length ? true
            : (employee.id in this.entitiesRelations && service.id in this.entitiesRelations[employee.id] &&
            this.selectedEntities.locations.some(loc => this.entitiesRelations[employee.id][service.id].indexOf(loc.id) !== -1))
          )
        ).length > 0
      )
    },

    filteredLocations () {
      return this.locations.filter(location =>
        (!this.selectedEntities.employees.length ? true
          : (this.selectedEntities.employees.filter(e => e.serviceList.filter(
            employeeService => {
              return e.id in this.entitiesRelations && employeeService.id in this.entitiesRelations[e.id] &&
                this.entitiesRelations[e.id][employeeService.id].indexOf(location.id) !== -1
            }).length > 0).length > 0
          )
        ) &&
        (!this.selectedEntities.services.length ? true
          : this.filteredEmployees().filter(
            e => e.id in this.entitiesRelations && e.serviceList.filter(employeeService => employeeService.id in this.entitiesRelations[e.id] &&
              this.entitiesRelations[e.id][employeeService.id].indexOf(location.id) !== -1 &&
              this.selectedEntities.services.map(s => s.id).indexOf(employeeService.id) !== -1).length > 0
          ).length > 0
        )
      )
    },

    getParsedEntity () {
      let services  = this.allEntitiesSelected.services ? [] : this.selectedEntities.services.map(s => ({entityId: s.id, entityType: 'service'}))
      let locations = this.allEntitiesSelected.locations ? [] : this.selectedEntities.locations.map(l => ({entityId: l.id, entityType: 'location'}))
      let employees = this.allEntitiesSelected.employees ? [] : this.selectedEntities.employees.map(e => ({entityId: e.id, entityType: 'employee'}))

      return {
        name: this.resource.name,
        quantity: this.resource.quantity,
        shared: !this.sharedResource ? this.resource.shared : null,
        status: this.resource.status,
        entities: services.concat(locations).concat(employees)
      }
    },

    closeDialog () {
      this.$emit('closeDialog')
    },

    clearValidation () {
      if (typeof this.$refs.resource !== 'undefined') {
        this.$refs.resource.clearValidate()
      }
    }
  },

  components: {
    DialogActions
  }

}
</script>
