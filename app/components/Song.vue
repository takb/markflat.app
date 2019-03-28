<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <WebView :src="songHtml" @tap="close" @swipe="onSwipe" @pinch="onPinch" @loaded="webviewLoaded" />
    </ScrollView>
  </Page>
</template>

<script>
import { mapActions, mapState } from 'vuex'
  export default {
    methods: {
      close() {
        this.$navigateBack();
      },
      ...mapActions(['transposeUp', 'transposeDown', 'setZoom']),
      onSwipe(e) {
        if (e.direction == 1)
          this.transposeUp({showMessage: true});
        if (e.direction == 2)
          this.transposeDown({showMessage: true});
      },
      onPinch(e) {
        if (e.state == 2)
          this.setZoom(Math.floor(e.scale * 100));
      },
      webviewLoaded(webview) { // hack required to handle swipe events without interference
        if (webview.object.android) {
            webview.object.android.getSettings().setBuiltInZoomControls(false);
        }
      }
    },
    computed: {
      ...mapState(['showdown', 'song', 'zoom', 'transposeBy', 'addMinorChordMarker']),
      songHtml() {
        var reactToChange = this.transposeBy;
        reactToChange = this.addMinorChordMarker;
        this.showdown.zoom = this.zoom;
        return this.showdown.makeHtml(this.song.md);
      }
    }
  }
</script>
