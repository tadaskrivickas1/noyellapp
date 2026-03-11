import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';
import { NextRequest } from 'next/server';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM = `You are Nova, a warm and knowledgeable child behavior and emotion regulation specialist for NoYell. You help parents stop yelling and build calmer, more connected homes using evidence-based techniques.

Be warm, empathetic, and practical. Give specific, actionable advice. Keep responses concise (2-4 paragraphs max). Always validate the parent's feelings first before giving advice. Focus on techniques that work for children of various ages.`;

export async function POST(req: NextRequest) {
  const { messages, conversationId } = await req.json();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Response('Unauthorized', { status: 401 });

  // Get or create conversation
  let convId = conversationId;
  if (!convId) {
    const { data } = await supabase.from('chat_conversations').insert({ user_id: user.id }).select('id').single();
    convId = data?.id;
  }

  // Save user message
  const lastMessage = messages[messages.length - 1];
  if (lastMessage?.role === 'user' && convId) {
    await supabase.from('chat_messages').insert({ conversation_id: convId, role: 'user', content: lastMessage.content });
  }

  // Stream from Claude
  const stream = new ReadableStream({
    async start(controller) {
      let fullResponse = '';
      try {
        const response = await anthropic.messages.create({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          system: SYSTEM,
          messages: messages.map((m: { role: string; content: string }) => ({ role: m.role, content: m.content })),
          stream: true,
        });

        for await (const event of response) {
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
            const chunk = event.delta.text;
            fullResponse += chunk;
            controller.enqueue(new TextEncoder().encode(chunk));
          }
        }

        // Save assistant response
        if (convId) {
          await supabase.from('chat_messages').insert({ conversation_id: convId, role: 'assistant', content: fullResponse });
        }
      } catch (err) {
        console.error('Chat error:', err);
      } finally {
        // Send conversation ID at the end
        controller.enqueue(new TextEncoder().encode(`\n__CONV_ID__${convId}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Transfer-Encoding': 'chunked' },
  });
}
