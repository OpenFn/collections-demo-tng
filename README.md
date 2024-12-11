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

This guide assumes users on Linux or Mac. Everything should work on Windows but may need some translation (PRs on these docs are welcome, Windows users!)

### Platform setup

This repo is setup to use Collections from demo.openfn.org.

- Log in to demo.openfn.org
- Get a Personal Access Token and save it to apiKey
- Create Collections ``

Alternatively, you can use a local Lightning instance. As well as setting u

Otherwise, when following these instructions take care to replace demo.opennf.org with localhost:4000.

Make a note of the project ID, we'll need that in a minute. In the URL on the app, the project id is the long hash after `projects/` and before `/w`:

```
https://demo.openfn.org/projects/00863200-fe33-4aed-976e-9d47d8438d8d/w
```

### Local Setup

Set up this repo by installing [Bun](https://bun.sh), a JavsScript Runtime.

```bash
bun install
```

You'll also need to make sure the CLI is supported (you need version at least 1.9.0)

```bash
npm install -g @openfn/cli
```

Test the CLI works with:

```bash
openfn test
```

You'll also need to setup your CLI to authenticate with OpenFn. Just set the following env vars:

```
export OPENFN_PAT="<your-access-token>
export OPENFN_ENDPOINT="<your-openfn-endpoint>
```

Don't forget to source your shell.

Note that you can also pass `--lightning-url <www>` and `--token <abc>` to each command, if you're going to be working with different deployments.

If you've set everything up correctly, you should be able run this and get no data back:

```bash
openfn collections get tng-char-map \*
```

Note: the `*` character (used here as a wildcard, as in, "get all") has special meaning in bash shells and may be expanded. Make sure to escape it. It's fine to use `*` in a string, like `openfn collections get tng-char-map 2024*`

### Deploying the workflow

This repo contains a complete OpenFn project in the `workflow` folder. Now we need to push it to the OpenFn app.

We can use the CLI to deploy the project with the following command:

```bash

```

### Upload scripts

First off, we'll upload the scripts

A simple TypeScript app in this repo will parse the script files, extract lines of dialog, and upload them straight

### Parsing Scripts

The Workflow is setup to take script data from the incoming webhook, process it, and insert it into a collection.

### Mappings

There's a little bit of a problem with the raw data we're using. The scripts use a short character name for each line of dialog, like `PICARD`. When we go on to use the data downstream, we want to make sure we have a human friendly name for the character, like `Cpt. Jean-Luc Picard`.

This is a mapping problem - and they appear all the time in workflow automation and integration. Some of our source data is missing, or at least in the wrong format, and need to mapped to a suitable value for our destination system.

In the Upload Scripts workflow, the `parse-script` step does an important job for us. It makes a note of every character referenced in the script, and saves a mapping object to a Collection.

Once the workflow has finished and all our scripts are uploaded, we need to manually go through the mappings and provide nice names, then update the mappings in Collection. We can then use this downstream.

The CLI helps us here: first we download the mappings object:

```bash
openfn collections get tng-char-map characters -o ./mappings/chars.json
```

Where `-o` specifies a path on disk to write to, relative to the working directory.

The data looks like this:

```js
{
  "picard": true,
  "data": true,
  /*...*/
}
```

We can go in and replace the `true` values with real names:

```js
{
  "picard": "Cpt. Jean-Luc Picard",
  "data": "Cmdr. Data",
  /*...*/
}
```

And then re-upload our updated map:

```bash
openfn collections set tng-char-map characters ./mappings/chars.json
```

Note that this repo actually has a mappings file checked in already, which means that our hand-written mappings are never lost.

### Footnote - A Mapping Problem

By the way, there's one important note here. When setting a key on Collections, it's always an "upsert" - the existing value, if any, will be replaced with the new one. So every time we set the character map for one episode, we overwrite the existing map.

That introduces two problems for us:

1. Characters from other episodes will disappear from the mapping (because the new mapping object does not contain them)
2. If we've manually added a nice name to the mapping, it'll be removed and replaced.

These issues are easy to navigate. We just make sure to:

1. Get the currently mapping collection first
1. Add new character names to the map
1. Set our new mapping object to the collection

### Getting a quote

At this point we have:

- Saved the raw scripts to one Collection
- Saved each line under a unique, searchable key to a different Collection
- Generated and curated a list of name mappings for each character.

So we're all set to generate a random quote from a character in the show.

The process for this is really easy:

## Next Steps

If you want to hack on this project to continue learning OpenFn and Collections, here are some sample exercises:

- Upload each line of the script to Google Sheets (or some other platform)
- Use mailgun to email a quote of the day to yourself using a cron trigger
