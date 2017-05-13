var mydata = (function () {
  var json = null;
  $.ajax({
    'async': false,
    'global': false,
    'url': "./data/data.json",
    'dataType': "json",
    'success': function (data) {
      json = data;
    }
  });
  return json;
})();
