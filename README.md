# Collections Demo (TNG)

This repo contains a demo app to showcase the use of the Collections API on the [OpenFn platform](https://app.openfn.org).

The demo can be run straight out of this repo and uses our sandbox platform at demo.openfn.org. The sandbox is reset daily.

- setup a local git repo to deploy to lightning
- upload data to lightning
- create a simple collection with raw data
- parse the raw data to create a processed collection
- search collection keys to satisfy a user query
- build and use a data map

## Further Reading

You can read more about Collections from the following links:

- Collections Intro https://docs.openfn.org/documentation/build/collections
- Collections API docs https://docs.openfn.org/adaptors/packages/collections-docs

Learn more about OpenFn generally at https://docs.openfn.org/documentation

## Application Background

The demo application is a simple quote generator which reads in scripts for the 1990s TV serial Star Trek: The Next Generation, uploads them to the OpenFn platform, parses individual lines, and provides a Workflow to generate a random quote.

Scripts are provided courtesy of (chakoteya.net/)[http://chakoteya.net/].

It demonstrates the saving of a fairly large dataset to OpenFn, how to use job code to save the data in collections, and how to use the data to implement a simple application.

Star Trek ® and related marks are trademarks of CBS Studios Inc.

## Demo Walkthrough

### Local Setup

Set up this repo by installing [Bun](https://bun.sh), a JavsScript Runtime.

```bash
bun install
```

### Platform setup

This repo is setup to use Collections from demo.openfn.org.

- Log in to demo.openfn.org
- Get a Personal Access Token and save it to apiKey
- Create Collections ``

Alternatively, you can use a local Lightning instance. As well as setting u

Otherwise, when following these instructions take care to replace demo.opennf.org with localhost:4000.

### Upload scripts

First off, we'll upload the scripts

A simple TypeScript app in this repo will parse the script files, extract lines of dialog, and upload them straight

## Next Steps

If you want to hack on this project to continue learning OpenFn and Collections, here are some sample exercises:

- Upload each line of the script to Google Sheets (or some other platform)
- Use mailgun to email a quote of the day to yourself using a cron trigger
