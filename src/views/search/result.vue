<template>
  <div class="container">
    <van-nav-bar fixed title="搜索结果"  left-arrow @click-left="$router.back()" />

    <van-list @load="onLoad" v-model="loading"  :finished="finished" finished-text="查找不到你想要的┓(´∀`)┏">
      <van-cell-group>
        <!-- Cell单元格 自带的 to属性和 vue-router中的to属性是一样的 -->
        <!-- path对应query  name对应params -->
        <van-cell v-for="item in resultArr" :key="item.art_id" :to="{path:'/article',query:{id:item.art_id}}">
          <div class="article_item">
            <h3 class="van-ellipsis">{{item.title}}</h3>
            <div class="img_box" v-if="item.cover.type===3">
              <van-image class="w33" fit="cover" :src="item.cover.images[0]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[1]" />
              <van-image class="w33" fit="cover" :src="item.cover.images[2]" />
            </div>
            <div class="img_box" v-if="item.cover.type===1">
              <van-image class="w100" fit="cover" :src="item.cover.images[0]" />
            </div>
            <div class="info_box">
              <span>{{item.aut_name}}</span>
              <span>{{item.comm_count}}评论</span>
              <span>{{item.pubdate | timeFormat}}</span>
            </div>
          </div>
        </van-cell>
      </van-cell-group>
    </van-list>
  </div>
</template>

<script>
import { searchResult } from '@/api/article'
export default {
  data () {
    return {
      // 数据列表
      resultArr: [],
      // 传输的数据
      reqParams: {
        // 当前页码
        page: 1,
        // 每页的数量
        perPage: 10,
        // 当前查询关键词
        q: this.$route.query.q
      },
      // 正在加载
      loading: false,
      // 是否全部加载完成
      finished: false
    }
  },
  created () {
    this.getResult()
  },
  methods: {
    // 获取搜索结果
    async getResult () {
      const data = await searchResult(this.reqParams)
      // 追加数据
      this.resultArr.push(...data.results)
      // 结束加载效果
      this.loading = false
      if (!data.results.length) {
        this.finished = true
        return false
      }
      // console.log(data)
    },
    // 加载更多信息
    onLoad () {
      this.reqParams.page++
      this.getResult()
    }
  }
}
</script>

<style scoped lang='less'>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>
