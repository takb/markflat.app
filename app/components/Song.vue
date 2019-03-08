<template>
  <Page actionBarHidden="true">
    <ScrollView @swipe="onSwipe">
      <WebView :src="songHtml" @tap="closeSong"/>
    </ScrollView>
  </Page>
</template>

<script>
  var gestures = require("tns-core-modules/ui/gestures");
  export default {
    props: ["song"],
    methods: {
      closeSong() {
        this.$navigateBack();
      },
      transposeUp() {
        this.$store.commit("transposeUp");
      },
      transposeDown() {
        this.$store.commit("transposeDown");
      },
      onSwipe (e) {
        switch(e.direction) {
          case 2:
            this.transposeDown();
            break;
          case 6:
            this.transposeUp();
            break;
          default:
            break;
        }
      }
    },
    computed: {
      title() {
        return this.$props.song.title;
      },
      artist() {
        return this.$props.song.artist;
      },
      songHtml() {
        return this.$store.state.showdown.makeHtml(this.$props.song.md);
      }
    }
  }
</script>
