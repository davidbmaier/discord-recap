import React, { useState } from 'react';
import { Link } from 'remix';

import { extractPackage } from '../lib/extract';
import { collectStats } from '../lib/stats/stats';
import Row from '../components/Row';
import Tile from '../components/Tile';

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

  const getParagraphs = () => {
    const messages = [
      'Ever wondered what kind of data Discord knows about you?',
      'You\'re in the right place!',
      'Simply follow the instructions below to get started.',
    ];
    return messages.map((message) => (
      <p className="dr-landing-text" key={message}>{message}</p>
    ));
  };

  const getInstructions = () => {
    const messages = [
      '1. Request your data package from Discord!',
      'User Settings -> Privacy & safety -> Request all of my data',
      '2. It can take a day or two - when it arrives, come back here!',
      '3. Press the button below to get it analyzed!',
      "Very important: Nothing gets uploaded, everything happens in your browser - so you don't have to worry about your data getting stolen or misused.",
    ];
    return messages.map((message) => (
      <p className="dr-landing-instruction" key={message}>{message}</p>
    ));
  };

  return (
    <>
      <div className="dr-landing-wrapper">
        <div className="dr-landing-tile">
          <h1>Discord Recap</h1>
          <Row>
            <Tile flex={1}>
              {getParagraphs()}
            </Tile>
          </Row>
          <Row>
            <Tile flex={1}>
              {getInstructions()}
              <div className="dr-landing-loading-wrapper">
                {
                loading
                  ? <div className="dr-landing-loading">Preparing your recap...</div>
                  : <button type="button" className="dr-landing-button" onClick={fileUpload}>Get your package analyzed!</button>
              }
              </div>
            </Tile>
          </Row>
        </div>
      </div>
      <div className="dr-landing-footer">
        <Link to="/about">About</Link>
      </div>
    </>

  );
}
