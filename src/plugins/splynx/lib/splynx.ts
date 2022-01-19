//import { Tools } from '@bettercorp/tools/lib/Tools';
import { Tools } from '@bettercorp/tools/lib/Tools';
import { IServerConfig, ISplynxAPIVersion } from '../../../weblib';
//import moment = require('moment');
import * as moment from 'moment';
import { ApiHelper } from './index';

export class Splynx implements ISplynx {
  private server: ApiHelper;
  private serverConf: IServerConfig;
  private loggedIn = false;
  constructor(server: IServerConfig) {
    this.serverConf = server;
    this.server = new ApiHelper(server.hostname);
    this.server.version = server.version === ISplynxAPIVersion.v1 ? ApiHelper.API_VERSION_1_0 : ApiHelper.API_VERSION_2_0;
  }
  async login() {
    if (this.loggedIn) return;
    let state = await this.server.login(ApiHelper.LOGIN_TYPE_ADMIN, {
      login: this.serverConf.username,
      password: this.serverConf.password
    });
    if (state.statusCode !== 201) throw state;
    this.loggedIn = true;
  }
  async getServices(clientId?: Number): Promise<SplynxService[]> {
    await this.login();
    return this.server.get(`admin/customers/customer/${ clientId }/internet-services`);
  }
  async getClient(id?: Number): Promise<SplynxClient | SplynxClient[]> {
    await this.login();
    return this.server.get(`admin/customers/customer`, id);
  }

  addPayment(clientId: number,
    invoiceId?: number, requestId?: number, transactionId?: number,
    paymentType?: string, receiptNumber?: string, date?: number, amount?: number, note?: string,
    comment?: string, field1?: string, field2?: string, field3?: string, field4?: string, field5?: string): Promise<SplynxPayment> {
    return new Promise(async (resolve, reject) => {
      if (Tools.isNullOrUndefined(clientId)) return reject('clientId not set');
      if (Tools.isNullOrUndefined(paymentType)) return reject('paymentType not set');
      if (Tools.isNullOrUndefined(receiptNumber)) return reject('receiptNumber not set');
      if (Tools.isNullOrUndefined(amount)) return reject('amount not set');

      await this.login();

      this.server.post<any, SplynxPayment>(`admin/finance/payments`, {
        customer_id: clientId,
        invoice_id: invoiceId,
        request_id: requestId,
        transaction_id: transactionId,
        payment_type: paymentType,
        receipt_number: receiptNumber,
        date: moment(date).format('YYYY-MM-DD'),
        amount: amount!.toFixed(2),
        note: note,
        comment: comment,
        field_1: field1,
        field_2: field2,
        field_3: field3,
        field_4: field4,
        field_5: field5,
      }, 'multipart/form-data').then(resolve).catch(reject);
    });
  }
  async getInvoices(invoiceId?: number, clientId?: Number): Promise<SplynxInvoice | SplynxInvoice[]> {
    await this.login();
    if (Tools.isNullOrUndefined(invoiceId)) {
      let clientIdAsStr = `${ clientId }`;
      let invoices = await this.server.get<Array<SplynxInvoice>>(`admin/finance/invoices?customer_id=${ clientId }`);
      let sendingInvoices: Array<SplynxInvoice> = [];
      for (let inv of invoices) {
        if (inv.customer_id === clientIdAsStr)
          sendingInvoices.push(inv);
      }
      return sendingInvoices;
    };
    return this.server.get(`admin/finance/invoices`, `${ invoiceId }?customer_id=${ clientId }`);
  }
  async getPayments(paymentId?: Number, clientId?: Number): Promise<SplynxPayment | SplynxPayment[]> {
    await this.login();
    if (Tools.isNullOrUndefined(paymentId)) {
      let clientIdAsStr = `${ clientId }`;
      let payments = await this.server.get<Array<SplynxPayment>>(`admin/finance/payments?customer_id=${ clientId }`);
      let sendingPayments: Array<SplynxPayment> = [];
      for (let paym of payments) {
        if (paym.customer_id === clientIdAsStr)
          sendingPayments.push(paym);
      }
      return sendingPayments;
    };
    return this.server.get(`admin/finance/payments`, `${ paymentId }?customer_id=${ clientId }`);
  }
  async getPaymentMethods(): Promise<SplynxPaymentMethod | SplynxPaymentMethod[]> {
    await this.login();
    return this.server.get(`admin/finance/payment-methods`);
  };
  // getServicePlanSurcharges(serviceId?: Number, id?: Number): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // self.webRequest(`/clients/services/${ serviceId }/service-surcharges${ Tools.isNullOrUndefined(id) ? '' : `/${ id }` }`, 'GET').then(async (x) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }
  // getServicePlans(id?: Number): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // return self.webRequest(`/service-plans${ Tools.isNullOrUndefined(id) ? '' : `/${ id }` }`, 'GET').then(async (x) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }

