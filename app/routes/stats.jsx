import React from 'react';

import { Outlet } from 'remix';

export default function StatsWrapper() {
  return (
    <div>
      <div className="dr-header">
        <h2>Discord Recap</h2>
      </div>
      <div className="dr-content-wrapper">
        <Outlet />
      </div>
    </div>
  );
}
