import * as crypto from 'crypto';
import { ISplynxPluginConfig } from '../../weblib';

export default (): ISplynxPluginConfig => {
  return {
    webhooks: false,
    crmAPI: false,
    clientEncryptionKey: crypto.pseudoRandomBytes(64).toString('hex'),
    myHost: 'http://localhost'
  };
};