import React from 'react';
import { lastWeek } from '../../../services/interval';

/*
* DataDisplayer is a class to hold an interval (start, end) and a timesplit
* It also calls refresh whenever it considers the props has changed and the values has to reload
* It does NOT implement a rendering
*/

class DataDisplayer extends React.Component {
  constructor(props, name) {
    super(props);

    this.inited = true;
    this.name = name;

    let {
      start,
      end,
    } = this.props;

    const {
      timeSplit,
      dontFetchOnMount,
    } = this.props;

    this.dontFetchOnMount = dontFetchOnMount;

    if (!start || !end) {
      const thisWeek = lastWeek();

      start = thisWeek.start;
      end = thisWeek.end;
    }

    const previous = this.getPreviousInter(start, end);

    this.state = {
      start,
      end,
      previousStart: previous.start,
      previousEnd: previous.end,
      timeSplit: timeSplit || 'hour',
      stats: null,
    };
  }

  getPreviousInter = (start, end) => {
    const diff = end.getTime() - start.getTime();

    // Previous end and previous start represent
    // a period of (end - start) days just before the start-end period
    // which gives something like [previousPeriod of n days][period of n days]

    const previousStart = new Date(start.getTime());
    previousStart.setTime(previousStart.getTime() - diff);

    const previousEnd = new Date(end.getTime());
    previousEnd.setTime(previousEnd.getTime() - diff);
    return {
      start: previousStart,
      end: previousEnd,
    };
  }

  async componentDidMount() {
    if (!this.inited) {
      throw new Error('You must call parent constructor when using IntervalChart');
    }
    const { loaded } = this.props;

    if (!this.dontFetchOnMount) {
      await this.refresh();
      if (loaded) loaded();
    } else if (loaded) {
      loaded();
    }
  }

  componentDidUpdate(prevProps) {
    const lastStart = prevProps.start;
    const lastEnd = prevProps.end;
    const { start } = this.props;
    const { end } = this.props;

    const lastSplit = prevProps.timeSplit;
    const split = this.props.timeSplit;

    const changes = {};

    let finalStart = lastStart;
    let finalEnd = lastEnd;

    if (
      (!lastStart && start)
      || (lastStart && start && lastStart.getTime() !== start.getTime())
    ) {
      changes.start = start;
      finalStart = start;
    }

    if (
      (!lastEnd && end)
      || (lastEnd && end && lastEnd.getTime() !== end.getTime())
    ) {
      changes.end = end;
      finalEnd = end;
    }

    if (split && lastSplit !== split) {
      changes.timeSplit = split;
    }
    if (Object.keys(changes).length > 0) {
      const previous = this.getPreviousInter(finalStart, finalEnd);

      changes.previousStart = previous.start;
      changes.previousEnd = previous.end;

      this.setState(changes, this.refresh);
    }
  }
}

export default DataDisplayer;
