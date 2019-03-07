<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <WebView :src="songHtml" @tap="closeSong" />
    </ScrollView>
  </Page>
</template>

<script>
  export default {
    props: ["song"],
    methods: {
      closeSong() {
        this.$navigateBack();
      },
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
