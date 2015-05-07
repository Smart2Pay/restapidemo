paymentsApp.filter('formatJson', function (){
  return function(input) {
    if(!input) return input;
    var output = input
      //replace possible line breaks.
      .replace(/(\r\n|\r|\n)/g, '<br/>')
      //replace tabs
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;')
      //replace spaces.
      .replace(/ /g, '&nbsp;');

      return output;
  };
});

paymentsApp.filter('cleanJson', function (){
  return function(input) {
    if(!input) return input
    if(typeof input == 'object') return input
    var output = input
      .replace(/(<br>)/g, '')
      .replace(/(<br\/>)/g, '')
      .replace(/ /g, '')
      .replace(/(\\)/g, '')
      .replace(/&nbsp;/g, '')
      .replace(/'/g,'"')
      return JSON.parse(output);
  };
});

paymentsApp.filter('cleanHtml', function (){
  return function(input) {
    if(!input) return input
    console.log('input:' + input)
    if(typeof input == 'object') return input
    var output = input
      .replace(/(<br>)/g, '')
      .replace(/(<br\/>)/g, '')
      .replace(/(amp;)/g, '')
      console.log('output:' + output)
      return output;
  };
});
