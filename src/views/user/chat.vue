<template>
  <div class="container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="小爱同学"></van-nav-bar>
    <div class="chat-list" ref="list">
      <div
        class="chat-item"
        :class="{left:item.name==='xa',right:item.name==='self'}"
        v-for="(item,index) in chatList"
        :key="index"
      >
        <van-image v-if="item.name==='xa'" fit="cover" round :src="xiaoAiPhoto" />
        <div class="chat-pao">{{item.msg}}</div>
         <van-image
          v-if="item.name==='self'"
          fit="cover"
          round
          :src="myPhoto ||'https://img.yzcdn.cn/vant/cat.jpeg' "
        />
      </div>
    </div>
    <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="说点什么...">
        <van-loading v-if="loading" slot="button" type="spinner" size="16px"></van-loading>
        <span v-else @click="send()" slot="button" style="font-size:12px;color:#999">提交</span>
      </van-field>
    </div>
  </div>
</template>

<script>
import xa from '../../assets/xa.jpg'
import { mapState } from 'vuex'
import io from 'socket.io-client'
export default {
  data () {
    return {
      value: '',
      loading: false,
      xiaoAiPhoto: xa,
      // 存储websocket实例，方便在其它地方也能用到
      socket: null,
      // 聊天记录
      chatList: []
    }
  },
  methods: {
    // 保持滚动条一直在底部
    keepScroll () {
      // 卷曲高度等于滚动条高度  ： 把scrollTop 设置成可以卷曲最大高度
      this.$nextTick(() => {
        // 设置为下一帧执行，因为接收消息太快，所以只执行了一次
        this.$refs.list.scrollTop = this.$refs.list.scrollHeight
      })
    },
    // 发送消息
    send () {
      if (!this.value) return false
      // 开启加载中效果
      this.loading = true
      // alert(1)
      // 发送消息
      this.socket.emit('message', { msg: this.value, timestamp: Date.now() })
      this.chatList.push({ name: 'self', msg: this.value })
      // 关闭加载中效果
      this.loading = false
      // 清空输入框
      this.value = ''
      // 保持底部
      this.keepScroll()
    }
  },
  created () {
    // bug: 打印出来是一个函数？   ƒ mappedState () {
    // 解决：必须卸载计算属性中....mapState
    // console.log(this.myPhoto)

    // 创建实例
    this.socket = io('http://ttapi.research.itcast.cn', {
      query: { token: this.token.token }
    })
    // 建立连接
    this.socket.on('connect', () => {
      this.chatList.push({ name: 'xa', msg: '我是小爱同学，你好啊! ' })
    })
    // 接收 消息
    this.socket.on('message', data => {
      // 推送小爱的信息到聊天记录中
      this.chatList.push({ name: 'xa', msg: data.msg })
      // 保持底部
      this.keepScroll()
    })
  },
  // 必须卸载计算属性中....mapState
  computed: {
    ...mapState(['myPhoto', 'token'])
  },
  beforeDestroy () {
    // 在实例销毁前关闭连接
    this.socket.close()
  }
}
</script>

<style scoped lang='less'>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 46px 0 50px 0;
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      .van-image {
        vertical-align: top;
        width: 40px;
        height: 40px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 38px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        padding: 0 10px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 14px;
        color: #333;
        &::before {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
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
}
</style>
