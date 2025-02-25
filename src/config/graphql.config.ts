import { ApolloDriverConfig } from "@nestjs/apollo"
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';
import * as dotenv from 'dotenv';
import { appConfig } from "./app.config";

dotenv.config();

const isGraphqlPlaygroundEnabled = process.env.GRAPHQL_PLAYGROUND_ENABLED === 'true'
    || appConfig.environment === 'local';

const apolloServerPlugins = [];
if (isGraphqlPlaygroundEnabled) {
    apolloServerPlugins.push(ApolloServerPluginLandingPageLocalDefault());
}

export const graphqlConfigFactory = (): ApolloDriverConfig => ({
    autoSchemaFile: join(process.cwd(), 'src/schema/schema.gql'),
    includeStacktraceInErrorResponses: false,
    playground: false, // use apollo client plugin instead
    introspection: isGraphqlPlaygroundEnabled ? true : false,
    plugins: apolloServerPlugins,
    context: ({ req, res, payload, connection }: any) => ({
        req,
        res,
        payload,
        connection,
    }),
    subscriptions: {
        'graphql-ws': true,
        'subscriptions-transport-ws': {
            onConnect: (connectionParams) => {
                return {
                    req: {
                        headers: {
                            authorization: `${connectionParams.headers['Authorization']}`,
                        },
                    },
                };
            },
        },
    },
});