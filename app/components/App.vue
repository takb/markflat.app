<script src="http://localhost:8098"></script>

<template>
  <Page @loaded="appLoaded">
    <ActionBar col="0" row="0">
        <GridLayout width="100%" columns="48, *">
            <Button text="" @tap="toggleMenu" col="0" class="fa button-icon" />
            <SearchBar :test="query" hint="Search songs..." col="1" />
        </GridLayout>
    </ActionBar>
  <RadSideDrawer ref="drawer" showOverNavigation="1">
    <StackLayout ~drawerContent backgroundColor="#ffffff">
      <Label class="drawer-header" text="Songbook file" />
      <Label class="drawer-item" text="choose local songbook file" @tap="loadLocalFile" />
      <Label class="drawer-header" :text="transposeByString" />
      <Label class="drawer-item" text="transpose up" @tap="transposeUp" />
      <Label class="drawer-item" text="transpose down" @tap="transposeDown" />
      <Label class="drawer-header" :text="zoomString" />
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
  import { mapActions, mapState, mapGetters } from 'vuex'
  export default {
    components: {
      List, Song
    },
    computed: {
      ...mapState(['query']),
      ...mapGetters(['transposeByString', 'zoomString'])
    },
    methods: {
      appLoaded() {
        this.$store.dispatch("init");
      },
      toggleMenu() {
        this.$refs.drawer.nativeView.toggleDrawerState();
      },
      ...mapActions(['transposeUp', 'transposeDown', 'toggleMinorChordMarker', 'updateQuery']),
      loadLocalFile() {

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
    background-color: #666;
    color: #ffffff;
    font-size: 24;
  }
  .drawer-item {
    padding: 8 16;
    color: #333333;
    font-size: 16;
  }
</style>
