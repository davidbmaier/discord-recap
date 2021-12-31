import React from 'react';
import PropTypes from 'prop-types';
import {
  ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar,
} from 'recharts';

import { chartTypes, dayLabels } from '../lib/constants';

const Chart = (props) => {
  const { data, type } = props;

  const formatTooltipValue = (value) => [`${value} Messages`, ''];

  const formatLabel = (label) => {
    if (type === chartTypes.hour) {
      const intLabel = parseInt(label, 10);
      if (intLabel < 12) {
        return `${intLabel || 12}am`;
      }
      return `${intLabel - 12 || 12}pm`;
    } if (type === chartTypes.day) {
      return dayLabels[label];
    }
    return `${label}`;
  };

  return (
    <ResponsiveContainer width="99%" height={300}>
      <BarChart
        data={data}
      >
        <XAxis dataKey="category" tickFormatter={formatLabel} />
        <YAxis />
        <Tooltip formatter={formatTooltipValue} labelFormatter={formatLabel} separator="" />
        <Legend />
        <Bar dataKey="count" name="Message Count" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

Chart.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(PropTypes.shape({
    category: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
  })).isRequired,
};

export default Chart;