  // private webRequest(path: string, method: string, params: Object | undefined = undefined, data: Object | undefined = undefined, additionalProps: Object | undefined = undefined) {
  // return CWR(this.ServerConfig, '/crm/api/v1.0', path, method, params, data, additionalProps);
  // }

  // addNewServiceForClient(service: UCRM_Service, clientId: number): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // self.webRequest(`/clients/${ clientId }/services`, 'POST', undefined, service).then(resolve).catch(reject);
  // });
  // }
  // addNewClient(client: UCRM_Client): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // self.webRequest(`/clients`, 'POST', undefined, client).then(resolve).catch(reject);
  // });
  // }
  // getPayments(clientId?: Number): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // return self.webRequest(`/payments${ clientId !== undefined ? `?clientId=${ clientId }&limit=10000` : '?limit=10000' }`, 'GET').then(async (x) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }
  // getPaymentMethods(): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // return self.webRequest(`/payment-methods`, 'GET').then(async (x) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }
  // getInvoicePdf(invoiceId: number, clientId: Number): Promise<any> {
  // const self = this;
  // return new Promise((resolve, reject) => {
  // self.getInvoices(invoiceId, clientId).then((invoiceObj: any) => {
  // if (`${ invoiceObj.clientId }` !== `${ clientId }`)
  // return reject(`NO AUTH (${ invoiceId } !=belong to ${ clientId }) {${ invoiceObj.clientId }}`);
  // self.webRequest(`/invoices/${ invoiceId }/pdf`, 'GET', undefined, undefined, {
  // responseType: 'stream'
  // }).then((response: any) => {
  // var writer = Tools.MemoryStream();
  // response.data.pipe(writer);
  // resolve(writer);
  // }).catch(reject);
  // }).catch(reject);
  // });
  // }
  // getServices(serviceId?: Number, clientId?: Number, status?: number, offset: number = 0, limit: number = 10000): Promise<any[]> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // self.webRequest((clientId !== undefined && clientId !== null && (serviceId === undefined || serviceId === null) ?
  // `/clients/services?clientId=${ clientId }&offset=${ offset }&limit=${ limit }${ Tools.isNullOrUndefined(status) ? '' : `&statuses=${ status }` }` :
  // `/clients/services${ serviceId !== undefined && serviceId !== null ?
  // `/${ serviceId }?offset=${ offset }&limit=${ limit }` :
  // `?offset=${ offset }&limit=${ limit }` }${ Tools.isNullOrUndefined(status) ? '' : `&statuses=${ status }` }`), 'GET').then(x => resolve(x as Array<any>)).catch(reject);
  // });
  // }
  // getServiceSurcharges(serviceId: number): Promise<any[]> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // self.webRequest(`/clients/services/${ serviceId }/service-surcharges`, 'GET').then(x => resolve(x as Array<any>)).catch(reject);
  // });
  // }
  // getInvoices(invoiceId?: number, clientId?: Number): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // self.webRequest((clientId !== undefined && clientId !== null && (invoiceId === undefined || invoiceId === null) ? `/invoices?clientId=${ clientId }&limit=10000` : `/invoices${ invoiceId !== undefined && invoiceId !== null ? `/${ invoiceId }?limit=10000` : '?limit=10000' }`), 'GET').then(x => resolve(x as Array<any>)).catch(reject);
  // });
  // }
  // getClient(id?: Number, emailOrPhoneNumber?: String): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // if (emailOrPhoneNumber === undefined || emailOrPhoneNumber === null)
  // return self.webRequest(`/clients${ id ? `/${ id }` : '?limit=10000' }`, 'GET').then(x => resolve(x as Array<any> | any)).catch(reject);
  // let tempEmailOrPhone = `${ emailOrPhoneNumber }`.toLowerCase();
  // return self.webRequest(`/clients?limit=10000`, 'GET').then(async (x) => {
  // for (let clientObj of (x as any[])) {
  // let clientContacts = await self.webRequest(`/clients/${ clientObj.id }/contacts`, 'GET');
  // for (let contactObj of (clientContacts as any[])) {
  // if (contactObj.email !== undefined && contactObj.email !== null && `${ contactObj.email }`.toLowerCase() === tempEmailOrPhone) {
  // return resolve(clientObj);
  // }
  // if (contactObj.phone !== undefined && contactObj.phone !== null && `${ contactObj.phone }`.toLowerCase() === tempEmailOrPhone) {
  // return resolve(clientObj);
  // }
  // }
  // }
  // resolve(null);
  // }).catch(reject);
  // });
  // }
  // setClient(id: Number, clientObj: any): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // return self.webRequest(`/clients/${ id }`, 'PATCH', undefined, clientObj).then(async (x) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }
  // addPayment(clientId: Number, methodId: string, amount: number, note: string, invoiceIds?: number[], applyToInvoicesAutomatically?: boolean, userId?: number, additionalProps?: any): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // let sendObj: any = {
  // clientId,
  // amount,
  // currencyCode: 'ZAR',
  // note,
  // invoiceIds
  // };
  // sendObj.methodId = methodId;
  // if (!Tools.isNullOrUndefined(additionalProps)) {
  // if (!Tools.isNullOrUndefined(additionalProps.providerName))
  // sendObj.providerName = additionalProps.providerName;
  // if (!Tools.isNullOrUndefined(additionalProps.providerPaymentId))
  // sendObj.providerPaymentId = additionalProps.providerPaymentId;
  // sendObj.providerPaymentTime = additionalProps.providerPaymentTime || moment().format('DD/MM/YYYY HH:mm');
  // } else {
  // sendObj.providerPaymentTime = moment().format('DD/MM/YYYY HH:mm');
  // }
  // return self.webRequest(`/payments`, 'POST', undefined, sendObj).then(async (x) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }
  // getClientBankAccount(id?: Number, clientId?: Number): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // return self.webRequest(id !== undefined ? `/clients/bank-accounts/${ id }` : `/clients/${ clientId }/bank-accounts`, 'GET').then(async (x) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }
  // addClientBankAccount(clientId: Number, obj: any): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // return self.webRequest(`/clients/${ clientId }/bank-accounts`, 'POST', undefined, obj).then(async (x) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }
  // addNewInvoice(items: Array<UCRM_InvoiceItem>, attributes: Array<UCRM_InvoiceAttribute>, maturityDays: number = 14,
  // invoiceTemplateId: number, clientId: number, applyCredit: Boolean = true,
  // proforma: boolean = false, adminNotes?: string, notes?: string): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // return self.webRequest(`/clients/${ clientId }/invoices`, 'POST', undefined, {
  // items,
  // attributes,
  // maturityDays,
  // invoiceTemplateId,
  // applyCredit,
  // proforma,
  // adminNotes,
  // notes
  // }).then(async (x: any) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }
  // sendInvoice(invoiceId: string): Promise<any> {
  // let self = this;
  // return new Promise((resolve, reject) => {
  // return self.webRequest(`/invoices/${ invoiceId }/send`, 'PATCH').then(async (x: any) => {
  // resolve(x);
  // }).catch(reject);
  // });
  // }
}

