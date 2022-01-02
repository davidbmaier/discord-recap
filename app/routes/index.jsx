import React, { useState } from 'react';

import { extractPackage } from '../lib/extract';
import { collectStats } from '../lib/stats/stats';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handlePackage = async (file) => {
    try {
      setLoading(true);
      const extractedPackage = await extractPackage(file);
      await collectStats(extractedPackage);
      window.location.href = '/stats';
    } catch (error) {
      // TODO: use a proper error boundary
      console.log('error', error);
    }
  };

  const fileUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', '.zip');
    input.addEventListener('change', (e) => handlePackage(e.target.files[0]));
    input.click();
  };

  return (
    <div className="dr-landing-wrapper">
      <div className="dr-landing-tile">
        <h1>Discord Recap</h1>
        {
          loading
            ? <div className="dr-landing-loading">Preparing your recap...</div>
            : <button type="button" className="dr-landing-button" onClick={fileUpload}>Upload your package!</button>
        }
      </div>
    </div>
  );
}
