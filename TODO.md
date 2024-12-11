What do I need to do here?

- add some kind of documentation
- set this up to target demo.openfn.org. anyone should be able to run this against demo. Do we need unique names?
- make sure there are instructions to get setup against demo or your own deployment
- use npm not bun. bun is too wierd for a public repo on our stack
- delete this file

- setup git commit config.yaml without an api token, then ignore the file
- do something to make the webhook endpoints flexible

what does setup look like?

- checkout this repo
- create a new project on openfn
- get an api key from your server
- paste the api key into the config
- run openfn deploy -c config.json -p <id> to push the project to lighting
- update webhook urls in this repo
- then do npm run upload to parse and post the scripts
- check the lightning history - you should see it
- Now run the job from lightning with this sample data

could i create a little pnpm setup script? what would it do?

- name the project
- load an api key maybe
  nah

what does this project do?

- setup a local git repo to deploy to lightning
- upload data to lightning
- create a simple collection with raw data
- parse the raw data to create a processed collection
- search collection keys to satisfy a user query
- build and use a data map#
