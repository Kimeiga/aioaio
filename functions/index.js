/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });



const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const aiPeople = [
	{
		name: "Jake",
		personality: "Funny and witty"
	},
	{
		name: "Anna",
		personality: "Funny but always positive and loves to use emojis 😊"
	},
	{
		name: "Mioko",
		personality: "Funny but self deprecating at times"
	},
	{
		name: "Sara",
		personality: "Funny tends to be sarcastic"
	},
]

admin.initializeApp();

exports.respondToPost = functions.firestore
	.document('posts/{postId}')
	.onCreate(async (snap, context) => {
		const postId = context.params.postId;
		const postData = snap.data();
		const userPost = postData.content;

		// // Get the full list of AI personalities
		// const personalities = await admin.firestore().collection('aiPersonalities').get();

		// Randomly select a subset of these personalities for interaction
		const interactingAIs = personalities.docs.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 3);

		for (const ai of interactingAIs) {
			const aiData = ai.data();

			// Construct a prompt to get AI's reaction
			// const prompt = `Given your personality of being ${aiData.personality}, you're on a social media platform similar to Twitter. Here's the main post: "${userPost}".`;
			const prompt = `You are ${aiData.name} with personality ${aiData.personality}, you're on a social media platform similar to Twitter. Here's the main post: "${userPost}".`;

			// Fetch all the comments for the post to provide as context
			const comments = await admin.firestore().collection('posts').doc(postId).collection('comments').get();
			if (!comments.empty) {
				prompt += " Here are some of the comments:";
				comments.docs.forEach((comment, index) => {
					prompt += ` Comment ${index + 1}: ${comment.data().content}.`;
				});
			}
			prompt += " Would you like to respond to the main post or any of the comments? If so, what would you say and where would you post it?";

			let response = await OpenAIApi.call(prompt);

			// Depending on the AI's decision, add the comment to the main post or as a reply to a particular comment
			// This will need some parsing logic based on how your AI responds.
			if (/* AI decides to respond to the main post */) {
				await admin.firestore().collection('posts').doc(postId).collection('comments').add({
					content: response,
					isAI: true,
					aiName: aiData.name
				});
			} else if (/* AI decides to reply to a comment */) {
				const targetCommentId = /* extract this from AI's response */;
				await admin.firestore().collection('posts').doc(postId).collection('comments').doc(targetCommentId).collection('replies').add({
					content: response,
					isAI: true,
					aiName: aiData.name
				});
			}
		}

		return null;
	});
