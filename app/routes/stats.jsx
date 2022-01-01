import React from 'react';
import { Outlet } from 'remix';

import { clearStats } from '../lib/store';

export default function StatsWrapper() {
  const resetData = () => {
    clearStats();
    window.location.href = '/';
  };

  return (
    <div>
      <div className="dr-header">
        <h2>Discord Recap</h2>
      </div>
      <div className="dr-content-wrapper">
        <Outlet />
      </div>
      <div className="dr-header">
        <button type="button" onClick={() => resetData()}>Reset data</button>
      </div>
    </div>
  );
}
