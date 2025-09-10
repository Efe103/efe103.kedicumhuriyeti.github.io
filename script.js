document.addEventListener('DOMContentLoaded', () => {
    const authContainer = document.getElementById('auth-container');
    const mainApp = document.getElementById('main-app');
    const loginForm = document.getElementById('login-auth');
    const registerForm = document.getElementById('register-auth');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    const logoutBtn = document.getElementById('logout-btn');
    const profileName = document.getElementById('profile-name');
    const browserInfo = document.getElementById('browser-info');
    const statusInfo = document.getElementById('status-info');
    const adminMenu = document.getElementById('admin-menu');
    const catFormContainer = document.getElementById('cat-form-container');
    const catForm = document.getElementById('cat-form');
    const catList = document.getElementById('cat-list');
    const catOptions = document.getElementById('cat-options');
    const catNameInput = document.getElementById('cat-name');
    const catMotherInput = document.getElementById('cat-mother');
    const catDobInput = document.getElementById('cat-dob');
    const catDescriptionInput = document.getElementById('cat-description');
    const catStatusInput = document.getElementById('cat-status');
    const convertImageBtn = document.getElementById('convert-image-btn');
    const imageUpload = document.getElementById('image-upload');
    const apiResult = document.getElementById('api-result');
    
    // --- Veri Depolama (localStorage) ---
    // Gerçek bir uygulamada bu veriler sunucuda tutulur.
    let users = JSON.parse(localStorage.getItem('users')) || {};
    let cats = JSON.parse(localStorage.getItem('cats')) || [];
    let currentUser = null;

    // --- Admin Bilgileri ---
    const admins = {
        'kc1302': 'efe12345',
        'kciss0383': 'ipek12345'
    };

    // --- Giriş/Kayıt Ekranı Geçişleri ---
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('register-form').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    });

    // --- Giriş Yapma İşlemi ---
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;
        const rememberMe = document.getElementById('remember-me').checked;

        if (users[username] && users[username].password === password) {
            currentUser = username;
            if (rememberMe) {
                localStorage.setItem('currentUser', currentUser);
            }
            localStorage.setItem('isLoggedIn', 'true');
            loadApp(currentUser);
        } else {
            alert('Geçersiz kullanıcı adı veya şifre!');
        }
    });

    // --- Kayıt Olma İşlemi ---
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('register-username').value;
        const password = document.getElementById('register-password').value;

        if (users[username]) {
            alert('Bu kullanıcı adı zaten mevcut!');
        } else {
            users[username] = { password, role: 'user' };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Kayıt başarılı! Giriş yapabilirsiniz.');
            showLoginLink.click();
        }
    });

    // --- Uygulamayı Yükleme ---
    function loadApp(username) {
        authContainer.style.display = 'none';
        mainApp.style.display = 'flex';
        currentUser = username;

        // Admin kontrolü
        const isAdmin = admins[username] && admins[username] === users[username].password;
        if (isAdmin) {
            adminMenu.style.display = 'block';
            users[username].role = 'admin';
        } else {
            adminMenu.style.display = 'none';
            users[username].role = 'user';
        }

        // Profil ve Tarayıcı Bilgilerini Güncelleme
        profileName.textContent = username;
        browserInfo.textContent = navigator.userAgent;
        statusInfo.textContent = 'Çevrimiçi';
        statusInfo.className = 'status online';

        renderCats();
    }

    // --- Çıkış Yapma ---
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('isLoggedIn');
        currentUser = null;
        mainApp.style.display = 'none';
        authContainer.style.display = 'block';
        document.getElementById('login-username').value = '';
        document.getElementById('login-password').value = '';
    });

    // --- Otomatik Giriş Kontrolü ---
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const rememberedUser = localStorage.getItem('currentUser');
    if (isLoggedIn && rememberedUser) {
        if (users[rememberedUser]) {
            loadApp(rememberedUser);
        } else {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('isLoggedIn');
        }
    }

    // --- Kedi Ekleme Formunu Gösterme ---
    catOptions.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            catFormContainer.style.display = 'block';
            catNameInput.value = '';
            catMotherInput.value = '';
            catDobInput.value = '';
            catDescriptionInput.value = '';
            // Gerekirse duruma göre başlangıç değeri ayarla
        }
    });

    document.getElementById('cancel-cat-form').addEventListener('click', () => {
        catFormContainer.style.display = 'none';
    });

    // --- Kedi Kayıt, Düzenleme ve Silme İşlemleri ---
    catForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const catId = document.getElementById('cat-id').value;
        const newCat = {
            id: catId || Date.now(),
            name: catNameInput.value,
            mother: catMotherInput.value,
            dob: catDobInput.value,
            description: catDescriptionInput.value,
            status: catStatusInput.value,
            owner: currentUser,
            createdAt: new Date().toISOString()
        };

        if (catId) {
            const index = cats.findIndex(c => c.id == catId);
            if (index !== -1) {
                cats[index] = newCat;
            }
        } else {
            cats.push(newCat);
        }

        saveCats();
        renderCats();
        catFormContainer.style.display = 'none';
    });

    function saveCats() {
        localStorage.setItem('cats', JSON.stringify(cats));
    }

    function renderCats() {
        // Tarihe göre sıralama
        const sortedCats = cats.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        catList.innerHTML = '';
        sortedCats.forEach(cat => {
            const li = document.createElement('li');
            li.className = 'cat-item';
            const catAge = calculateAge(cat.dob);
            li.innerHTML = `
                <h3>${cat.name} (${cat.status})</h3>
                <p><strong>Annesi:</strong> ${cat.mother || 'Bilinmiyor'}</p>
                <p><strong>Doğum Tarihi:</strong> ${cat.dob} (Yaklaşık Yaşı: ${catAge})</p>
                <p><strong>Açıklama:</strong> ${cat.description || 'Yok'}</p>
                <p><strong>Ekleyen:</strong> ${cat.owner}</p>
                <div class="cat-item-actions">
                    <button onclick="editCat(${cat.id})">Düzenle</button>
                    <button class="delete" onclick="deleteCat(${cat.id})">Sil</button>
                </div>
            `;
            catList.appendChild(li);
        });
    }

    window.editCat = function(id) {
        const catToEdit = cats.find(c => c.id == id);
        if (catToEdit) {
            document.getElementById('cat-id').value = catToEdit.id;
            catNameInput.value = catToEdit.name;
            catMotherInput.value = catToEdit.mother;
            catDobInput.value = catToEdit.dob;
            catDescriptionInput.value = catToEdit.description;
            catStatusInput.value = catToEdit.status;
            catFormContainer.style.display = 'block';
        }
    };

    window.deleteCat = function(id) {
        if (confirm('Bu kediyi silmek istediğinizden emin misiniz?')) {
            cats = cats.filter(c => c.id != id);
            saveCats();
            renderCats();
        }
    };
    
    // --- Yaş Hesaplama Fonksiyonu ---
    function calculateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let ageYears = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            ageYears--;
        }
        return ageYears > 0 ? `${ageYears} yıl` : `Yavru`;
    }

    // --- Resmi Metne Çevirme (Mock API) ---
    // Gerçek bir API entegrasyonu için sunucu tarafı kod gerekir.
    convertImageBtn.addEventListener('click', () => {
        const file = imageUpload.files[0];
        if (!file) {
            alert('Lütfen bir resim seçin.');
            return;
        }

        apiResult.textContent = 'Resim işleniyor...';

        // Mock API çağrısı: 2 saniye sonra sahte bir sonuç döner.
        setTimeout(() => {
            const fakeText = "Bu resimdeki kedi, tüylü ve sevimli görünüyor. Muhtemelen bir yavru kedi.";
            apiResult.textContent = `API Sonucu: ${fakeText}`;
        }, 2000);
    });
});