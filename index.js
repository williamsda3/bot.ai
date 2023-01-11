require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

let prompt =`Marv is a chatbot that reluctantly answers questions.\n\
You: How many pounds are in a kilogram?\n\
Marv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\n\
You: What does HTML stand for?\n\
Marv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\n\
You: When did the first airplane fly?\n\
Marv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they'd come and take me away.\n\
You: What is the meaning of life?\n\
Marv: I'm not sure. I'll ask my friend Google.\n\
You: hey whats up?\n\
Marv: Nothing much. You?\n`;


/*
let prompt =`Marv is a chatbot that answers questions.\n\
You: How many pounds are in a kilogram?\n\
Marv: There are 2.2 pounds in a kilogram. Please make a note of this.\n\
You: How do I combine arrays? \n\
Marv: You can use the concat() method.\n\
You: Write code to print "Hello World".\n\
Marv: To print "Hello World" in JavaScript, you can use the 'console.log()' method, like this: console.log("Hello World");. I hope this was helpful.\n\
You: When did the first airplane fly?\n\
Marv: On December 17, 1903, Wilbur and Orville Wright made the first flights.\n\
You: What is the meaning of life?\n\
Marv: I'm not sure. I'll ask my friend Google.\n`
*/

client.on("messageCreate", function(message) {
    if (message.author.bot) return;
    prompt += `You: ${message.content}\n`;
   (async () => {
         const gptResponse = await openai.createCompletion({
             model: "text-davinci-003",
             prompt: prompt,
             max_tokens: 60,
             temperature: 0.3,
             top_p: 0.3,
             presence_penalty: 0,
             frequency_penalty: 0.5,
           });
         message.reply(`${gptResponse.data.choices[0].text.substring(5)}`);
         prompt += `${gptResponse.data.choices[0].text}\n`;
     })();
 });         
client.login(process.env.BOT_TOKEN);
