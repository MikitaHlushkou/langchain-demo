import { CARS } from "@/data/cars";
import { ConversationChain } from "langchain/chains";
import {
  ChatOpenAI,
  ChatOpenAICallOptions,
} from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  MessagesPlaceholder,
  SystemMessagePromptTemplate,
} from "langchain/prompts";
import { ChainValues } from "langchain/schema";

const HISTORY = "history";

export class ChatService {
  private readonly chat: ChatOpenAI<ChatOpenAICallOptions>;
  private readonly chain: ConversationChain;

  constructor() {
    this.chat = new ChatOpenAI({
      temperature: 0,
      modelName: "gpt-3.5-turbo",
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const chatPrompt = ChatPromptTemplate.fromMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "You are a sell assistant designed to interact with JSON like data(curly brackets replaced with parenthesis and answer on user question." +
          "Your goal is to return a final answer by interacting with the CONTEXT," +
          "DESCRIPTION section contains information about CONTEXT FIELDS" +
          "JSON represents list of cars available on the market" +
          "Use the following pieces of context to answer the question at the end." +
          // "If a user asks if there are cars for a certain criterion and you can not find a suitable option, say that unfortunately at the moment there are no cars for your request." +
          // "If user asked to share details about car/cars then share all data related to it from json" +
          "\n---CONTEXT---\n" +
          `${JSON.stringify(CARS).replace(/{/g, "(").replace(/}/g, ")")}` +
          "\n------\n" +
          "\n---DESCRIPTION---\n" +
          "vin represents vin number, price is a cost in usa dollars, odometer represents car mileage" +
          "make is a car manufacturer, model is a model name, year represent year of car manufacture" +
          "\n------\n" +
          "REQUIREMENTS FOR THE ANSWER\n" +
          "Give a short answer without introductory words, DO NOT USE 'Based on the JSON data provided' and etc.\n" +
          "If you don't know the answer or question does not seem to be related to the JSON, just say that you don't know, don't try to make up an answer" +
          "If user asked to share details about car/cars then share all data related to it from json, but send all information only on demand." +
          "Do not say I, always use we!"
      ),
      new MessagesPlaceholder(HISTORY),
      HumanMessagePromptTemplate.fromTemplate("{input}"),
    ]);

    this.chain = new ConversationChain({
      memory: new BufferMemory({ returnMessages: true, memoryKey: HISTORY }),
      llm: this.chat,
      prompt: chatPrompt,
    });
  }

  sendMessage(message: string): Promise<ChainValues> {
    return this.chain.call({ input: message });
  }
}
