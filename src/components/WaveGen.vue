<template>
  <h2>{{ msg }}</h2>

  <div class="waveGen">
    <!-- 表单1 -->
    <el-form ref="form" :model="form" label-width="auto" :size="formSize" :label-position="labelPosition">
      <el-form-item label="波形选择">
        <el-select v-model="waveType" placeholder="请选择波形">
          <el-option label="正弦波" value="1"></el-option>
          <el-option label="方波" value="2"></el-option>
          <el-option label="锯齿波" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="频率" style="width:100%s">
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
        <el-button type="primary" @click="onSubmit" style="width: 40%; margin-right: 5%;">立即设置</el-button>
        <el-button style="width: 40%; margin-left: 0%;">取消</el-button>
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
  ElRow,
  ElCol,
  ElSelect,
  ElSlider,
  ElSwitch,
} from 'element-plus'

import { reactive } from 'vue'

defineProps<{ msg: string }>();

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

const onSubmit = () => {
  console.log('submit!')
}
const freqChange = (value: number) => {
  console.log(value);
  form.freq = value;
}
const dutyChange = (value: number) => {
  console.log(value);
  form.duty = value;
}
const uMaxValueChange = (value: number) => {
  console.log(value);
}
const biasChange = (value: number) => {
  console.log(value);
}

</script>

<script lang="ts">
export default {
  name: "WaveGen",
  props1: {
    msg: String
  }
}
</script>

<style>
.waveGen {
  width: 50%;
  height: auto;
  margin: 0 auto;
  font-size: 2em;
}

.el-input-number  {
  width: 100%;
  min-width: 200px;
}
.el-select{
  width: 100%;
  min-width: 200px;
}
</style>