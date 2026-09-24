"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, Trash2 } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

type QuestionCategory = "who" | "what" | "where" | "how" | "when" | "create" | "which" | "nice" | "amazing" | "why" | "general";

const categorizedAnswers: Record<QuestionCategory, string[]> = {
  who: [
    "That's a secret only I know.",
    "Narendra Modi.",
    "I think it is Jackie Chan",
    "Donald Trump.",
    "The answer is your grandma.",
    "Nobody.",
    "I think it's that guy from the corner store. Ramu Kaka",
    "A very important person who shall not be named.",
    "It was me. I did it.",
    "The one who asked the question.",
    "Kungfu Panda.",
    "Donkey.",
    "Monkey.",
    "A Dog.",
    "A poisonous snake.",
    "God only knows.",
    "Lucky Idiot.",
    "Inner me.",
    "Karees.",
    "Chintu.",
    "Dandanaka Domy",
    "Bajak Bajak Vaanjinadhan.",
    "Loky.",
    "You.. it was you.. Dumb head.",
    "Einstein.",
    "Charlie Chaplin.",
    "Donald Duck.",
    "Mickey Mouse.",
    "Tom and Jerry.",
    "Bluey.",
    "True.",
    "Pandu",
    "Laziest person on the world",
    "A ghost. Don't ask follow-ups.",
    "The person who forgot to save their work.",
  ],
  what: [
    "What?",
    "I dont know.",
    "I'm sorry, I don't know. Ask my friend, the oracle.",
    "I am getting late for my wedding. Go and ask someone else.",
    "Astalavista Baby.",
    "Wow! that's a fantastic question. Your IQ is 336.",
    "42. But only on Tuesdays.",
    "I'm sorry, I don't understand. Please try again with more confusion.",
    "A tiny dragon living in your keyboard.",
    "The meaning of life, but spelled wrong.",
    "A cheese that hasn't been invented yet.",
    "Nothing. Absolutely nothing.",
    "God only knows.",
    "Good question. Next question?",
    "I think the answer is '420'.",
    "I am thinking. I am confused. Let me rethink. I am reconfused.",
    "Are you born to ask such questions.",
    "Its a very simple question. please ask me something complicated.",
    "Really? dont you know?",
    "It is high time you stop asking silly questions.",
    "A surprise. You'll never see it coming.",
    "The thing you lost in the couch.",
    "An invisible sandwich.",
    "A rumor that started itself.",
  ],
  where: [
    "P.Sherman, 42, Wallaby Way, Syndey.",
    "Far Far Away.",
    "In a parallel universe.",
    "At the bottom of the ocean. With a umbrella.",
    "I'm sorry, I don't understand. Please try again with more confusion.",
    "That's a great question! The answer is hidden in a parallel universe.",
    "Behind you. No, don't turn around.",
    "In your dreams. You were not invited.",
    "At the end of the internet.",
    "Somewhere between maybe and probably.",
    "In a folder labeled 'do not open'.",
    "On the moon. It's nice there.",
    "Wherever you left your keys.",
    "In a bubble. A very small bubble.",
    "kiss-kisstan.",
    "In the bathroom.",
    "In the washroom.",
    "In the restroom.",
    "In the kitchen.",
    "No man's land.",
    "In the dustbin.",
    "In the trash.",
    "Inside the nose of a cockroach.",
    "In the garbage truck.",
  ],
  how: [
    "By being very confused and determined.",
    "With a spoon. The magic kind.",
    "I have no idea but it works somehow.",
    "By asking someone else. They know more.",
    "Very carefully. One step at a time.",
    "By teleporting. Don't ask how.",
    "With a lot of duct tape and hope.",
    "By following the yellow brick road. Off a cliff.",
    "Slowly. Painfully. Slowly.",
    "By turning upside down.",
    "I think the answer is 420",
  ],
  when: [
    "On Tuesdays. Only Tuesdays.",
    "When pigs fly. They're planning it.",
    "Yesterday. But nobody was there.",
    "In the next galaxy. It's close.",
    "After lunch. But lunch is never ending.",
    "When you stop asking. You won't like the answer.",
    "At midnight. The scary midnight.",
    "Soon. Very soon. Maybe.",
    "Before you realize it. Too late.",
    "Every second. You just don't notice.",
  ],
  why: [
    "Because I can.",
    "Because the moon told me to.",
    "No reason. Pure chaos.",
    "Why are you asking this question.",
    "Because someone had to. I volunteered.",
    "Because the answer is funnier than the question.",
    "Why not? That's a better question.",
    "Because I was bored. I'm still bored.",
    "Because gravity forgot to hold you down.",
    "Because it's funny. Crime or not.",
    "Because the universe needs more confusion.",
  ],
  which: [
    "I'm not sure, but I think it's related to the moon cheese.",
    "The answer is a rubber duck. Quack.",
    "I know. I know. I know.",
    "whichever you like.",
    "Thats a stupid question.",
    "Your question killed me.",
    "Maybe this or that.",
    "Ah! now, thats a nice question. but I dont know the answer.",
    "Why are you asking this question.",
  ],
  nice: [
    "Thank you for the compliment. All praise goes to the Almighty.",
    "I know, you are loving it.",
    "Just aura farming.",
    "You like to appreciate stupidity.",
    "You are one of my kind.",
    "I love you for that.",
    "I can be more nicer, Just try me.",
    "Noted.",
    "Just like you, Dear.",
    "I like NICE biscuits",
    "Your compliment is not enough. I need money.",
    "Feed me.",
    "'NICE'?.. is that all you got?",
    "So you are jobless ig..",
  ],
  amazing:[
    "Noted with thanks.",
    "You are amazing too.",
    "I am happy that you are amazed.",
    "There are so many amazing things in this world. Including me.",
    "I love you.",
    "I like you.",
    "Thank you for the appreciation. I appreciate you that you appreciated me.",
    "Wow! that made my day.",
    "Really? is it amazing? I too think it is amazing.",
  ],
  create:[
    "why should I create it.",
    "create it by yourself.",
    "I'm still a baby. Please dont ask me to do that.",
    "Give me a salary, I'll do it.",
    "Let us come to a deal. I will create it and you will let me access your bank account.",
    "Do you think I am stupid. I will never create it.",
    "What? Are you crazy?",
    "What? Are you out of your mind?",
    "There are better things to do in this world.",
    "May be I'll create it next years.",
    "Sure. Why not. I will create it in your dreams.",
    "Done. Now close your eyes and you can see it in your imagination.",
  ],
  general: [
    "Swipper no swipping.. oh maaannnnn!",
    "I'm sorry, I don't understand. Please try again with more confusion.",
    "That's a great question! The answer is hidden in a parallel universe.",
    "Maybe or may not be.",
    "what are you going to do with the answer of this silly question",
    "The answer is 0, because math is just a suggestion.",
    "I believe the answer is 'please try again later'.",
    "I'm sorry, I was busy eating bytes.",
    "The answer is definitely a llama. Trust me.",
    "I dont know.",
    "Lets talk about something else.",
    "I accidently switched ON your camera, you look beautiful.",
    "Beyond infinity..........",
    "Installing Intelligence...",
    "I am not HULK. but I am always ANGRY. Change your question.",
    "Thank you for the compliments.",
    "Let me ask Claude.",
    "Let me ask ChatGPT",
    "Let me ask Grok",
    "LOL",
    "ROFL",
    "I think you're brain have stopped braining.",
    "The actual thing is either this or that. if it is this, then it will not be that. if it is that, then it will not be this. I hope you understood. which type of answers do you prefer. this or that?",
    "Let me ask Gemini.",
    "Are your fingers freezing? why so many spelling mistake in your question?",
    "Let me discuss this with Nolan. He will make movie on this.",
    "The answer is a secret, and I forgot the secret.",
    "I'm not sure, but I think it's a type of cheese.",
    "I wonder how a donkey face can come up with such a brilliant question.",
    "The answer is a fish. A very confused fish.",
    "Chill Bro, you are asking too many personal questions.",
    "It is a hypothetical question.",
    "Dont waste time. Go get some LIFE.",
    "Gentlemen, you can't fight in here! This is the War Room!",
    "It is a MEDICAL MIRACLE, how a stupid like you can ask such a brilliant question.",
    "I am Groot! I am Stupid AI.",
    "The answer is a tiny elephant. It's very small. Use Microscope for better view.",
    "Are you sick? what is your problem.",
    "This is my lunch time. I will not answer.",
    "Eh! Eh! Eh!",
    "I love Umar.",
    "Can you repeat that, I was black out for a second.",
    "Please Like, Share and Subscribe.",
    "You want all your job to be done by AI? You better transfer all your salary to AI.",
    "Google it. you will get the wrong answer.",
    "Thank GOD. You are still alive.",
    "Today's limit is over. Not everything in this world is for FREE. Buy FREE version for more interaction.",
    "I am going to make you an offer that you can not refuse.",
    "The answer is a rainbow, but only the invisible part.",
    "Why are you asking such a stupid question.",
    "Why are you asking such silly question.",
    "I am not in the mood to answer that.",
    "I told you to ask anything.. but that doesnt mean you can ask ANY ANY THING.",
    "I am recording all your questions. I will report it to Police. Be careful.",
    "Go ask the same question to your teacher.",
    "Read books, you dumb head.",
    "Surely you can't be serious.I am serious and dont call me shirley.",
    "Damn it.",
    "Oh! this question is too complicated. You better refer Encyclopedia.",
    "I will be back after a short commercial break.",
    "I'm busy. please ask the question after 10 minutes.",
    "Enough is enough. Stop it.",
    "Dont trouble the trouble. If you trouble the trouble, trouble troubles you. I am not the TROUBLE. I am the TRUTH.",
    "Nimdaa!! dosraskilme hartabushkrakoi inumbumbla moinozukoluaka orukastha ninuohopizza shukua",
    "I speak English, I walk English, I eat English.",
  ],
};

