import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Chart from './Chart';
import { chartTypes } from '../lib/constants';

const MessageCharts = (props) => {
  const { messageCountPerDay, messageCountPerHour, messageCountPerYear } = props;

  const [chartType, setChartType] = useState(chartTypes.hour);

  const getChartData = () => {
    if (chartType === chartTypes.day) {
      return messageCountPerDay;
    } if (chartType === chartTypes.hour) {
      return messageCountPerHour;
    } if (chartType === chartTypes.year) {
      return messageCountPerYear;
    }
    return [];
  };
  return (
    <div className="dr-messagecharts">
      <Chart data={getChartData()} type={chartType} />
      <div className="dr-messagecharts-controls">
        <button
          type="button"
          onClick={() => setChartType(chartTypes.hour)}
        >
          Per hour
        </button>
        <button
          type="button"
          onClick={() => setChartType(chartTypes.day)}
        >
          Per day
        </button>
        <button
          type="button"
          onClick={() => setChartType(chartTypes.year)}
        >
          Per year
        </button>
      </div>
    </div>
  );
};

MessageCharts.propTypes = {
  messageCountPerDay: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
  messageCountPerHour: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
  messageCountPerYear: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
};

export default MessageCharts;
