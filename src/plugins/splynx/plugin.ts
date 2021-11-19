import { CPlugin, CPluginClient } from '@bettercorp/service-base/lib/ILib';
import { Tools } from '@bettercorp/tools/lib/Tools';
import { Splynx } from './lib/splynx';
import { SplynxEvents } from '../../events';
import { IServerConfig, ISplynxData, ISplynxPluginConfig } from '../../weblib';
import { fastify } from '@bettercorp/service-base-plugin-web-server/lib/plugins/fastify/fastify';

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
  //async getInvoicePDFUrl(clientKey: string, clientId: string, invoiceId: string): Promise<string> {
  //  const self = this;
  //  return new Promise<string>((resolve, reject) => {
  //    self.emitEventAndReturn<any, any>(IUCRMEvents.getInvoicePdf, {
  //      data: {
  //        clientKey,
  //        clientId,
  //        invoiceId
  //      }
  //    }).then(x => resolve(x.url)).catch(reject);
  //  });
  //}
  //async getServicesByType(servicePlanIds: Array<string>, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.getServicesByType, {
  //    server,
  //    data: {
  //      ids: servicePlanIds
  //    }
  //  });
  //}
  //async validateServiceForClient(id: number, clientId: number, server: IServerConfig, active?: boolean, status?: IUCRMServiceStatus, servicePlanIds?: Array<number> | number) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.validateServiceForClient, {
  //    server,
  //    data: {
  //      id,
  //      crmId: clientId,
  //      active,
  //      status,
  //      servicePlanIds
  //    }
  //  });
  //}
  //async getServicePlanSurcharges(id: number, serviceId: number, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.getServicePlanSurcharges, {
  //    server,
  //    data: {
  //      id,
  //      serviceId
  //    }
  //  });
  //}
  async getServices(server: IServerConfig, clientId?: number/*, serviceId?: number*/) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getServices, {
      server,
      data: {
        clientId,
        //serviceId
      }
    });
  }
  async getPaymentMethods(server: IServerConfig) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getPaymentMethods, {
      server,
      data: null
    });
  }
  //async getServicePlans(id: number, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.getServicePlans, {
  //    server,
  //    data: id
  //  });
  //}
  //async sendInvoice(id: number, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.sendInvoice, {
  //    server,
  //    data: id
  //  });
  //}
  //async getServiceSurcharges(serviceId: number, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.getServiceSurcharges, {
  //    server,
  //    data: serviceId
  //  });
  //}
  async getPayments(server: IServerConfig, clientId: number, id?: number) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getPayments, {
      server,
      data: {
        clientId,
        id
      }
    });
  }
  //async addClientBankAccount(clientId: number, bankData: any, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.addClientBankAccount, {
  //    server,
  //    data: {
  //      clientId,
  //      data: bankData
  //    }
  //  });
  //}
  //async getClientBankAccount(clientId: number, id: number, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.getClientBankAccount, {
  //    server,
  //    data: {
  //      clientId,
  //      id
  //    }
  //  });
  //}
  //async addNewServiceForClient(clientId: number, service: any, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.addNewServiceForClient, {
  //    server,
  //    data: {
  //      clientId,
  //      service
  //    }
  //  });
  //}
  //async setClient(id: number, data: any, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.setClient, {
  //    server,
  //    data: {
  //      id,
  //      data
  //    }
  //  });
  //}
  //async getServicesByAttribute(attrKey: string, attrVal: any, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.getServicesByAttribute, {
  //    server,
  //    data: {
  //      attrKey,
  //      attrVal
  //    }
  //  });
  //}
  async getClientById(server: IServerConfig, id: number) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getClient, {
      server,
      data: {
        id
      }
    });
  }
  //async getClientByAttr(emailOrPhoneNumber: string, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.getClient, {
  //    server,
  //    data: {
  //      emailOrPhoneNumber
  //    }
  //  });
  //}
  //async addNewClient(clientData: any, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.addNewClient, {
  //    server,
  //    data: clientData
  //  });
  //}
  async getInvoices(server: IServerConfig, clientId: Number, invoiceId?: Number) {
    return this.emitEventAndReturn<ISplynxData, any>(SplynxEvents.getInvoices, {
      server,
      data: {
        clientId,
        invoiceId
      }
    });
  }
  //async addNewInvoice(clientId: number, items: Array<any>, attributes: Array<any>, maturityDays: number, invoiceTemplateId: number, applyCredit: boolean, proforma: boolean, adminNotes: string, notes: string, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.addNewInvoice, {
  //    server,
  //    data: {
  //      items,
  //      attributes,
  //      maturityDays,
  //      invoiceTemplateId,
  //      clientId,
  //      applyCredit,
  //      proforma,
  //      adminNotes,
  //      notes
  //    }
  //  });
  //}
  //async addPayment(clientId: number, methodId: string, amount: number, note: string, invoiceIds: Array<number>, applyToInvoicesAutomatically: boolean, userId: number, additionalProps: any, server: IServerConfig) {
  //  return this.emitEventAndReturn<IUNMSUCRMData, any>(IUCRMEvents.addPayment, {
  //    server,
  //    data: {
  //      clientId,
  //      methodId,
  //      amount,
  //      note,
  //      invoiceIds,
  //      applyToInvoicesAutomatically,
  //      userId,
  //      additionalProps
  //    }
  //  });
  //}
}

