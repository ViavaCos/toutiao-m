<template>
  <!-- ActionSheet 上拉菜单 -->
  <!-- 控制右上角关闭按钮 @cancel  @closed也ok -->
  <van-action-sheet
  :value="value"
    title="编辑频道"
    @cancel="$emit('input')"
  >
    <div class="channel">
      <div class="tit">
        我的频道：
        <span class="tip">点击可进入频道</span>
        <van-button v-if="!editing" @click="editing=true" size="mini" type="info" plain>编辑</van-button>
        <van-button v-else @click="editing=false" size="mini" type="danger" plain>完成</van-button>
      </div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="(item,index) in myChannels" :key="item.id">
            <!-- 通过:class判断当前频道的下标是否和选中频道id相同来判断是否激活 -->
          <span class="f12" :class="{red:index === activeChannel}" @click="toggleChannel(index)">{{item.name}}</span>
          <!-- 这里使用v-show来控制这群便签的显隐，降低开销 -->
          <van-icon v-show="item.id !== 0 && editing" class="btn" name="cross" @click="delChannel(item.id,index)"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
    <div class="channel">
      <div class="tit">可选频道：</div>
      <van-grid class="van-hairline--left">
        <van-grid-item v-for="item in optionalChannel" :key="item.id">
          <span class="f12">{{item.name}}</span>
          <van-icon @click="addChannel(item)" class="btn" name="plus"></van-icon>
        </van-grid-item>
      </van-grid>
    </div>
  </van-action-sheet>
</template>

<script>
import { getAllChannel, delChannel, addChannel } from '@/api/channel'

export default {
  // 接收父组件传参
  props: {
    // 控制频道组件显隐
    value: {
      type: Boolean,
      default: false
    },
    // 我的频道
    myChannels: {
      type: Array,
      //  复杂数据类型不能直接赋值，需要用函数返回值
      default: () => []
    },
    // 当前激活频道
    activeChannel: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // 切换【编辑】& 【完成】
      editing: false,
      // 所有频道列表
      channels: []
    }
  },
  computed: {
    optionalChannel () {
      // 返回在全部频道中，查找全部频道在我的频道找不到的频道  可选 = 全部 - 我的
      return this.channels.filter(item => this.myChannels.findIndex(myItem => item.id === myItem.id) === -1)
    }
  },
  created () {
    // 获取全部频道列表
    this.getAllChannel()
  },
  methods: {
    // 添加频道
    addChannel ({ id, name }) {
      const orderChannels = this.myChannels.map((item, i) => {
        return {
          id: item.id,
          name: item.name,
          seq: i
        }
      })
      orderChannels.push({ id, name, seq: orderChannels.length - 1 })
      orderChannels.splice(0, 1)
      try {
        addChannel(orderChannels)
        this.$toast.success('添加成功')
        // this.$emit('delChannel')
        this.myChannels.push({
          // 频道id
          id,
          // 频道名称
          name,
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
        })
      } catch (error) {
        this.$toast.fail('添加失败')
      }
    },
    // 获取全部列表
    async getAllChannel () {
      const { channels } = await getAllChannel()
      // console.log(channels)
      this.channels = channels
    },
    // 切换频道
    toggleChannel (index) {
    // 传递频道下标给父组件
    //   this.$emit('toggle', index)
    // 改写自定义双向绑定 ①      PS: 简写的事件只能是update  (⊙o⊙)…
      this.$emit('update:activeChannel', index)
      // 关闭频道编辑组件
      this.$emit('input', false)
    },
    // 删除频道
    async delChannel (id, index) {
      try {
        await delChannel(id)
        this.$toast.success('删除频道成功')
        // 根据当前激活频道的索引和被删除索引的频道进行比较是否需要前移选中样式
        if (this.activeChannel >= index) {
          // console.log('index', index)
          // console.log('activeChannel', this.activeChannel)
          this.$emit('update:activeChannel', this.activeChannel - 1)
        }
        // 从我的频道中删除(可以操作父组件中传递过来的复杂数据类型)
        this.myChannels.splice(index, 1)
        // 通知父组件 调用切换频道函数
        this.$emit('delChannel')
        // console.log(this.activeChannel)
      } catch (error) {
        this.$toast.fial('删除频道失败')
      }
    }
  }
}
</script>

<style scoped lang='less'>
// 频道编辑组件样式
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
.channel {
  padding: 10px;
  .tit{
    line-height: 3;
    .tip {
      font-size: 10px;
      color: #999;
    }
  }
  .van-button {
    float: right;
    margin-top: 7px;
  }
  .btn{
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ddd;
    font-size: 12px;
    color: #fff;
  }
  .f12{
      font-size:12px;
      color: #555;
  }
  .red{
    color: red;
  }
}

// 去掉顶部圆角
.van-popup--bottom.van-popup--round{
    border-radius: 0
}
</style>
