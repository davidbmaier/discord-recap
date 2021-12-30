import React from 'react';

import { extractPackage } from '../lib/extract';
import { collectStats } from '../lib/stats/stats';

const handlePackage = async (file) => {
  try {
    const extractedPackage = await extractPackage(file);
    await collectStats(extractedPackage);
    window.location.href = '/stats';
  } catch (error) {
    // TODO: use a proper error boundary
    console.log('error', error);
  }
};

export default function Home() {
  return (
    <div>
      <h1>Discord Recap</h1>
      <input type="file" accept=".zip" onChange={(e) => handlePackage(e.target.files[0])} />
    </div>
  );
}
