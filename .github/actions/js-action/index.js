const core = require("@actions/core");
const github = require("@actions/github");

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("name");
  console.log(`Hello ${nameToGreet}!`);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
  try {
    console.log(`jsn idx: Head: ${payload["head"]}`);
    console.log(`jsn idx: Head ref: ${payload["head"]["ref"]}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
  try {
    console.log(`jsn prp: Head: ${payload.head}`);
    console.log(`jsn prp: Head ref: ${payload.head.ref}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
  try {
    console.log(`ctx idx: Head: ${github.context.payload["head"]}`);
    console.log(`ctx idx: Head ref: ${github.context.payload["head"]["ref"]}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
  try {
    console.log(`ctx prp: Head: ${github.context.payload.head}`);
    console.log(`ctx prp: Head ref: ${github.context.payload.head.ref}`);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
} catch (error) {
  core.setFailed(error.message);
}
