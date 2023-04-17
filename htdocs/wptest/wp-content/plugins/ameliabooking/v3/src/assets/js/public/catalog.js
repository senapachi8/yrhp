import { reactive, ref } from "vue";

import { useFormattedPrice } from "../common/formatting.js";

const globalSettings = reactive(window.wpAmeliaSettings)
const globalLabels = reactive(window.wpAmeliaLabels)
const shortcodeData = reactive(window.ameliaShortcodeData ? window.ameliaShortcodeData[0] : null)

function useAvailableServiceIdsInCategory (category, entities, employeeId = null, locationId = null) {
  let serviceIdInCategory = []
  if (category) {
    category.serviceList.forEach(service => {
      if (employeeId) {
        if (
          employeeId in entities.entitiesRelations
          && service.id in entities.entitiesRelations[employeeId]
          && (locationId ? entities.entitiesRelations[employeeId][service.id].find(a => a === locationId) : true)
          && service.status === 'visible'
          && service.show
          && !serviceIdInCategory.filter(el => el === service.id).length
        ) {
          serviceIdInCategory.push(service.id)
        }
      } else {
        entities.employees.forEach(employee => {
          if (
            employee.id in entities.entitiesRelations
            && service.id in entities.entitiesRelations[employee.id]
            && (locationId ? entities.entitiesRelations[employee.id][service.id].find(a => a === locationId) : true)
            && service.status === 'visible'
            && service.show
            && !serviceIdInCategory.filter(el => el === service.id).length
          ) {
            serviceIdInCategory.push(service.id)
          }
        })
      }
    })
  }

  return serviceIdInCategory
}

function useEmployeesServiceCapacity(entities, serviceId) {
  let arrMax = []
  let arrMin = []

  entities.employees.forEach(employee => {
    if (
      employee.id in entities.entitiesRelations
      && serviceId in entities.entitiesRelations[employee.id]
    ) {
      let employeeService = employee.serviceList.find(service => service.id === serviceId)
      arrMax.push(employeeService.maxCapacity)
      arrMin.push(employeeService.minCapacity)
    }
  })

  let serviceMinCapacity = arrMin.reduce((prev, curr) => {
    return curr < prev ? curr : prev
  }, arrMin[0])

  let serviceMaxCapacity = arrMax.reduce((prev, curr) => {
    return curr > prev ? curr : prev
  }, arrMax[0])

  if (serviceMinCapacity !== serviceMaxCapacity) {
    return `${serviceMinCapacity}/${serviceMaxCapacity}`
  }

  return serviceMinCapacity;
}

function useServiceDuration(seconds) {
  let hours = Math.floor(seconds / 3600)
  let minutes = seconds / 60 % 60

  return (hours ? (hours + globalLabels.h + ' ') : '') + ' ' + (minutes ? (minutes + globalLabels.min) : '')
}

function useServicePrice(entities, serviceId) {
  let arrPrice = []

  entities.employees.forEach(employee => {
    if (employee.id in entities.entitiesRelations && serviceId in entities.entitiesRelations[employee.id]) {
      let employeeService = employee.serviceList.find(service => service.id === serviceId)
      arrPrice.push(employeeService.price)
    }
  })

  let serviceMinPrice = arrPrice.reduce((prev, curr) => {
    return curr < prev ? curr : prev
  }, arrPrice[0])

  let serviceMaxPrice = arrPrice.reduce((prev, curr) => {
    return curr > prev ? curr : prev
  }, arrPrice[0])

  if (serviceMinPrice !== serviceMaxPrice) {
    return {
      price: `${useFormattedPrice(serviceMinPrice, !globalSettings.payments.hideCurrencySymbolFrontend)} - ${useFormattedPrice(serviceMaxPrice, !globalSettings.payments.hideCurrencySymbolFrontend)}`,
      min: serviceMinPrice,
      max: serviceMaxPrice
    }
  }

  return {
    price: useFormattedPrice(serviceMinPrice, globalSettings.payments.hideCurrencySymbolFrontend),
    min: serviceMinPrice,
    max: serviceMaxPrice
  }
}

function useServiceLocation(entities, serviceId) {
  let arr = []

  entities.employees.forEach(employee => {
    if (
      employee.id in entities.entitiesRelations
      && serviceId in entities.entitiesRelations[employee.id]
      && entities.entitiesRelations[employee.id][serviceId].length
    ) {
      entities.locations.forEach(a => {
        if (
          entities.entitiesRelations[employee.id][serviceId].some(b => b === a.id)
          && !arr.find(b => b === a.id)
        ) {
          arr.push(a)
        }
      })
    }
  })

  return arr
}

function useDisabledPackageService (entities, pack) {
  let detector = []
  let employeesIds = Object.keys(entities.entitiesRelations)

  pack.bookable.forEach(item => {
    let serviceEmployees = []
    employeesIds.forEach((employeeId) => {
      if (
        entities.entitiesRelations[employeeId][item.service.id]
        && !serviceEmployees.find(a => a ? a.id === parseInt(employeeId) : true)
      ) {
        serviceEmployees.push(entities.employees.find(a => a.id === parseInt(employeeId)))
      }
    })

    if (!serviceEmployees.length) {
      detector.push(false)
    }
  })

  return detector.filter(a => a === false).length
}

