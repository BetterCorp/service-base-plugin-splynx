import { CPlugin, CPluginClient } from '@bettercorp/service-base/lib/interfaces/plugins';
import { Tools } from '@bettercorp/tools/lib/Tools';
import { Splynx } from './lib/splynx';
import { SplynxEvents } from '../../events';
import { IServerConfig, ISplynxData, ISplynxPluginConfig } from '../../weblib';
//import { fastify } from '@bettercorp/service-base-plugin-web-server/lib/plugins/fastify/fastify';
//import { FastifyReply } from 'fastify/types/reply';
//import { FastifyRequest } from 'fastify/types/request';

export class splynx extends CPluginClient<ISplynxPluginConfig> {
  public readonly _pluginName: string = "splynx";

  /*async onEventsVerifyServer(listener: (resolve: PromiseResolve<boolean, void>, reject: PromiseResolve<any, void>, clientKey: string) => void) {
    this.onReturnableEvent(SplynxEvents.eventsVerifyServer, listener as any);
  };
  async onEventsGetServer(listener: (resolve: PromiseResolve<IServerConfig, void>, reject: PromiseResolve<any, void>, clientKey: string) => void) {
    this.onReturnableEvent(SplynxEvents.eventsGetServer, listener as any);
  };
  async onEventsEmitServer(listener: (data: IUCRMServerEvent) => void) {
    this.onEvent(SplynxEvents.eventsServer, listener as any);
  };*/
  async getServices(server: IServerConfig, clientId?: number/*, serviceId?: number*/) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getServices, {
      server,
      data: {
        clientId
      }
    });
  }
  async getPaymentMethods(server: IServerConfig) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getPaymentMethods, {
      server,
      data: null
    });
  }
  async getPayments(server: IServerConfig, clientId: number, id?: number) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getPayments, {
      server,
      data: {
        clientId,
        id
      }
    });
  }
  async getClientById(server: IServerConfig, id: number) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getClient, {
      server,
      data: {
        id
      }
    });
  }
  async getInvoices(server: IServerConfig, clientId: Number, invoiceId?: Number) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getInvoices, {
      server,
      data: {
        clientId,
        invoiceId
      }
    });
  }
}

export class Plugin extends CPlugin<ISplynxPluginConfig> {
  //private fastify!: fastify;
  private setupServer(data: ISplynxData): Promise<Splynx> {
    return new Promise((resolve, reject) => {
      if (Tools.isNullOrUndefined(data)
        || Tools.isNullOrUndefined(data.server)
        || Tools.isNullOrUndefined(data.server.hostname)
        || Tools.isNullOrUndefined(data.server.username)
        || Tools.isNullOrUndefined(data.server.password)) {
        return reject('Undefined variables passed in!');
      }
      resolve(new Splynx(data.server));
    });
  }


  private getPayments(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) => self.setupServer(data).then(server => server.getPayments(data.data.id, data.data.clientId).then(resolve).catch(reject)).catch(reject));
  }
  private getPaymentMethods(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) => self.setupServer(data).then(server => server.getPaymentMethods().then(resolve).catch(reject)).catch(reject));
  }
  private getServices(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) => self.setupServer(data).then(server => server.getServices(data.data.clientId).then(resolve).catch(reject)).catch(reject));
  }
  private getInvoices(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) => self.setupServer(data).then(server => server.getInvoices(data.data.invoiceId, data.data.clientId).then(resolve).catch(reject)).catch(reject));
  }
  private getClient(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) => self.setupServer(data).then(server => server.getClient(data.data.id).then(resolve).catch(reject)).catch(reject));
  }

  /*private async webHook(req: FastifyRequest<any>, reply: FastifyReply): Promise<void> {
    try {
      let postBody = req.body;
      this.log.info(`[CRM] ${ postBody.entity } changed for ${ postBody.extraData.entity.clientId } (${ postBody.eventName }-${ postBody.entityId })`);

      let cleanedID = `${ req.params.id }`.replace(/(?![-])[\W]/g, '').trim().substr(0, 255);
      let knownServer = await this.emitEventAndReturn<String, Boolean>(null, SplynxEvents.eventsGetServer + cleanedID, cleanedID);
      if (!knownServer) {
        reply.status(404).send();
        return;
      }

      this.emitEvent(null, SplynxEvents.eventsServer + cleanedID, postBody);
      reply.status(202).send();
    } catch (exc) {
      this.log.error(exc);
      reply.status(500).send();
    }
  }*/

  init(): Promise<void> {
    const self = this;
    return new Promise(async (resolve) => {
      /*self.fastify = new fastify(self);
      if ((await self.getPluginConfig()).webhooks === true) {
        self.fastify.post('/initrd/events/:id', (a, b) => self.webHook(a, b));
      }*/
      self.onReturnableEvent(null, SplynxEvents.getPayments, data => self.getPayments(data));
      self.onReturnableEvent(null, SplynxEvents.getPaymentMethods, data => self.getPaymentMethods(data));
      self.onReturnableEvent(null, SplynxEvents.getServices, data => self.getServices(data));
      self.onReturnableEvent(null, SplynxEvents.getInvoices, data => self.getInvoices(data));
      self.onReturnableEvent(null, SplynxEvents.getClient, data => self.getClient(data));

      self.log.info("Splynx Ready");
      resolve();
    });
  }
};