import { useState } from 'react'
import { useAuth } from '@/app/contexts/authContext'

export function useChat() {
    const { user, tier } = useAuth()
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const sendMessage = async (text: string) => {
        if (!user) return

        const userMsg = { role: 'user', content: text, timestamp: new Date() }
        setMessages(prev => [...prev, userMsg])
        setLoading(true)

        try {
            const response = await fetch('https://us-central1-finguard-ai-55aec.cloudfunctions.net/chat_stream', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.uid,
                    message: text,
                    tier: tier || 'consumer'
                })
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const reader = response.body?.getReader()
            let aiResponse = ''

            if (reader) {
                while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const textChunk = new TextDecoder().decode(value)
                    const lines = textChunk.split('\n')

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            try {
                                const data = JSON.parse(line.slice(6))
                                if (data.token) {
                                    aiResponse += data.token
                                    setMessages(prev => {
                                        const newMessages = [...prev]
                                        const lastMsg = newMessages[newMessages.length - 1]
                                        if (lastMsg?.role === 'assistant') {
                                            return [
                                                ...newMessages.slice(0, -1),
                                                { ...lastMsg, content: aiResponse }
                                            ]
                                        } else {
                                            return [...newMessages, { role: 'assistant', content: aiResponse, timestamp: new Date() }]
                                        }
                                    })
                                }
                            } catch (e) {
                                // Ignore parse errors for partial chunks
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the server.", timestamp: new Date() }])
        } finally {
            setLoading(false)
        }
    }

    return { messages, loading, sendMessage }
}