function usePackageAvailabilityByEmployeeAndLocation (entities, pack) {
  let displayPack = []
  let employeesIds = Object.keys(entities.entitiesRelations)
  let unfilteredEmployees = ref(shortcodeData && shortcodeData.employee ? entities.unfilteredEmployees.filter(a => a.id === parseInt(shortcodeData.employee)) : entities.unfilteredEmployees)

  pack.bookable.forEach(item => {
    let arr = []

    if (item.providers.length) {
      item.providers.forEach(p => {
        if (item.locations.length) {
          item.locations.forEach(l => {
            if (
              unfilteredEmployees.value.find(a => a.id === p.id)
              && entities.entitiesRelations[p.id][item.service.id]
              && entities.entitiesRelations[p.id][item.service.id].indexOf(l.id) !== -1
              && !arr.find(a => a.id === p.id)
            ) {
              arr.push(unfilteredEmployees.value.find(a => a.id === p.id))
            }
          })
        } else {
          if (
            unfilteredEmployees.value.find(a => a.id === p.id)
            && !arr.find(a => a.id === p.id)
          ) {
            arr.push(unfilteredEmployees.value.find(a => a.id === p.id))
          }
        }
      })
    } else {
      employeesIds.forEach((employeeId) => {
        if (item.locations.length) {
          item.locations.forEach(l => {
            if (
              entities.entitiesRelations[employeeId][item.service.id]
              && entities.entitiesRelations[employeeId][item.service.id].indexOf(l.id) !== -1
              && unfilteredEmployees.value.find(a => a.id === parseInt(employeeId))
              && !arr.find(a => a.id === parseInt(employeeId))
            ) {
              arr.push(unfilteredEmployees.value.find(a => a.id === parseInt(employeeId)))
            }
          })
        } else {
          if (
            entities.entitiesRelations[employeeId][item.service.id]
            && unfilteredEmployees.value.find(a => a.id === parseInt(employeeId))
            && !arr.find(a => a.id === parseInt(employeeId))
          ) {
            arr.push(unfilteredEmployees.value.find(a => a.id === parseInt(employeeId)))
          }
        }
      })
    }

    displayPack.push(!!arr.length)
  })

  return !displayPack.filter(a => a === false).length
}

function usePackageEmployees (entities, pack) {
  let arr = []
  let employeesIds = Object.keys(entities.entitiesRelations)
  let unfilteredEmployees = ref(shortcodeData && shortcodeData.employee ? entities.unfilteredEmployees.filter(a => a.id === parseInt(shortcodeData.employee)) : entities.unfilteredEmployees)

  pack.bookable.forEach(item => {
    if (item.providers.length) {
      item.providers.forEach(p => {
        if (item.locations.length) {
          item.locations.forEach(l => {
            if (
              unfilteredEmployees.value.find(a => a.id === p.id)
              && entities.entitiesRelations[p.id][item.service.id].indexOf(l.id) !== -1
              && !arr.find(a => a.id === p.id)
            ) {
              arr.push(unfilteredEmployees.value.find(a => a.id === p.id))
            }
          })
        } else {
          if (
            unfilteredEmployees.value.find(a => a.id === p.id)
            && !arr.find(a => a.id === p.id)
          ) {
            arr.push(unfilteredEmployees.value.find(a => a.id === p.id))
          }
        }
      })
    } else {
      employeesIds.forEach((employeeId) => {
        if (item.locations.length){
          item.locations.forEach(l => {
            if (
              entities.entitiesRelations[employeeId][item.service.id]
              && entities.entitiesRelations[employeeId][item.service.id].indexOf(l.id) !== -1
              && unfilteredEmployees.value.find(a => a.id === parseInt(employeeId))
              && !arr.find(a => a.id === parseInt(employeeId))
            ) {
              arr.push(unfilteredEmployees.value.find(a => a.id === parseInt(employeeId)))
            }
          })
        } else {
          if (
            entities.entitiesRelations[employeeId][item.service.id]
            && unfilteredEmployees.value.find(a => a.id === parseInt(employeeId))
            && !arr.find(a => a.id === parseInt(employeeId))
          ) {
            arr.push(unfilteredEmployees.value.find(a => a.id === parseInt(employeeId)))
          }
        }
      })
    }
  })

  return arr
}

function usePackageLocations (entities, pack) {
  let arr = []

  let employeesIds = Object.keys(entities.entitiesRelations)
  let unfilteredLocations =  ref(shortcodeData && shortcodeData.location ? entities.unfilteredLocations.filter(a => a.id === parseInt(shortcodeData.location)) : entities.unfilteredLocations)

  pack.bookable.forEach(b => {
    if (b.locations.length) {
      b.locations.forEach(l => {
        if (
          unfilteredLocations.value.find(a => a.id === l.id)
          && !arr.find(a => a.id === l.id)
        ) {
          arr.push(unfilteredLocations.value.find(a => a.id === l.id))
        }
      })
    } else {
      employeesIds.forEach(e => {
        unfilteredLocations.value.forEach(l => {
          if (
            e in entities.entitiesRelations
            && b.service.id in entities.entitiesRelations[e]
            && entities.entitiesRelations[e][b.service.id].indexOf(l.id) !== -1
            && unfilteredLocations.value.find(a => a.id === l.id)
            && !arr.find(a => a.id === parseInt(l.id))
          ) {
            arr.push(unfilteredLocations.value.find(a => a.id === l.id))
          }
        })
      })
    }
  })

  return arr
}

export {
  useAvailableServiceIdsInCategory,
  useEmployeesServiceCapacity,
  useServiceDuration,
  useServicePrice,
  useServiceLocation,
  useDisabledPackageService,
  usePackageAvailabilityByEmployeeAndLocation,
  usePackageEmployees,
  usePackageLocations
}