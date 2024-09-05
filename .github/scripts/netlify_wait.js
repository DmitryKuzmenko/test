import { NetlifyAPI } from "netlify";

// module.exports = async (core, site_id, title, token) => {
export default async function netlify_wait(
  core,
  github,
  context,
  site_name,
  site_id,
  title,
  token
) {
  try {
    console.log(`core: ${core}`);
    console.log(`site_name: ${site_name}`);
    console.log(`site_id: ${site_id}`);
    console.log(`title: ${title}`);
    console.log(`token: ${token}`);
    const payload = JSON.stringify(context.payload);
    console.log(`payload: ${payload}`);
    const br = context.payload.pull_request.head.ref;
    console.log(`head ref: ${br}`);
    const branch = "feature/PEWEB-175-custom-domain-for-api-gw";

    const client = new NetlifyAPI(token);

    console.log("Calling listSiteDeploys");
    let deployments = await client.listSiteDeploys({
      site_id: site_id,
      branch: branch,
    });
    console.log(`Deployments # ${deployments.length}`);
    console.log(deployments);
    deployments = deployments.filter((deployment) => deployment.title == title);
    console.log(`Filtered # ${deployments.length}`);

    var deployment = deployments[0];
    var deploy_id = deployment.id;

    function deploy_in_progress(deployment) {
      /**
       * Netlify Deploy state is enum. Possible values are:
       * "new" "pending_review" "accepted" "rejected" "enqueued" "building" "uploading" "uploaded" "preparing" "prepared" "processing" "processed" "ready" "error" "retrying"
       *
       * There is no specific field in the deploy data set that let us know is the process done or still in progress.
       *
       * By analyzing existing deploys states here we use the following logic:
       *  - When deploy is done Netlify sets the `deploy_time` field to a non-`null` value.
       *  - If error occurred Netlify sets the `error_message` to a non-`null` string.
       *  - Special case of a canceled deploy because of no changes could be determined by the specific error message:
       *    "Failed during stage 'checking build content for changes': Canceled build due to no content change"
       *
       * Relevant examples:
       *  - state: 'error', error_message: "Failed during stage 'building site': Command did not finish within the time limit", deploy_time: null,
       *  - state: 'error', error_message: "Failed during stage 'checking build content for changes': Canceled build due to no content change", deploy_time: null,
       *  - state: 'error', error_message: 'Canceled build', deploy_time: null,
       *  - state: 'error', error_message: 'Skipped', deploy_time: null,
       *  - state: 'new', error_message: null, deploy_time: null,
       *  - state: 'prepared', error_message: 'Canceled build', deploy_time: null,
       *  - state: 'ready', error_message: null, deploy_time: 333,
       */
      return deployment.deploy_time == null && deployment.error_message == null;
    }

    var in_progress = deploy_in_progress(deployment);
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
      await new Promise((resolve) => setTimeout(resolve, 10000));
      console.log("Sleeping done, updating status");
      deployment = await client.getSiteDeploy({
        site_id: site_id,
        deploy_id: deploy_id,
      });
      in_progress = deploy_in_progress(deployment);
      console.log(`Got update. In progress: ${in_progress}`);
      console.log(deployment);
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
    core.setOutput("site-url", deployment.deploy_ssl_url);
  } catch (error) {
    core.setFailed(error.message);
  }
}
