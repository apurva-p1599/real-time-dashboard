// eslint-disable-next-line no-unused-vars
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MainContainer,
    ChatContainer,
    ConversationHeader,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";

function convertToModel(userID, userName, text) {
    const message = {
        user: {
            id: userID,
            name: userName
        },
        text: text
    };
    return message;
}

export default function Chat() {
    const navigate = useNavigate(); // Hook for navigation
    const [messages, addMessage] = useState([{
        user: {
            id: "AI",
            name: "AI Assistant",
        },
        text: "Hi! How may I assist you?"
    }]);

    function sendMessage(text) {
        const message = convertToModel("user", "You", text);
        addMessage(messages => [...messages, message]);

        // Initiate API request
        AIprompt(text);
    }

    async function AIprompt(text) {
        try {
            const response = await fetch(`http://127.0.0.1:5000/chatbot/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    question: text
                })
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const json = await response.json();
            const message = convertToModel("AI", "AI Assistant", json.answer);
            addMessage(messages => [...messages, message]);

        } catch (error) {
            console.error("Fetch error:", error);
            alert("An error occurred while fetching the AI response. Please try again.");
        }
    }

    return (
        <div style={{ padding: "20px" }}>
            {/* Back to Dashboard Button */}
            <button
        onClick={() => navigate('/')} // Navigate back to the dashboard
        style={{
          backgroundColor: '#007BFF', // Blue background color
          color: 'white', // White text color
          border: 'none', // No border
          padding: '10px 20px', // Padding for a better look
          cursor: 'pointer', // Pointer cursor on hover
          borderRadius: '5px', // Slightly rounded corners
          fontSize: '16px', // Increased font size
          transition: 'background-color 0.3s', // Transition for hover effect
          position: 'absolute', // Positioning the button
          top: '20px', // Distance from the top
          left: '20px', // Distance from the left
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')} // Darker blue on hover
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#007BFF')} // Original blue on mouse leave
      >
        Back to Dashboard
      </button>

            {/* Centered Chat Interface */}
            <div style={{ display: "flex", justifyContent: "center" }}>
                <MainContainer
                    responsive={true}
                    style={{
                        height: "50vh",
                        width: "70vw",
                        maxWidth: "700px"
                    }}
                >
                    <ChatContainer>
                        <ConversationHeader>
                            <ConversationHeader.Content
                                userName="Disaster Management Help"
                            />
                        </ConversationHeader>
                        <MessageList>
                            {messages &&
                                messages.map((message, index) => {
                                    return message.user.id === "AI" ? (
                                        <Message
                                            key={index}
                                            model={{
                                                direction: "incoming",
                                                message: message.text,
                                                sender: message.user.name,
                                            }}
                                        />
                                    ) : (
                                        <div key={index} style={{ justifyContent: "flex-end", display: "flex" }}>
                                            <Message
                                                model={{
                                                    direction: "outgoing",
                                                    message: message.text,
                                                    sender: message.user.name,
                                                }}
                                            />
                                        </div>
                                    );
                                })}
                        </MessageList>
                        <MessageInput
                            onSend={(_, textContent) => sendMessage(textContent)}
                            placeholder="Type message here"
                            attachButton={false}
                            sendButton={true}
                        />
                    </ChatContainer>
                </MainContainer>
            </div>
        </div>
    );
}
