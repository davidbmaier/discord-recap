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

  const getButtonClassNames = (type) => {
    let classNames = 'dr-messagecharts-button';
    if (type === chartType) {
      classNames += ' dr-messagecharts-button-active';
    }
    return classNames;
  };

  return (
    <div className="dr-messagecharts">
      <Chart data={getChartData()} type={chartType} />
      <div className="dr-messagecharts-controls">
        <button
          className={getButtonClassNames(chartTypes.hour)}
          type="button"
          onClick={() => setChartType(chartTypes.hour)}
        >
          Hourly
        </button>
        <button
          className={getButtonClassNames(chartTypes.day)}
          type="button"
          onClick={() => setChartType(chartTypes.day)}
        >
          Daily
        </button>
        {
          messageCountPerYear && (
            <button
              className={getButtonClassNames(chartTypes.year)}
              type="button"
              onClick={() => setChartType(chartTypes.year)}
            >
              Yearly
            </button>
          )
        }
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
  })),
};

export default MessageCharts;
