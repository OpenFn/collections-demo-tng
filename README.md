# Collections Demo (TNG)

This repo contains a demo app to showcase the use of the Collections API on the [OpenFn platform](https://app.openfn.org).

The demo can be run straight out of this repo and uses our sandbox platform at demo.openfn.org. The sandbox is reset daily.

- setup a local git repo to deploy to lightning
- upload data to lightning
- create a simple collection with raw data
- parse the raw data to create a processed collection
- search collection keys to satisfy a user query
- build and use a data map

## Getting Help

This readme is designed to help walk through setting up and running the demo - but it's not comprehensive and makes a lot of assumptions. It's quite a high-level guide. For help, check docs.openfn.org or post a question to community.openfn.org

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

This repo is setup to use Collections from demo.openfn.org. You may want to prefix project and collection names with your name to ensure it's unique.

- Log in to demo.openfn.org with credentials `super@openfn.org` and password `welcome12345`
- Get a Personal Access Token and save it to your env (`OPENFN_PAT`) and `apiKey` in `workflow/config.json`

Alternatively, you can use a local Lightning instance, or any other deployment. When following these instructions take care to replace demo.openfn.org with the server address.

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

Note that you can also pass `--lightning <www>` and `--token <abc>` to each command, if you're going to be working with different deployments.

If you've set everything up correctly, you should be able run this and get no data back:

```bash
openfn collections get tng-char-map \*
```

Note: the `*` character (used here as a wildcard, as in, "get all") has special meaning in bash shells and may be expanded. Make sure to escape it. It's fine to use `*` in a string, like `openfn collections get tng-char-map 2024*`

Finally, copy out your PAT and paste it into `workflow/config.json`

### Deploying the workflow

This repo contains a complete OpenFn project in the `workflow` folder - all the code needed to run the demo. Rather than copy and pasting it into the app, we'll upload it directly with the CLI.

In the `workflow` folder you'll find the main project.yaml, which is the file that OpenFn uses to run your workflow. You'll also find JavaScript files for our actual steps - `save-script.js`, `parse-script.js` and `get-quote.js`. These files contain the business logic of our demo. Feel free to take a look - but we'll explore the code and functionality in more detail later.

You'll need to step into the `workflow` folder (`cd workflow`) and then run:

```bash
openfn deploy -c ./config.json
```

Note: if you have previously used the CLI to pull or deploy, you should unset or override OPENFN_ENDPOINT and OPENFN_API_KEY.

Note: the demo app resets daily. You may need to delete `.state.json` if you've previously deployed this demo project.

This will read the project.yaml on disk, contact the app, and attempt to create a new project.

You'll be asked to confirm the changes - press y to do so - and once it's finished, you'll see a new `.state.json` file on disk. This file tracks your newly created project against local changes to the project.yaml.

But don't worry about that - check your app and you should see a brand new Collections Demo project.

We're almost ready to dig in and start playing with our Collections workflows - we've just got one more piece of admin to take care of.

### Creating Collections

Collections must be created from the app's Admin menu before they can be used.

Create 3 Collections `tng-char-map`, `tng-lines` and `tng-scripts` and give each access to your new project.

### Configure this repo

In the app, open up the inspector and open the Upload Scripts workflow. Click on the webhook trigger and copy the webhook URL.

Edit `workflow/config.json` locally and paste the URL into the `_webhook` key.

This will tell your local repo where to load script data to. We'll get to that stuff shortly.

The `_webhook` key is non-standard key used for this demo, and has no meaning to CLI deploy.

### Upload scripts

Now we're all set up: we've installed our local dependencies, we've got a demo project set up with our workflows and we've set up our Collections.

You'll notice the project has two Workflows: Upload Scripts and Get Quote.

Let's take a look at Upload Scripts. This workflow accepts data in a webhook, adds it to a Collection, then parses it into a second collection.

You can look at the local `workflow/parse-script.js` and `workflow/save-script.js` in your editor, or you can look at the Workflow on OpenFn.

So before we can run the Workflow, we need to post some data to it. That's what this repo is for: the repo holds all our source data and has a convenient script which will post each episide up to the app.

To run the script and upload every episode of Star Trek: The Next Generation into OpenFn, run this from root:

```bash
bun upload.ts
```

This will very quickly upload the data to OpenFn. If you take a look at the History page, you'll see the generated work orders receive each request and start processing data.

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
1. Add NEW character names to the map
1. Set our new mapping object to the collection

### Getting a quote

At this point we have:

- Saved the raw scripts to one Collection
- Saved each line under a unique, searchable key to a different Collection
- Generated and curated a list of name mappings for each character.

So we're all set to generate a random quote from a character in the show.

The process for this is really easy. In the app, open the Get Quote workflow and open the code inspector.

In the Input box, paste this payload:

```json
{
  "data": {
    "character": "picard"
  }
}
```

This simulates a HTTP request coming into the webhook at OpenFn to generate a quote from Picard.

When we hit Create New Work Order, this input will be passed into the workflow. After a moment your logs should show the code being executed and you'll notice the output - including a nicely mapped character name.

## Next Steps

If you want to hack on this project to continue learning OpenFn and Collections, here are some sample exercises:

- Upload each line of the script to Google Sheets (or some other platform)
- Use mailgun to email a quote of the day to yourself using a cron trigger
