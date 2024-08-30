import { NetlifyAPI } from "netlify";

// module.exports = async (core, site_id, title, token) => {
export default async function netlify_wait(core, site_id, title, token) {
  try {
    console.log(`core: ${core}`);
    console.log(`site_id: ${site_id}`);
    console.log(`title: ${title}`);
    console.log(`token: ${token}`);
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
      deployment = await client.getSiteDeploy({
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
    core.setOutput('site-url', deployment.deploy_ssl_url);
  } catch (error) {
    core.setFailed(error.message);
  }
}
