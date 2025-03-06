/*
 * 不要将父级的宽高设置为固定的px值。
 * 实现功能：自适应父级组件宽度
 *         全局resize事件
 *         暴露echarts对象
 *         暴露option对象，暴露echarts.on方法传递回调参数
 *
 * 参数
 * echarts_option: echarts option参数
 * events?: 以数组的形式传递需要绑定的事件，格式为：[{type:'click',events:function(params)}]
 *          events:会传递params的回调参数
 *
 * ref: 可以通过父组件传递ref的方式 获取组件中的echarts init后的对象
 *
 * */
import * as echarts from 'echarts';
import React,{ useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { ECElementEvent } from 'echarts/types/dist/echarts';
import { useSize } from 'ahooks';

export type EChartsOption = echarts.EChartsOption;
export type EChartsEvent = ECElementEvent;
export type EchartsRef = echarts.ECharts;
export interface EchartsEvents {
  type: ECElementEvent['type'];
  events: (params: EChartsEvent) => void;
}

export interface EchartsContainerType {
  echarts_option: EChartsOption;
  events?: EchartsEvents[];
  style: React.CSSProperties;
}

const EchartsContainer = forwardRef((props: EchartsContainerType, ref) => {
  const { echarts_option, events,style } = props;

  const echarts_ref = useRef<HTMLDivElement>(null);
  const echarts_box_ref = useRef<HTMLDivElement>(null);
  const size = useSize(echarts_box_ref);
  const myChart = useRef<EchartsRef | null>(null);
  //
  const init = () => {
    if (echarts_ref.current) {
      if (myChart?.current) {
        echarts.dispose(myChart.current);
      }
      myChart.current = echarts.init(echarts_ref.current);
      const option = { ...echarts_option };
      myChart?.current.setOption(option);
      if (Array.isArray(events) && events.length > 0) {
        for (let i = 0; i < events.length; i++) {
          if (myChart.current) {
            myChart.current.on(events[i].type, function (params) {
              return events[i].events && events[i].events(params as EChartsEvent);
            });
          }
        }
      }
    }
  };

  // const resizeAll = () => {
  //   if (myChart.current) {
  //     myChart.current.resize();
  //   }
  // };

  useEffect(() => {
    myChart.current?.resize({ ...size });
  }, [size]);

  useEffect(() => {
    init();
  }, [echarts_option]);

  // useEffect(() => {
  //   window.addEventListener('resize', resizeAll, false);
  //   init();
  //   return () => {
  //     window.removeEventListener('resize', resizeAll, false);
  //   };
  // }, []);

  useImperativeHandle(ref, () => {
    return myChart.current;
  }, []);
  return (
    <div
      style={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex',...style }}
      ref={echarts_box_ref}
    >
      <div style={{ flexGrow: 1, height: '100%' }} ref={echarts_ref} />
    </div>
  );
});

EchartsContainer.displayName = 'EchartsContainer';

export default EchartsContainer;
