<template>
  <div class="container" style="justify-content:normal;">
    <el-row>
      <!-- 左半屏幕 -->
      <el-col :span="12">
        <div class="LeftMain">
          <WaveGen msg="波形发生器控制面板" />
          <WaveGenChart width="550" height="350" container="WaveGenChart"></WaveGenChart>
        </div>
      </el-col>
      <!-- 右半屏幕 -->
      <el-col :span="12">
        <el-row justify="end" style="height:32px;">
          <el-form-item label="连接设备" style="margin-right: 20px;">
            <el-switch v-model="isConnected" @change="connectDevice()" inline-prompt active-text="开"
              inactive-text="关" />
          </el-form-item>
          <el-form-item label="深色模式" style="margin-right: 20px;">
            <el-switch v-model="switchVal" @change="toggleDark(), UseDarkMode()" inline-prompt active-text="开"
              inactive-text="关" />
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="24">
            <h2>ESP32示波器面板</h2>
            <OSChart width="550" height="350" container="OSChart"></OSChart>
          </el-col>
        </el-row>

      </el-col>
    </el-row>
  </div>
</template>
<style>
.LeftMain {
  width: 100%;
  height: auto;
}

.el-row {
  margin-bottom: 0px;
}
</style>
<script setup lang="ts">
import { ref } from 'vue'
import { onMounted } from 'vue'
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
const switchVal = ref(isDark.value)
const isConnected = ref(false)

function UseDarkMode() {
  WaveGenChart.darkMode(isDark.value);
  OSChart.darkMode(isDark.value);
};
function connectDevice() {
  if (isConnected.value == true) {
    console.log("连接设备");
    socket.init(receiveMessage);
  }
  else {
    console.log("断开连接");
    socket.close();
  }
}
function receiveMessage(message: any) {
  if (message.data[0] == '{' && message.data[2] == 'a') {
    var data = JSON.parse(message.data);
    OSChart.refreshData(data);
  } else if(message.data[0] == '{' && message.data[2] == 'p'){
    var data = JSON.parse(message.data);
    console.log(data.param);
    WaveGen.changeParam(data.param);
  } else {
    console.log(message.data);
  }

}

onMounted(() => {
  UseDarkMode();
  switchVal.value = isDark.value;
});

</script>
<script lang="ts">
import WaveGen from './components/WaveGen.vue'
import WaveGenChart from './components/WaveGenChart.vue'
import OSChart from './components/OSChart.vue'
import socket from './script/websocket'


export default {
  name: 'App',
  components: {
    //2.声明或注册组件
    WaveGen,
    WaveGenChart,
    OSChart
  }
}


</script>