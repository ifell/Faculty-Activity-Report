'use strict';

angular.module('reports').controller('Section15Controller', ['$scope', '$stateParams', '$location', 'Authentication',
	function($scope, $stateParams, $location, Authentication, Reports ) {


		$scope.authentication = Authentication;
		
<<<<<<< Updated upstream
		//variable for section 15 to initialize the table
		$scope.incomplete = false;
      $scope.hideTable = true;
=======
		//variables for section 15 to initialize the table
		$scope.incomplete = false; //Checks if all the fields are complete in order to enable the add grant button
      $scope.hideTable = true; 

>>>>>>> Stashed changes
      $scope.grants = 
            [{
               titleOfGrant:null,
               fundingAgency:null,
               PI:null,
               startEnd:null,
               value:null,
            }];
<<<<<<< Updated upstream
        $scope.addGrants = function(){
               $scope.grants.push({titleOfGrant: $scope.grants.titleOfGrant , fundingAgency: $scope.grants.fundingAgency, PI: $scope.grants.PI, value:$scope.grants.value, startEnd: $scope.grants.startEnd});
               $scope.grants.titleOfGrant =null;
               $scope.grants.fundingAgency =null;
               $scope.grants.PI =null;
               $scope.grants.value=null;
               $scope.grants.startEnd=null;
               $scope.hideTable = false;

            };

        $scope.$watch('grants.titleOfGrant',function(){$scope.test();});
=======
            
         //When the add grant button is pressed this function is called.
        $scope.addGrants = function(){
               $scope.grants.push({titleOfGrant: $scope.grants.titleOfGrant , fundingAgency: $scope.grants.fundingAgency, PI: $scope.grants.PI, value:$scope.grants.value, startEnd: $scope.grants.startEnd});
               $scope.grants.titleOfGrant = null;
               $scope.grants.fundingAgency = null;
               $scope.grants.PI = null;
               $scope.grants.value = null;
               $scope.grants.startEnd = null;
               $scope.hideTable = false;
            };
       /*
      //to watch whether these strings are empty, in order to check for completion of forms to enable button
         $scope.test = function() {
         $scope.incomplete = false;
         if(!$scope.grants.value.length || !$scope.grants.titleOfGrant.length || !$scope.grants.fundingAgency.length || !$scope.grants.PI.length || !$scope.grants.startEnd.length){
            $scope.incomplete = true;
         }
      }; 
      //Function to look for changes that are happening in the Grants object.
      $scope.$watch('grants.titleOfGrant',function(){$scope.test();});
>>>>>>> Stashed changes
      $scope.$watch('grants.fundingAgency',function() {$scope.test();});
      $scope.$watch('grants.PI',function() {$scope.test();});
      $scope.$watch('grants.value',function() {$scope.test();});
      $scope.$watch('grants.startEnd',function() {$scope.test();});
<<<<<<< Updated upstream

      $scope.test = function() {
         $scope.incomplete = true;
         $scope.incomplete = false;
         if($scope.grants.value <= 0 || !$scope.grants.titleOfGrant.length||!$scope.grants.fundingAgency.length||!$scope.grants.PI.length||!$scope.grants.startEnd.length){
            $scope.incomplete = true;
         }
      };
=======
      */

>>>>>>> Stashed changes
	}
]);
