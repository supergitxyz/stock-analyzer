# Stock Analyzer

Turns a ticker into a structured watchlist-decision brief: tailwinds, risks,
what to watch, and valuation vs. peers. Built directly from the reusable
prompt developed and tested in Project 0.4 of the Master AI by Building
course — this UI is the format that prompt was designed to produce.

**What this demonstrates:** translating a tested, refined prompt into a real
product interface; structured/scannable data presentation over wall-of-text
output.

## Stack
React + Vite.

## Run locally
```
npm install
npm run dev
```

## Deploy
Connect this repo to Cloudflare Pages:
- Build command: `npm run build`
- Output directory: `dist`

## Status
Sample data for now, formatted exactly to the tested prompt spec. Live
data hookup (real-time search per ticker) is a Level 2 project
(API + tool use).
