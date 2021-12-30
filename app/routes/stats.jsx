import React from 'react';

import { Outlet } from 'remix';

export default function StatsWrapper() {
  return (
    <div>
      <h1>global header</h1>
      <Outlet />
    </div>
  );
}