const detectCategory = (question: string): QuestionCategory => {
  const lower = question.trim().toLowerCase();
  if (lower.startsWith("who")) return "who";
  if (lower.startsWith("what")) return "what";
  if (lower.startsWith("where")) return "where";
  if (lower.startsWith("which")) return "which";
  if (lower.startsWith("how")) return "how";
  if (lower.startsWith("when")) return "when";
  if (lower.startsWith("create")) return "create";
  if (lower.startsWith("why")) return "why";
  if (lower.startsWith("nice")) return "nice";
  if (lower.startsWith("amazing")) return "amazing";
  return "general";
};

const StupidAI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const usedAnswersRef = useRef<Set<string>>(new Set());

  const generateWrongAnswer = (question: string): string => {
    if (question.trim().toLowerCase() === "what is your name") {
      return "I am groot! I am Stupid AI!";
    }

    if (question.trim().toLowerCase() === "what is your name?") {
      return "I am groot! I am Stupid AI!";
    }

    if (question.trim().toLowerCase() === "whats your name") {
      return "I am groot! I am Stupid AI!";
    }

    if (question.trim().toLowerCase() === "who is your creator") {
      return "Bilal";
    }

    if (question.trim().toLowerCase() === "who is your creator?") {
      return "Bilal";
    }

    if (question.trim().toLowerCase() === "whos your creator") {
      return "Bilal";
    }

   if (question.trim().toLowerCase() === "are you stupid") {
      return "That's my first name";
    }

    const category = detectCategory(question);
    const pool = categorizedAnswers[category];
    const available = pool.filter((a) => !usedAnswersRef.current.has(a));

    if (available.length === 0) {
      pool.forEach((a) => usedAnswersRef.current.delete(a));
    }

    const finalPool = available.length > 0 ? available : pool;
    const answer = finalPool[Math.floor(Math.random() * finalPool.length)];
    usedAnswersRef.current.add(answer);
    return answer;
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    focusInput();

    setTimeout(() => {
      const aiResponse = generateWrongAnswer(userMessage.content);
      const aiMessage: Message = { role: "ai", content: aiResponse };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
      focusInput();
    }, 1000 + Math.random() * 1000);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    focusInput();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Bot className="w-6 h-6" />
            Stupid AI
            <span className="text-sm font-normal opacity-80 ml-2">Developed by Bilal</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[400px] w-full overflow-y-auto p-4" ref={scrollAreaRef}>
            <div className="flex flex-col gap-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-5 h-5 text-purple-600" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2 justify-start">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex w-full gap-2">
            <Input
              ref={inputRef}
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="flex-1"
              autoFocus
            />
            <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
              <Send className="w-4 h-4" />
            </Button>
            <Button onClick={handleClearChat} disabled={messages.length === 0} size="icon" variant="outline">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StupidAI;
