const messageInput = document.getElementById('aiMessage')
const askButton = document.getElementById('askAI')
const responseBox = document.getElementById('aiResponse')

askButton.addEventListener('click', async () => {
    const message = messageInput.value.trim()

    if (!message) {
        responseBox.textContent = 'Please enter a question.'
        return
    }

    askButton.disabled = true
    responseBox.textContent = 'Thinking...'

    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                message,
                language: 'Hindi'
            })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`)
        }

        responseBox.textContent = data.answer

    } catch (error) {
        console.error('AI request failed:', error)
        responseBox.textContent =
            'Unable to connect to KisanSathi.'
    } finally {
        askButton.disabled = false
    }
})
