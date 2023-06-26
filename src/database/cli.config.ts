import { DataSource } from 'typeorm';
import * as dotent from 'dotenv';
import { getDataSourceOptions } from './dataSourceOptions';

dotent.config();

const datasource = new DataSource(getDataSourceOptions()); // config is one that is defined in datasource.config.ts file
datasource.initialize();
export default datasource;
