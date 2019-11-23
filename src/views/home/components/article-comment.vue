<template>
<div class="comment">
      <!-- 评论列表 -->
      <!-- :immediate-check="false"  取消初始化的时候会自动调用一次load事件 -->
  <van-list v-model="loading"  @load="getCommentArr" :immediate-check="false" :finished="finished" finished-text="没有更多了">
    <div
      class="item van-hairline--bottom van-hairline--top"
      v-for="item in commentArr"
      :key="item.com_id.toString()"
    >
      <van-image round width="1rem" height="1rem" fit="fill" :src="item.aut_photo" />
      <div class="info">
        <p>
          <span class="name">{{item.aut_name}}</span>
          <span style="float:right">
            <span class="van-icon van-icon-good-job-o zan"></span>
            <span class="count">{{item.like_count}}</span>
          </span>
        </p>
        <p>{{item.content}}</p>
        <p>
          <span class="time">{{item.pubdate}}</span>&nbsp;
          <van-tag plain @click="showReply=true">{{item.reply_count}} 回复</van-tag>
        </p>
      </div>
    </div>
  </van-list>
  <!-- 底部输入框 -->
  <div class="reply-container van-hairline--top">
    <van-field v-model="value" placeholder="写评论...">
      <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
      <span class="submit" v-else slot="button">提交</span>
    </van-field>
  </div>
</div>
</template>

<script>
import { getReply } from '@/api/article'
export default {
  data () {
    return {
      // *************评论
      loading: false,
      finished: false,
      showReply: false,
      value: '',
      submiting: false,
      // 获取评论的请求参数
      reqParams: {
        type: 'a',
        source: this.$route.query.id.toString(),
        offset: null
      },
      // 评论渲染数据源
      commentArr: []
    }
  },
  methods: {
    async getCommentArr () {
      console.log(this.reqParams.offset)
      // 获取评论
      const comment = await getReply(this.reqParams)
      //   console.log(comment)
      //   取消加载中状态
      this.loading = false
      //   判断评论是否已经全部加载完成
      if (comment.last_id > comment.end_id) {
        // 加载下一页数据  需要上一次加载数据最后的ID
        this.reqParams.offset = comment.last_id
      } else {
        this.finished = true
      }
      // 追加数据
      this.commentArr.push(...comment.results)
    //   console.log(this.commentArr)
    }
    // onLoad () {
    //   this.loading = false
    //   this.offset++
    //   this.getCommentArr()
    // }
  },
  activated () {
    this.commentArr = []
    this.loading = true
    this.finished = false
    // 再次激活时需要将source和offset重置
    this.reqParams.source = this.$route.query.id.toString()
    this.reqParams.offset = null
    this.getCommentArr()
  }
}

// bug: 查看完有留言的，然后再切换至无留言的会把留言带过去。
// 解决：由于组件被缓存，所以组件再次被激活的时候需要将请求需要的参数再次重置
</script>

<style scoped lang="less">
// 评论样式
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
</style>