export interface ISplynx {
  addPayment(clientId: number,
    invoiceId?: number, requestId?: number, transactionId?: number,
    paymentType?: string, receiptNumber?: string, date?: number, amount?: number, note?: string,
    comment?: string, field1?: string, field2?: string, field3?: string, field4?: string, field5?: string): Promise<SplynxPayment>;
  //addNewInvoice(items: Array<UCRM_InvoiceItem>, attributes: Array<UCRM_InvoiceAttribute>, maturityDays: number, invoiceTemplateId: number, clientId: number, applyCredit?: Boolean, proforma?: boolean, adminNotes?: string, notes?: string): Promise<any>;
  //sendInvoice(invoiceId: string): Promise<any>;
  //addNewServiceForClient(service: UCRM_Service, clientId: number): Promise<any>;
  //addNewClient(client: UCRM_Client): Promise<any>;
  getPayments(paymentId?: Number, clientId?: Number): Promise<Array<SplynxPayment> | SplynxPayment>;
  getPaymentMethods(): Promise<Array<SplynxPaymentMethod> | SplynxPaymentMethod>;
  //getInvoicePdf(invoiceId: number, clientId: Number): Promise<any>;
  getServices(clientId?: Number): Promise<Array<SplynxService>>;
  //getServiceSurcharges(serviceId: number): Promise<Array<any>>;
  getInvoices(invoiceId?: number, clientId?: Number): Promise<Array<SplynxInvoice> | SplynxInvoice>;
  getClient(id?: Number): Promise<Array<SplynxClient> | SplynxClient>;
  //setClient(id: Number, clientObj: any): Promise<Array<any> | any>;
  //addPayment(clientId: Number, methodId: string, amount: number, note: string, invoiceIds?: Array<number>, applyToInvoicesAutomatically?: boolean, userId?: number, additionalProps?: any): Promise<Array<any> | any>;
  //getClientBankAccount(id?: Number, clientId?: Number): Promise<Array<any> | any>;
  //addClientBankAccount(clientId: Number, obj: any): Promise<Array<any> | any>;
  //getServicePlans(id?: Number): Promise<Array<any> | any>;
  //getServicePlanSurcharges(serviceId?: Number, id?: Number): Promise<Array<any> | any>;
  //getTickets (id?: Number): Promise<Array<any> | any>;
  //setTicket (ticketData: any, id?: Number): Promise<any>;
  //getJobs (id?: Number): Promise<Array<any> | any>;
  //setJob (jobData: any, id?: Number): Promise<any>;
}

