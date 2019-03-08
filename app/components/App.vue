<script src="http://localhost:8098"></script>

<template>
  <Page @loaded="appLoaded">
    <ActionBar col="0" row="0">
        <GridLayout width="100%" columns="48, *">
            <Button text="" @tap="$refs.drawer.nativeView.toggleDrawerState()" col="0" class="fa button-icon" />
            <SearchBar :text="query" @textChange="updateQuery" hint="Search songs..." col="1" />
        </GridLayout>
    </ActionBar>

  <RadSideDrawer ref="drawer" showOverNavigation="1">
    <StackLayout ~drawerContent backgroundColor="#ffffff">
        <Label class="drawer-header" :text="transpose"/>

        <Label class="drawer-item" text="transpose up" @tap="transposeUp" />
        <Label class="drawer-item" text="transpose down" @tap="transposeDown" />
    </StackLayout>

    <Frame ~mainContent>
      <List />
    </Frame>
  </RadSideDrawer>
</Page>
</template>

<script>
  import List from './List'
  import Song from './Song'
  export default {
    components: {
      List, Song
    },
    computed: {
      query() {
        return this.$store.state.query;
      },
      transpose() {
        return 'Transpose: ' + this.$store.state.showdown.transposeby;
      }
    },
    methods: {
      transposeUp() {
        this.$store.commit("transposeUp");
      },
      transposeDown() {
        this.$store.commit("transposeDown");
      },
      toggleMinorChordMarker() {
        this.$store.commit("toggleMinorChordMarker");
      },
      updateQuery(e) {
        this.$store.commit("query", e.value);
      },
      appLoaded() {
        const json = require("../assets/compiled.json")
        this.$store.commit("storeSongbook", json);
        this.$store.commit("initShowdown");
      }
    },
  }
</script>

<style scoped>
  ActionBar {
    background-color: #ffffff;
    color: #666666;
  }
  .drawer-header {
    padding: 8;
    background-color: #333;
    color: #ffffff;
    font-size: 24;
  }
  .drawer-item {
    padding: 8 16;
    color: #333333;
    font-size: 16;
  }
</style>
