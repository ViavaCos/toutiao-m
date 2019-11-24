<template>
  <div class="container">
    <van-nav-bar
      left-arrow
      @click-left="$router.back()"
      title="编辑资料"
      right-text="保存"
      @click-right="save()"
    ></van-nav-bar>
    <van-cell-group>
      <van-cell is-link title="头像" @click="showPhoto=true" center>
        <van-image slot="default" width="1.5rem" height="1.5rem" fit="cover" round :src="photo" />
      </van-cell>
      <van-cell is-link title="名称" @click="showName=true" :value="user.name" />
      <van-cell is-link title="性别" @click="showGender=true" :value="user.gender===0?'男':'女'" />
      <van-cell is-link title="生日" @click="openDate()" :value="user.birthday" />
    </van-cell-group>
    <van-popup v-model="showPhoto" position="bottom">
      <van-cell value="本地相册选择" is-link @click="$refs.upload.click()" />
      <van-cell value="拍照" is-link />
    </van-popup>
    <van-popup v-model="showName" position="bottom">
      <van-field v-model="user.name" required placeholder="请输入用户名" />
    </van-popup>
    <van-popup v-model="showGender" position="bottom">
      <van-cell value="男" @click="changeGender(0)" is-link />
      <van-cell value="女" @click="changeGender(1)" is-link />
    </van-popup>
    <van-popup v-model="showBirthday" position="bottom">
      <van-datetime-picker
        title="选择生日"
        v-model="nowDate"
        type="date"
        :min-date="minDate"
        @cancel="dateShow=false"
        @confirm="confirmDate"
      />
    </van-popup>
    <input type="file" ref="upload" @change="uploadPhoto" v-show="false">
  </div>
</template>

<script>
import { getUserEditInfo, uploadPhoto, uploadUserInfo } from '@/api/user'
import dayjs from 'dayjs'

export default {
  data () {
    return {
      showPhoto: false,
      photo: null,
      showName: false,
      showGender: false,
      user: {},
      showBirthday: false,
      minDate: new Date('1950-01-01'),
      nowDate: Date.now(),
      file: null

    }
  },
  methods: {
    // 保存用户信息
    async save () {
      try {
        const fd = new FormData()
        fd.append('photo', this.file)
        // console.log(fd.get('photo'))

        // 上传图片新信息
        await uploadPhoto(fd)

        const { name, gender, birthday } = this.user
        // 上传用户信息
        await uploadUserInfo(name, gender, birthday)
        this.$toast.success('保存成功')
      } catch (error) {
        // console.log(error)
        this.$toast.fail('保存失败')
      }
    },
    // 获取用户信息
    async getUserEditInfo () {
      const data = await getUserEditInfo()
      // console.log(data)
      this.user = data
      this.photo = this.user.photo
    },
    // 打开日期控件
    openDate () {
      this.showBirthday = true
    },
    // 修改性别
    changeGender (type) {
      this.user.gender = type
      this.showGender = false
    },
    // 确认日期
    confirmDate (data) {
      // 赋值
      // this.user.birthday = data.toLocaleDateString()
      this.user.birthday = dayjs(data).format('YYYY-MM-DD')

      // 关闭日期控件
      this.showBirthday = false
    },
    // 上传头像
    uploadPhoto () {
      // 触发file控件的点击事件来调用选择文件弹窗（市面大多数的上传图片原理）
      this.file = this.$refs.upload.files[0]
      // console.log(file)
      const fileReader = new FileReader()
      fileReader.readAsDataURL(this.file)
      fileReader.onload = () => {
        this.photo = fileReader.result
        // console.log(fileReader.result)
        this.showPhoto = false
      }
    }

  },
  created () {
    this.getUserEditInfo()
  }
}
</script>
<style></style>
