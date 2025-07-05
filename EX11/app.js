angular.module('calcApp', []).controller('CalcController', function($scope) {
  $scope.expression = '';
  $scope.result = '0';

  function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US';
    speechSynthesis.speak(msg);
  }

  $scope.append = function(value) {
    $scope.expression += value;
    speak(value);
    $scope.calculate();
  };

  $scope.clear = function() {
    $scope.expression = '';
    $scope.result = '0';
    speak('Clear');
  };

  $scope.backspace = function() {
    $scope.expression = $scope.expression.slice(0, -1);
    speak('Backspace');
    $scope.calculate();
  };

  $scope.calculate = function() {
    try {
      if ($scope.expression) {
        $scope.result = eval($scope.expression);
      } else {
        $scope.result = '0';
      }
    } catch {
      $scope.result = 'Err';
    }
  };

  $scope.evaluate = function() {
    $scope.calculate();
    speak(`Result is ${$scope.result}`);
    $scope.expression = $scope.result.toString();
  };
});
