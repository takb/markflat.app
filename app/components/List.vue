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
  import { mapActions, mapState } from 'vuex'
  export default {
    methods: {
      ...mapActions(['loadSong']),
      openSong(e) {
        this.loadSong(e.item);
        this.$navigateTo(Song);
      },
      songSort(a,b) {
        return ('' + a.title).localeCompare(b.title)
      },
    },
    computed: {
      ...mapState(['query', 'songbook']),
      filteredSongs() {
        console.log(this.query)
        if (!this.query)
          return this.songbook.sort(this.songSort);
        var r = new RegExp(this.query, 'i');
        return this.songbook.filter(song => r.exec(song.title) || r.exec(song.artist)).sort(this.songSort);
      }
    }
  }
</script>

<style scoped>
  .list-item {
    padding: 8;
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
