'use strict';

import { Tools } from '@bettercorp/tools/lib/Tools';
import * as crypto from 'crypto';
//import {http_build_query} from 'qhttp';
const http_build_query = require('qhttp/http_build_query');
const request = require('request');
const fs = require('fs');

const API_VERSION_1_0 = '1.0';
const API_VERSION_2_0 = '2.0';

const CONTENT_TYPE_APPLICATION_JSON = 'application/json';
const CONTENT_TYPE_MULTIPART_FORM_DATA = 'multipart/form-data';

const LOGIN_TYPE_API_KEY = 'api_key';
const LOGIN_TYPE_ADMIN = 'admin';
const LOGIN_TYPE_CUSTOMER = 'customer';
const LOGIN_TYPE_SESSION = 'session';

const HEADER_X_TOTAL_COUNT = 'x-total-count';

const ENDPOINT_TOKENS = 'admin/auth/tokens';

export class SplynxApi {
    host: any;
    api_version: any;
    api_key: any;
    api_secret: any;
    access_token: any;
    access_token_expiration: any;
    refresh_token: any;
    refresh_token_expiration: any;
    permissions: any;
    nonce_v: any;
    sash: any;
    administrator: any;
    debug: any;
    on_unauthorized_callback: any;
    on_renew_token_callback: any;

