$(document).ready(function(){

  function toDate(dateStr) {
    const [day, month, year] = dateStr.split("/") ;
    return new Date(year, month - 1, day) ;
  }

  function formattedDate(d = new Date) {
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
  }

  var arr = $.map(mydata, function (o){ return toDate(o['DATEMAJ']); });
  var datemax = new Date(Math.max.apply(this,arr)) ;
  $('#mydata_maxdatemaj').text(formattedDate(datemax));

  var filteringData = {'TYPE_ENTITE': [], 'COUV_GEO': [], 'POLPUBLIQUE': [], 'LICENCE': [], 'NOM_ENTITE': []}

  filteringDataKeys = Object.keys( filteringData );


  $.each(mydata, function (key, data) {
      $.each(filteringDataKeys, function(item, key){
        filteringData[key].push(data[key]);
        filteringData[key].sort();
      })
  })

  $.each(filteringData, function(key, data){
    filteringData[key] = filteringData[key].filter(function(itm,i,a){
        return i==a.indexOf(itm);
    });
    filteringData[key].sort();
  })

  var template = $('#template').html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, filteringData);
  $('#target').html(rendered);

  initSliders();

  var FJS = FilterJS.auto(mydata)

  FJS.addCallback('afterFilter', function(result){
    $('#mydata_count').text(result.length);
  });

  FJS.addCriteria({field: 'TYPE_ENTITE', ele: '#type_entite_criteria input:radio'});
  FJS.addCriteria({field: 'LICENCE', ele: '#licence_criteria input:radio'});
  FJS.addCriteria({field: 'COUV_GEO', ele: '#couv_geo_criteria input:radio'});
  FJS.addCriteria({field: 'NOM_ENTITE', ele: '#nom_entite_criteria input:radio'});
  FJS.addCriteria({field: 'POLPUBLIQUE', ele: '#polpublique_criteria input:radio'});
  FJS.filter();

  window.FJS = FJS;
});

function initSliders(){
  $("#rating_slider").slider({
    min: 8,
    max: 10,
    values:[8, 10],
    step: 0.1,
    range:true,
    slide: function( event, ui ) {
      $("#rating_range_label" ).html(ui.values[ 0 ] + ' - ' + ui.values[ 1 ]);
      $('#rating_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

  $("#runtime_slider").slider({
    min: 50,
    max: 250,
    values:[0, 250],
    step: 10,
    range:true,
    slide: function( event, ui ) {
      $("#runtime_range_label" ).html(ui.values[ 0 ] + ' mins. - ' + ui.values[ 1 ] + ' mins.');
      $('#runtime_filter').val(ui.values[0] + '-' + ui.values[1]).trigger('change');
    }
  });

}

function linkify(inputText) {
  //console.log(inputText)
    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank"><i class="external icon"></i></a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank"><i class="external icon"></i></a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    replacedText = replacedText.replace(new RegExp('\r?\n','g'), '<br />');


    return replacedText;
}

function qualcolor (val) {
  switch (true) {
    case (val<40): return "grey" ; break;
    case (val<60): return "yellow" ; break;
    case (val<80): return "olive" ; break;
    default: return "green" ; break;
  }




}
