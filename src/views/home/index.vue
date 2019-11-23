<template>
  <div class="container">
    <!-- Tab 标签页 -->
    <van-tabs swipeable v-model="activeChannel" :lazy-render="false" @change="changeChannel">
      <van-tab :key="myChannel.id" v-for="myChannel in myChannels" :title="myChannel.name">
        <div class="scroll-wrapper" ref="scrollWrapper" @scroll="scroll">
          <!-- PullRefresh 下拉刷新组件 -->
          <van-pull-refresh
            v-model="myChannel.isLoading"
            :success-text="refreshSuccessText"
            @refresh="onRefresh"
          >
            <!-- List 列表组件,实现上拉加载 -->
            <van-list
              v-model="myChannel.loading"
              :finished="myChannel.finished"
              finished-text="┓(´∀`)┏已经没有了"
              @load="onLoad"
            >
              <!-- item.aut_id.toString()  因为这个数据被bigInt处理过，所以使用toString转换成字符串 -->
              <van-cell v-for="item in myChannel.list" :key="item.aut_id.toString()" :to="{path:'/article',query:{id:item.art_id}}">
                <div class="article_item">
                  <h3 class="van-ellipsis">{{item.title}}</h3>
                  <!-- 三图 -->
                  <div class="img_box" v-if="item.cover.type === 3">
                    <!-- lazy-load 开启图片懒加载 -->
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                    <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]" />
                  </div>
                  <!-- 单图 -->
                  <div class="img_box" v-if="item.cover.type === 1">
                    <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
                  </div>
                  <div class="info_box">
                    <span>{{item.aut_name}}</span>
                    <span>{{item.comm_count}}评论</span>
                    <span>{{item.pubdate | timeFormat}}</span>
                    <!-- 阻止事件冒泡 .stop -->
                    <span class="close" v-if="token.token" @click.stop="report(item)">
                      <van-icon name="cross"></van-icon>
                    </span>
                  </div>
                </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>
        </div>
      </van-tab>
    </van-tabs>
    <span class="bar_btn" slot="nav-right">
      <van-icon @click="showChannelEdit=true" name="wap-nav"></van-icon>
    </span>
    <!-- Popup 弹出层
    <van-popup v-model="show">
      <van-cell-group v-if="!isReport">
        <van-cell>不感兴趣</van-cell>
        <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
        <van-cell>拉黑作者</van-cell>
      </van-cell-group>
      <van-cell-group v-else>
        <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
        <van-cell>侵权</van-cell>
        <van-cell>色情</van-cell>
        <van-cell>暴力</van-cell>
        <van-cell>低俗</van-cell>
        <van-cell>不适</van-cell>
        <van-cell>错误</van-cell>
        <van-cell>其他</van-cell>
      </van-cell-group>
    </van-popup>-->
    <!-- 举报功能菜单组件 -->
    <dislike-popup
      v-model="show"
      :articleID="articleID"
      :blackID="blackID"
      @dislike="dislike"
      @report="dislike"
    ></dislike-popup>
    <!-- 编辑频道组件 -->
    <!-- <channel-edit v-model="showChannelEdit" :myChannels="myChannels" :activeChannel="activeChannel" @toggle="activeChannel=$event"></channel-edit> -->
    <!-- 写自定义双向绑定 ② -->
    <channel-edit
      v-model="showChannelEdit"
      :myChannels="myChannels"
      :activeChannel.sync="activeChannel"
      @delChannel="changeChannel"
    ></channel-edit>
  </div>
</template>

<script>
import { getMyChannel } from '@/api/channel'
import { getArticles } from '@/api/article'
import { mapState } from 'vuex'
import DislikePopup from './components/dislike-popup'
import channelEdit from './components/channel-edit'

