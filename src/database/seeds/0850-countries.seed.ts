import { Seeder } from 'typeorm-seeding';
import { Country } from 'src/modules/lists/models/country.model';
import { Region } from 'src/modules/lists/models/region.model';

export default class CountriesSeed implements Seeder {
    public async run(): Promise<void> {

        const countries = [
            {
                "countryName": "Tanzania, United Republic of",
                "countryShortCode": "TZ",
                "regions": [
                    {
                        "name": "Arusha",
                        "shortCode": "01"
                    },
                    {
                        "name": "Coast",
                        "shortCode": "19"
                    },
                    {
                        "name": "Dar es Salaam",
                        "shortCode": "02"
                    },
                    {
                        "name": "Dodoma",
                        "shortCode": "03"
                    },
                    {
                        "name": "Iringa",
                        "shortCode": "04"
                    },
                    {
                        "name": "Kagera",
                        "shortCode": "05"
                    },
                    {
                        "name": "Kigoma",
                        "shortCode": "08"
                    },
                    {
                        "name": "Kilimanjaro",
                        "shortCode": "09"
                    },
                    {
                        "name": "Lindi",
                        "shortCode": "12"
                    },
                    {
                        "name": "Manyara",
                        "shortCode": "26"
                    },
                    {
                        "name": "Mara",
                        "shortCode": "13"
                    },
                    {
                        "name": "Mbeya",
                        "shortCode": "14"
                    },
                    {
                        "name": "Morogoro",
                        "shortCode": "16"
                    },
                    {
                        "name": "Mtwara",
                        "shortCode": "17"
                    },
                    {
                        "name": "Mwanza",
                        "shortCode": "18"
                    },
                    {
                        "name": "Pemba North",
                        "shortCode": "06"
                    },
                    {
                        "name": "Pemba South",
                        "shortCode": "10"
                    },
                    {
                        "name": "Rukwa",
                        "shortCode": "20"
                    },
                    {
                        "name": "Ruvuma",
                        "shortCode": "21"
                    },
                    {
                        "name": "Shinyanga",
                        "shortCode": "22"
                    },
                    {
                        "name": "Singida",
                        "shortCode": "23"
                    },
                    {
                        "name": "Tabora",
                        "shortCode": "24"
                    },
                    {
                        "name": "Tanga",
                        "shortCode": "25"
                    },
                    {
                        "name": "Zanzibar North",
                        "shortCode": "07"
                    },
                    {
                        "name": "Zanzibar Central/South",
                        "shortCode": "11"
                    },
                    {
                        "name": "Zanzibar Urban/West",
                        "shortCode": "15"
                    }
                ]
            },
        ];


        for (const country of countries) {
            const countryRow = Country.create({
                name: country.countryName,
                code: country.countryShortCode,
            });

            await countryRow.save();

            for (const region of country.regions) {
                const regionRow = Region.create({
                    name: region.name,
                    code: region.shortCode,
                    countryId: countryRow.id,
                });

                await regionRow.save();
            }
        }

    }
}
