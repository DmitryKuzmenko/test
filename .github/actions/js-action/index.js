import { NetlifyAPI } from "netlify";

import * as core from "@actions/core";
import * as github from "@actions/github";
import https from "node:https";

try {
  const name = core.getInput("name");
  const id = core.getInput("id");
  const title = core.getInput("title");
  const netlify_payload = core.getInput("payload");
  const token = core.getInput("token");
  // const branch = github.context.payload.pull_request.head.ref;
  const branch = "feature/PEWEB-175-custom-domain-for-api-gw";

  const client = new NetlifyAPI(token);

  console.log("Calling listSiteDeploys");
  let deployments = await client.listSiteDeploys({
    site_id: id,
    branch: branch,
  });
  console.log(deployments);
  deployments = deployments.filter((deployment) => deployment.title == title);
  console.log(deployments);

  // Get the JSON webhook payload for the event that triggered the workflow
  // const payload = JSON.stringify(github.context.payload, undefined, 2);
  // console.log(`The event payload: ${payload}`);
  // console.log(`Head Ref: ${github.context.payload.pull_request.head.ref}`);

  // const client = new NetlifyAPI("nfp_6oiUkxrMJ4Kh1zhoGTARfLAMzbtVnbPC3e67");
  // const sites = await client.listSites();
  // console.log(sites);

  // console.log("Trying HTTP post");
  // let xhr = new XMLHttpRequest();
  // xhr.open(
  //   "POST",
  //   "https://httpbin.org/post?trigger_branch=GITHUB_HEAD_REF&trigger_title=TITLE"
  // );
  // xhr.setRequestHeader("Content-Type", "applicathion/json");
  // xhr.send(
  //   JSON.stringify({
  //     rscEnv: "STAGE",
  //     cognitoUserPoolId: "COGNITO_USER_POOL_ID",
  //     cognitoClientId: "COGNITO_CLIENT_ID",
  //   })
  // );
  // xhr.onload = function () {
  //   let resp = xhr.response;
  //   console.log(`HTTP Response: ${resp.message}`);
  // };

  // const options = {
  //   hostname: "httpbin.org",
  //   port: 443,
  //   path: "/post",
  //   method: "POST",
  // };

  // const req = https.request(options, (res) => {
  //   console.log("statusCode:", res.statusCode);
  //   console.log("headers:", res.headers);

  //   res.on("data", (d) => {
  //     process.stdout.write(d);
  //   });
  // });

  // req.on("error", (e) => {
  //   console.error(e);
  // });
  // req.end();
} catch (error) {
  core.setFailed(error.message);
}
