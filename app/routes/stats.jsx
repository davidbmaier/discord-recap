import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'remix';
import html2canvas from 'html2canvas';

import { clearStats } from '../lib/store';
import { checkForMobile } from '../lib/utils';

export default function StatsWrapper() {
  const location = useLocation();
  const [isMobileDevice, setIsMobileDevice] = useState(true);

  useEffect(() => {
    setIsMobileDevice(checkForMobile(window.navigator.userAgent));
  }, []);

  const resetData = async () => {
    await clearStats();
    window.location.href = '/';
  };

  const takeScreenshot = () => {
    html2canvas(document.getElementById('dr-share-content'), {
      useCORS: true,
    }).then((canvas) => {
      const downloadLink = document.createElement('a');
      downloadLink.setAttribute('download', 'discordStats.png');
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        downloadLink.setAttribute('href', url);
        downloadLink.click();
      });
    });
  };

  return (
    <>
      <div className="dr-header">
        <h2>Discord Recap</h2>
      </div>
      <div className="dr-content-wrapper">
        <Outlet context={{ shareable: false }} />
      </div>
      <div className="dr-footer">
        <span>
          {'Made with ❤️ by '}
          <b><a href="https://github.com/davidbmaier">David B. Maier</a></b>
        </span>
        <span>
          <button type="button" onClick={() => resetData()}>Reset data</button>
        </span>
        {
          // only show screenshot button if we're on the stats page and not on mobile
          location.pathname === '/stats' && !isMobileDevice && (
            <span>
              <button type="button" onClick={() => takeScreenshot()}>Share</button>
            </span>
          )
        }
      </div>
      <div id="dr-share-wrapper">
        <div id="dr-share-content">
          <Outlet context={{ shareable: true }} />
        </div>
      </div>
    </>
  );
}
