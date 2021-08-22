import { Http } from '@nativescript/core';
import Vue from 'nativescript-vue';
import Vuex from 'vuex';
Vue.use(Vuex);

const fs = require('tns-core-modules/file-system');
const storagePath = fs.path.join(fs.knownFolders.documents().path, "mdSongbook.json");
// const mbPath = fs.path.join(android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).toString(), "mdSongbook");
// const permissions = require("nativescript-permissions");

function readJSON(path) {
  var jsonFile = fs.File.fromPath(path);
  return new Promise(function (resolve, reject) {
    try {
      jsonFile.readText().then(function (content) {
        try {
          var content = JSON.parse(content);
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

function writeJSON(path, content) {
  var jsonFile = fs.File.fromPath(path);
  return new Promise(function (resolve, reject) {
    try {
      var data = JSON.stringify(content);
      jsonFile.writeText(data).then(function () {
        try {
          resolve(true);
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

// function readMb(path, sb) {
//   permissions.requestPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE, "Required to load .mb files")
//     .then(() => {
//       var folder = fs.Folder.fromPath(path);
//       try {
//         console.log(permissions.hasPermission(android.Manifest.permission.READ_EXTERNAL_STORAGE))
//         console.log(folder.path)
//       } catch (err) {
//         console.log(err);
//       }
//     })          
//     .catch(() => {
//       console.log("permission READ_EXTERNAL_STORAGE denied");
//     });
//   return sb;  
// }

export default new Vuex.Store({
  state: {
    query: "",
    songbook: [],
    song: {},
    zoom: 100,
    transposeBy: 0,
    addMinorChordMarker: false,
    showdown: {},
    feedback: {},
  },
  mutations: {
    query(state, q) {
      console.log(q)
      state.query = q;
    },
    songbook(state, sb) {
      state.songbook = sb;
    },
    song(state, s) {
      state.song = s;
    },
    zoom(state, z) {
      state.zoom = z;
    },
    transposeBy(state, value) {
      state.transposeBy = value;
      state.showdown.transposeby = value;
    },
    addMinorChordMarker(state, value) {
      state.addMinorChordMarker = value;
      state.showdown.addMinorChordMarker = value;
    },
    showdown(state) {
      var showdown  = require('showdown');
      require('../showdown.ext-sbmd');
      state.showdown = new showdown.Converter({extensions: ['sbmd']});
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
      };
      state.showdown.style = `<style>
        em {
          font-style: normal;
          text-decoration: underline;
        }
    
        h1 {
          position: relative;
          color: #333;
          font-size: 1.4em;
        }
    
        .sbmd-artist {
          float: right;
          font-size: 0.9em;
        }
    
        ul, ol {
          margin: 0;
          padding: 0 0 0 4.4em;
          color: #333;
        }
    
        ul {
          list-style: none;
        }
    
         ul li, ol li {
          margin: 6 0;
          line-height: 1.2em;
        }
    
        ul li::before {
          position: absolute;
          width: 4.2em;
          left: 0;
          content: attr(list);
          text-align: right;
        }
    
        .sbmd-ca {
          position: relative;
        }
    
        .sbmd-chord {
          position: absolute;
          font-size: 0.9em;
          bottom: 0.6em;
        }
    
        .sbmd-chord, .sbmd-chord-inline {
          font-weight: bold;
          white-space: nowrap;
        }
    
        .sbmd-chord sup {
          font-size: 0.6em;
        }
    
        .sbmd-has-chords {
          line-height: 1.9em;
        }
        </style>`;
    },
    feedback(state) {
            var FeedbackPlugin = require("nativescript-feedback");
      state.feedback = new FeedbackPlugin.Feedback();
    }
  },
  getters: {
    transposeByString(state) {
      return 'Transpose: ' + state.transposeBy;
    },
    zoomString(state) {
      return 'Zoom: ' + state.zoom + ' %';
    }
  },
  actions: {
    init({ commit }) {
      commit('feedback');
      commit('showdown');
      if (fs.File.exists(storagePath)) {
        readJSON(storagePath)
          .then(function(sb){
            commit("songbook", sb);
            console.log("file load from local file");
          }, function(error){
            console.log(error);
          });
      } else {
          const json = require("../assets/compiled.json")
          commit("songbook", json);
          console.log("file load from default asset");
        }
    },
    // loadLocalFile({ state, commit }) {
    //   if (fs.Folder.exists(mbPath)) {
    //     var compiled = readMb(mbPath,  state.songbook);       
    //     commit("songbook", compiled);
    //     writeJSON(storagePath, compiled)
    //       .then(function(){
    //         console.log("songbook saved");
    //       }, function(error){
    //         console.log(error);
    //       });
    //   } else {
    //     permissions.requestPermission(android.Manifest.permission.WRITE_EXTERNAL_STORAGE, "Required to load .mb files")
    //       .then(() => {
    //         android.os.Environment.getExternalStoragePublicDirectory(android.os.Environment.DIRECTORY_DOCUMENTS).getFolder("mdSongbook");
    //       })
    //       .catch(() => {
    //         console.log("could not create folder for .mb files");
    //       });
    //   }
    // },
    loadServer({ state, commit }) {
      console.log(state.songbook[0])
      Http.getJSON('https://www.genkidelic.de/songbook.php').then(
        (result) => {
          console.log(result)
          console.log(result.length + " songs loaded")
          commit("songbook", result);
          writeJSON(storagePath, result)
            .then(function(){
              console.log("songbook saved");
            }, function(error){
              console.log(error);
            });
        },
        e => {
          console.log(e);
        }
      )
    },
    loadDefault({ state, commit }) {
      const json = require("../assets/compiled.json")
      commit("songbook", json);
      console.log("file load from default asset");
    },
    transposeUp({ state, commit, dispatch }, param) {
      var value = ++state.transposeBy;
      value = value > 11 ? 0 : value;
      commit('transposeBy', value);
      if (param && param.showMessage)
        dispatch('showInfo', "Transpose: " + value);
    },
    transposeDown({ state, commit, dispatch }, param) {
      var value = --state.transposeBy;
      value = value < -11 ? 0 : value;
      commit('transposeBy', value);
      if (param && param.showMessage)
        dispatch('showInfo', "Transpose: " + value);
    },
    toggleMinorChordMarker({ commit, state }) {
      var value = !state.showdown.addMinorChordMarker;
      commit('addMinorChordMarker', value);
    },
    loadSong({ commit }, s) {
      commit('song', s);
    },
    updateQuery({ commit }, q) {
      commit('query', q);
    },
    setZoom({ commit }, z) {
      commit('zoom', z);
    },
    showInfo({ state }, message) {
      state.feedback.info({
        message: message,
        duration: 1500
      });
    },
  }
});
