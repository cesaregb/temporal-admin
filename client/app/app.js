'use strict';

angular.module('processAdminApp', [
  'processAdminApp.auth',
  'processAdminApp.admin',
  'processAdminApp.constants',
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
  'validation.match',
  'angular-noty',
  'formly',
  'formlyBootstrap',
  'angular-confirm',
  'ngMaterial',
  'ui.select',
  'ngSanitize',
  'angular-loading-bar',
  'ngTable',
  'ui.bootstrap.datetimepicker',
  'dndLists'
])
  .config(function ($urlRouterProvider, $locationProvider, cfpLoadingBarProvider, formlyConfigProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
    // configure loading-bar
    // cfpLoadingBarProvider.parentSelector = '#loadingContainer';
    // cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.includeSpinner = false;

    // cfpLoadingBarProvider.spinnerTemplate = '<div class="spinning-wheel-container"><div class="spinning-wheel"></div></div>';

    // set templates here
    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapLabel',
      template: [
        '<label for="{{::id}}" class="col-sm-2 control-label">',
        '{{to.label}} {{to.required ? "*" : ""}}',
        '</label>',
        '<div class="col-sm-8">',
        '<formly-transclude></formly-transclude>',
        '</div>'
      ].join(' ')
    });

    formlyConfigProvider.setWrapper({
      name: 'horizontalBootstrapCheckbox',
      template: [
        '<div class="col-sm-offset-2 col-sm-8">',
        '<formly-transclude></formly-transclude>',
        '</div>'
      ].join(' ')
    });

    formlyConfigProvider.setType({
      name: 'horizontalInput',
      extends: 'input',
      wrapper: ['horizontalBootstrapLabel', 'bootstrapHasError']
    });

    formlyConfigProvider.setType({
      name: 'horizontalCheckbox',
      extends: 'checkbox',
      wrapper: ['horizontalBootstrapCheckbox', 'bootstrapHasError']
    });

    // auth configuration
    // $httpProvider.defaults.headers.common['Authorization'] = 'Basic ' + auth;

  }).run(function ($location, $log, constants, $rootScope, Auth) {
    var url = $location.absUrl();
    $log.info('[info] url: ' + url);
    if (url.indexOf('localhost') > 0) {
      constants.API_ENDPOINT = constants.LOCAL_API_ENDPOINT;

    } else if (url.indexOf('52.6.82.228') > 0) { // dev elastic ip "52.6.82.228"
      constants.API_ENDPOINT = constants.DEV_API_ENDPOINT;

    } else {
      constants.API_ENDPOINT = constants.PROD_API_ENDPOINT;

    }

    $rootScope.$on('$stateChangeStart', function (event, next) {
      // SET AUTH FOR ALL THE APP
      // we may require to skip some screens.
      var flag = true || (next.authenticate);

      Auth.isLoggedIn(function (loggedIn) {

        if (flag && !loggedIn) {

          $log.info('[run] Access not granted');
          $location.path('/login');

        }else{

          // once is logged...
          this.factoryServices.getResources('stores').then((stores) => {
            // select the valid store.
            this.constants.store = stores[0];
            this.$log.info('[run] constants.store.idStore: ' + this.constants.store.idStore);
          });


          if (url.includes('login')){
            $location.path('/main');
          }

        }

      });

    });

});
