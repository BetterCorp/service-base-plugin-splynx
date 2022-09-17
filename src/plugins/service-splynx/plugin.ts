import { Tools } from "@bettercorp/tools/lib/Tools";
import {
  Splynx,
  SplynxClient,
  SplynxInvoice,
  SplynxPayment,
  SplynxPaymentMethod,
} from "./lib/splynx";
import moment = require("moment");
import { IPluginLogger, ServiceCallable, ServicesBase } from "@bettercorp/service-base";
import { IServerConfig, ISplynxPluginConfig } from "./sec.config";
import { fastify } from '@bettercorp/service-base-plugin-web-server/lib/clients/service-fastify/plugin';

export interface SplynxReturnEmitEvents {
  onWebhook(clientKey: string, data: any): Promise<void>;
}
export interface SplynxReturnEmitAndReturnEvents {
  validateClientKey(clientKey: string): Promise<boolean>;
}
export interface SplynxEmitAndReturnEvents {
  getServices(
    server: IServerConfig,
    clientId?: number /*, serviceId?: number*/
  ): Promise<Array<any>>;
  getPayments(
    server: IServerConfig,
    clientId: number,
    id?: number
  ): Promise<SplynxPayment | Array<SplynxPayment>>;
  getPaymentMethods(server: IServerConfig): Promise<Array<SplynxPaymentMethod>>;
  getClientById(server: IServerConfig, id: number): Promise<SplynxClient>;
  getClients(server: IServerConfig): Promise<SplynxClient[]>;
  getInvoices(
    server: IServerConfig,
    clientId: number,
    invoiceId?: number
  ): Promise<SplynxInvoice | Array<SplynxInvoice>>;
  addPayment(
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
  ): Promise<SplynxPayment>;
}

export class Service extends ServicesBase<
  ServiceCallable,
  SplynxReturnEmitEvents,
  SplynxEmitAndReturnEvents,
  SplynxReturnEmitAndReturnEvents,
  ServiceCallable,
  ISplynxPluginConfig
> {
  private fastify: fastify;
  constructor(pluginName: string, cwd: string, log: IPluginLogger) {
    super(pluginName, cwd, log);
    this.fastify = new fastify(this);
  }

  private setupServer(server: IServerConfig): Promise<Splynx> {
    return new Promise((resolve, reject) => {
      if (
        Tools.isNullOrUndefined(server.hostname) ||
        Tools.isNullOrUndefined(server.username) ||
        Tools.isNullOrUndefined(server.password)
      ) {
        return reject("Undefined variables passed in!");
      }
      resolve(new Splynx(server));
    });
  }

  public override async init() {
    const self = this;
    if ((await self.getPluginConfig()).webhooks === true) {
      self.fastify.post<any, any, any, any>(
        "/initrd/events/:id",
        async (req, reply) => {
          try {
            let postBody = req.body as any;
            if (postBody.type == "ping") {
              self.log.info(`PING: ${req.headers.ip}`);
              reply.status(200).send();
              return;
            }
            if (postBody.type != "event") {
              self.log.warn(
                `[${postBody.type}]: ${req.headers.ip} - not parsable type, we'll just respond OK`
              );
              reply.status(200).send();
              return;
            }
            self.log.info(
              `[CRM] ${postBody.data.source} (${postBody.data.model}) ${
                postBody.data.action
              } for ${
                postBody.data.customer_id ||
                (postBody.data.service || {}).id ||
                postBody.data.hook_id ||
                "UNKNOWN_ID"
              }`,
              {},true
            );

            let cleanedID = `${(req.params as any).id}`
              .replace(/(?![-])[\W]/g, "")
              .trim()
              .substring(0, 255);
            let knownServer = await this.emitEventAndReturn("validateClientKey",
              cleanedID
            );
            if (!knownServer) {
              reply.status(404).send();
              return;
            }

            self.emitEvent("onWebhook",
              cleanedID,
              postBody.data
            );
            reply.status(202).send();
          } catch (exc: any) {
            self.log.error(exc);
            reply.status(500).send();
          }
        }
      );
    }
    await this.onReturnableEvent(
      "getServices",
      async (server: IServerConfig, clientId?: number) => {
        return await (await self.setupServer(server)).getServices(clientId);
      }
    );
    await this.onReturnableEvent(
      "getPayments",
      async (server: IServerConfig, clientId: number, id?: number) => {
        return await (await self.setupServer(server)).getPayments(id, clientId);
      }
    );
    await this.onReturnableEvent(
      "getPaymentMethods",
      async (server: IServerConfig) => {
        return (await (
          await self.setupServer(server)
        ).getPaymentMethods()) as Array<SplynxPaymentMethod>;
      }
    );
    await this.onReturnableEvent(
      "getClientById",
      async (server: IServerConfig, id: number) => {
        return (await (
          await self.setupServer(server)
        ).getClients(id)) as SplynxClient;
      }
    );
    await this.onReturnableEvent(
      "getClients",
      async (server: IServerConfig) => {
        return (await (
          await self.setupServer(server)
        ).getClients()) as Array<SplynxClient>;
      }
    );
    await this.onReturnableEvent(
      "getInvoices",
      async (server: IServerConfig,
        clientId: number,
        invoiceId?: number) => {
        return (await (
          await self.setupServer(server)
        ).getInvoices(invoiceId, clientId));
      }
    );
    await this.onReturnableEvent(
      "addPayment",
      async (
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
      ) => {
        return await (
          await self.setupServer(server)
        ).addPayment(
          clientId,
          invoiceId,
          requestId,
          transactionId,
          paymentType,
          receiptNumber ||
            `${moment().format("DD MM YYYY")}-${clientId}`.replace(/ /g, ""),
          date,
          //date || moment().format("YYYY-MM-DD"),
          amount,
          note,
          comment,
          field1,
          field2,
          field3,
          field4,
          field5
        );
      }
    );
  }
}

