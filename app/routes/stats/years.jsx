import React, { useEffect, useState } from 'react';
import { Link } from 'remix';

import { getStats } from '../../lib/store';
import { cleanChartData } from '../../lib/utils';
import Row from '../../components/Row';
import Tile from '../../components/Tile';
import MessageCount from '../../components/MessageCount';
import FirstMessage from '../../components/FirstMessage';
import MessageCharts from '../../components/MessageCharts';
import TopWordsAndEmotes from '../../components/TopWordsAndEmotes';

export default function Years() {
  const [stats, setStats] = useState(null);
  const [year, setYear] = useState(null);
  const [yearStats, setYearStats] = useState(null);
  const [validYears, setValidYears] = useState([]);

  useEffect(() => {
    const globalStats = JSON.parse(getStats());
    const allYearStats = globalStats.messageStats.yearMessages;
    setStats(allYearStats);

    const tempValidYears = [];
    Object.entries(allYearStats).forEach(([specificYear, specificYearStats]) => {
      if (specificYearStats.messageCount > 0) {
        tempValidYears.push(specificYear);
      }
    });
    setValidYears(tempValidYears);

    const initialYear = tempValidYears[tempValidYears.length - 1];
    setYear(initialYear);
    setYearStats(allYearStats[initialYear]);
  }, []);

  const onYearChange = (newYear) => {
    setYear(newYear);
    setYearStats(stats[newYear]);
  };

  return (
    <div>
      <h1>Your yearly stats</h1>
      <div className="dr-breadcrumb-wrapper">
        <Link className="dr-breadcrumb" to="/stats">Back to Stats</Link>
        <span>
          Filter by year:
          <select id="dr-yearselect" value={year || ''} onChange={(e) => onYearChange(e.target.value)}>
            {validYears.map((validYear) => (
              <option key={validYear}>{validYear}</option>
            ))}
          </select>
        </span>
      </div>
      { yearStats && (
        <>
          <Row>
            <Tile flex={3}>
              <MessageCount
                messageCount={yearStats.messageCount}
                wordCount={yearStats.wordCount}
                characterCount={yearStats.characterCount}
                firstMessage={yearStats.firstMessage}
                lastMessage={yearStats.lastMessage}
                context={`in ${year}`}
              />
            </Tile>
            <Tile flex={3}>
              <FirstMessage
                message={yearStats.firstMessage}
                context={`in ${year}`}
                showChannel
                showServer
              />
            </Tile>
          </Row>
          <Row>
            <Tile flex={4}>
              <MessageCharts
                messageCountPerDay={cleanChartData(yearStats.messageCountPerDay)}
                messageCountPerHour={cleanChartData(yearStats.messageCountPerHour)}
              />
            </Tile>
          </Row>
          <TopWordsAndEmotes topWords={yearStats.topWords} topEmotes={yearStats.topEmotes} />
        </>
      )}
    </div>
  );
}
