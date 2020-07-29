import * as logger from "../../logger";
import { promptOnce } from "../../prompt";
import fsutils = require("../../fsutils");

import clc = require("cli-color");
import { RemoteConfigTemplate } from "../../remoteconfig/interfaces";
import Config = require("../../config");

/**
 * Function retrieves names for parameters and parameter groups
 * @param setup Input is of type any
 * @param config Input is of type any
 * @return {Promise} Returns a promise and writes the project file for remoteconfig template when initializing
 */

interface RemoteConfig {
  template?: RemoteConfigTemplate;
}
interface SetUpConfig {
  remoteconfig: RemoteConfig;
}
interface RemoteConfigSetup {
  config: SetUpConfig;
}
export async function doSetup(setup: RemoteConfigSetup, config: Config): Promise<void> {
  setup.config.remoteconfig = {};
  const jsonFilePath = await promptOnce({
    type: "input",
    name: "template",
    message: "What is the path file you want to store your template.json?",
    default: "remoteconfig.template.json",
  });
  if (fsutils.fileExistsSync(jsonFilePath)) {
    const msg =
      "File " +
      clc.bold(jsonFilePath) +
      " already exists." +
      " Do you want to overwrite the default Remote Config Template file path?";
    const overwrite = await promptOnce({
      type: "confirm",
      message: msg,
      default: false,
    });
    if (overwrite == true) {
      setup.config.remoteconfig.template = jsonFilePath;
      logger.info(setup.config.remoteconfig.template);
    } else {
      setup.config.remoteconfig.template = jsonFilePath;
    }
  }
  setup.config.remoteconfig.template = jsonFilePath;
  config.writeProjectFile(setup.config.remoteconfig.template, "");
}
