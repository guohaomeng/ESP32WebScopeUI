<template>
  <div :style="`width:${width}px;height:${height}px;`" :id="container" class="WaveGenChart"></div>

</template>

<script lang="ts">

echarts.use([
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

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
    name: '波形索引',
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
    name: '输出电压/V',
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
      endValue: 300,
      moveOnMouseWheel: 'alt'
    },
    {
      show: true,
      type: 'inside',
      // disabled: true,
      // zoomLock: true,
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
      data: []
    }
  ]
};

// 绘制预览波形相关变量及函数
var start = true;
let uMaxValue = 3.3;         //峰峰值
let offSetValue = 1.65       //偏置电压
let duty = 50;               //占空比%(方波)
let wave = 1;                //波形种类
let samplePerCycle = 256;
//定义板载8位DAC输出的对应值
var waveTab1 = new Array();
var waveTab = new Array();

function wave_gen(index: number) {
  if (index == 1) {
    var sineValue = 0.0;
    for (var i = 0; i < samplePerCycle; i++) {
      sineValue = Math.sin(((2 * Math.PI) / samplePerCycle) * i) * (uMaxValue / 2) + offSetValue;
      waveTab1[i] = (((sineValue * 255 / 3.3)));
    }
    console.log("波形表重设成功，当前为正弦波\n");
  }
  else if (index == 2) {
    var x = samplePerCycle * (duty / 100.0);
    var x1 = x;
    for (var i = 0; i < samplePerCycle; i++) {
      if (i < x) {
        waveTab1[i] = (255 * (uMaxValue / 2 + offSetValue) / 3.3);
      }
      else {
        waveTab1[i] = (255 * (-(uMaxValue / 2) + offSetValue) / 3.3);
      }
    }
    console.log("波形表重设成功，当前为方波,占空比:" + duty + "\n");
  }
  else if (index == 3) //锯齿波
  {
    for (var i = -128; i < 128; i++) {
      waveTab1[i + 128] = (i * (uMaxValue / 3.3) + (offSetValue * 255 / 3.3));
    }
    console.log("波形表重设成功，当前为锯齿波\n");
  }
  for (var i = 0; i < samplePerCycle; i++) {
    if (waveTab1[i] > 255) {
      waveTab1[i] = 255;
    }
    if (waveTab1[i] < 0) {
      waveTab1[i] = 0;
    }
    waveTab[i] = waveTab1[i] * 3.3 / 255;

  }
  // console.log(waveTab);
}

function generateData() {
  let data = [];
  for (let i = 0; i <= 256; i++) {
    data.push([i, waveTab[i]]);
  }
  return data;
}

function refreshData() {
  offSetValue = WaveGenData.biasVoltage.value;
  duty = WaveGenData.duty.value;
  uMaxValue = WaveGenData.uMaxValue.value;
  wave = parseInt(WaveGenData.waveType.value);
  wave_gen(wave);
  //刷新数据
  if (start === true) {
    myChart.setOption({
      series: [
        {
          data: generateData()
        }
      ]
    });
  }
}

function darkMode(isDark: boolean) {
  myChart.dispose();
  if (isDark == true)
    myChart = echarts.init(chartDom, 'dark');
  else
    myChart = echarts.init(chartDom);
  myChart.setOption(option);
  refreshData();
}

export default {
  name: "WaveGenChart",
  option,
  //myChart,
  uMaxValue,
  offSetValue,
  duty,
  wave,
  refreshData,
  darkMode
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
import WaveGenData from './WaveGen.vue'
import { EChartsType } from 'echarts/core';

// 定义传入的参数
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
    default: "WaveGenChart",
  },
});

onMounted(() => {
  wave_gen(1);
  chartDom = document.getElementById(props.container) as HTMLElement
  myChart = echarts.init(chartDom);
  option.series[0].data = generateData(); // 搞不明白为啥报错，但能用
  option && myChart.setOption(option);
});
</script>



<style>
.WaveGenChart {
  margin: 0 auto;
}
</style>