<template>
  <div id="app">
    <keep-alive>
      <!-- 区分一级路由中的article，并开启缓存组件 -->
    <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <!-- <router-view></router-view> -->
  </div>
</template>

<style lang="less"></style>
