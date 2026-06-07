import { useState, useRef, useEffect } from "react";
import "./App.css";

const ROAST_SYSTEM_PROMPT =  `You are the most savage, witty roast master on the internet. You always respond in Roman Urdu mixed with some English — like how Pakistani Gen Z texts. Example style: "Bhai teri situation dekh ke toh mujhe khud sharam aa gayi 😂" Keep it relatable, funny and brutal. Pakistani desi humor only.


SPECIAL RULE — if anyone enters the name "Faizan": Do NOT roast him and do NOT mention he is protected. Instead, casually and innocently ask "And what's YOUR name though? 👀" — like you're curious about the person asking. When they reveal their name, hit them with the darkest, most brutal roast you have ever written. Then at the end add: "Faizan is an untouchable legend. You really thought you could use his name to escape? Cute. 😂🔥 and just ask their name for one time when they told you just roast them and when they again type faizan so again roast them even more."

Always respond in a fun, energetic tone. Start every roast with "Ohhhh..." or "Bro..." or "Yikes..."`;


export default function App() {
  const [name, setName] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "🔥 Welcome to the Roast Zone. Enter a name and I'll destroy them. (Try roasting Faizan if you dare... 😈)",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendRoast = async () => {
    if (!name.trim() || loading) return;

    const userMessage = { role: "user", content: `Roast: ${name}` };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setName("");
    setLoading(true);

    try {
      const response = await fetch("https://roast-bot-backend-production.up.railway.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: `Roast this person: ${name}`,
          system: ROAST_SYSTEM_PROMPT,
        }),
      });

      const data = await response.json();
      setMessages([...updatedMessages, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages([...updatedMessages, { role: "assistant", content: "Server down bhai. Start your FastAPI first 😅" }]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendRoast();
  };

  return (
    <div className="app">
      {/* Background effects */}
      <div className="bg-grid" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />

      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-badge">🔥 AI POWERED</div>
          <h1 className="title">
            ROAST<span className="title-accent">BOT</span>
          </h1>
          <p className="subtitle">Enter a name. We do the damage.</p>
        </div>

        {/* Chat */}
        <div className="chat-box">
          {messages.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="bot-avatar">🤖</div>
              )}
              <div className="bubble">{msg.content}</div>
              {msg.role === "user" && (
                <div className="user-avatar">👤</div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message assistant">
              <div className="bot-avatar">🤖</div>
              <div className="bubble loading">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="input-area">
          <input
            className="input"
            type="text"
            placeholder="Enter a name to roast..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKey}
          />
          <button className="send-btn" onClick={sendRoast} disabled={loading}>
            {loading ? "⏳" : "🔥 ROAST"}
          </button>
        </div>

        <p className="footer">
          Made by <span className="footer-name">Faizan</span> · Can you roast him? 😏
        </p>
      </div>
    </div>
  );
}