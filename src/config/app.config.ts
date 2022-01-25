import * as path from 'path';

require('dotenv').config();

export const appConfig = {
  baseUrl: process.env.APP_URL || 'http://localhost:3000',

  frontendUrl: process.env.FRONTEND_URL || 'https://chapchap.codeblock.co.tz',

  port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 3000,

  secret: process.env.SECRET,

  rootDir: path.join(__dirname, '../../'),

  appCallbackUrl: process.env.APP_CALLBACK_URL,

  tiraApiUrl: process.env.TIRA_BRIDGE_API_URL + '/motor/policy/create',
};
export const adminContacts = process.env.ADMIN_CONTACTS.split(',');
