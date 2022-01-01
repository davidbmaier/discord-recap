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
        <Tooltip
          formatter={formatTooltipValue}
          labelFormatter={formatLabel}
          separator=""
          contentStyle={{
            backgroundColor: '#2c2f33', color: 'white', border: '0', borderRadius: '5px',
          }}
          cursor={{ stroke: '#3b3d42', fill: '#3b3d42', strokeWidth: 2 }}
          labelStyle={{ backgroundColor: '#2c2f33', color: 'white' }}
        />
        <Legend />
        <Bar dataKey="count" name="Message Count" fill="#5865F2" legendType="circle" background={false} />
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
