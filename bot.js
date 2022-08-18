const { ActivityHandler, MessageFactory } = require('botbuilder');

class EchoBot extends ActivityHandler {
    constructor() {
        
        super();

        this.onMessage(async (context, next) => {
            const replyText = `I heard you say ${context.activity.text}`;
            await context.sendActivity(MessageFactory.text(replyText));
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = `Hello and welcome to EchoBot!`;

            for(let i = 0; i < membersAdded.length; i++) {
                if(membersAdded[i].id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText));
                }
            }

            await next();
        });
    }
};

module.exports = EchoBot;