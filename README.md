# Discord Recap

A tool to explore your Discord data package - originally inspired by [Androz2091's Discord Data Package Explorer](https://ddpe.androz2091.fr/), but with a lot more details.

Live version: https://discord-recap.com

## Demo

![image](https://user-images.githubusercontent.com/17618532/148423923-a0dbd358-54d9-4e4c-a5ee-8a3f55622f9b.png)
![image](https://user-images.githubusercontent.com/17618532/148423958-d45c3da9-3415-493f-8b29-8a9c66547f66.png)

## What can this do?

The web app scans through your Discord data package and extrapolates a ton of information about:

- your account
- your servers
- your channels
- your DMs
- your messages
- your activity

and a bunch more!

Everything happens in the browser, and no external requests are made (apart from fetching some Discord emoji).

### Feature requests

The web app tries to capture as many stats as possible - if you have any ideas for new features, please open an issue.

## Setup

The web app uses [Remix](https://remix.run) and [React](https://reactjs.org).
To get started, simply install the dependencies (`npm i`) and run the server (`npm run dev`).
