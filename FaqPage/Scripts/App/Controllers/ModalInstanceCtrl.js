(function() {
    "use strict";

    angular.module("FaqApp.controllers").
        controller("ModalInstanceCtrl", [
            "$modalInstance", "$scope", "processing", "$location",
            function($modalInstance, $scope, processing) {
                processing.initilize($scope);

                $scope.ok = function() {
                    $modalInstance.close();
                };

                $scope.cancel = function() {
                    $modalInstance.dismiss("cancel");
                };
            }
        ]);
})();