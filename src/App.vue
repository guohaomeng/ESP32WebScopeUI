<template>
  <div class="container" style="justify-content:normal;">
    <el-row justify="end" style="height:32px;">
      <el-form-item label="暗黑模式">
        <el-switch v-model="switchVal" @change="toggleDark()" inline-prompt active-text="否" inactive-text="是" />
      </el-form-item>
    </el-row>
    <el-row>
      <!-- 左半屏幕 -->
      <el-col :span="12">
        <div class="LeftMain">
          <WaveGen msg="波形发生器控制面板" />
        </div>
      </el-col>
      <!-- 右半屏幕 -->
      <el-col :span="12">
      </el-col>
    </el-row>

  </div>
</template>
<style>

.LeftMain {
  width: 100%;
  height: 100%;
}

.el-row {
  margin-bottom: 0px;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import {
  ElNotification,
  ElRow,
  ElCol,
  ElSwitch,
  ElFormItem
} from 'element-plus'

// 自动切换暗黑模式
import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
const toggleDark = useToggle(isDark)

const switchVal = ref(true)


function onClick() {
  ElNotification({
    type: 'success',
    title: '已成功发送邮件',
    message: '验证码区分大小写，有效期5分钟',
    duration: 3000,
  })
}
</script>
<script lang="ts">
import WaveGen from './components/WaveGen.vue'
export default {
  name: 'App',
  components: {
    //2.声明或注册组件
    WaveGen
  }
}
</script>