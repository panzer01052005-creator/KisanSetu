document.addEventListener('DOMContentLoaded', () => {
    const page = document.body
    const toast = document.createElement('div')
    toast.className = 'site-toast'
    toast.setAttribute('role', 'status')
    page.appendChild(toast)
    const toastStyles = document.createElement('style')
    toastStyles.textContent = `.site-toast{position:fixed;right:20px;bottom:20px;z-index:20;max-width:280px;padding:12px 16px;border-radius:7px;color:#fff;background:#176b45;box-shadow:0 10px 25px #172d1f30;font:600 12px/1.4 'DM Sans',sans-serif;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .2s,transform .2s}.site-toast.visible{opacity:1;transform:translateY(0)}@media(max-width:560px){.site-toast{right:15px;left:15px;bottom:15px;max-width:none;text-align:center}}`
    const style = document.createElement('style')
    style.textContent = '.site-toast{position:fixed;right:20px;bottom:20px;z-index:30;max-width:290px;padding:12px 16px;border-radius:7px;color:#fff;background:#176b45;box-shadow:0 10px 25px #172d1f30;font:600 12px/1.4 sans-serif;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .2s,transform .2s}.site-toast.visible{opacity:1;transform:translateY(0)}.menu-open{display:flex!important}@media(max-width:560px){.site-toast{right:15px;left:15px;bottom:15px;max-width:none;text-align:center}}'
    document.head.appendChild(style)
    let toastTimer
    const showToast = (message) => {
        toast.textContent = message
        toast.classList.add('visible')
        clearTimeout(toastTimer)
        toastTimer = setTimeout(() => toast.classList.remove('visible'), 3200)
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const targetId = link.getAttribute('href')
            if (!targetId || targetId === '#') return
            const target = document.querySelector(targetId)
            if (target && !target.classList.contains('login-overlay')) {
                event.preventDefault()
                target.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
        })
    })

    document.querySelectorAll('.auth-toggle-btn').forEach((button) => {
        button.addEventListener('click', () => {
            const targetMode = button.dataset.authMode
            document.querySelectorAll('.auth-toggle-btn').forEach((toggle) => {
                const isActive = toggle === button
                toggle.classList.toggle('active', isActive)
                toggle.setAttribute('aria-selected', String(isActive))
            })

            document.querySelectorAll('.auth-panel').forEach((panel) => {
                const isActive = panel.id === `${targetMode}-panel`
                panel.classList.toggle('active', isActive)
                panel.hidden = !isActive
            })
        })
    })

    document.querySelectorAll('form').forEach((form) => {
        form.addEventListener('submit', (event) => {
            if (form.closest('.login-modal, .login-card')) {
                event.preventDefault()
                showToast('Thanks. We will verify your details shortly.')
            }
        })
    })

    const mobileMenu = document.querySelector('.mobile-menu')
    const mainNav = document.querySelector('.main-nav')
    if (mobileMenu && mainNav) {
        mobileMenu.addEventListener('click', () => {
            mainNav.classList.toggle('menu-open')
        })
    }
})
