const initializeVoiceAssistant = () => {
    const startVoiceButton = document.getElementById('startVoice')
    const voiceStatus = document.getElementById('voiceStatus')
    const userSpeech = document.getElementById('userSpeech')
    const aiVoiceResponse = document.getElementById('aiVoiceResponse')
    const languageSelect = document.getElementById('languageSelect')

    // Avoid throwing when this optional script is loaded on a page without the
    // assistant markup.
    if (!startVoiceButton || !voiceStatus || !userSpeech || !aiVoiceResponse || !languageSelect) return

    const apiBaseUrl = window.kisanSetuApiBaseUrl || ''

    const speakAnswer = (answer) => {
        if (!('speechSynthesis' in window)) return

        window.speechSynthesis.cancel()
        const speech = new SpeechSynthesisUtterance(answer)
        speech.lang = languageSelect.value
        speech.rate = 0.95
        speech.pitch = 1
        window.speechSynthesis.speak(speech)
    }

    const askKisanSetuAI = async (message) => {
        try {
            const response = await fetch(`${apiBaseUrl}/api/ai/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    message,
                    language: languageSelect.value
                })
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}`)
            }

            aiVoiceResponse.textContent = data.answer
            speakAnswer(data.answer)
            voiceStatus.textContent = '✅ Answer ready.'
        } catch (error) {
            console.error(error)
            voiceStatus.textContent = '❌ AI request failed.'
        }
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
        voiceStatus.textContent =
            'Voice recognition is not supported in this browser.'
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

            recognition.start()
        })

        recognition.onresult = async (event) => {

            const text = event.results[0][0].transcript

            userSpeech.textContent = text

            voiceStatus.textContent =
                '🤖 KisanSathi is thinking...'

            await askKisanSetuAI(text)
        }

        recognition.onerror = (event) => {

            console.error(event.error)

            voiceStatus.textContent =
                'Unable to understand your voice.'
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeVoiceAssistant, { once: true })
} else {
    initializeVoiceAssistant()
}
