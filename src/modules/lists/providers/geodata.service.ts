import { Injectable, OnModuleInit } from '@nestjs/common';
import { Region } from '../models/region.model';
import { Country } from '../models/country.model';
import { District } from '../models/district.model';

const geodatas = [
    {
        countryName: 'Tanzania, United Republic of',
        countryShortCode: 'TZ',
        data: [
            { Region: 'Arusha ', District: 'Meru ' },
            { Region: 'Arusha ', District: 'Arusha City' },
            { Region: 'Arusha ', District: 'Arusha ' },
            { Region: 'Arusha ', District: 'Karatu ' },
            { Region: 'Arusha ', District: 'Longido ' },
            { Region: 'Arusha ', District: 'Monduli ' },
            { Region: 'Arusha ', District: 'Ngorongoro ' },
            { Region: 'Dar es Salaam ', District: 'Ilala Municipal' },
            { Region: 'Dar es Salaam ', District: 'Kinondoni Municipal' },
            { Region: 'Dar es Salaam ', District: 'Temeke Municipal' },
            { Region: 'Dar es Salaam ', District: 'Kigamboni Municipal' },
            { Region: 'Dar es Salaam ', District: 'Ubungo Municipal' },
            { Region: 'Dodoma ', District: 'Bahi ' },
            { Region: 'Dodoma ', District: 'Chamwino ' },
            { Region: 'Dodoma ', District: 'Chemba ' },
            { Region: 'Dodoma ', District: 'Dodoma Municipal' },
            { Region: 'Dodoma ', District: 'Kondoa ' },
            { Region: 'Dodoma ', District: 'Kongwa ' },
            { Region: 'Dodoma ', District: 'Mpwapwa ' },
            { Region: 'Geita ', District: 'Bukombe ' },
            { Region: 'Geita ', District: 'Chato ' },
            { Region: 'Geita ', District: 'Geita Town' },
            { Region: 'Geita ', District: 'Mbogwe ' },
            { Region: 'Geita ', District: "Nyang'hwale " },
            { Region: 'Iringa ', District: 'Iringa ' },
            { Region: 'Iringa ', District: 'Iringa Municipal' },
            { Region: 'Iringa ', District: 'Kilolo ' },
            { Region: 'Iringa ', District: 'Mafinga Town' },
            { Region: 'Iringa ', District: 'Mufindi ' },
            { Region: 'Kagera ', District: 'Biharamulo ' },
            { Region: 'Kagera ', District: 'Bukoba ' },
            { Region: 'Kagera ', District: 'Bukoba Municipal' },
            { Region: 'Kagera ', District: 'Karagwe ' },
            { Region: 'Kagera ', District: 'Kyerwa ' },
            { Region: 'Kagera ', District: 'Missenyi ' },
            { Region: 'Kagera ', District: 'Muleba ' },
            { Region: 'Kagera ', District: 'Ngara ' },
            { Region: 'Katavi ', District: 'Mlele ' },
            { Region: 'Katavi ', District: 'Mpanda ' },
            { Region: 'Katavi ', District: 'Mpanda Town' },
            { Region: 'Kigoma ', District: 'Buhigwe ' },
            { Region: 'Kigoma ', District: 'Kakonko ' },
            { Region: 'Kigoma ', District: 'Kasulu ' },
            { Region: 'Kigoma ', District: 'Kasulu Town' },
            { Region: 'Kigoma ', District: 'Kibondo ' },
            { Region: 'Kigoma ', District: 'Kigoma ' },
            { Region: 'Kigoma ', District: 'Kigoma-Ujiji Municipal' },
            { Region: 'Kigoma ', District: 'Uvinza ' },
            { Region: 'Kilimanjaro ', District: 'Hai ' },
            { Region: 'Kilimanjaro ', District: 'Moshi ' },
            { Region: 'Kilimanjaro ', District: 'Moshi Municipal' },
            { Region: 'Kilimanjaro ', District: 'Mwanga ' },
            { Region: 'Kilimanjaro ', District: 'Rombo ' },
            { Region: 'Kilimanjaro ', District: 'Same ' },
            { Region: 'Kilimanjaro ', District: 'Siha ' },
            { Region: 'Pemba Kusini ', District: 'Chake Chake ' },
            { Region: 'Pemba Kusini ', District: 'Mkoani ' },
            { Region: 'Unguja Kusini ', District: 'Kati ' },
            { Region: 'Unguja Kusini ', District: 'Kusini ' },
            { Region: 'Lindi ', District: 'Kilwa ' },
            { Region: 'Lindi ', District: 'Lindi ' },
            { Region: 'Lindi ', District: 'Lindi Municipal' },
            { Region: 'Lindi ', District: 'Liwale ' },
            { Region: 'Lindi ', District: 'Nachingwea ' },
            { Region: 'Lindi ', District: 'Ruangwa ' },
            { Region: 'Manyara ', District: 'Babati Town' },
            { Region: 'Manyara ', District: 'Babati ' },
            { Region: 'Manyara ', District: 'Hanang ' },
            { Region: 'Manyara ', District: 'Kiteto ' },
            { Region: 'Manyara ', District: 'Mbulu ' },
            { Region: 'Manyara ', District: 'Simanjiro ' },
            { Region: 'Mara ', District: 'Bunda ' },
            { Region: 'Mara ', District: 'Butiama ' },
            { Region: 'Mara ', District: 'Musoma ' },
            { Region: 'Mara ', District: 'Musoma Municipal' },
            { Region: 'Mara ', District: 'Rorya ' },
            { Region: 'Mara ', District: 'Serengeti ' },
            { Region: 'Mara ', District: 'Tarime ' },
            { Region: 'Mbeya ', District: 'Busokelo ' },
            { Region: 'Mbeya ', District: 'Chunya ' },
            { Region: 'Mbeya ', District: 'Kyela ' },
            { Region: 'Mbeya ', District: 'Mbarali City' },
            { Region: 'Mbeya ', District: 'Mbeya ' },
            { Region: 'Mbeya ', District: 'Mbeya ' },
            { Region: 'Mbeya ', District: 'Rungwe' },
            { Region: 'Unguja Mjini Magharibi ', District: 'Magharibi ' },
            { Region: 'Unguja Mjini Magharibi ', District: 'Mjini ' },
            { Region: 'Morogoro ', District: 'Gairo ' },
            { Region: 'Morogoro ', District: 'Kilombero ' },
            { Region: 'Morogoro ', District: 'Kilosa ' },
            { Region: 'Morogoro ', District: 'Morogoro ' },
            { Region: 'Morogoro ', District: 'Morogoro Municipal' },
            { Region: 'Morogoro ', District: 'Mvomero ' },
            { Region: 'Morogoro ', District: 'Ulanga ' },
            { Region: 'Morogoro ', District: 'Malinyi ' },
            { Region: 'Morogoro ', District: 'Ifakara Township' },
            { Region: 'Mtwara ', District: 'Masasi ' },
            { Region: 'Mtwara ', District: 'Masasi Town' },
            { Region: 'Mtwara ', District: 'Mtwara ' },
            { Region: 'Mtwara ', District: 'Mtwara Municipal' },
            { Region: 'Mtwara ', District: 'Nanyumbu ' },
            { Region: 'Mtwara ', District: 'Newala ' },
            { Region: 'Mtwara ', District: 'Tandahimba ' },
            { Region: 'Mwanza ', District: 'Ilemela Municipal' },
            { Region: 'Mwanza ', District: 'Kwimba ' },
            { Region: 'Mwanza ', District: 'Magu ' },
            { Region: 'Mwanza ', District: 'Misungwi ' },
            { Region: 'Mwanza ', District: 'Nyamagana Municipal' },
            { Region: 'Mwanza ', District: 'Sengerema ' },
            { Region: 'Mwanza ', District: 'Ukerewe ' },
            { Region: 'Njombe ', District: 'Ludewa ' },
            { Region: 'Njombe ', District: 'Makambako Town' },
            { Region: 'Njombe ', District: 'Makete ' },
            { Region: 'Njombe ', District: 'Njombe ' },
            { Region: 'Njombe ', District: 'Njombe Town' },
            { Region: 'Njombe ', District: "Wanging'ombe " },
            { Region: 'Pwani ', District: 'Bagamoyo ' },
            { Region: 'Pwani ', District: 'Kibaha ' },
            { Region: 'Pwani ', District: 'Kibaha Town' },
            { Region: 'Pwani ', District: 'Kisarawe ' },
            { Region: 'Pwani ', District: 'Mafia ' },
            { Region: 'Pwani ', District: 'Mkuranga ' },
            { Region: 'Pwani ', District: 'Rufiji ' },
            { Region: 'Rukwa ', District: 'Kalambo ' },
            { Region: 'Rukwa ', District: 'Nkasi ' },
            { Region: 'Rukwa ', District: 'Sumbawanga ' },
            { Region: 'Rukwa ', District: 'Sumbawanga Municipal' },
            { Region: 'Ruvuma ', District: 'Mbinga ' },
            { Region: 'Ruvuma ', District: 'Songea ' },
            { Region: 'Ruvuma ', District: 'Songea Municipal' },
            { Region: 'Ruvuma ', District: 'Tunduru ' },
            { Region: 'Ruvuma ', District: 'Namtumbo ' },
            { Region: 'Ruvuma ', District: 'Nyasa ' },
            { Region: 'Shinyanga ', District: 'Kahama Town' },
            { Region: 'Shinyanga ', District: 'Kahama ' },
            { Region: 'Shinyanga ', District: 'Kishapu ' },
            { Region: 'Shinyanga ', District: 'Shinyanga ' },
            { Region: 'Shinyanga ', District: 'Shinyanga Municipal' },
            { Region: 'Simiyu ', District: 'Bariadi ' },
            { Region: 'Simiyu ', District: 'Busega ' },
            { Region: 'Simiyu ', District: 'Itilima ' },
            { Region: 'Simiyu ', District: 'Maswa ' },
            { Region: 'Simiyu ', District: 'Meatu ' },
            { Region: 'Singida ', District: 'Ikungi ' },
            { Region: 'Singida ', District: 'Iramba ' },
            { Region: 'Singida ', District: 'Manyoni ' },
            { Region: 'Singida ', District: 'Mkalama ' },
            { Region: 'Singida ', District: 'Singida ' },
            { Region: 'Singida ', District: 'Singida Municipal' },
            { Region: 'Songwe ', District: 'Ileje ' },
            { Region: 'Songwe ', District: 'Mbozi ' },
            { Region: 'Songwe ', District: 'Momba ' },
            { Region: 'Songwe ', District: 'Songwe ' },
            { Region: 'Tabora ', District: 'Igunga ' },
            { Region: 'Tabora ', District: 'Kaliua ' },
            { Region: 'Tabora ', District: 'Nzega ' },
            { Region: 'Tabora ', District: 'Sikonge ' },
            { Region: 'Tabora ', District: 'Tabora Municipal' },
            { Region: 'Tabora ', District: 'Urambo ' },
            { Region: 'Tabora ', District: 'Uyui ' },
            { Region: 'Tanga ', District: 'Handeni ' },
            { Region: 'Tanga ', District: 'Handeni Town' },
            { Region: 'Tanga ', District: 'Kilindi ' },
            { Region: 'Tanga ', District: 'Korogwe Town' },
            { Region: 'Tanga ', District: 'Korogwe ' },
            { Region: 'Tanga ', District: 'Lushoto ' },
            { Region: 'Tanga ', District: 'Muheza ' },
            { Region: 'Tanga ', District: 'Mkinga ' },
            { Region: 'Tanga ', District: 'Pangani ' },
            { Region: 'Tanga ', District: 'Tanga City' },
            { Region: 'Unguja Kaskazini ', District: 'Kaskazini A ' },
            { Region: 'Unguja Kaskazini ', District: 'Kaskazini B ' },
            { Region: 'Pemba Kusini ', District: 'Micheweni ' },
            { Region: 'Pemba Kusini ', District: 'Wete ' },
            {
                Region: 'Unguja Mjini Magharibi ',
                District: 'Unguja Magharibi ',
            },
            { Region: 'Unguja Mjini Magharibi ', District: 'Unguja Mjini ' },
        ],
    },
];

