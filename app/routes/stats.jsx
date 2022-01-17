import React from 'react';
import { Outlet } from 'remix';

import { clearStats } from '../lib/store';

export default function StatsWrapper() {
  const resetData = async () => {
    await clearStats();
    window.location.href = '/';
  };

  return (
    <>
      <div className="dr-header">
        <h2>Discord Recap</h2>
      </div>
      <div className="dr-content-wrapper">
        <Outlet />
      </div>
      <div className="dr-footer">
        <span>
          {'Made with ❤️ by '}
          <b><a href="https://github.com/davidbmaier">David B. Maier</a></b>
        </span>
        <span>
          <button type="button" onClick={() => resetData()}>Reset data</button>
        </span>
      </div>
    </>
  );
}
