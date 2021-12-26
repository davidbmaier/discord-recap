import {useEffect, useState} from 'react';
import {getStats} from '../../lib/store';

export default function Stats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const stats = getStats();
    setStats(stats);
  }, []);

  return (
    <div >
      <h1>Stats</h1>
      {
        stats
          ? JSON.stringify(stats)
          : <></>
      }
    </div>
  );
}
