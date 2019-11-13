<template>
  <div class="container">
    <van-swipe :autoplay="3000" indicator-color="white" :height="300">
      <van-swipe-item>1</van-swipe-item>
      <van-swipe-item>2</van-swipe-item>
      <van-swipe-item>3</van-swipe-item>
      <van-swipe-item>4</van-swipe-item>
    </van-swipe>
  </div>
</template>

<script>
export default {}
</script>

<style scope lang="less">
.van-swipe-item{
  background-color: skyblue;
  text-align: center;
  line-height: 300px;
  font-size: 50px;
}
</style>
