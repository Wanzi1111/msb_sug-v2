import Vue from 'vue'
Vue.use({
  install: function(Vue) {
    const requireComponent = require.context('./', true, /\.vue$/)
    let componentConfig = {}
    requireComponent.keys().forEach(componentName => {
      componentConfig = requireComponent(componentName)
      Vue.component(
        componentConfig.default.name,
        componentConfig.default
      )
    })
  }
})