export class Plugin extends CPlugin<ISplynxPluginConfig> {
  private fastify!: fastify;
  private initNewSplynx(server: IServerConfig) {
    return new Splynx(server);
  }
  private validateData(data: ISplynxData): boolean {
    if (Tools.isNullOrUndefined(data)) return false;
    if (Tools.isNullOrUndefined(data.server)) return false;
    if (Tools.isNullOrUndefined(data.server.hostname)) return false;
    if (Tools.isNullOrUndefined(data.server.username)) return false;
    if (Tools.isNullOrUndefined(data.server.password)) return false;

    return true;
  }
  init(): Promise<void> {
    const self = this;
    return new Promise(async (resolve) => {
      self.fastify = new fastify(self);
      if ((await self.getPluginConfig()).webhooks === true) {
        self.fastify.post('/initrd/events/:id', async (req: any, reply): Promise<void> => {
          try {
            let postBody = req.body;
            self.log.info(`[CRM] ${ postBody.entity } changed for ${ postBody.extraData.entity.clientId } (${ postBody.eventName }-${ postBody.entityId })`);

            let cleanedID = `${ req.params.id }`.replace(/(?![-])[\W]/g, '').trim().substr(0, 255);
            let knownServer = await self.emitEventAndReturn<String, Boolean>(null, SplynxEvents.eventsGetServer + cleanedID, cleanedID);
            if (!knownServer) {
              reply.status(404).send();
              return;
            }

            self.emitEvent(null, SplynxEvents.eventsServer + cleanedID, postBody);
            reply.status(202).send();
          } catch (exc) {
            self.log.error(exc);
            reply.status(500).send();
          }
        });
      }

      /*if ((await self.getPluginConfig()).events === true) {
        features.initForPlugins('plugin-express', 'use', {
          arg1: async (req: any, res: any, next: Function) => {
            if (req.path.indexOf('/api/') !== 0) return next();
            features.log.debug(`REQ[${ req.method }] ${ req.path } (${ JSON.stringify(req.query) })`);
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', ['OPTIONS', 'POST', 'GET'].join(','));
            res.setHeader('Access-Control-Allow-Headers', ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'authorization', 'session'].join(','));

            if (req.method.toUpperCase() === 'OPTIONS')
              return res.sendStatus(200);

            next();
          }
        });*/
      // await features.initForPlugins<IWebServerInitPlugin, void>('plugin-express', 'get', {
      //   arg1: '/api/IVPDF/:hash',
      //   arg2: async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
      //     try {
      //       features.log.info(`[CRM] get INV PDF`);
      //       let base64Hash = decodeURIComponent(`${ req.params.hash }`).substr(0, 1024);
      //       let hash = Buffer.from(base64Hash, 'base64').toString('utf-8');
      //       let now = new Date();
      //       let checksum = decodeURIComponent(`${ req.query.checksum }`).substr(0, 1024);
      //       let secureKey = features.getPluginConfig<IUCRMPluginConfig>().clientKey + `-${ checksum }-${ now.getFullYear() }-${ now.getMonth() }-${ now.getDay() }-invoice-pdf`;

      //       let data = JSON.parse(Tools.decrypt(hash, secureKey));
      //       let randoHashChecksum = cryptoJS.SHA256(data.buffer).toString();
      //       if (randoHashChecksum !== checksum) throw 'Invalid checksum';

      //       features.log.info(`[CRM] ${ data.clientId } get ${ data.invoiceId } INV PDF`);
      //       new UCRM(data.server).getInvoicePdf(data.invoiceId, data.clientId).then((stream: any) => {
      //         stream.pipe(res);
      //       }).catch(x => {
      //         features.log.error(x);
      //         res.sendStatus(500);
      //       });
      //     } catch (exc) {
      //       features.log.error(exc);
      //       res.sendStatus(500);
      //     }
      //   }
      // });

      // if (features.getPluginConfig<IUCRMPluginConfig>().crmAPI === true) {
      //   features.onReturnableEvent(null, SplynxEvents.getInvoicePdf, (resolve: Function, reject: Function, data: ISplynxData) => {
      //     if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //       return reject('Undefined variables passed in!');
      //     }
      //     let random = crypto.randomBytes(Math.floor((Math.random() * 100) + 1)).toString('hex');
      //     let randoHashChecksum = cryptoJS.SHA256(random).toString();
      //     let now = new Date();
      //     let secureKey = features.getPluginConfig<IUCRMPluginConfig>().clientKey + `-${ randoHashChecksum }-${ now.getFullYear() }-${ now.getMonth() }-${ now.getDay() }-invoice-pdf`;
      //     let hash = Tools.encrypt(JSON.stringify({
      //       server: data.server,
      //       clientId: data.data.clientId,
      //       invoiceId: data.data.invoiceId,
      //       buffer: random,
      //     }), secureKey);
      //     let base64Hash = Buffer.from(hash, 'utf-8').toString('base64');
      //     resolve({
      //       url: features.getPluginConfig<IUCRMPluginConfig>().myHost + `/api/IVPDF/${ encodeURIComponent(base64Hash) }?checksum=${ encodeURIComponent(randoHashChecksum) }`
      //     });
      //   });
      // }

      //features.onReturnableEvent(null, SplynxEvents.addNewServiceForClient, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //
      //  new UCRM(data.server).addNewServiceForClient(data.data.service,
      //    data.data.clientId).then(x => {
      //      resolve(x);
      //    }).catch(x => {
      //      reject(x);
      //    });
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.addNewClient, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).addNewClient(data.data).then(x => {
      //    resolve(x);
      //  }).catch(x => {
      //    reject(x);
      //  });
      //});
      //
      self.onReturnableEvent(null, SplynxEvents.getPayments, (resolve: Function, reject: Function, data: ISplynxData) => {
        if (!self.validateData(data)) {
          return reject('Undefined variables passed in!');
        }
        self.initNewSplynx(data.server).getPayments(data.data.id, data.data.clientId).then(x => {
          resolve(x);
        }).catch(x => {
          reject(x);
        });
      });

      self.onReturnableEvent(null, SplynxEvents.getPaymentMethods, (resolve: Function, reject: Function, data: ISplynxData) => {
        if (!self.validateData(data)) {
          return reject('Undefined variables passed in!');
        }
        self.initNewSplynx(data.server).getPaymentMethods().then(x => {
          resolve(x);
        }).catch(x => {
          reject(x);
        });
      });
      //
      self.onReturnableEvent(null, SplynxEvents.getServices, (resolve: Function, reject: Function, data: ISplynxData) => {
        if (!self.validateData(data)) {
          return reject('Undefined variables passed in!');
        }
        self.initNewSplynx(data.server).getServices(data.data.clientId).then(x => {
          resolve(x);
        }).catch(x => {
          reject(x);
        });
      });
      //
      //features.onReturnableEvent(null, SplynxEvents.getServicesByAttribute, async (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  try {
      //    let server = new UCRM(data.server);
      //    let services = await server.getServices(undefined, undefined, undefined); // TODO: Specific active services ... no need to waste time lookup up non-active services
      //    for (let service of services) {
      //      if (Tools.isNullOrUndefined(service.attributes)) continue;
      //      for (let attr of service.attributes) {
      //        if (attr.key === data.data.attrKey && attr.value === data.data.attrVal)
      //          return resolve(service);
      //      }
      //    }
      //    return resolve(null);
      //  } catch (exc) {
      //    reject(exc);
      //  }
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.getServiceSurcharges, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).getServiceSurcharges(data.data.serviceId).then(x => {
      //    resolve(x);
      //  }).catch(x => {
      //    reject(x);
      //  });
      //});
      //
      self.onReturnableEvent(null, SplynxEvents.getInvoices, (resolve: Function, reject: Function, data: ISplynxData) => {
        if (!self.validateData(data)) {
          return reject('Undefined variables passed in!');
        }
        console.log('GET INVOICES FOR: ' + data.data.clientId)
        self.initNewSplynx(data.server).getInvoices(data.data.invoiceId, data.data.clientId).then(x => {
          resolve(x);
        }).catch(x => {
          reject(x);
        });
      });
      //
      self.onReturnableEvent(null, SplynxEvents.getClient, (resolve: Function, reject: Function, data: ISplynxData) => {
        if (!self.validateData(data)) {
          return reject('Undefined variables passed in!');
        }
        self.initNewSplynx(data.server).getClient(data.data.id).then(x => {
          resolve(x);
        }).catch(x => {
          reject(x);
        });
      });
      //
      //features.onReturnableEvent(null, SplynxEvents.setClient, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).setClient(data.data.id, data.data.data).then(x => {
      //    resolve(x);
      //  }).catch(x => {
      //    reject(x);
      //  });
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.addPayment, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).addPayment(data.data.clientId, data.data.methodId
      //    , data.data.amount, data.data.note, data.data.invoiceIds,
      //    data.data.applyToInvoicesAutomatically, data.data.userId, data.data.additionalProps).then(x => {
      //      resolve(x);
      //    }).catch(x => {
      //      reject(x);
      //    });
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.getClientBankAccount, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).getClientBankAccount(data.data.id, data.data.clientId).then(x => {
      //    resolve(x);
      //  }).catch(x => {
      //    reject(x);
      //  });
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.addClientBankAccount, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).addClientBankAccount(data.data.clientId, data.data.data).then(x => {
      //    resolve(x);
      //  }).catch(x => {
      //    reject(x);
      //  });
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.addNewInvoice, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).addNewInvoice(data.data.items, data.data.attributes,
      //    data.data.maturityDays, data.data.invoiceTemplateId, data.data.clientId,
      //    data.data.applyCredit, data.data.proforma, data.data.adminNotes, data.data.notes
      //  ).then(x => {
      //    resolve(x);
      //  }).catch(x => {
      //    reject(x);
      //  });
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.sendInvoice, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).sendInvoice(data.data.id).then(x => {
      //    resolve(x);
      //  }).catch(x => {
      //    reject(x);
      //  });
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.getServicePlans, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).getServicePlans(data.data.id).then(x => {
      //    resolve(x);
      //  }).catch(x => {
      //    reject(x);
      //  });
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.getServicePlanSurcharges, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).getServicePlanSurcharges(data.data.serviceId, data.data.id).then(x => {
      //    resolve(x);
      //  }).catch(x => {
      //    reject(x);
      //  });
      //});
      //
      //
      //features.onReturnableEvent(null, SplynxEvents.validateServiceForClient, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).getServices(data.data.id, data.data.crmId).then((x: any) => {
      //    if (Tools.isNullOrUndefined(x))
      //      return resolve(false);
      //    if (!Tools.isNullOrUndefined(data.data.active))
      //      if (x.status !== 1)
      //        return resolve(false);
      //    if (!Tools.isNullOrUndefined(data.data.status))
      //      if (data.data.status !== x.status)
      //        return resolve(false);
      //    if (!Tools.isNullOrUndefined(data.data.typeId))
      //      if (data.data.typeId !== x.servicePlanId)
      //        return resolve(false);
      //    if (Tools.isArray(data.data.typesId)) {
      //      let okay = false;
      //      for (const typeId of data.data.typesId) {
      //        if (typeId === x.servicePlanId) {
      //          okay = true;
      //          break;
      //        }
      //      }
      //      if (!okay)
      //        return resolve(false);
      //    }
      //    resolve(true);
      //  }).catch((x) => {
      //    reject(x);
      //  });
      //});
      //
      //features.onReturnableEvent(null, SplynxEvents.getServicesByType, (resolve: Function, reject: Function, data: ISplynxData) => {
      //  if (Tools.isNullOrUndefined(data) || Tools.isNullOrUndefined(data.server) || Tools.isNullOrUndefined(data.server.hostname) || Tools.isNullOrUndefined(data.server.key)) {
      //    return reject('Undefined variables passed in!');
      //  }
      //  new UCRM(data.server).getServices().then(x => {
      //    let outlist = [];
      //    for (let ix of x) {
      //      if (data.data.ids.indexOf(ix.servicePlanId) >= 0)
      //        outlist.push(ix);
      //    }
      //    resolve(outlist);
      //  }).catch((x) => {
      //    reject(x);
      //  });
      //});

      self.log.info("Splynx Ready");
      resolve();
    });
  }
};