document.addEventListener('DOMContentLoaded', () => {
    // DOM Elementleri
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const mainApp = document.getElementById('main-app');
    const authContainer = document.getElementById('auth-container');
    const loginAuthForm = document.getElementById('login-auth');
    const registerAuthForm = document.getElementById('register-auth');
    const profileName = document.getElementById('profile-name');
    const profileNickname = document.getElementById('profile-nickname'); // Takma ad elementi
    const logoutBtn = document.getElementById('logout-btn');
    const catFormContainer = document.getElementById('cat-form-container');
    const catForm = document.getElementById('cat-form');
    const catOptions = document.getElementById('cat-options');
    const catList = document.getElementById('cat-list');
    const deleteCatBtn = document.getElementById('delete-cat-btn');

    // Yeni eklenen elementler
    const showHidePasswordBtn = document.getElementById('show-hide-password');
    const showHideRegisterPasswordBtn = document.getElementById('show-hide-register-password');
    const loginPasswordInput = document.getElementById('login-password');
    const registerPasswordInput = document.getElementById('register-password');
    const forgotPasswordLink = document.getElementById('forgot-password');

    // Sohbet elementleri
    const chatMessageInput = document.getElementById('chat-message-input');
    const sendMessageBtn = document.getElementById('send-message-btn');
    const chatMessages = document.getElementById('chat-messages');

    let selectedCatItem = null;
    let currentUser = {};

    // Form görünürlüğünü değiştirme
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.style.display = 'none';
        loginForm.style.display = 'block';
    });

    // Giriş işlemi
    loginAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const nickname = document.getElementById('login-nickname').value;
        
        // Kullanıcı bilgileri
        currentUser = {
            username: username,
            nickname: nickname
        };

        if (username && nickname) {
            authContainer.style.display = 'none';
            mainApp.style.display = 'flex';
            profileName.textContent = currentUser.username;
            profileNickname.textContent = currentUser.nickname;
        }
    });

    // Kayıt işlemi
    registerAuthForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Kayıt başarılı! Lütfen giriş yapın.');
        showLoginLink.click();
    });

    // Çıkış yapma
    logoutBtn.addEventListener('click', () => {
        authContainer.style.display = 'block';
        mainApp.style.display = 'none';
        currentUser = {}; // Kullanıcı bilgilerini sıfırla
    });

    // Kedi formu gösterme/gizleme
    catOptions.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            catFormContainer.style.display = 'block';
        });
    });

    // Kedi formunu kaydetme
    catForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const catName = document.getElementById('cat-name').value;
        const catStatus = document.getElementById('cat-status').value;
        addCatToList(catName, catStatus);
        catFormContainer.style.display = 'none';
        catForm.reset();
    });

    // Kedi listesine ekleme fonksiyonu
    function addCatToList(name, status) {
        const li = document.createElement('li');
        li.textContent = `${name} - Durum: ${status}`;
        catList.appendChild(li);
        
        li.addEventListener('click', () => {
            if (selectedCatItem) {
                selectedCatItem.classList.remove('selected');
            }
            li.classList.add('selected');
            selectedCatItem = li;
            deleteCatBtn.style.display = 'block';
        });
    }

    // Şifreyi göster/gizle butonu
    showHidePasswordBtn.addEventListener('click', () => {
        if (loginPasswordInput.type === 'password') {
            loginPasswordInput.type = 'text';
            showHidePasswordBtn.textContent = 'Gizle';
        } else {
            loginPasswordInput.type = 'password';
            showHidePasswordBtn.textContent = 'Göster';
        }
    });

    // Kayıt formundaki şifreyi göster/gizle butonu
    showHideRegisterPasswordBtn.addEventListener('click', () => {
        if (registerPasswordInput.type === 'password') {
            registerPasswordInput.type = 'text';
            showHideRegisterPasswordBtn.textContent = 'Gizle';
        } else {
            registerPasswordInput.type = 'password';
            showHideRegisterPasswordBtn.textContent = 'Göster';
        }
    });

    // "Şifremi Unuttum" bağlantısı
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Şifre sıfırlama talimatları e-posta adresinize gönderildi. (Simülasyon)');
    });

    // Kedi silme butonu
    deleteCatBtn.addEventListener('click', () => {
        if (selectedCatItem) {
            if (confirm(`"${selectedCatItem.textContent}" adlı kediyi silmek istediğinizden emin misiniz?`)) {
                selectedCatItem.remove();
                selectedCatItem = null;
                deleteCatBtn.style.display = 'none';
            }
        } else {
            alert('Lütfen silmek için bir kedi seçin.');
        }
    });

    // --- SOHBET İŞLEVİ ---
    sendMessageBtn.addEventListener('click', () => {
        const message = chatMessageInput.value.trim();
        if (message !== '') {
            const nickname = currentUser.nickname || currentUser.username;
            addChatMessage(nickname, message);
            chatMessageInput.value = '';
        }
    });

    // Mesaj ekleme fonksiyonu
    function addChatMessage(nickname, text, isOwnMessage = true) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message');
        
        // Mesajı gönderenin siz olduğunu belirtmek için
        if (isOwnMessage) {
            messageDiv.classList.add('own-message');
        }

        const nicknameSpan = document.createElement('span');
        nicknameSpan.classList.add('chat-nickname');
        nicknameSpan.textContent = nickname + ':';

        const textSpan = document.createElement('span');
        textSpan.classList.add('chat-text');
        textSpan.textContent = text;

        messageDiv.appendChild(nicknameSpan);
        messageDiv.appendChild(textSpan);
        chatMessages.appendChild(messageDiv);

        // Sohbet alanının en alta kaymasını sağla
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Örnek mesajlar ekle (sayfa yenilendiğinde silinir)
    addChatMessage('AnonimKedi', 'Merhaba, Kedi Yönetim Sistemi Sohbetine hoş geldiniz!', false);
    addChatMessage('Pati Dostu', 'Nasılsınız? Yeni bir kedi eklediniz mi?', false);

});