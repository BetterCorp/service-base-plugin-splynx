import {
  CPlugin,
  CPluginClient,
} from "@bettercorp/service-base/lib/interfaces/plugins";
import { Tools } from "@bettercorp/tools/lib/Tools";
import { Splynx, SplynxClient, SplynxPayment } from "./lib/splynx";
import { SplynxEvents } from "../../events";
import { IServerConfig, ISplynxData, ISplynxPluginConfig } from "../../weblib";
import moment = require("moment");
import { fastify } from "@bettercorp/service-base-plugin-web-server/lib/plugins/fastify/fastify";

export class splynx extends CPluginClient<ISplynxPluginConfig> {
  public readonly _pluginName: string = "splynx";

  /*async onEventsVerifyServer(listener: (resolve: (), reject: PromiseResolve<any, void>, clientKey: string) => void) {
    this.onReturnableEvent(SplynxEvents.eventsVerifyServer, listener as any);
  };*/
  async onEventsGetServer(listener: (clientKey?: string) => Promise<boolean>) {
    this.onReturnableEvent<string, boolean>(
      SplynxEvents.eventsGetServer,
      listener
    );
  }
  async onEventsEmitServer(listener: (data: any) => Promise<void>) {
    this.onEvent(SplynxEvents.eventsServer, listener);
  }
  async getServices(
    server: IServerConfig,
    clientId?: number /*, serviceId?: number*/
  ) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getServices, {
      server,
      data: {
        clientId,
      },
    });
  }
  async getPaymentMethods(server: IServerConfig) {
    return this.emitEventAndReturn<ISplynxData, any>(
      SplynxEvents.getPaymentMethods,
      {
        server,
        data: null,
      }
    );
  }
  async getPayments(
    server: IServerConfig,
    clientId: number
  ): Promise<Array<SplynxPayment>>;
  async getPayments(
    server: IServerConfig,
    clientId: number,
    id: number
  ): Promise<SplynxPayment>;
  async getPayments(
    server: IServerConfig,
    clientId: number,
    id?: number
  ): Promise<SplynxPayment | Array<SplynxPayment>> {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getPayments, {
      server,
      data: {
        clientId,
        id,
      },
    });
  }
  async getClientById(
    server: IServerConfig,
    id: number
  ): Promise<SplynxClient> {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getClients, {
      server,
      data: {
        id,
      },
    });
  }
  async getClients(server: IServerConfig): Promise<SplynxClient[]> {
    return this.emitEventAndReturn<ISplynxData, Array<any>>(
      SplynxEvents.getClients,
      {
        server,
        data: {},
      }
    );
  }
  async getInvoices(
    server: IServerConfig,
    clientId: number,
    invoiceId?: number
  ) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getInvoices, {
      server,
      data: {
        clientId,
        invoiceId,
      },
    });
  }
  async addPayment(
    server: IServerConfig,
    clientId: number,
    invoiceId?: number,
    requestId?: number,
    transactionId?: number,
    paymentType?: string,
    receiptNumber?: string,
    date?: number,
    amount?: number,
    note?: string,
    comment?: string,
    field1?: string,
    field2?: string,
    field3?: string,
    field4?: string,
    field5?: string
  ): Promise<SplynxPayment> {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.addPayment, {
      server,
      data: {
        clientId,
        invoiceId,
        requestId,
        transactionId,
        paymentType,
        receiptNumber,
        date,
        amount,
        note,
        comment,
        field1,
        field2,
        field3,
        field4,
        field5,
      },
    });
  }
}

export class Plugin extends CPlugin<ISplynxPluginConfig> {
  private fastify!: fastify;
  private setupServer(data: ISplynxData): Promise<Splynx> {
    return new Promise((resolve, reject) => {
      if (
        Tools.isNullOrUndefined(data) ||
        Tools.isNullOrUndefined(data.server) ||
        Tools.isNullOrUndefined(data.server.hostname) ||
        Tools.isNullOrUndefined(data.server.username) ||
        Tools.isNullOrUndefined(data.server.password)
      ) {
        return reject("Undefined variables passed in!");
      }
      resolve(new Splynx(data.server));
    });
  }

