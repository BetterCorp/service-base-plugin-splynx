export enum ISplynxAPIVersion {
  v1 = "1.0",
  v2 = "2.0"
}

export interface ISplynxPluginConfig {
  webhooks: boolean;
  crmAPI: boolean;
  clientEncryptionKey: string;
  myHost: string;
}

export interface IServerConfig {
  hostname: string;
  version: ISplynxAPIVersion;
  username: string;
  password: string;
}

export interface ISplynxData {
  data: any;
  server: IServerConfig;
}