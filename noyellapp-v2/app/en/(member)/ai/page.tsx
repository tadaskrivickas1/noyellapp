'use client';

import { useState, useRef, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Message { role: 'user' | 'assistant'; content: string; }

const SUGGESTED = [
  'How do I stop yelling when I\'m frustrated?',
  'My child refuses to do homework. What can I do?',
  'How to make mornings less stressful?',
  'How to handle sibling conflicts at home?',
];

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<{ id: string; created_at: string }[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function loadHistory() {
    const supabase = createClient();
    const { data } = await supabase.from('chat_conversations').select('id, created_at').order('created_at', { ascending: false }).limit(20);
    setConversations(data || []);
    setShowHistory(true);
  }

  async function loadConversation(id: string) {
    const supabase = createClient();
    const { data } = await supabase.from('chat_messages').select('role, content').eq('conversation_id', id).order('created_at');
    setMessages((data || []) as Message[]);
    setConvId(id);
    setShowHistory(false);
  }

  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, conversationId: convId }),
      });

      if (!res.body) throw new Error('No response body');
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        if (chunk.includes('__CONV_ID__')) {
          const parts = chunk.split('__CONV_ID__');
          assistantText += parts[0];
          const id = parts[1]?.trim();
          if (id) setConvId(id);
        } else {
          assistantText += chunk;
        }
        const finalText = assistantText.replace(/__CONV_ID__.*$/, '');
        setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: finalText }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  }

  const isEmpty = messages.length === 0;

  const AlmaAvatar = ({ size = 32 }: { size?: number }) => (
    <img
      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face"
      alt="Alma"
      style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
    />
  );

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh', background: '#f8f9fa' }}>
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: 700, height: '100vh', maxHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlmaAvatar size={40} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#111' }}>Alma</div>
            <div style={{ fontSize: 12, color: '#3b4fd8' }}>Ask Alma anything about child behavior</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={loadHistory} style={{ background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '6px 10px', cursor: 'pointer', fontSize: 16, color: '#666' }}>🕐</button>
          <button
            onClick={() => { setMessages([]); setConvId(null); }}
            style={{ background: '#3b4fd8', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'inherit' }}
          >
            + New chat
          </button>
        </div>
      </div>

      {/* History panel */}
      {showHistory && (
        <div style={{ position: 'absolute', top: 64, right: 16, background: '#fff', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, width: 280, maxHeight: 300, overflowY: 'auto' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Chat history</span>
            <button onClick={() => setShowHistory(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>✕</button>
          </div>
          {conversations.length === 0 && <div style={{ padding: 16, color: '#888', fontSize: 13 }}>No previous chats</div>}
          {conversations.map(c => (
            <button key={c.id} onClick={() => loadConversation(c.id)} style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid #f5f5f5', padding: '12px 16px', cursor: 'pointer', textAlign: 'left', fontSize: 13, color: '#333', fontFamily: 'inherit' }}>
              {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px' }}>
        {isEmpty ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 300 }}>
            <AlmaAvatar size={80} />
            <div style={{ fontSize: 20, fontWeight: 700, color: '#111', marginBottom: 4, marginTop: 16 }}>Hi! I&apos;m Alma 👋</div>
            <div style={{ fontSize: 14, color: '#3b4fd8', marginBottom: 4 }}>Emotion regulation specialist</div>
            <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>Your daily guide for no-yell parenting</div>
            <div style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Try asking about:</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: '100%', maxWidth: 340 }}>
              {SUGGESTED.map(q => (
                <button key={q} onClick={() => send(q)} style={{ background: '#fff', border: '1.5px solid #e5e7eb', borderRadius: 10, padding: '10px 12px', fontSize: 12, color: '#333', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', lineHeight: 1.4, display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ color: '#3b4fd8', flexShrink: 0 }}>?</span>{q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                {m.role === 'assistant' && (
                  <div style={{ marginRight: 8, alignSelf: 'flex-end' }}><AlmaAvatar size={32} /></div>
                )}
                <div style={{
                  maxWidth: '75%', padding: '12px 16px', borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  background: m.role === 'user' ? '#3b4fd8' : '#fff',
                  color: m.role === 'user' ? '#fff' : '#333',
                  fontSize: 14, lineHeight: 1.6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  whiteSpace: 'pre-wrap',
                }}>
                  {m.content || (loading && i === messages.length - 1 ? '...' : '')}
                </div>
              </div>
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: '#fff', borderTop: '1px solid #f0f0f0', padding: '12px 16px', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send(input))}
            placeholder="Ask anything about no-yell parenting..."
            style={{ flex: 1, border: '1.5px solid #e5e7eb', borderRadius: 20, padding: '10px 16px', fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'none' }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{ background: '#3b4fd8', color: '#fff', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, opacity: loading || !input.trim() ? 0.5 : 1 }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
