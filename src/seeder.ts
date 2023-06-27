import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CountriesSeeder } from './modules/lists/countries-seeder.provider';

async function runSeeder() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seeder = app.get(CountriesSeeder);
    await seeder.seed();
    await app.close();
}

runSeeder();
