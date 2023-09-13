import permission from './permission'

const directive = {
    permission
}
export default {
    install(Vue) {
        Object.keys(directive).forEach(key => {
            Vue.directive(key, directive[key])
        })
    }
}
