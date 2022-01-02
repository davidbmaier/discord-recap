import React from 'react';
import { Link } from 'remix';

import Row from '../components/Row';
import Tile from '../components/Tile';

const getAboutProject = () => {
  const paragraphs = [
    'Discord Recap was made by ',
    <b><a href="https://github.com/davidbmaier">David B. Maier/@tooInfinite</a></b>,
    ' - its code can be found ',
    <b><a href="https://github.com/davidbmaier/discord-recap">here</a></b>,
    '.',
  ];
  return paragraphs.map((paragraph, index) => (
    // eslint-disable-next-line react/no-array-index-key -- these are hard-coded anyway
    <span key={`paragraph${index}`}>{paragraph}</span>
  ));
};

const getLegal = () => {
  const paragraphs = [
    "This project is not affiliated with Discord - it's just a community-created tool to visualize all the stats in your data package.",
  ];
  return paragraphs.map((paragraph) => (
    <span key={paragraph}>{paragraph}</span>
  ));
};

const getPrivacyPolicy = () => {
  const paragraphs = [
    'This project does not collect any personal data. All the extrapolated stats are stored in your browser\'s local storage. No external requests are made that include any personal information.',
  ];
  return paragraphs.map((paragraph) => (
    <span key={paragraph}>{paragraph}</span>
  ));
};

export default function StatsWrapper() {
  return (
    <>
      <div className="dr-landing-wrapper">
        <div className="dr-landing-tile">
          <h1>About Discord Recap</h1>
          <Row>
            <Tile flex={1}>
              <div className="dr-landing-paragraph">
                {getAboutProject()}
              </div>
            </Tile>
          </Row>
          <Row>
            <Tile flex={1}>
              <div className="dr-landing-paragraph">
                {getLegal()}
              </div>
            </Tile>
          </Row>
          <Row>
            <Tile flex={1}>
              <div className="dr-landing-paragraph">
                {getPrivacyPolicy()}
              </div>
            </Tile>
          </Row>
        </div>
      </div>
      <div className="dr-landing-footer">
        <Link to="/">Back</Link>
      </div>
    </>
  );
}
