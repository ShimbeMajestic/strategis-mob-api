export const mapfreConfig = {
  wsdlUrl:
    process.env.MAPFRE_WSDL ||
    'https://www.mapfrewarranty.com/wsWarranty4.asmx?wsdl',

  username: process.env.MAPFRE_USERNAME,

  password: process.env.MAPFRE_PASSWORD,

  country: process.env.MAPFRE_COUNTRY,

  remoteAddress: process.env.MAPFRE_REMOTE_ADDR || '127.0.0.1',

  dealer: process.env.MAPFRE_DEALER || 'STRAT01',
};
