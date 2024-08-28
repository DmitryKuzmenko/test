import { NetlifyAPI } from "netlify";

const core = require("@actions/core");
const github = require("@actions/github");

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("name");
  console.log(`Hello ${nameToGreet}!`);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
  console.log(`Head Ref: ${github.context.payload.pull_request.head.ref}`);
  const client = new NetlifyAPI("nfp_6oiUkxrMJ4Kh1zhoGTARfLAMzbtVnbPC3e67");
  const sites = await client.listSites();
  console.log(sites);
} catch (error) {
  core.setFailed(error.message);
}
