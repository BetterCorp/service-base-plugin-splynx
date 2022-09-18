import { SecConfig } from "@bettercorp/service-base";
import * as bcrypt from "bcrypt";

export enum ISplynxAPIVersion {
  v1 = "1.0",
  v2 = "2.0",
}
export interface IServerConfig {
  hostname: string;
  version: ISplynxAPIVersion;
  username: string;
  password: string;
}

export interface ISplynxPluginConfig {
  webhooks: boolean; // Webhooks: Enable inbound webhooks (Not available yet)
  //crmAPI: boolean; //
  clientEndpointKey: string; // Client Key: Inbound URL key for WebHooks
  multiTenant: boolean; // Multi-Tenant Mode: If false, Client Key is used to lock down webhooks
  myHost: string; // My Host: My hosts URL
  serverConfig?: IServerConfig; // Server Config: If not running in multi-tenant config, you can define the splynx details here
}

export class Config extends SecConfig<ISplynxPluginConfig> {
  migrate(
    mappedPluginName: string,
    existingConfig: ISplynxPluginConfig
  ): ISplynxPluginConfig {
    return {
      serverConfig:
        existingConfig.serverConfig !== undefined
          ? existingConfig.serverConfig
          : undefined,
      webhooks:
        existingConfig.webhooks !== undefined ? existingConfig.webhooks : false,
      //crmAPI: false,
      clientEndpointKey:
        existingConfig.clientEndpointKey !== undefined
          ? existingConfig.clientEndpointKey
          : Buffer.from(bcrypt.genSaltSync(1).repeat(3), "utf8").toString(
              "base64url"
            ),
      multiTenant:
        existingConfig.multiTenant !== undefined
          ? existingConfig.multiTenant
          : false,
      myHost:
        existingConfig.myHost !== undefined
          ? existingConfig.myHost
          : "http://localhost",
    };
  }
}
