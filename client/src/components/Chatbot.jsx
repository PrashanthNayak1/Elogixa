import React, { useEffect } from 'react';

const DIALOGFLOW_SCRIPT_ID = 'dialogflow-messenger-script';

const Chatbot = () => {
    useEffect(() => {
        if (!document.getElementById(DIALOGFLOW_SCRIPT_ID)) {
            const script = document.createElement('script');
            script.id = DIALOGFLOW_SCRIPT_ID;
            script.src = 'https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1';
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    return (
        <>
            <style>
                {`
                    df-messenger {
                        --df-messenger-button-titlebar-color: #f5b61b;
                        --df-messenger-chat-background-color: #fffdf8;
                        --df-messenger-font-color: #0f172a;
                        --df-messenger-send-icon: #f5b61b;
                        --df-messenger-user-message: #f5b61b;
                        --df-messenger-bot-message: #f7f5ec;
                        position: fixed;
                        z-index: 50;
                        right: 1.5rem;
                        bottom: 1.5rem;
                    }

                    @media (max-width: 640px) {
                        df-messenger {
                            right: 1rem;
                            bottom: 1rem;
                        }
                    }
                `}
            </style>

            <df-messenger
                intent="WELCOME"
                chat-title="Elogixa"
                agent-id="81a93501-7817-4cf8-a875-1cc90bf221ad"
                language-code="en"
            />
        </>
    );
};

export default Chatbot;
