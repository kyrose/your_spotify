import React from 'react';
import s from './index.module.css';
import IntervalChart, { FillModes } from '../../IntervalChart';
import API from '../../../../../services/API';
import Chart from '../../../../Chart';

class PopularityPer extends IntervalChart {
  constructor(props) {
    super(props, 'Average song popularity', FillModes.VOID);
  }

  dataGetter = stats => {
    if (stats === null) return 0;
    return stats.totalPopularity;
  }

  fetchStats = async () => {
    const { start, end, timeSplit } = this.state;
    const { data } = await API.popularityPer(start, end, timeSplit);

    return data;
  }

  getChartData = () => {
    const { stats } = this.state;

    return stats.map((stat, k) => ({ x: k, y: stat.data, date: stat._id }));
  }

  getContent = () => {
    const { start, end, timeSplit } = this.state;
    const data = this.getChartData();

    return (
      <Chart
        xName="Date"
        yName="Average popularity"
        start={start}
        end={end}
        timeSplit={timeSplit}
        tValueFormat={value => `${Math.floor(value)}% popularity`}
        onTimeSplitChange={e => this.setInfos('timeSplit', e)}
        onStartChange={e => this.setInfos('start', e)}
        onEndChange={e => this.setInfos('end', e)}
        className={s.chart}
        data={data} />
    );
  }
}

export default PopularityPer;
