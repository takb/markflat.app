import Vue from 'nativescript-vue';
import Vuex from 'vuex';
Vue.use(Vuex);
import showdown from 'showdown'
require('../showdown.ext-sbmd');

function readJSON(path) {
  var fs = require('tns-core-modules/file-system');
  var jsonFile = fs.knownFolders.currentApp().getFile(path);
  return new Promise(function (resolve, reject) {
    try {
      jsonFile.readText().then(function (content) {
        try {
          var data = JSON.parse(content);
          resolve(content);
        }
        catch (err) {
          reject(err);
        }
      });
    }
    catch (err) {
      reject(err);
    }
  });
}

export default new Vuex.Store({
  state: {
    query: "",
    songbook: [],
    showdown: {}
  },
  mutations: {
    transposeUp(state) {
      state.showdown.transposeby++;
      if (state.showdown.transposeby > 11)
        state.showdown.transposeby = 0;
    },
    transposeDown(state) {
      state.showdown.transposeby--;
      if (state.showdown.transposeby < -11)
        state.showdown.transposeby = 0;
    },
    toggleMinorChordMarker(state) {
      state.showdown.addMinorChordMarker = !state.showdown.addMinorChordMarker;
    },
    query(state, q) {
      state.query = q;
    },
    loadSongbook(state, file) {
      readJSON(file)
        .then(function(sb){
          state.songbook = sb
        }, function(error){
          console.log(error);
        });
    },
    storeSongbook(state, sb) {
      state.songbook = sb
    },
    initShowdown(state) {
      state.showdown = new showdown.Converter({extensions: ['sbmd']})
      state.showdown.addMinorChordMarker = false;
      state.showdown.transposeby = 0;
      state.showdown.transpose = function(key) {
        if (key && this.transposeby != undefined && this.transposeby != 0) {
          var isMinor = key.match(/^[a-g]/);
          var scale = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
          if (key.length > 1 && key[key.length - 1] == 'b') {
            scale = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
          }
          key = key.length > 1 ? key[0].toUpperCase() + key.substr(1, key.length - 1) : key.toUpperCase();
          if (scale.indexOf(key) >= 0) {
            var i = (scale.indexOf(key) + this.transposeby) % scale.length;
            key = scale[ i < 0 ? i + scale.length : i ];
            if (isMinor) {
                key = key.toLowerCase();
            }
          } else {
            console.log('transpose failed', key, scale)
          }
        }
        return key;
      }
    }
  }
});
