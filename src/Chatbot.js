import React, { useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const handleQuestionSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/chatbot', {
                question: question
            });
            setAnswer(response.data.answer);
        } catch (error) {
            setAnswer('Error fetching the answer. Please try again later.');
        }
    };

    return (
        <div>
            <h2>Ask a Question</h2>
            <form onSubmit={handleQuestionSubmit}>
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Type your question"
                />
                <button type="submit">Ask</button>
            </form>
            <div>
                <h3>Answer:</h3>
                <p>{answer}</p>
            </div>
        </div>
    );
};

export default Chatbot;
