<template>
  <h2>{{ msg }}</h2>

  <div class="waveGen">
    <!-- 表单1 -->
    <el-form ref="form" :model="form" label-width="auto" :size="formSize" :label-position="labelPosition">
      <el-form-item label="波形选择">
        <el-select v-model="waveType" @change="waveTypeChange(waveType)" placeholder="请选择波形">
          <el-option label="正弦波" value="1"></el-option>
          <el-option label="方波" value="2"></el-option>
          <el-option label="锯齿波" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="频率" style="width:100%">
        <el-input-number v-model="freq" @change="freqChange(freq)" :min="1" :max="1500" :step="1" label="频率">
        </el-input-number>
      </el-form-item>
      <el-form-item label="占空比">
        <el-input-number v-model="duty" @change="dutyChange(duty)" :min="1" :max="99" :step="1" label="占空比">
        </el-input-number>
      </el-form-item>
      <el-form-item label="峰峰值">
        <el-input-number v-model="uMaxValue" @change="uMaxValueChange(uMaxValue)" :min="0" :max="3.3" :precision="2"
          :step="0.2" label="峰峰值"></el-input-number>
      </el-form-item>
      <el-form-item label="偏置电压">
        <el-input-number v-model="biasVoltage" @change="biasChange(biasVoltage)" :min="0" :max="3.3" :precision="2"
          :step="0.2" label="频率"></el-input-number>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" style="width: 45%; margin-right: 5%;">立即设置</el-button>
        <el-button @click="getParam" style="width: 45%; margin-left: 5%;">获取参数</el-button>
      </el-form-item>
    </el-form>
  </div>

</template>
<script setup lang="ts">
import { ref } from "vue";
import {
  ElForm,
  ElFormItem,
  ElButton,
  ElOption,
  ElInputNumber,
  ElMessage,
  ElSelect,
  ElSlider,
  ElSwitch,
} from 'element-plus'

import { reactive } from 'vue'
import WaveGenChart from './WaveGenChart.vue'
import socket from '../script/websocket'

defineProps<{ msg: string }>();

</script>

<script lang="ts">
const formSize = ref('large')
const labelPosition = ref('right')

const waveType = ref("1")
const freq = ref(100)
const duty = ref(50)
const uMaxValue = ref(3.3)
const biasVoltage = ref(1.65);
const form = reactive({
  waveType: '1',
  freq: ref(100),
  duty: ref(50),
  uMaxValue: ref(3.3),
  biasVoltage: ref(1.65),
})

const sendData = (data: string) => {
  if (socket.socket_open) {
    socket.send(data);
  } else {
    ElMessage({
      type: 'error',
      message: '请先建立连接',
      duration: 0,
      center: true,
      grouping: true,
      showClose: true
    })
  }
}

const onSubmit = () => {
  WaveGenChart.refreshData();
  console.log('submit!')
}
const getParam = () => {
  sendData("GP");
  console.log('获取参数');
}
const changeParam = (param: Object) => {
  uMaxValue.value = param.U;
  biasVoltage.value = param.B;
  duty.value = param.D;
  freq.value = param.F;
  waveType.value = String(param.W);
  WaveGenChart.refreshData();
}
const waveTypeChange = (value: string) => {
  console.log("W" + value);
  form.waveType = value;
  sendData("W" + value);
}
const freqChange = (value: number) => {
  console.log("F" + value);
  form.freq = value;
  sendData("F" + value);
}
const dutyChange = (value: number) => {
  console.log(value);
  form.duty = value;
  sendData("D"+value);
}
const uMaxValueChange = (value: number) => {
  console.log(value);
  sendData("U"+value);
}
const biasChange = (value: number) => {
  console.log(value);
  sendData("B"+value);
}
export default {
  name: "WaveGen",
  waveType,
  freq,
  duty,
  uMaxValue,
  biasVoltage,
  changeParam,
  props1: {
    msg: String
  }
}
</script>

<style>
.waveGen {
  width: 55%;
  height: auto;
  margin: 0 auto;
  font-size: 2em;
}

.el-input-number {
  width: 100%;
  min-width: 200px;
}

.el-select {
  width: 100%;
  min-width: 200px;
}
</style>