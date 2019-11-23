<template>
  <div class="container">
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{articleDetail.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="articleDetail.aut_photo" />
        <div class="text">
          <p class="name">{{articleDetail.aut_name}}</p>
          <p class="time">{{articleDetail.pubdate}}</p>
        </div>
        <van-button
          @click="changeFllowingStatus(articleDetail.aut_id)"
          round
          size="small"
          type="info"
        >{{articleDetail.is_followed?"已关注":"+ 关注"}}</van-button>
      </div>
      <div class="content">
        <p v-html="articleDetail.content"></p>
      </div>
      <div class="zan">
        <van-button
          round
          size="small"
          :class="{active:articleDetail.attitude===1}"
          plain
          icon="like-o"
          @click="changeAttitude(1)"
        >点赞</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button
          round
          size="small"
          :class="{active:articleDetail.attitude===0}"
          plain
          icon="delete"
          @click="changeAttitude(0)"
        >不喜欢</van-button>
      </div>

    <!-- 评论区域 -->
    <article-comment></article-comment>
    </div>
  </div>
</template>

<script>
import {
  getArticleDetails,
  likings,
  unLikings,
  dislikes,
  unDislikes
} from '@/api/article'
import { following, unFollowing } from '@/api/user'
import articleComment from './components/article-comment'

export default {
  data () {
    return {
      // 文章详情渲染数据源
      articleDetail: {
        title: null,
        // 作者名称
        aut_name: null,
        // 文章状态
        attitude: null,
        // 是否关注
        is_followed: null,
        // 文章id
        art_id: null
      }

    }
  },
  components: {
    'article-comment': articleComment
  },
  async activated () {
    // 获取文章详情
    const data = await getArticleDetails(this.$route.query.id)
    // console.log(data)
    this.articleDetail = data
  },
  methods: {
    // 更改关注状态
    changeFllowingStatus (id) {
      try {
        // 判断当前状态
        if (this.articleDetail.is_followed === false) {
          // 已关注： 取消关注
          unFollowing(id)
          this.articleDetail.is_followed = true
        } else {
          // 未关注：添加关注
          following(id)
          this.articleDetail.is_followed = false
        }
        this.$toast.success('操作成功')
      } catch (error) {
        this.$toast.fail('操作失败')
      }
    },
    // 更改对文章的态度
    changeAttitude (status) {
      try {
        const id = this.articleDetail.art_id
        if (status === 1) {
          if (this.articleDetail.attitude === 1) {
            // 取消点赞
            unLikings(id)
            this.articleDetail.attitude = -1
          } else {
            // 点赞
            likings(id)
            this.articleDetail.attitude = 1
          }
        } else {
          if (this.articleDetail.attitude === 0) {
            // 取消不喜欢
            unDislikes(id)
            this.articleDetail.attitude = -1
          } else {
            // 不喜欢文章
            dislikes(id)
            this.articleDetail.attitude = 0
          }
        }
        this.$toast.success('操作成功')
      } catch (error) {
        this.$toast.fail('操作失败')
      }
    }

  }

}
</script>

<style scoped lang="less">
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  // height: 1000%;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan {
    text-align: center;
    padding: 10px 0;
    .active {
      border-color: red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
    /deep/ code {
      white-space: pre-wrap;
    }
  }
}
</style>
