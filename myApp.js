var app = angular.module('myApp', ['ngMaterial'])
        .controller("autocompleteController", ['$scope', '$http', function($scope, $http){
            $scope.searchLoc = '';
            $scope.searchLocLat = '';
            $scope.searchLocLon = '';
            $scope.searchBy = '';
            this.searchTerm = '';
            $scope.rec = undefined;

            this.querySearch = function(query){
            return $http.get("http://localhost:8000/autokey/"+query)
            .then(function(response){
                if(undefined == response.data._embedded){
                    return {name:"no data found"};
                }
                else{
                    console.log(JSON.stringify(response.data));
                    return response.data._embedded.attractions;
                }
            })
          };
          $scope.init = function(overrideVal){
            if('current'==overrideVal){
                $http.get("http://ip-api.com/json").then(function(result){
                    $scope.searchLoc=result.data.city;
                    $scope.searchLocLat = result.data.lat;
                    $scope.searchLocLon = result.data.lon;
                })
            }else{
                $http.get("https://api.opencagedata.com/geocode/v1/json?q=" +
                $scope.searchLoc + "&key=8bcff146fff1476799cbb57b85c1ec02&q=52.51627%2C13.37769").then(function(result){
                    //console.log(JSON.stringify(result));
                    //$scope.searchLoc=result.data.results[0].formatted;
                    $scope.searchLocLat = result.data.results[0].geometry.lat;
                    $scope.searchLocLon = result.data.results[0].geometry.lng;
                })
            }
          }
          $scope.submitForm = function(param){
            $scope.rec = [];
//            //console.log('before request: ' + $scope.ctrl.selectedItem.name+', '+$scope.distance+', '
//            +$scope.distanceUnit+', '+$scope.searchLoc+'->'+$scope.searchLocLat+','+$scope.searchLocLon;
              return $http.get("http://localhost:8000/searchEvents", {params: {
                keyword: $scope.ctrl.selectedItem.name,
                segmentId: "KZFzniwnSyZfZ7v7nE",
                distance: $scope.distance,
                distanceUnit: $scope.distanceUnit.trim() == "Miles"? "miles":"km",
                latitude: $scope.searchLocLat,
                longitude: $scope.searchLocLon,
                }})
              .then(function(response){
                $scope.rec = response.data._embedded['events'];
              });
          };
        }]);