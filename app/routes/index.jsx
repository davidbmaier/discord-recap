import React, { useState, useEffect } from 'react';
import { Link } from 'remix';

import { AiOutlineLoading } from 'react-icons/ai';

import { extractPackage } from '../lib/extract';
import { collectStats } from '../lib/stats/stats';
import { checkForMobile } from '../lib/utils';
import Row from '../components/Row';
import Tile from '../components/Tile';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    setIsMobileDevice(checkForMobile(window.navigator.userAgent));
  }, []);

  const handlePackage = async (file) => {
    try {
      setLoading(true);
      setError();
      const extractedPackage = await extractPackage(file);
      await collectStats(extractedPackage);
      window.location.href = '/stats';
    } catch (packageError) {
      setLoading(false);
      setError(packageError);
      console.error(packageError);
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
      'User Settings / Privacy & safety / Request all of my data',
      '2. It can take a day or two - when it arrives, come back here!',
      '3. Get your data package analyzed!',
      "Very important: Nothing gets uploaded, everything happens in your browser - so you don't have to worry about your data getting stolen or misused.",
    ];
    return messages.map((message) => (
      <p className="dr-landing-instruction" key={message}>{message}</p>
    ));
  };

  const getMobileDisclaimer = () => {
    const messages = [
      'It looks like you\'re using a mobile device.',
      'Due to the size of Discord data packages, the performance cost of analyzing them is quite high.',
      'If you want to use this site, please switch to a desktop browser.',
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
              {
                !isMobileDevice && (
                  <div className="dr-landing-loading-wrapper">
                    {
                      loading
                        ? (
                          <div className="dr-landing-loading">
                            Preparing your recap...
                            <span className="dr-landing-loading-icon">
                              <AiOutlineLoading />
                            </span>
                          </div>
                        )
                        : <button type="button" className="dr-landing-button" onClick={fileUpload}>Get your data package analyzed!</button>
                    }
                  </div>
                )
              }

            </Tile>
          </Row>
          {
            isMobileDevice && (
              <Row>
                <Tile flex={1}>
                  {getMobileDisclaimer()}
                </Tile>
              </Row>
            )
          }
          {
            error && (
              <Row>
                <Tile flex={1}>
                  <div className="dr-landing-error">
                    <div className="dr-landing-text">Uh-oh, looks like something went wrong.</div>
                    <div className="dr-landing-text">
                      Please report this by
                      <b><a href="https://github.com/davidbmaier/discord-recap/issues"> opening an issue in the Github repository</a></b>
                      .
                    </div>
                    <div className="dr-landing-text">
                      You can find the error in the browser console (F12 - Console).
                    </div>
                  </div>
                </Tile>
              </Row>
            )
          }
        </div>
      </div>
      <div className="dr-landing-footer">
        <Link to="/about">About</Link>
      </div>
    </>

  );
}
