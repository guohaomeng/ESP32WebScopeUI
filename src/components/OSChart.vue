<template>
  <div :style="`width:${width}px;height:${height}px;`" :id="container" class="OSChart"></div>

</template>

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
    default: "WaveGenChart",
  },
});

var option: EChartsOption;

function func(x: number) {
  x /= 10;
  return Math.sin(x) * 3.3;
}

function generateData() {
  let data = [];
  for (let i = 0; i <= 300; i += 1) {
    data.push([i, func(i)]);
  }
  return data;
}

option = {
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
    name: 'x',
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
    name: 'y',
    min: -5,
    max: 5,
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
      filterMode: 'filter',
      xAxisIndex: [0],
      startValue: -20,
      endValue: 20
    },
    {
      show: true,
      type: 'inside',
      filterMode: 'empty',
      yAxisIndex: [0],
      startValue: -20,
      endValue: 20
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

onMounted(() => {
  var chartDom = document.getElementById(props.container) as HTMLElement
  var myChart = echarts.init(chartDom);
  option && myChart.setOption(option);
})

</script>

<script lang="ts">
export default {
  name: "OSChart",
  props2: {
    msg: String,
    option: Object
  },
  darkMode(isDark: boolean) {
    let chartDom1 = document.getElementById(this.container) as HTMLElement
    if (isDark)
      var chart = echarts.init(chartDom1, 'dark');
    else
      var chart = echarts.init(chartDom1);
  }
}

</script>

<style>
.OSChart {
  margin: 0 auto;
}
</style>