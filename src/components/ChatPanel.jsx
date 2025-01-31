import React, { useEffect, useRef } from 'react';

function ChatPanel({ aiPrompt, chatMessages, handleAiPromptChange, handleAiSubmit }) {
    const chatEndRef = useRef(null);

    // Automatyczne przewijanie do najnowszej wiadomości
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages]);

    // Obsługa naciśnięcia "Enter"
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAiSubmit();
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {chatMessages.map((message, index) => (
                    <div key={index} className={`chat-message ${message.sender}`}>
                        <div className="chat-bubble">{message.text}</div>
                    </div>
                ))}
                <div ref={chatEndRef} /> {/* Punkt przewijania */}
            </div>
            <div className="chat-input">
                <textarea
                    placeholder="Wpisz zapytanie..."
                    value={aiPrompt}
                    onChange={handleAiPromptChange}
                    onKeyDown={handleKeyDown} // Obsługa Enter
                    rows="3"
                />
                <button onClick={handleAiSubmit} disabled={!aiPrompt.trim()}>Wyślij</button>
            </div>
        </div>
    );
}

export default ChatPanel;
