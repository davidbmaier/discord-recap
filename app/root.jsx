import React from 'react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from 'remix';

import styles from './styles/shared.css';

// include global styles
export function links() {
  return [{ rel: 'stylesheet', href: styles }];
}

export function meta() {
  return { title: 'Discord Recap' };
}

// eslint-disable-next-line react/prop-types -- ErrorBoundary always gets an error
export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <html lang="en">
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="dr-landing-wrapper">
          <div className="dr-landing-tile">
            <h1>Uh-oh, looks like something went wrong.</h1>
            <div className="dr-landing-text">
              Please report this to
              {' '}
              <b>@tooInfinite</b>
              {' '}
              or open an issue on the Github repository.
            </div>
            <div className="dr-landing-text">
              You can find the error in the browser console (F12 - Console).
            </div>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <div title={`${caught.status} ${caught.statusText}`}>
      <div className="error-container">
        <h1>
          {caught.status}
          {' '}
          {caught.statusText}
        </h1>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
