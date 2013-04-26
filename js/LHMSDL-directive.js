/**
 * Created with JetBrains WebStorm.
 * User: Robert
 * Date: 13-04-26
 * Time: 00:01
 * To change this template use File | Settings | File Templates.
 */

Directives.directive('PlayerTag',function(){
    var directiveDefinitionObject = {
        restrict:'EA',
        template: '<div></div>',
        compile: function compile(tElement, tAttrs) {
            return function postLink(scope, iElement, iAttrs) {

            }
        }
    };
    return directiveDefinitionObject;
});

Directives.directive("drag", ["$rootScope", function($rootScope) {

    function dragStart(evt, element, dragStyle) {
        element.addClass(dragStyle);
        evt.dataTransfer.setData("id", evt.target.id);
        evt.dataTransfer.effectAllowed = 'move';
    };
    function dragEnd(evt, element, dragStyle) {
        element.removeClass(dragStyle);
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            attrs.$set('draggable', 'true');
            scope.dragData = scope[attrs["drag"]];
            scope.dragStyle = attrs["dragstyle"];
            element.bind('dragstart', function(evt) {
                $rootScope.draggedElement = scope.dragData;
                dragStart(evt, element, scope.dragStyle);
            });
            element.bind('dragend', function(evt) {
                dragEnd(evt, element, scope.dragStyle);
            });
        }
    }
}]);

Directives.directive("drop", ['$rootScope', function($rootScope) {

    function dragEnter(evt, element, dropStyle) {
        evt.preventDefault();
        element.addClass(dropStyle);
    };
    function dragLeave(evt, element, dropStyle) {
        element.removeClass(dropStyle);
    };
    function dragOver(evt) {
        evt.preventDefault();
    };
    function drop(evt, element, dropStyle) {
        evt.preventDefault();
        element.removeClass(dropStyle);
    };

    return {
        restrict: 'A',
        link: function(scope, element, attrs)  {
            scope.dropData = scope[attrs["drop"]];
            scope.dropStyle = attrs["dropstyle"];
            element.bind('dragenter', function(evt) {
                dragEnter(evt, element, scope.dropStyle);
            });
            element.bind('dragleave', function(evt) {
                var rect = this.getBoundingClientRect();
                //if(evt.clientX < rect.left || evt.clientX >rect.right || evt.clientY<rect.top||evt.clientY>rect.bottom){
                dragLeave(evt, element, scope.dropStyle);
                //}
            });
            element.bind('dragover', dragOver);
            element.bind('drop', function(evt) {
                drop(evt, element, scope.dropStyle);
                $rootScope.$broadcast('dropEvent', $rootScope.draggedElement,element/* scope.dropData*/);
            });
        }
    }
}]);