export interface SplynxClient {
  login?: string;
  status?: string;
  partner_id: number;
  location_id: number;
  password?: string;
  name: string;
  email?: string;
  billing_email?: string;
  phone?: string;
  category: string;
  street_1?: string;
  street_2?: string;
  zip_code?: string;
  city?: string;
  date_add?: string;
  gps?: string;
  mrr_total?: number;
  billing_type?: string;
  added_by?: string;
  added_by_id?: number;
  last_online?: string;
  last_update?: string;
  daily_prepaid_cost?: number;
}

export interface SplynxService {
  customer_id: number;
  tariff_id: number;
  status: string;
  description: string;
  quantity: number;
  unit: number;
  unit_price: number;
  start_date: string;
  end_date: string;
  discount: string;
  discount_type: string;
  discount_value: number;
  discount_start_date: string;
  discount_end_date: string;
  discount_text: string;
  router_id: number;
  sector_id: number;
  login: string;
  password: string;
  taking_ipv4: number;
  ipv4: string;
  ipv4_route: string;
  ipv4_pool_id: number;
  ipv6: string;
  ipv6_delegated: string;
  mac: string;
  port_id: number;
  id: number;
  geo: SplynxServiceGeo;
}

export interface SplynxServiceGeo {
  address: string;
  marker: string;
}

export interface SplynxInvoice {
  customer_id: string;
  date_created: string;
  date_updated: string;
  date_till: string;
  date_payment: string;
  status: string;
  number: string;
  payment_id: number;
  payd_from_deposit: number;
  items: Array<SplynxInvoiceItem>;
  id: number;
}
export interface SplynxInvoiceItem {
  description: string;
  quantity: number;
  unit: number;
  price: number;
  tax: number;
  period_from: string;
  period_to: string;
  categoryIdForTransaction: number;
}

export interface SplynxPayment {
  customer_id: string;
  invoice_id: number;
  request_id: number;
  transaction_id: number;
  payment_type: string;
  receipt_number: string;
  date: string;
  amount: string;
  comment: string;
  field_1: string;
  field_2: string;
  field_3: string;
  field_4: string;
  field_5: string;
  id: number;
}

export interface SplynxPaymentMethod {
  name: string;
  is_active: boolean;
  name_1: string;
  name_2: string;
  name_3: string;
  name_4: string;
  name_5: string;
  id: number;
}
