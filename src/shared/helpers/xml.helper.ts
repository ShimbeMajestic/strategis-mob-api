import { Injectable } from '@nestjs/common';
import * as xml2js from 'xml2js';

@Injectable()
export class Xml {
  static jsonToXml(jsonObject: any, rootName: string = null): string {
    const options = {
      headless: true,
      renderOpts: { pretty: false, allowEmpty: true },
    };

    // Set explicit root name if provided
    if (rootName) {
      options['explicitRoot'] = false;
      options['rootName'] = rootName;
    }

    const builder = new xml2js.Builder(options);

    const xml = builder.buildObject(jsonObject);

    return xml;
  }

  static async xmlToJson(xml: string): Promise<any> {
    const options = {
      explicitArray: false,
      normalize: false,
      normalizeTags: false,
      trim: true,
    };

    return new Promise((resolve, reject) => {
      xml2js.parseString(xml, options, (err, result) => {
        if (err) {
          reject(err);
        }

        // `result` is a JavaScript object
        // convert it to a JSON string
        // const json = JSON.stringify(result, null, 4);

        // // log JSON string
        // this.logger.verbose(typeof json);

        return resolve(result);
      });
    });
  }

  static extractXmlNode(
    xmlString: string,
    nodeName: string,
    includeTags = true,
  ): string {
    const strartString = '&lt;' + nodeName + '&gt;';
    const endString = '&lt;/' + nodeName + '&gt;';

    const startindex = xmlString.indexOf(strartString);
    const endindex = xmlString.indexOf(endString, startindex);

    if (startindex != -1 && endindex != -1 && endindex > startindex) {
      if (includeTags) {
        return xmlString.substring(startindex, endindex + endString.length);
      }

      return xmlString.substring(startindex + strartString.length, endindex);
    }
  }

  /**
   * Pretty print XML string
   */
  static prettify(xml: string, indentSize = 2) {
    const PADDING = ' '.repeat(indentSize); // set desired indent size here
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;

    xml = xml.replace(reg, '$1\n$2$3');

    return xml
      .split('\n')
      .map((node, index) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/) && pad > 0) {
          pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        pad += indent;

        return PADDING.repeat(pad - indent) + node;
      })
      .join('\n');
  }
}
