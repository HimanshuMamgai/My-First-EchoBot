require('dotenv').config();
const restify = require('restify');

const {
    CloudAdapter,
    ConfigurationServiceClientCredentialFactory,
    createBotFrameworkAuthenticationFromConfiguration
} = require('botbuilder');

const EchoBot = require('./bot');

const server = restify.createServer({
    name: 'EchoBot'
});

server.use(restify.plugins.bodyParser());

server.listen(process.env.PORT || 3000, () => {
    console.log(`${server.name} listening to ${server.url}`);
});

const credentialsFactory = new ConfigurationServiceClientCredentialFactory({
    MicrosoftAppId: process.env.MicrosoftAppId,
    MicrosoftAppPassword: process.env.MicrosoftAppPassword,
    MicrosoftAppType: process.env.MicrosoftAppType,
    MicrosoftAppTenantId: process.env.MicrosoftAppTenantId
});

const botFrameworkAuthentication = createBotFrameworkAuthenticationFromConfiguration(null, credentialsFactory);

const adapter = new CloudAdapter(botFrameworkAuthentication);

const onTurnErrorHandler = async (context, error) => {
    console.error(`\n [onTurnError] unhandled error: ${error}`);

    await context.sendTraceActivity(
        'onTurnError Trace',
        `${error}`
    );

    await context.sendActivity('The bot encountred an errror or bug');
};

adapter.onTurnError = onTurnErrorHandler;

const myBot = new EchoBot();

server.post('/api/messages', async (req, res) => {
    await adapter.process(req, res, (context) => myBot.run(context));
});