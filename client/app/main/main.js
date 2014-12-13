'use strict';

angular.module('sphynxApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('parent',{
      	abstract: true,
      	template: '<div ui-view></div>',
      	controller: 'MainCtrl'
      })
      .state('parent.main', {
        url: '/',
        templateUrl: 'app/main/main.html'
      })
      .state('parent.view', {
      	url: '/view',
      	templateUrl: 'app/main/view.html'
      })
  });