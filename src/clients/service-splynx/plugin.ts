import { ServiceCallable, ServicesClient } from "@bettercorp/service-base";
import {
  IServerConfig,
  ISplynxPluginConfig,
} from "../../plugins/service-splynx/sec.config";
import {
  SplynxReturnEmitEvents,
  SplynxEmitAndReturnEvents,
  SplynxReturnEmitAndReturnEvents,
} from "../../plugins/service-splynx/plugin";
import {
  SplynxPayment,
  SplynxPaymentMethod,
  SplynxClient,
  SplynxInvoice,
} from "../../plugins/service-splynx/lib/splynx";

export class splynx
  extends ServicesClient<
    ServiceCallable,
    SplynxReturnEmitEvents,
    SplynxEmitAndReturnEvents,
    SplynxReturnEmitAndReturnEvents,
    ServiceCallable,
    ISplynxPluginConfig
  >
  implements SplynxEmitAndReturnEvents
{
  async getServices(
    server: IServerConfig,
    clientId?: number | undefined
  ): Promise<any[]> {
    return await this._plugin.emitEventAndReturn(
      "getServices",
      server,
      clientId
    );
  }
  async getPayments(
    server: IServerConfig,
    clientId: number,
    id?: number | undefined
  ): Promise<SplynxPayment | SplynxPayment[]> {
    return await this._plugin.emitEventAndReturn(
      "getPayments",
      server,
      clientId,
      id
    );
  }
  async getPaymentMethods(
    server: IServerConfig
  ): Promise<SplynxPaymentMethod[]> {
    return await this._plugin.emitEventAndReturn("getPaymentMethods", server);
  }
  async getClientById(
    server: IServerConfig,
    id: number
  ): Promise<SplynxClient> {
    return await this._plugin.emitEventAndReturn("getClientById", server, id);
  }
  async getClients(server: IServerConfig): Promise<SplynxClient[]> {
    return await this._plugin.emitEventAndReturn("getClients", server);
  }
  async getInvoices(
    server: IServerConfig,
    clientId: number,
    invoiceId?: number | undefined
  ): Promise<SplynxInvoice | SplynxInvoice[]> {
    return await this._plugin.emitEventAndReturn(
      "getInvoices",
      server,
      clientId,
      invoiceId
    );
  }
  async addPayment(
    server: IServerConfig,
    clientId: number,
    invoiceId?: number | undefined,
    requestId?: number | undefined,
    transactionId?: number | undefined,
    paymentType?: string | undefined,
    receiptNumber?: string | undefined,
    date?: number | undefined,
    amount?: number | undefined,
    note?: string | undefined,
    comment?: string | undefined,
    field1?: string | undefined,
    field2?: string | undefined,
    field3?: string | undefined,
    field4?: string | undefined,
    field5?: string | undefined
  ): Promise<SplynxPayment> {
    return await this._plugin.emitEventAndReturn(
      "addPayment",
      server,
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
      field5
    );
  }
  public override readonly _pluginName: string = "service-splynx";

  /*async onWebhook(listener: {(clientKey: string, data: any): Promise<void>}): Promise<void> {
    await this._plugin.onEvent('onWebhook', (...a) => {

    });
  }*/
}
