import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime' // 按需加载插件
import 'dayjs/locale/zh-cn'
dayjs.extend(relativeTime) // 使用插件

function timeFormat (time) {
  // console.log(time)
  // return dayjs().locale('zh-cn').format(time) // 在这个实例上使用简体中文
  return dayjs().locale('zh-cn').from(time)
}

export default {
  install (Vue) {
    Vue.filter('timeFormat', timeFormat)
  }
}
