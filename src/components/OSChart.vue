<template>
  <div :style="`width:${width}px;height:${height}px;`" :id="container" class="OSChart"></div>
  <div class="OSCForm">
    <el-form-item size="large">
      <el-button type="primary" @click="OSCRun" style="width: 45%; margin-right: 5%;">运行</el-button>
      <el-button @click="OSCStop" style="width: 45%; margin-left: 5%;">停止</el-button>
    </el-form-item>
    <el-form-item size="large" label="采样频率/Hz">
      <el-input-number v-model="sampleRate" @change="sampleRateChange(sampleRate)" :min="1000" :max="128000"
        :step="1000" step-strictly label="采样频率/Hz">
      </el-input-number>
    </el-form-item>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";
type EChartsOption = echarts.ComposeOption<
  | ToolboxComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | DataZoomComponentOption
  | LineSeriesOption
>;
var option: EChartsOption;
var myChart: EChartsType;
var chartDom: HTMLElement;

let isRun = true;
var OSCData = new Array();
const sampleRate = ref(8000);
const sampleRateChange = (value: number) => {
  console.log("R" + value + "\n");
  sendData("R" + value);
}
function OSCRun() {
  isRun = true;
  sendData("CT");
};
function OSCStop() {
  isRun = false;
  sendData("CF");
};
function func(x: number) {
  x /= 10;
  return Math.sin(x) * 3.3;
}

function generateData() {
  let data = [];
  if (OSCData.length < 10) {
    for (var i = 0; i < 256; i++) {
      OSCData[i] = 0;
      data.push([i, OSCData[i]]);
    }
  } else {
    for (var i = 0; i < 256; i++) {
      data.push([i, OSCData[i]]);
    }
  }
  return data;
}

option = {
  backgroundColor: '',
  animation: false,
  grid: {
    top: 40,
    left: 50,
    right: 40,
    bottom: 50
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: 'none'
      },
      dataView: {
        readOnly: false
      },
      magicType: {
        type: ['line', 'line']
      },
      restore: {},
      saveAsImage: {}
    }
  },
  xAxis: {
    name: 'Div',
    min: 0,
    max: 256,
    minorTick: {
      show: true
    },
    minorSplitLine: {
      show: true
    }
  },
  yAxis: {
    name: '电压/V',
    min: -0.2,
    max: 3.5,
    minorTick: {
      show: true
    },
    minorSplitLine: {
      show: true
    }
  },
  dataZoom: [
    {
      show: true,
      type: 'inside',
      filterMode: 'none',
      xAxisIndex: [0],
      startValue: 0,
      endValue: 40
    },
    {
      show: true,
      type: 'inside',
      filterMode: 'none',
      yAxisIndex: [0],
      startValue: -1,
      endValue: 5
    }
  ],
  series: [
    {
      type: 'line',
      showSymbol: false,
      clip: true,
      data: generateData()
    }
  ]
};
function darkMode(isDark: boolean) {
  myChart.dispose();
  if (isDark == true)
    myChart = echarts.init(chartDom, 'dark');
  else
    myChart = echarts.init(chartDom);
  myChart.setOption(option);
}

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
function refreshData(message: any) {
  if (isRun) {
    OSCData = [];
    OSCData = message.a;
    myChart.setOption({
      series: [
        {
          data: generateData()
        }
      ]
    });
  }
}
export default {
  name: "OSChart",
  darkMode,
  refreshData,
  props2: {
    msg: String,
    option: Object
  }
}

</script>


<script lang="ts" setup>
import * as echarts from 'echarts/core';
import {
  ToolboxComponent,
  ToolboxComponentOption,
  TooltipComponent,
  TooltipComponentOption,
  GridComponent,
  GridComponentOption,
  DataZoomComponent,
  DataZoomComponentOption
} from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { onMounted } from 'vue';
import { EChartsType } from 'echarts/core';
import socket from '../script/websocket'


import {
  // ElFormItem,
  // ElInputNumber,
  // ElButton,
  ElMessage
} from 'element-plus'

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);


// 2.定义传入的参数
const props = defineProps({
  width: {
    type: String,
    default: "550",
  },
  height: {
    type: String,
    default: "350",
  },
  //首次加载
  isFirst: {
    type: Boolean,
    default: false,
  },
  //组件唯一值
  container: {
    type: String,
    default: "OSCChart",
  },
});



onMounted(() => {
  chartDom = document.getElementById(props.container) as HTMLElement
  myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
})

</script>


<style>
.OSChart {
  margin: 0 auto;
}

.OSCForm {
  width: 50%;
  margin: 0 auto;
}
</style>