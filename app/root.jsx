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
