const languageSelect = document.getElementById('languageSelect')
const startVoiceButton = document.getElementById('startVoice')
const voiceStatus = document.getElementById('voiceStatus')
const userSpeech = document.getElementById('userSpeech')
const aiVoiceResponse = document.getElementById('aiVoiceResponse')
const messageInput = document.getElementById('aiMessage')
const askButton = document.getElementById('askAI')

const speakAnswer = (text) => {
    if (!('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()
    const speech = new SpeechSynthesisUtterance(text)
    speech.lang = languageSelect.value
    speech.rate = 0.95
    speech.pitch = 1
    window.speechSynthesis.speak(speech)
}

const askKisanSetuAI = async (message) => {
    voiceStatus.textContent = '🤖 KisanSathi is thinking...'
    aiVoiceResponse.textContent = 'Thinking...'

    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                message,
                language: languageSelect.value,
            }),
        })
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`)

        aiVoiceResponse.textContent = data.answer || 'No answer was returned.'
        voiceStatus.textContent = '✅ Answer ready.'
        speakAnswer(data.answer)
    } catch (error) {
        console.error('AI request failed:', error)
        aiVoiceResponse.textContent = 'Unable to connect to KisanSathi.'
        voiceStatus.textContent = '❌ AI request failed.'
    }
}

const submitTextQuestion = async () => {
    const message = messageInput.value.trim()
    if (!message) {
        aiVoiceResponse.textContent = 'Please enter a question.'
        messageInput.focus()
        return
    }

    userSpeech.textContent = message
    askButton.disabled = true
    await askKisanSetuAI(message)
    askButton.disabled = false
}

askButton.addEventListener('click', submitTextQuestion)
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) submitTextQuestion()
})

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
if (!SpeechRecognition) {
    startVoiceButton.disabled = true
    voiceStatus.textContent = 'Voice recognition is not supported in this browser.'
} else {
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = languageSelect.value

    languageSelect.addEventListener('change', () => {
        recognition.lang = languageSelect.value
    })

    startVoiceButton.addEventListener('click', () => {
        voiceStatus.textContent = '🎤 Listening...'
        startVoiceButton.disabled = true
        recognition.start()
    })

    recognition.onresult = async (event) => {
        const text = event.results[0][0].transcript
        userSpeech.textContent = text
        await askKisanSetuAI(text)
        startVoiceButton.disabled = false
    }

    recognition.onerror = (event) => {
        console.error('Voice recognition failed:', event.error)
        voiceStatus.textContent = 'Unable to understand your voice.'
        startVoiceButton.disabled = false
    }

    recognition.onend = () => {
        startVoiceButton.disabled = false
    }
}