@Injectable()
export class GeoDataService implements OnModuleInit {
    async onModuleInit() {
        await this.populateData();
    }

    async populateData() {
        // populate the country
        for (const country of geodatas) {
            let theCountry: number;
            const existingCountry = await Country.findOne({
                where: {
                    name: country.countryName,
                },
            });

            if (!existingCountry) {
                const newCountry = new Country();

                newCountry.name = country.countryName;
                newCountry.code = country.countryShortCode;

                await newCountry.save();

                theCountry = newCountry.id;
            } else {
                theCountry = existingCountry.id;
            }

            // populate the regions & districts
            for (const region of country.data) {
                const existingRegion = await Region.findOne({
                    where: {
                        name: region.Region,
                        countryId: theCountry,
                    },
                });

                let regionId: number;

                if (!existingRegion) {
                    const newRegion = new Region();
                    newRegion.name = region.Region;
                    newRegion.countryId = theCountry;

                    await newRegion.save();

                    regionId = newRegion.id;
                } else {
                    regionId = existingRegion.id;
                }

                // populate the districts
                const existingDistrict = await District.findOne({
                    where: {
                        name: region.District,
                        regionId: regionId,
                    },
                });

                if (!existingDistrict) {
                    const newDistrict = new District();
                    newDistrict.name = region.District;
                    newDistrict.regionId = regionId;
                    newDistrict.countryId = theCountry;

                    await newDistrict.save();
                }
            }
        }
    }
}