export default {
  data () {
    return {
      // 是否已经加载完全部数据
      // finished: false,
      // 是否正在加载
      // loading: false,
      // 渲染的数据来源
      // list: [],
      // 是否正在刷新
      // isLoading: false,
      // 我的频道列表
      myChannels: [],
      // 当前激活频道
      activeChannel: 0,
      // 下拉刷新提示
      refreshSuccessText: '',
      // 控制弹出层
      show: false,
      // 是否举报
      isReport: false,
      // 不感兴趣文章的id
      articleID: null,
      // 是否显示编辑频道组件
      showChannelEdit: false,
      // 拉黑作者的id
      blackID: null
    }
  },
  // 挂载组件
  components: {
    // 举报功能组件
    'dislike-popup': DislikePopup,
    // 频道编辑组件
    'channel-edit': channelEdit
  },
  computed: {
    currentChannel () {
      // 利用计算属性来获取当前频道中的数据
      return this.myChannels[this.activeChannel]
    },
    // 引入token 以便监听用户状态是否登录
    ...mapState(['token'])
  },
  watch: {
    // 监听用户是否登录
    token () {
      // console.log('**************************')

      if (this.token.token) {
        // console.log('*******1111111111111111********')

        // 如果用户登录状态改变了，则重新获取频道数据
        this.getMyChannel()
        // 并且将当前激活频道初始化为推荐
        this.activeChannel = 0
        // 最后在重新载入下页面数据
        this.onLoad()
      }
    }
  },
  // 开启 组件缓存 keep-alive 后才有的钩子
  activated () {
    if (this.$refs.scrollWrapper) {
      // console.log(this.$refs.scrollWrapper)
      // console.log('1', this.$refs.scrollWrapper)
      // console.log('2', this.$refs)
      // console.log('3', this.$refs.scrollWrapper)
      // console.log('4', this.$refs.scrollWrapper[this.activeChannel])
      // console.log('this.activeIndex', this.activeChannel)

      this.$refs.scrollWrapper[this.activeChannel].scrollTop = this.currentChannel.scrollTop
    }
    // console.log('***********************', this.currentChannel.scrollTop)
  },
  methods: {
    // 不喜欢文章
    dislike () {
      // 将不喜欢的文章，从渲染数组中截取出去
      this.currentChannel.list.splice(
        this.currentChannel.list.findIndex(item => {
          // console.log(this.currentChannel.list)
          // console.log('1', item.art_id.toString())
          // console.log('2', this.articleID)

          return item.art_id.toString() === this.articleID
        }),
        1
      )
      // console.log(this.currentChannel.list)
    },
    // 举报
    report (item) {
      // 显示弹出层
      this.show = true
      // 赋值文章id给不感兴趣的id
      this.articleID = item.art_id.toString()
      // 赋值作者id给拉黑作者的id
      this.blackID = item.aut_id.toString()
    },
    // 计算内容滚动距离
    scroll (e) {
      // console.log(e.target.scrollTop)
      // this.$refs.scrollWrapper.scrollTop
      this.currentChannel.scrollTop = e.target.scrollTop
      // console.log(this.currentChannel.scrollTop)
      // console.log(this.currentChannel)
    },
    // 频道切换事件：手动触发自动加载
    changeChannel () {
      if (!this.currentChannel.list.length) {
        // 显示当前状态为正在加载
        this.currentChannel.loading = true
        // BUG：回来访问的时候需要将finished设置为false
        this.currentChannel.finished = false
        // 加载数据
        this.onLoad()
      } else {
        // window.setTimeout(() => {
        //   this.$refs.scrollWrapper[this.activeChannel].scrollTop = this.currentChannel.scrollTop
        // })
        // 下一帧执行：因为需要将组件的默认置顶给覆盖掉，所以需要添加此等操作
        this.$nextTick(() => {
          this.$refs.scrollWrapper[this.activeChannel].scrollTop = this.currentChannel.scrollTop
        })
      }
    },
    // 上拉加载
    async onLoad () {
      // // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 20) {
      //     this.finished = true
      //   }
      // }, 500)

      // 异步请求获取数据 - 文章列表信息
      const data = await getArticles({
        channelId: this.activeChannel,
        // 不晓得为何有时就会报错，所以放个三元先
        // timestamp: this.currentChannel ? this.currentChannel.timestamp : null
        timestamp: this.currentChannel ? this.currentChannel.timestamp : Date.now()
      })
      // console.log(data)
      // 加载状态结束
      this.currentChannel.loading = false
      // 再渲染数组的基础上push进新获取的数据
      this.currentChannel.list.push(...data.results)
      // 根据当前返回数据中是否有上一次的时间戳来判断数据是否全部载入
      if (!data.pre_timestamp) {
        this.currentChannel.finished = true
      } else {
        // 没有全部载入则将上一次的时间戳赋值给当前选中的频道数据中来再次发起请求获取剩余文章
        this.currentChannel.timestamp = data.pre_timestamp
      }
    },
    // 下拉刷新
    async onRefresh () {
      // setTimeout(() => {
      //   this.$toast('刷新成功')
      //   this.isLoading = false
      // }, 500)
      // 更新当前频道数据中的时间戳
      this.currentChannel.timestamp = Date.now()
      const data = await getArticles({
        channelId: this.activeChannel,
        timestamp: this.currentChannel.timestamp
      })
      // 取消正在刷新状态
      this.currentChannel.isLoading = false
      // 根据当前获取的数据中是否有新的数据来判断是否获取到了新的内容
      if (!data.results.length) {
        // this.$toast('暂无新内容')
        this.refreshSuccessText = '暂无新内容'
      } else {
        // 刷新成功。重新赋值渲染数据源
        this.currentChannel.list = data.results
        // this.$toast('刷新成功')
        this.refreshSuccessText = '刷新成功'
        // 将已完成状态设置为非完成，否则到底之后刷新无法再次下拉加载数据
        this.currentChannel.finished = false
        // 调用onload方法来重新渲染页面
        this.onLoad()
      }
    },
    async getMyChannel () {
      const data = await getMyChannel()
      // console.log(data)
      // BUG：选择频道后再点击个人信息，由于未登录会跳转到登录页面。登录后发现频道乱了，推荐变成第三个频道了，所以需要先将缓存中的频道信息清空。
      this.myChannels = []
      // 然后再通过 下一帧 来重新赋值
      this.$nextTick(() => {
        // 获取到的是一个大对象，所以需要把里面的channels赋值给数组
        this.myChannels = data.map(item => {
          // 此处是实现不同频道间来回切换依旧可以保持切换前的频道不受其它频道影响之重点
          // 因为每一个频道中都包含了自己的数据，包括当前渲染了多少条数据，是否加载到底了等等
          return {
            // 频道id
            id: item.id,
            // 频道名称
            name: item.name,
            // 是否正在加载
            loading: false,
            // 是否已经加载完全部数据
            finished: false,
            // 是否正在刷新
            isLoading: false,
            // 当前频道渲染的数据源
            list: [],
            // 时间戳
            timestamp: Date.now(),
            // 内容卷曲距离
            scrollTop: 0
          }
        })
      })
    }
    // async getArticles () {
    //   const data = await getArticles({
    //     channelId: this.activeChannel,
    //     timestamp: Date.now()
    //   })
    //   console.log(data)
    // }
  },
  created () {
    // 获取我的频道列表
    this.getMyChannel()
    // 获取文章列表
    // this.getArticles()
  }
}
</script>

<style scoped lang="less">
// 顶部标签页&菜单按钮样式
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  //    /deep/  作用：让样式在其他组件生效
  /deep/ .van-tabs__content {
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane {
    height: 100%;
    .scroll-wrapper {
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}

// 渲染列表项样式
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
      width: 100%;
      height: 180px;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span {
      padding-right: 10px;
      &.close {
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>
