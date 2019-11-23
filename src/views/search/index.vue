<template>
  <div class="container">
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()" />
    <!-- Search 搜索 -->
    <van-search v-model.trim="query" placeholder="请输入搜索关键词" shape="round" @search="onSearch" />
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="query">
      <van-cell icon="search" v-for="item in queryArr" :key="item">
        <!-- <p>{{item | formatSuggest(query,queryArr)}}</p> -->
        <p v-html="$options.filters.formatSuggest(item,query,queryArr)"  @click="enterResult(item)"></p>
        <!-- <p v-html="item"></p> -->
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <div class="history-box" v-else-if="historyArr.length">
      <div class="head">
        <span>历史记录</span>
        <van-icon name="delete" @click="historyArr=[]"></van-icon>
      </div>
      <van-cell-group>
        <van-cell v-for="(item,index) in historyArr" :key="item">
          <a class="word_btn" @click="$router.push({ path: '/search/result', query: { q: item } })">{{item}}</a>
          <van-icon class="close_btn" slot="right-icon" name="cross" @click="clearCurrentHistory(index)" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { suggest } from '@/api/article'
// import { formatSuggest } from './filter/format-suggest'
const KEY = 'toutiao-m-history-key'
export default {
  data () {
    return {
      // 查询字符
      query: null,
      // 历史记录
      historyArr: JSON.parse(window.localStorage.getItem(KEY)) || [],
      // 联想关键字
      queryArr: [],
      // 定时器
      timer: null,
      abc: []
    }
  },
  methods: {
    // 搜索关键字
    onSearch () {
      // this.historyArr.push(this.query)
      this.historyArr = new Set(this.historyArr).add(this.query)
      // console.log(this.historyArr)
      window.localStorage.setItem(KEY, JSON.stringify([...this.historyArr]))
      this.$router.push({ path: '/search/result', query: { q: this.query } })
    },
    // 进入联想结果
    enterResult (keyword) {
      this.query = keyword.toLowerCase()
      this.onSearch()
    },
    // 清除当前历史记录
    clearCurrentHistory (index) {
      this.historyArr.splice(index, 1)
    }
  },
  watch: {
    // 监听输入框信息
    query () {
      if (!this.query) {
        // 防止光速删除搜索关键字出现问题
        clearTimeout(this.timer)
        return false
      }
      clearTimeout(this.timer)
      this.timer = window.setTimeout(async () => {
        const data = await suggest(this.query)
        this.queryArr = data.options
        // this.queryArr = data.options.map(item => item.toLowerCase().replace(this.query, `<span>${this.query}</span>`))
      }, 400)
    }
    // queryArr () {
    //   this.abc = this.queryArr.map(item => item.toLowerCase().replace(this.query, `<span>${this.query}<span>`))
    // }
  },
  filters: {
    formatSuggest (origin, target, queryArr) {
      // console.log(origin)
      // console.log(target)
      // console.log(this)
      // if (!target) return false
      const data = origin.toLowerCase().replace(target, `<span>${target}</span>`)
      // console.log(data)
      queryArr = []
      queryArr.push(data)

      return data
    }
  }
}
</script>

<style scoped lang='less'>
// 历史记录
.history-box {
  padding: 0 20px;
  .head {
    line-height: 36px;
    color: #999;
    .van-icon {
      font-size: 16px;
      float: right;
      margin-top: 10px;
    }
  }
  .van-cell {
    padding: 10px 0;
  }
  .word_btn {
    color: #3296fa;
  }
  .close_btn {
    margin-top: 5px;
    color: #999;
  }
}

// 联想搜索
.suggest-box {
  /deep/ .van-cell {
    padding: 10px 20px;
    color: #999;
    p {
      span {
        color: red;
      }
    }
  }
}
</style>
