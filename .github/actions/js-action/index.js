import { NetlifyAPI } from "netlify";

import * as core from "@actions/core";
import * as github from "@actions/github";

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput("name");
  console.log(`Hello ${nameToGreet}!`);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2);
  console.log(`The event payload: ${payload}`);
  console.log(`Head Ref: ${github.context.payload.pull_request.head.ref}`);
  // const client = new NetlifyAPI("nfp_6oiUkxrMJ4Kh1zhoGTARfLAMzbtVnbPC3e67");
  // const sites = await client.listSites();
  // console.log(sites);

  console.log("Trying HTTP post");
  let xhr = new XMLHttpRequest();
  xhr.open(
    "POST",
    "https://httpbin.org/post?trigger_branch=GITHUB_HEAD_REF&trigger_title=TITLE"
  );
  xhr.setRequestHeader("Content-Type", "applicathion/json");
  xhr.send(
    JSON.stringify({
      rscEnv: "STAGE",
      cognitoUserPoolId: "COGNITO_USER_POOL_ID",
      cognitoClientId: "COGNITO_CLIENT_ID",
    })
  );
  xhr.onload = function() {
    let resp = xhr.response;
    console.log(`HTTP Response: ${resp.message}`)
  }
} catch (error) {
  core.setFailed(error.message);
}
