<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <ListView for="item in filteredSongs" @itemTap="openSong">
        <v-template>
          <Label :text="item.title" />
        </v-template>
      </ListView>
    </ScrollView>
  </Page>
</template>

<script>
  import Song from './Song'
  export default {
    methods: {
      openSong(e) {
        this.$navigateTo(Song, {props: {"song":  e.item}});
      },
      songSort(a,b) {
        return ('' + a.title).localeCompare(b.title)
      },

    },
    computed: {
      filteredSongs() {
        var query = this.$store.state.query;
        var filteredArray = this.$store.state.songbook;
        if (query) {
          var r = new RegExp(query, 'i');
          filteredArray = filteredArray.filter(song => r.exec(song.title) || r.exec(song.artist));
        }
        return filteredArray.sort(this.songSort);
      }
    }
  }
</script>
