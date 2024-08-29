import { NetlifyAPI } from "netlify";

import * as core from "@actions/core";
import * as github from "@actions/github";
import https from "node:https";

try {
  const name = core.getInput("name");
  const site_id = core.getInput("id");
  const title = core.getInput("title");
  const netlify_payload = core.getInput("payload");
  const token = core.getInput("token");
  // const branch = github.context.payload.pull_request.head.ref;
  const branch = "feature/PEWEB-175-custom-domain-for-api-gw";

  const client = new NetlifyAPI(token);

  console.log("Calling listSiteDeploys");
  let deployments = await client.listSiteDeploys({
    site_id: site_id,
    branch: branch,
  });
  console.log(`Deployments # ${deployments.length}`);
  deployments = deployments.filter((deployment) => deployment.title == title);
  console.log(`Filtered # ${deployments.length}`);
  // console.log(deployments);

  // Output:
  // state: 'ready',
  //     Statuses:
  //          "new" "pending_review" "accepted" "rejected" "enqueued" "building" "uploading" "uploaded"
  //          "preparing" "prepared" "processing" "processed" "ready" "error" "retrying"
  // deploy_ssl_url: 'https://feature-peweb-175-custom-domain-for-api-gw--sportdog.netlify.app',
  // deploy_time: null (in progress) or <int> (if done)
  // error_message: null (success) or str (if error)
  var deployment = deployments[0];
  var deploy_id = deployment.id;
  var in_progress = deployment.deploy_time == null;
  console.log(
    `state: ${deployment.state} (== 'ready': ${deployment.state == "ready"})`
  );
  console.log(`deploy url: ${deployment.deploy_ssl_url}`);
  console.log(`deploy time: ${deployment.deploy_time}`);
  console.log(
    `error message: ${deployment.error_message} (== null: ${
      deployment.error_message == null
    })`
  );

  in_progress = true;
  while (in_progress) {
    console.log("Sleeping 2 sec");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Sleeping done, updating status");
    deployment = await client.getSiteDeployment({
      site_id: site_id,
      deploy_id: deploy_id,
    });
    in_progress = deployment.deploy_time == null;
    console.log(`Got update. In progress: ${in_progress}`);
  }

  console.log(
    `state: ${deployment.state} (== 'ready': ${deployment.state == "ready"})`
  );
  console.log(`deploy url: ${deployment.deploy_ssl_url}`);
  console.log(`deploy time: ${deployment.deploy_time}`);
  console.log(
    `error message: ${deployment.error_message} (== null: ${
      deployment.error_message == null
    })`
  );
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
