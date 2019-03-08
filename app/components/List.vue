<template>
  <Page actionBarHidden="true">
    <ScrollView>
      <ListView for="item in filteredSongs" @itemTap="openSong">
        <v-template>
          <DockLayout class="list-item">
            <Label :text="item.title" class="song-title" dock="left" />
            <Label :text="item.artist" class="song-artist" dock="right" />
          </DockLayout>
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

<style scoped>
  .list-item {
    margin: 4;
    padding: 4;
  }
  .song-title {
    font-size: 16;
    font-weight: bold;
  }
  .song-artist {
    font-size: 14;
    text-align: right;
  }
</style>
