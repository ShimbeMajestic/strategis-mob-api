import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import * as moment from 'moment';
import { Xml } from 'src/shared';
import { TravelCoverRequest } from '../models/travel-cover-request.model';
import { mapfreConfig } from '../../../config/mapfre.config';

@Injectable()
export class MapfreService {
  private readonly logger = new Logger(MapfreService.name);

  constructor(private readonly http: HttpService) {}

  async issuePolicy(order: TravelCoverRequest) {
    const xml = await this.getXml(order);
    const token = await this.getToken();

    const headers = {
      'Content-Type': 'text/xml;charset=UTF-8',
      SOAPAction: 'http://wws.mapfreassistance.com/issuing',
    };

    const requestXml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wws="http://wws.mapfreassistance.com/">
    <soapenv:Header/>
    <soapenv:Body>
        <wws:issuing>
            <wws:token>${token}</wws:token>
            <wws:xml><![CDATA[${xml}]]></wws:xml>
        </wws:issuing>
    </soapenv:Body>
</soapenv:Envelope>`;

    this.logger.log('Issuing Request: ' + requestXml);

    const response = await this.http
      .post('', requestXml, { headers })
      .toPromise();

    const responseXml = response.data;

    this.logger.log('Issuing Response: ' + responseXml);
  }

  protected async getXml(order: TravelCoverRequest) {
    // Refetch order
    order = await TravelCoverRequest.findOne({
      relations: [
        'customer',
        'plan',
        'plan.destination',
        'plan.travelEntity',
        'plan.travelProduct',
      ],
    });

    const strStartDate = moment(order.departureDate).format('DD/MM/YYYY');
    const strEndDate = moment(order.returnDate).format('DD/MM/YYYY');
    const daysDuration = moment(strStartDate).diff(strEndDate, 'days') + 1;
    // Remove MMT prefix, and remain with numeric part only
    const policyNumber = order.id;
    // $usdGrossPrice = $order->amount_usd;
    const usdReinsurancePrice = order.plan.price; // Price needs to be in USD

    const coverType = order.plan.travelEntity.name.toLowerCase();
    const region = order.plan.destination.name.toLowerCase();

    const product = order.plan.travelProduct;

    const insuredLastName = order.customer.lastName;
    const insuredFirstNames = order.customer.firstName;
    const insuredDob = order.customer.dob;
    const insuredAge = moment(insuredDob).diff(moment(), 'years');

    const xml = `<root>
   <policyData>
    <txtSufijo>${product.productName}</txtSufijo>
    <txtFhInicio>${strStartDate}</txtFhInicio>
    <txtFhFin>${strEndDate}</txtFhFin>
    <txtNpoliza>${policyNumber}</txtNpoliza>
    <idRegDivisaProducto/>
    <tipoPagador>1</tipoPagador>
    <txtComentario/>
    <txtCodDealer>${mapfreConfig.dealer}</txtCodDealer>
    <idRegProducto>${product.productId}</idRegProducto>
    <idRegProductoComisionVariable>-1</idRegProductoComisionVariable>
    <idRegRegion>-1</idRegRegion>
    <txtDuracion>${daysDuration}</txtDuracion>
    <contratoReplicadoV2>0</contratoReplicadoV2>
    <idRegFranquicia>-1</idRegFranquicia>
    <txtPrecioBrutoTotal>${usdReinsurancePrice}</txtPrecioBrutoTotal>
    <txtDivisaProducto/>
    <txtCodPromocion>-1</txtCodPromocion>
    <txtFHExpiracion>${strEndDate}</txtFHExpiracion>
    <txtProducto>${product.productName}</txtProducto>
   </policyData>
   <riskData>
    <txtAttribute018>${usdReinsurancePrice}</txtAttribute018>
    <txtAttribute019/>
    <txtAttribute020/>
    <txtPaisOrigen/>
    <txtPaisDestino/>
    <CMBDESTINOSV>${product.destinationCode}</CMBDESTINOSV>
   </riskData>
   <insuredData>
    <txtNmAsegurado>${insuredFirstNames}</txtNmAsegurado>
    <txtApeAsegurado>${insuredLastName}</txtApeAsegurado>
    <txtFhNacimiento>${insuredDob}</txtFhNacimiento>
    <TXTEDADSV>${insuredAge}</TXTEDADSV>
    <txtIdFiscal>${order.passportNo}</txtIdFiscal>
    <txtDirAsegurado/>
    <txtTelefono>${order.customer.phone}</txtTelefono>
    <txtEmail>${order.customer.email}</txtEmail>
   </insuredData>
   <coberData>
    <chk_B0270>1</chk_B0270>
    <chk_B0000>1</chk_B0000>
    <chk_B0010A>1</chk_B0010A>
    <chk_B0030>1</chk_B0030>
    <chk_B0002>0</chk_B0002>
    <chk_J0000>1</chk_J0000>
    <chk_C0000>1</chk_C0000>
    <CoberturaLimites>
     <chk_B0270_107>-1</chk_B0270_107>
        <chk_B0000_98>-1</chk_B0000_98>
        <chk_B0000_97>-1</chk_B0000_97>
        <chk_B0000_95>-1</chk_B0000_95>
        <chk_B0010A_102>-1</chk_B0010A_102>
        <chk_B0010A_96>-1</chk_B0010A_96>
        <chk_B0030_106>-1</chk_B0030_106>
        <chk_B0030_105>-1</chk_B0030_105>
        <chk_B0030_104>-1</chk_B0030_104>
        <chk_B0030_103>-1</chk_B0030_103>
        <chk_J0000_121>-1</chk_J0000_121>
        <chk_C0000_109>-1</chk_C0000_109>
        <chk_C0000_108>-1</chk_C0000_108>
    </CoberturaLimites>
   </coberData>
   <ecasData/>
   <tomadorData>
    <txtNmAsegurado_policyHolder>${insuredFirstNames}</txtNmAsegurado_policyHolder>
    <txtApeAsegurado_policyHolder>${insuredLastName}</txtApeAsegurado_policyHolder>
    <txtFhNacimiento_policyHolder>${insuredDob}</txtFhNacimiento_policyHolder>
    <TXTEDADSV_policyHolder>${insuredAge}</TXTEDADSV_policyHolder>
    <txtIdFiscal_policyHolder>${order.passportNo}</txtIdFiscal_policyHolder>
    <txtTelefono_policyHolder>${order.customer.phone}</txtTelefono_policyHolder>
    <txtEmail_policyHolder>${order.customer.email}</txtEmail_policyHolder>
    <txtDirAsegurado_policyHolder/>
   </tomadorData>
   	<parameters>
		<permitirEnvioPublicidad>-1</permitirEnvioPublicidad>
		<permitirVentaDistancia>-1</permitirVentaDistancia>
		<permitirEstudioMercado>-1</permitirEstudioMercado>
		<adjuntarCondiciones>1</adjuntarCondiciones>
		<infoValidada>1</infoValidada>
		<action>A</action>
		<estadoContrato>1</estadoContrato>
		<posicionTomador>1</posicionTomador>
		<posAsegEliminados/>
		<divisaCobro>0</divisaCobro>
		<noAceptaOfertasCom>0</noAceptaOfertasCom>
		<origenRecepcion>1</origenRecepcion>
	</parameters>
</root>`;

    return xml;
  }

  async getToken(): Promise<string> {
    const requestXml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wws="http://wws.mapfreassistance.com/">
      <soapenv:Header/>
      <soapenv:Body>
         <wws:login>
            <wws:user>${mapfreConfig.username}</wws:user>
            <wws:pass>${mapfreConfig.password}</wws:pass>
            <wws:country>${mapfreConfig.country}</wws:country>
            <wws:remote_addr>${mapfreConfig.remoteAddress}</wws:remote_addr>
         </wws:login>
      </soapenv:Body>
   </soapenv:Envelope>`;

    const headers = {
      'Content-Type': 'text/xml;charset=UTF-8',
      SOAPAction: 'http://wws.mapfreassistance.com/login',
    };

    this.logger.log('Login Request: ' + requestXml);

    const response = await this.http
      .post('', requestXml, { headers })
      .toPromise();

    const responseXml = response.data;

    this.logger.log('Login Response: ' + responseXml);

    const token = Xml.extractXmlNode(responseXml, 'token', false);

    if (!(token?.length > 0)) {
      throw new Error('Could not obtain Mapfre token');
    }

    return token;
  }
}
