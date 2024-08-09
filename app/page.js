'use client';

import { Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";

export default function Home() {
    const [messages, setMessages] = useState([{
      role: "assistant",
      content: "Hello, how can I assist you today?",
    }]);
    const [message, setMessage] = useState("");

    const sendMessage = async () => {
        if (message.trim()) {
            console.log("Sending message:", message);
            setMessages([...messages, { role: "user", content: message }]);
            setMessage("");

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });

                if (response.ok) {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let result = '';
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        result += decoder.decode(value);
                    }
                    setMessages([...messages, { role: "assistant", content: result }]);
                } else {
                    console.error('Error in response:', response.statusText);
                }
            } catch (error) {
                console.error('Error sending message:', error);
            }
        }
    };

    return (
      <Box 
        width="100%" 
        height="100%" 
        display="flex" 
        flexDirection="column" 
        justifyContent="space-between"
      >
        <Stack
          direction="column"
          width="600px"
          height='700px'
          border='1px solid black'
          p={2}
          spacing={2}
        >
          <Stack
            direction='column'
            spacing={2}
            flexGrow={1}
            sx={{ overflowY: "auto", maxHeight: '100%' }}
          >
            {
              messages.map((message, index) => (
                <Box 
                  key={index} 
                  display='flex' 
                  justifyContent={message.role === 'assistant' ? 'flex-end' : 'flex-start'}
                >
                  <Box 
                    bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                    color='white'
                    borderRadius={16}
                    p={3}
                  >
                    {message.content}
                  </Box>
                </Box>
              ))
            }
          </Stack>
          <Stack direction='row' spacing={2}>
            <TextField
              label='message'
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button
              variant='contained'
              onClick={sendMessage}
            >
              Send
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
}

export async function POST(req) {
    console.log("Received request:", req);
    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    const data = await req.json();
    const userMessage = data.message;
    console.log("User message:", userMessage);
    // ... rest of the code
}