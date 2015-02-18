(function() {
    "use strict";
    angular.module("FaqApp.controllers").controller("SelectFaqForEditCtrl", [
            "processing", "$scope", "faqService", "$modal", "$jq",
            function (processing, $scope, faqService, $modal, $jq) {
                processing.initilize($scope);

                $scope.viewDeferred = faqService.faqRepository.getRootFolders();
                $scope.viewDeferred.then(function (folders) {
                    $scope.folders = folders;
                    faqService.faqRepository.folder = null;

                    $scope.$apply();
                }, function(error) {
                    alert(error.message);
                });

                $scope.editFaqSet = function(folder) {
                    $scope.go(String.format("/ManageFaqSet/{0}", folder.title));
                };

                $scope.deleteFaqSet = function(folder) {
                    var modalInstance = $modal.open({
                        templateUrl: "deleteFaqModal.html",
                        controller: "ModalInstanceCtrl",
                        size: "sm"
                    });

                    modalInstance.result.then(function() {
                        $scope.viewDeferred = faqService.faqRepository.deleteItem(folder);
                        $scope.viewDeferred.then(function () {
                            var indexToRemove = -1;
                            Array.forEach($scope.folders, function(currentFolder, index) {
                                if (currentFolder.id === folder.id) {
                                    indexToRemove = index;
                                    return;
                                }
                            });
                            if (indexToRemove > -1) {
                                $scope.folders.splice(indexToRemove, 1);
                            }

                            $scope.$apply();
                        }, function(error) {
                            alert(error.message);
                        });
                    }, function() {});
                };

                $scope.revertFolderName = function($repeatScope, folder) {
                    folder.title = folder.initialName;
                    $repeatScope.changed = $repeatScope.submitted = false;
                };

                $scope.initScope = function($repeatScope, folder) {
                    folder.initialName = folder.title;
                    $repeatScope.$watch("folder.title", function() {
                        $repeatScope.folder.fileLeafRef = $repeatScope.folder.title;
                    });
                };

                $scope.changeFolderName = function($repeatScope, folder) {
                    $repeatScope.submitted = true;

                    if ($repeatScope.faqSetForm.$invalid) return;

                    var hasDuplicateName = $jq.grep($repeatScope.folders, function (currentFolder) {
                        if (currentFolder.id === folder.id && currentFolder != folder) return true;

                        return false;
                    }).length > 0;

                    if (hasDuplicateName) {
                        $repeatScope.folderExists = true;
                        return;
                    }

                    $scope.viewDeferred = faqService.faqRepository.saveItem(folder);
                    $scope.viewDeferred.then(function () {
                        folder.initialName = folder.title;
                        $repeatScope.changed = $repeatScope.submitted = false;

                        $scope.$apply();
                    }, function(error) {
                        $repeatScope.folderExists = (error.errorCode === FAQ.ErrorCodes.FolderAlreadyExists);
                        $repeatScope.illegalCharacter = (error.errorCode === FAQ.ErrorCodes.IllegalName);
                        if (!$repeatScope.folderExists && !$repeatScope.illegalCharacter) {
                            $repeatScope.commonError = true;
                            $repeatScope.errorMessage = error.message;
                        }

                        $scope.$apply();
                    });
                };
            }
        ]);
})();