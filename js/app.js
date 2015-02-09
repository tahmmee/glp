// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('glp', ['ionic'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/profile')

  $stateProvider.state('app', {
    abstract: true,
    templateUrl: 'main.html'
  })

  $stateProvider.state('app.profile', {
    abstract: true,
    url: '',
    templateUrl: 'profile.html',
  })

  $stateProvider.state('app.profile.assets', {
    url: '/profile',
    views: {
      assets: {
        templateUrl: 'assets.html',
        controller: 'ProfileCtrl'
      }
    }
  })

  $stateProvider.state('app.profile.submitted', {
    url: '/profile',
    views: {
      assets: {
        templateUrl: 'submitted.html',
        controller: 'SubmissionCtrl'
      }
    }
  })

  $stateProvider.state('app.accounts', {
    url: '/accounts/:assetid',
    templateUrl: 'account.html',
    controller: 'AccountCtrl'
  })

})

app.factory('SubmissionService', function() {
  var categories = [  {name: 'Voya', qualified: true},
  {name: 'Ing', qualified: false, nerrs: 2,
    errors: ["Client cannot have +40k in IRA", "Minimum savings required is 20k"]}, 
  {name: 'Vangaurd', qualified: true},
  {name: 'Roth', qualified: false, nerrs: 3,
      errors: ["Cannot have holding +200k stocks", "Client cannot have +$40k in IRA", "Minimum savings required is 20k"]}, 
  {name: 'Lifetime', qualified: false, nerrs: 1,
    errors: ["Minimum savings required is 100k"]}
  ];

  return {
    categories: categories
  }
})


app.controller('SubmissionCtrl', function($scope, $ionicPopup, SubmissionService) {
  $scope.categories = SubmissionService.categories

  $scope.showErrors = function(category) {
     $scope.category = category
     var alertPopup = $ionicPopup.alert({
       title: category.nerrs + ' Conflicts Detected',
       scope: $scope,
       template: '<p ng-repeat="err in category.errors">{{err}}</p>' 
     });
     alertPopup.then(function(res) {
       console.log('Soli Deo');
     });
   };

})


app.factory('AccountsService', function() {
  var types = ['Savings', '401k', 'IRA', 'Stocks']
  var accounts = []
  var id = 0;
  for (var i = 0; i < 3; i++) {
    accounts.push([])
    for (var j = 0; j < 3; j++) {
      if(j==0){
       accounts[i].push([])
     }
     accounts[i][j] = {id: id, type: null, amount: "", active: false}
     id++
    }
  }

  accounts[0][0].active = true

  var getAccount = function(id){
    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if(accounts[i][j].id==id)
          { return accounts[i][j]; }
      }
    }
  }

  var setActive = function(newId){

    if (newId > 9){ newId = 0};

    for (var i = 0; i < 3; i++) {
      for (var j = 0; j < 3; j++) {
        if(accounts[i][j].id==newId){
           accounts[i][j].active = true;
         } else {
            accounts[i][j].active = false;
         }
      }
    }
  }

  return {
    accounts: accounts,
    types: types,
    getAccount: getAccount,
    setActive: setActive
  }
})

app.controller('ProfileCtrl', function($scope, AccountsService) {
  $scope.accounts = AccountsService.accounts
  $scope.accountsRow = function(i){ return AccountsService.accounts[i]}

})

app.controller('AccountCtrl', function($scope, $ionicPopup, 
          AccountsService, $stateParams, $ionicHistory) {

var id = $stateParams.assetid
$scope.account = AccountsService.getAccount(id)

$scope.showPopup = function(type) {

  var myPopup = $ionicPopup.show({
    template: '<input autofocus type="number" ng-model="account.amount">',
    title: 'Enter '+type+' Amount',
    subTitle: 'in dollars',
    scope: $scope,
    buttons: [
      { text: 'Cancel' },
      {
        text: '<b>Save</b>',
        type: 'button-positive',
        onTap: function(e) {
          if (!$scope.account.amount) {
            e.preventDefault();
          } else {
            return true;
          }
        }
      }
    ]
  })
  myPopup.then(function(res) {
    if(res){
      $scope.account.type = type;
      id++;
      AccountsService.setActive(id);
      $ionicHistory.goBack();
    }
  });

}

  $scope.types = AccountsService.types

})


