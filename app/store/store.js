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
      state.showdown =  new showdown.Converter({extensions: ['sbmd']});
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
      const json = require("../assets/compiled.json")
      commit("songbook", json);
    },
    loadSongbook(state, file) {
      readJSON(file)
        .then(function(sb){
          state.songbook = sb
        }, function(error){
          console.log(error);
        });
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
      console.log(q)
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
