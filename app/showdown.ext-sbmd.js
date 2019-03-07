define(function () {
  var artist = {
    type: 'lang',
    regex: /(# .*?)\s-\s(.*)$/mg,
    replace: '$1<span class="sbmd-artist"> - $2</span>'
  };
  var elements = {
    type: 'lang',
    filter: function (text, converter, options) {
      return text.replace(/\~(.*?)[ \t]+([\s\S ]*?)(?=\~|^\d+\. |^$)/mg, function(match, block, content) {
        return '<ul><li list="'+block+'">'+converter.makeHtml(content).replace(/\<\/?p\>/g, '')+'</li></ul>';
      });
    }
  };
  var chords = {
    type: 'lang',
    filter: function (text, converter, options) {
      return text.replace(/\{(.+?)\}([a-zA-Z\' ]|_[a-zA-Z ]_|\.|$)/g, function(match, p1, p2) {
        var chord = p1.replace(/^([a-gA-G][#b]?m?)(.*?)(?:\/([a-gA-G][#b]?))?$/g, function(match, key = '', modifier = '', bass = '') {
          if (typeof converter.transpose == 'function') {
            key = converter.transpose(key);
            bass = converter.transpose(bass);
          }
          key = converter.addMinorChordMarker ? key.replace(/^([a-g][#b]?(?!m))$/, '$1'.toUpperCase()+'m') : key;
          // key = key.replace(/#/g, '\u266F').replace(/(?!^)b/g, '\u266D');
          modifier = modifier.replace(/(\d+)\+/g, 'maj$1').replace(/^.(2|4)$/g, 'sus$1');//.replace(/#/g, '\u266F').replace(/b/g, '\u266D');
          // bass = bass.replace(/#/g, '\u266F').replace(/([a-gA-G])b/g, '$1\u266D');
          return key+(modifier ? '<sup>'+modifier+'</sup>' : '')+(bass ? '<sub>/'+bass+'</sub>' : '');
        });
        var base = p2 != '.' ? p2.replace(' ', '&nbsp;&nbsp;&nbsp;') : '';
        return base ? '<span class="sbmd-ca"><span class="sbmd-chord">'+chord+'</span>'+base+'</span>' : '<span class="sbmd-chord-inline">'+chord+'</span>';
      })
      .replace(/\{(\.\.\.|\:?\|\|?\:?|\')\}([a-zA-Z ]|_[a-zA-Z ]_|\.|$)/g, function (match, tag, base) {
        var base = base != '.' ? p2.replace(' ', '&nbsp;&nbsp;&nbsp;') : '';
        return base ? '<span class="sbmd-ca"><span class="sbmd-chord">'+tag+'</span>'+base+'</span>' : '<span class="sbmd-chord-inline">…</span>';
      });
    }
  };
  return [artist, elements, chords];
});