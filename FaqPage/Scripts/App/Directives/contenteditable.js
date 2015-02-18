(function() {
    "use strict";

    angular.module("FaqApp.directives").directive("contenteditable", [
            function() {
                return {
                    require: "ngModel",
                    link: function($scope, element, attrs, ngModel) {
                        // view -> model
                        element.on("blur", function() {
                            $scope.$apply(function() {
                                ngModel.$setViewValue(element.html());
                            });
                        });

                        // model -> view
                        ngModel.$render = function() {
                            element.html(ngModel.$viewValue);
                        };

                        ngModel.$render();
                    }
                };
            }
        ]);
})();