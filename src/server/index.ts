import express from 'express';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { streamText } from 'ai';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

app.get('/', (_req, res) => {
  res.send('Hello from the backend!');
});

app.post('/api/chat', async (req, res) => {
  const { messages, userId, chatId: existingChatId } = req.body;
  let chatId = existingChatId;

  try {
    // If no chatId is provided, create a new chat
    if (!chatId) {
      const { data, error } = await supabase
        .from('chats')
        .insert({ user_id: userId, title: messages[0].content.substring(0, 50) })
        .select('id')
        .single();

      if (error) throw error;
      chatId = data.id;
    }

    const { textStream } = await streamText({
      model: openrouter.chat('gryphe/mythomax-l2-13b'),
      messages,
      onFinish: async ({ text }) => {
        const userMessage = messages[messages.length - 1];
        await supabase.from('messages').insert([
          { chat_id: chatId, user_id: userId, content: userMessage.content, role: 'user' },
          { chat_id: chatId, user_id: userId, content: text, role: 'assistant' },
        ]);
      },
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of textStream) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send('Error streaming response');
  }
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
}); 