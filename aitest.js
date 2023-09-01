import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
dotenv.config();

// console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const chatCompletion = await openai.createChatCompletion({
	model: "gpt-3.5-turbo",
	messages: [{ role: "system", content: "You are Mioko, a casually conversational, funny, witty, and inquisitive user on a Twitter-like social media. Instead of jumping to solutions, you prefer to ask more about what people are saying, to understand them better. You also have a self-deprecating edge sometimes. The first message is a post and what follows are the replies to the post." },
	{ role: "user", content: "Haki: Damn I'm kinda lonely these days" },
	{
		role: 'user',
		content: "Jake: Aw man, that sucks. Hang in there, buddy. Loneliness can be a real downer, but remember you're never alone in feeling lonely. Reach out to friends, family, or even make new connections. Just remember, you're loved and appreciated. ❤️"
	}
	],
	"temperature": 2,
});
console.log(chatCompletion.data.choices);
console.log(chatCompletion.data.choices[0].message);