  private addPayment(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) =>
      self
        .setupServer(data)
        .then((server) => {
          server
            .addPayment(
              data.data.clientId,
              data.data.invoiceId,
              data.data.requestId,
              data.data.transactionId,
              data.data.paymentType,
              data.data.receiptNumber ||
                `${moment().format("DD MM YYYY")}-${
                  data.data.clientId
                }`.replace(/ /g, ""),
              data.data.date || moment().format("YYYY-MM-DD"),
              data.data.amount,
              data.data.note,
              data.data.comment,
              data.data.field1,
              data.data.field2,
              data.data.field3,
              data.data.field4,
              data.data.field5
            )
            .then(resolve)
            .catch((a) => {
              self.log.error(a);
              reject(a);
            });
        })
        .catch(reject)
    );
  }
  private getPayments(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) =>
      self
        .setupServer(data)
        .then((server) =>
          server
            .getPayments(data.data.id, data.data.clientId)
            .then(resolve)
            .catch((a) => {
              self.log.error(a);
              reject(a);
            })
        )
        .catch(reject)
    );
  }
  private getPaymentMethods(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) =>
      self
        .setupServer(data)
        .then((server) =>
          server.getPaymentMethods().then(resolve).catch(reject)
        )
        .catch((a) => {
          self.log.error(a);
          reject(a);
        })
    );
  }
  private getServices(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) =>
      self
        .setupServer(data)
        .then((server) =>
          server.getServices(data.data.clientId).then(resolve).catch(reject)
        )
        .catch((a) => {
          self.log.error(a);
          reject(a);
        })
    );
  }
  private getInvoices(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) =>
      self
        .setupServer(data)
        .then((server) =>
          server
            .getInvoices(data.data.invoiceId, data.data.clientId)
            .then(resolve)
            .catch(reject)
        )
        .catch((a) => {
          self.log.error(a);
          reject(a);
        })
    );
  }
  private getClients(data: ISplynxData) {
    const self = this;
    return new Promise((resolve, reject) =>
      self
        .setupServer(data)
        .then((server) =>
          server.getClients(data.data.id).then(resolve).catch(reject)
        )
        .catch((a) => {
          self.log.error(a);
          reject(a);
        })
    );
  }

  init(): Promise<void> {
    const self = this;
    return new Promise(async (resolve) => {
      if ((await self.getPluginConfig()).webhooks === true) {
        self.fastify = new fastify(self);
        self.fastify.post<any, any>(
          "/initrd/events/:id",
          async (req, reply) => {
            try {
              let postBody = req.body;
              if (postBody.type == "ping") {
                this.log.info(`PING: ${req.headers.ip}`);
                reply.status(200).send();
                return;
              }
              if (postBody.type != "event") {
                this.log.info(
                  `[${postBody.type}]: ${req.headers.ip} - not parsable type, we'll just respond OK`
                );
                reply.status(200).send();
                return;
              }
              this.log.info(
                `[CRM] ${postBody.data.source} (${postBody.data.model}) ${
                  postBody.data.action
                } for ${
                  postBody.data.customer_id ||
                  (postBody.data.service || {}).id ||
                  postBody.data.hook_id ||
                  "UNKNOWN_ID"
                }`
              );

              let cleanedID = `${req.params.id}`
                .replace(/(?![-])[\W]/g, "")
                .trim()
                .substring(0, 255);
              let knownServer = await this.emitEventAndReturn<String, Boolean>(
                null,
                SplynxEvents.eventsGetServer + cleanedID,
                cleanedID
              );
              if (!knownServer) {
                reply.status(404).send();
                return;
              }

              this.emitEvent(
                null,
                SplynxEvents.eventsServer + cleanedID,
                postBody.data
              );
              reply.status(202).send();
            } catch (exc) {
              this.log.error(exc);
              reply.status(500).send();
            }
          }
        );
      }
      self.onReturnableEvent(null, SplynxEvents.addPayment, (data) =>
        self.addPayment(data)
      );
      self.onReturnableEvent(null, SplynxEvents.getPayments, (data) =>
        self.getPayments(data)
      );
      self.onReturnableEvent(null, SplynxEvents.getPaymentMethods, (data) =>
        self.getPaymentMethods(data)
      );
      self.onReturnableEvent(null, SplynxEvents.getServices, (data) =>
        self.getServices(data)
      );
      self.onReturnableEvent(null, SplynxEvents.getInvoices, (data) =>
        self.getInvoices(data)
      );
      self.onReturnableEvent(null, SplynxEvents.getClients, (data) =>
        self.getClients(data)
      );

      self.log.info("Splynx Ready");
      resolve();
    });
  }
}
