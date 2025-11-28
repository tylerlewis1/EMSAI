// server/openaiSession.js
import WebSocket from "ws";

export async function createAiSession() {

    return new Promise((resolve, reject) => {

        // Connect to OpenAI Realtime over WEBSOCKETS
        const aiWS = new WebSocket(
            "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview",
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAIKEY}`,
                    "OpenAI-Beta": "realtime=v1"
                }
            }
        );

        // When backend connects to OpenAI:
        aiWS.on("open", () => {
            console.log("Backend → OpenAI WebSocket connected");

            // Request creation of a Realtime session
            aiWS.send(JSON.stringify({
                type: "session.create"
            }));
        });

        // Wait for OpenAI's "session.created" message
        aiWS.on("message", (data) => {
            const msg = JSON.parse(data);

            if (msg.type === "session.created") {

                resolve({
                    aiSessionId: msg.session.id,   // IMPORTANT
                    aiWS                                // Save socket
                });
            }
        });

        aiWS.on("error", (err) => {
            console.error("AI WS Error:", err);
            reject(err);
        });
    });
}
