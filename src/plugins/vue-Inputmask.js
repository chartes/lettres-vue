import Inputmask from 'inputmask'

// v-mask directive, formerly provided by vue-inputmask whose eval-based
// dist bundle breaks under webpack 5 ("exports is not defined")
export default {
  install(Vue) {
    Vue.directive('mask', {
      bind(el, binding) {
        Inputmask(binding.value).mask(el);
      }
    });
  }
};
/*
export default new Vuetify({
  iconfont: 'md',
  icons: {
    // pagination
    'firststep': 'fas fa-step-backward',
    'laststep': 'fas fa-step-forward',
    'nextstep': 'fas fa-chevron-right',
    'previousstep': 'fas fa-chevron-left',

    //tag bar
    'active_check_circle': 'fas fa-check-circle',
    'inactive_check_circle': 'far fa-check-circle',

    'active_bookmark': 'fas fa-bookmark',
    'inactive_bookmark': 'far fa-bookmark',

    'lock': 'fas fa-lock',
    'unlock': 'fas fa-unlock',

    'show': 'fas fa-eye',
    'hide': 'fas fa-eye-slash',
  }
})
 */
