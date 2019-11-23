<template>
  <!-- Popup 弹出层 -->
  <!-- 这里加@input是因为鼠标点击其它位置的时候需要隐藏弹出层 -->
  <van-popup :value="value" @input="$emit('input')">
  <!-- <van-popup :value="value"> -->
    <van-cell-group v-if="!isReport">
      <van-cell @click.stop="disLike">不感兴趣</van-cell>
      <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
      <van-cell @click="blackList">拉黑作者</van-cell>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
      <van-cell @click="report(item.value)" v-for="item in reports" :key="item.value">{{item.label}}</van-cell>
      <!-- <van-cell>色情</van-cell>
      <van-cell>暴力</van-cell>
      <van-cell>低俗</van-cell>
      <van-cell>不适</van-cell>
      <van-cell>错误</van-cell>
      <van-cell>其他</van-cell> -->
    </van-cell-group>
  </van-popup>
</template>

<script>
import { disLike, report, blackList } from '@/api/article'
import { reports } from '@/api/contains'

export default {
  props: {
    //  接收value
    value: {
      type: Boolean,
      default: false
    },
    // 接收 不感兴趣的id
    articleID: {
      type: String,
      default: null
    },
    // 接受拉黑作者的id
    blackID: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      isReport: false,
      reports
    }
  },
  methods: {
    // 拉黑作者
    async blackList () {
      try {
        await blackList(this.blackID)
        // 隐藏弹出层
        this.$emit('input', false)
        this.$toast.success('拉黑成功!')
      } catch (error) {
        this.$toast.fail('拉黑失败!')
      }
    },
    // 不感兴趣
    async disLike () {
      // console.log(111)
      try {
        await disLike(this.articleID)
        // 关闭弹出框
        this.$emit('input', false)
        // 提示成功
        this.$toast.success('操作成功!')
        // 通知父组件 操作成功了
        this.$emit('dislike')
      } catch (error) {
        this.$toast.fail('操作失败!')
      }
    },
    // 举报文章
    async report (type) {
      try {
        await report(this.articleID, type)
        // 取消弹出框
        this.$emit('input', false)
        // 通知父组件举报成功
        this.$emit('report')
        // 提示
        this.$toast.success('举报成功')
      } catch (error) {
        // 判断是否重复举报
        if (error.response.status === 409) {
          return this.$toast.fail('请勿重复举报')
        }
        this.$toast.fail('举报失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
// 弹出层样式-举报
.van-popup {
  width: 80%;
  border-radius: 4px;
}
</style>
