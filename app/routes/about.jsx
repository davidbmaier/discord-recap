/* eslint-disable react/no-array-index-key -- all keys are hard-coded anyway */
import React from 'react';
import { Link } from 'remix';

import Row from '../components/Row';
import Tile from '../components/Tile';

const getAboutProject = () => {
  const paragraphs = [
    'Discord Recap was made by ',
    <b><a href="https://github.com/davidbmaier">David B. Maier (@tooInfinite)</a></b>,
    ' - its code can be found ',
    <b><a href="https://github.com/davidbmaier/discord-recap">here</a></b>,
    '.',
    <br />,
    'You can support the creator by becoming ',
    <b><a href="https://github.com/sponsors/davidbmaier">a sponsor</a></b>,
    '!',
  ];
  return paragraphs.map((paragraph, index) => (
    <span key={`paragraph${index}`}>{paragraph}</span>
  ));
};

const getLegal = () => {
  const paragraphs = [
    "This project is not affiliated with Discord - it's just a community-created tool to visualize all the stats in your data package.",
  ];
  return paragraphs.map((paragraph, index) => (
    <span key={`paragraph${index}`}>{paragraph}</span>
  ));
};

const getPrivacyPolicy = () => {
  const paragraphs = [
    'This project does not collect any personal data. All the extrapolated stats are stored in your browser\'s local storage. No external requests are made that include any personal information.',
  ];
  return paragraphs.map((paragraph, index) => (
    <span key={`paragraph${index}`}>{paragraph}</span>
  ));
};

const getAboutTheData = () => {
  const paragraphs = [
    'If you encounter any problems, feel free to open an issue ',
    <b><a href="https://github.com/davidbmaier/discord-recap/issues">here</a></b>,
    '.',
    <br />,
    'In the end, this project is just presenting the data as it finds it in your data package - there are no guarantees the data is accurate.',
  ];
  return paragraphs.map((paragraph, index) => (
    <span key={`paragraph${index}`}>{paragraph}</span>
  ));
};

export default function About() {
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
          <Row>
            <Tile flex={1}>
              <div className="dr-landing-paragraph">
                {getAboutTheData()}
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