    constructor(host: any, api_key: any, api_secret: any) {
        this.host = host.replace(/\/*$/, "");
        this.api_version = API_VERSION_1_0;
        this.api_key = api_key;
        this.api_secret = api_secret;
        this.access_token = null;
        this.access_token_expiration = null;
        this.refresh_token = null;
        this.refresh_token_expiration = null;
        this.permissions = {};
        this.nonce_v = new Date().getTime();
        this.sash = null;
        this.administrator = {};
        this.debug = false;

        // Events handlers
        this.on_unauthorized_callback = null;
        this.on_renew_token_callback = null;
    }

    static get API_VERSION_1_0() {
        return API_VERSION_1_0;
    }

    static get API_VERSION_2_0() {
        return API_VERSION_2_0;
    }

    static get HEADER_X_TOTAL_COUNT() {
        return HEADER_X_TOTAL_COUNT;
    }

    static get LOGIN_TYPE_ADMIN() {
        return LOGIN_TYPE_ADMIN;
    }

    static get LOGIN_TYPE_CUSTOMER() {
        return LOGIN_TYPE_CUSTOMER;
    }

    static get LOGIN_TYPE_API_KEY() {
        return LOGIN_TYPE_API_KEY;
    }

    static get LOGIN_TYPE_SESSION() {
        return LOGIN_TYPE_SESSION;
    }

    static get CONTENT_TYPE_APPLICATION_JSON() {
        return CONTENT_TYPE_APPLICATION_JSON;
    }

    static get CONTENT_TYPE_MULTIPART_FORM_DATA() {
        return CONTENT_TYPE_MULTIPART_FORM_DATA;
    }

    set version(value) {
        this.api_version = value;
    }

    get version() {
        return this.api_version;
    }

    getAuthData() {
        return {
            access_token: this.access_token,
            access_token_expiration: this.access_token_expiration,
            refresh_token: this.refresh_token,
            refresh_token_expiration: this.refresh_token_expiration,
            permissions: this.permissions,
        };
    }

    setAuthData(auth_data: any) {
        this.access_token = auth_data['access_token'];
        this.access_token_expiration = auth_data['access_token_expiration'];
        this.refresh_token = auth_data['refresh_token'];
        this.refresh_token_expiration = auth_data['refresh_token_expiration'];
        if ('permissions' in auth_data) {
            this.permissions = auth_data['permissions'];
        }
    }

    login(auth_data: any) {
        return new Promise((resolve, reject) => {
            this.validateLoginData(auth_data);

            if (auth_data['auth_type'] === LOGIN_TYPE_API_KEY) {
                this.api_key = auth_data['key'];
                auth_data['signature'] = this.signature(auth_data['secret']);
                auth_data['nonce'] = this.nonce_v++;
                delete auth_data['secret'];
            }

            let options = {
                method: 'POST',
                path: ENDPOINT_TOKENS,
                params: auth_data
            };

            this.makeRequest(options, (res: any) => {
                if (this.debug) {
                    console.log('Login response:', res);
                }

                if (res.statusCode == 201) {
                    this.setAuthData(res.response);
                    resolve(res);
                } else {
                    reject(res);
                }
            });
        });
    }

    logout(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.access_token = null;
            this.access_token_expiration = null;
            this.refresh_token = null;
            this.refresh_token_expiration = null;
            this.permissions = null;

            let options = {
                method: 'DELETE',
                path: ENDPOINT_TOKENS
            };
            this.process(options, (res: any) => {
                if (this.debug) {
                    console.log('Logout response:', res);
                }

                resolve();
            });
        });
    }

    renewToken(): Promise<void> {
        return new Promise((resolve, reject) => {
            let options = {
                method: 'GET',
                path: ENDPOINT_TOKENS + '/' + this.refresh_token
            };
            this.makeRequest(options, (res: any) => {
                if (this.debug) {
                    console.log('Renew response:', res);
                }

                if (typeof this.on_renew_token_callback === 'function') {
                    this.on_renew_token_callback(res);
                }

                this.setAuthData(res.response);
                resolve();
            });
        });
    }

    validateLoginData(auth_data: any) {
        var required = [];
        if (!('auth_type' in auth_data)) {
            throw new Error('auth_type is missed in login data!');
        }

        if (auth_data['auth_type'] === LOGIN_TYPE_API_KEY) {
            required.push('key');
            required.push('secret');
        } else if (auth_data['auth_type'] === LOGIN_TYPE_SESSION) {
            required.push('session_id');
        } else if (auth_data['auth_type'] === LOGIN_TYPE_ADMIN || auth_data['auth_type'] === LOGIN_TYPE_CUSTOMER) {
            required.push('login');
            required.push('password');
        } else {
            throw new Error('auth_type is invalid!');
        }

        for (var i = 0; i < required.length; i++) {
            if (!(required[i] in auth_data)) {
                throw new Error('Required auth param `' + required[i] + '` is missing!');
            }
        }
    }

    /**
     * Generate signature
     * @returns String
     */
    signature(secret?: any) {
        var signature = this.nonce_v + this.api_key;
        if (typeof secret === 'undefined') {
            secret = this.api_secret;
        }

        return crypto
            .createHmac('sha256', Buffer.from(secret, 'utf8'))
            .update(Buffer.from(signature, 'utf8'))
            .digest('hex')
            .toUpperCase();
    }

    getUrl(path: any) {
        return this.host + '/api/' + this.api_version + '/' + path;
    }

    /**
     * Generate auth string
     * @returns String
     */
    getAuthString() {
        let params: any = {};

        if (this.api_version === API_VERSION_2_0) {
            params = {
                access_token: this.access_token
            };
        } else {
            params = {
                key: this.api_key,
                signature: this.signature(),
                nonce: this.nonce_v++
            };

            if (this.sash !== null) {
                params.sash = this.sash;
            }
        }

        return http_build_query(params);
    }

    removeFirstAndLastSlash(str: any) {
        return str.replace(/^[\/]+|[\/]+$/g, '');
    }

    prepareFilesToMultipartFormat(params: any, filesKey: any) {
        let files = params[filesKey];
        delete params[filesKey];

        // Convert files to multipart/form-data format
        files.forEach((file: any, index: any) => {
            params[filesKey + '[' + index + ']'] = fs.createReadStream(file);
        });
    }

    fixSettingsForUploadingFiles(settings: any) {
        settings.path = this.removeFirstAndLastSlash(settings.path);

        if (settings.path === 'admin/support/ticket-messages') {
            // Create ticket message (maybe with attachments)
            settings.contentType = CONTENT_TYPE_MULTIPART_FORM_DATA;
            if (typeof settings.params !== 'undefined' && typeof settings.params.files !== 'undefined') {
                // ... with attachments
                this.prepareFilesToMultipartFormat(settings.params, 'files');
            }

            return;
        }

        let documentsRe = /^admin\/customers\/customer\-documents\/\d+\-\-upload$/;
        if (settings.path.search(documentsRe) != -1) {
            // Uploading customer document
            settings.contentType = CONTENT_TYPE_MULTIPART_FORM_DATA;
            if (typeof settings.params !== 'undefined' && typeof settings.params.file !== 'undefined') {
                settings.params.file = fs.createReadStream(settings.params.file);
            }

            return;
        }

        let attachmentRe = /^admin\/support\/ticket\-attachments\?message_id\=\d+$/;
        if (settings.path.search(attachmentRe) != -1) {
            // Uploading ticket attachments
            settings.contentType = CONTENT_TYPE_MULTIPART_FORM_DATA;
            if (typeof settings.params !== 'undefined' && typeof settings.params.files !== 'undefined') {
                this.prepareFilesToMultipartFormat(settings.params, 'files');
            }

            return;
        }
    }

    /**
     * Send request with some params and return response to callback
     * @param settings Object
     * @param callback Function
     */
    process(settings: any, callback: any) {
        if (this.api_version === API_VERSION_2_0) {
            let timestamp = Math.round(new Date().getTime() / 1000);
            if (timestamp + 5 < this.refresh_token_expiration) {
                if (timestamp + 5 > this.access_token_expiration) {
                    this.renewToken().then(res => {
                        this.makeRequest(settings, callback);
                    });
                    return;
                }
            }
        }

        this.makeRequest(settings, callback);
    }

    makeRequest(settings: any, callback: any) {
        let auth_string = this.getAuthString();

        // Prepare settings for upload files
        this.fixSettingsForUploadingFiles(settings);

        var options: any = {
            method: settings.method,
            uri: this.getUrl(settings.path),
            headers: {
                'Content-type': 'application/json',
                'User-Agent': 'Splynx JavaScript API ' + this.api_version
            }
        };

        let contentType = CONTENT_TYPE_APPLICATION_JSON;
        if (typeof settings.contentType !== 'undefined') {
            contentType = settings.contentType;
        }

        if (auth_string !== '' && auth_string !== null) {
            options.headers['Authorization'] = 'Splynx-EA (' + auth_string + ')';
        }

        if (typeof settings.params !== 'undefined') {
            if (contentType === CONTENT_TYPE_MULTIPART_FORM_DATA) {
                options.formData = {};
                for (let oKey of Object.keys(settings.params)) {
                    if (Tools.isNullOrUndefined(settings.params[oKey])) continue;
                    options.formData[oKey] = settings.params[oKey];
                }
            } else {
                options.body = JSON.stringify(settings.params);
            }
        }

        if (this.debug) {
            console.log('Request options: ', options);
        }
        request(options, (err: any, res: any, body: any) => {
            if (this.debug) {
                if (options.method !== 'DELETE') {
                    console.log('Response error: ', err);
                }
                if (typeof res !== 'undefined' && typeof res.headers !== 'undefined') {
                    console.log('Response headers: ', res.headers);
                }
                console.log('Response body: ', body);
            }

            var returnData: any = {};

            if (options.method === 'DELETE') {
                // Hack for DELETE method.
                // Our API returned status code 204 and node.js cannot be parse HTTP response
                // So Node.js throw HPE_INVALID_CONSTANT error
                // But server successfully processed this request
                returnData = {
                    response: null,
                    statusCode: 204
                };
                callback(returnData, res, null, body);
                return;
            } else {
                if (err !== null) {
                    returnData = {
                        response: [
                            {
                                field: '',
                                message: err.toString()
                            }
                        ],
                        statusCode: err.code
                    };

                    if (this.debug) {
                        console.log('Error:', err);
                    }
                    callback(returnData, res, err, body);
                    return;
                }
            }

            if (typeof res !== 'undefined' && typeof res.headers !== 'undefined') {
                this.processHeaders(res.headers);
            }

            try {
                returnData.response = JSON.parse(body);
            } catch (err) {
                returnData.response = null;
            }

            returnData.statusCode = res.statusCode;

            if (res.statusCode == '401' && typeof this.on_unauthorized_callback === 'function') {
                this.on_unauthorized_callback(returnData, res, err, body);
            }

            callback(returnData, res, err, body);
        });
    }

    processHeaders(headers: any) {
        if (typeof headers['spl-administrator-id'] != 'undefined') {
            this.administrator.id = headers['spl-administrator-id'];
            this.administrator.role = headers['spl-administrator-role'];
            this.administrator.partner = headers['spl-administrator-partner'];
        }
    }
}
