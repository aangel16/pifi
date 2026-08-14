// ===== NAVEGACIÓN =====
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// ===== ANALIZADOR DE CONTRASEÑAS =====
const passwordInput = document.getElementById('passwordInput');
if (passwordInput) {
    passwordInput.addEventListener('input', analyzePassword);
}

function analyzePassword() {
    const password = passwordInput.value;
    const fill = document.getElementById('strength-fill');
    const text = document.getElementById('strength-text');
    const tips = document.getElementById('password-tips');
    
    if (!password) {
        fill.className = '';
        fill.style.width = '0%';
        text.textContent = 'Fortaleza: --';
        tips.innerHTML = '';
        return;
    }
    
    let score = 0;
    const checks = {
        length: password.length >= 12,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        symbols: /[^A-Za-z0-9]/.test(password),
        common: !isCommonPassword(password)
    };
    
    score = Object.values(checks).filter(Boolean).length;
    
    // Clasificación
    fill.className = '';
    text.className = '';
    
    if (score <= 2) {
        fill.classList.add('weak');
        text.classList.add('weak');
        text.textContent = 'Fortaleza: DÉBIL';
    } else if (score <= 4) {
        fill.classList.add('medium');
        text.classList.add('medium');
        text.textContent = 'Fortaleza: MEDIA';
    } else {
        fill.classList.add('strong');
        text.classList.add('strong');
        text.textContent = 'Fortaleza: FUERTE';
    }
    
    // Tips
    const tipList = [];
    if (!checks.length) tipList.push('Usa al menos 12 caracteres');
    if (!checks.uppercase) tipList.push('Incluye mayúsculas (A-Z)');
    if (!checks.lowercase) tipList.push('Incluye minúsculas (a-z)');
    if (!checks.numbers) tipList.push('Incluye números (0-9)');
    if (!checks.symbols) tipList.push('Incluye símbolos (!@#$%)');
    if (!checks.common) tipList.push('Evita contraseñas comunes');
    
    tips.innerHTML = tipList.map(tip => `<li>${tip}</li>`).join('');
}

function isCommonPassword(pwd) {
    const common = ['123456', 'password', 'qwerty', 'admin', '12345678', 'welcome', 'monkey'];
    return common.some(c => pwd.toLowerCase().includes(c));
}

// ===== GENERADOR DE CONTRASEÑAS =====
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');

if (lengthSlider) {
    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });
}

function generatePassword() {
    const length = parseInt(lengthSlider.value);
    const useUpper = document.getElementById('useUpper').checked;
    const useLower = document.getElementById('useLower').checked;
    const useNumbers = document.getElementById('useNumbers').checked;
    const useSymbols = document.getElementById('useSymbols').checked;
    
    let chars = '';
    if (useLower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (useUpper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (useNumbers) chars += '0123456789';
    if (useSymbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!chars) {
        alert('Selecciona al menos un tipo de carácter');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    document.getElementById('generatedPassword').value = password;
}

function copyToClipboard(elementId) {
    const el = document.getElementById(elementId);
    el.select();
    el.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(el.value).then(() => {
        const btn = event.target;
        const original = btn.textContent;
        btn.textContent = '✓';
        setTimeout(() => btn.textContent = original, 1000);
    });
}

// ===== ANÁLISIS DE DICCIONARIO =====
function analyzeDictionary() {
    const input = document.getElementById('dictionaryInput').value;
    const passwords = input.split('\n').filter(p => p.trim());
    
    if (passwords.length === 0) {
        alert('Ingresa al menos una contraseña');
        return;
    }
    
    let weak = 0, medium = 0, strong = 0;
    const patterns = {};
    
    passwords.forEach(pwd => {
        const score = calculateScore(pwd.trim());
        if (score <= 2) weak++;
        else if (score <= 4) medium++;
        else strong++;
        
        // Detectar patrones
        if (/^[0-9]+$/.test(pwd)) patterns['Solo números'] = (patterns['Solo números'] || 0) + 1;
        if (/^[a-zA-Z]+$/.test(pwd)) patterns['Solo letras'] = (patterns['Solo letras'] || 0) + 1;
        if (pwd.length < 8) patterns['Menos de 8 caracteres'] = (patterns['Menos de 8 caracteres'] || 0) + 1;
        if (/(.)\1{2,}/.test(pwd)) patterns['Caracteres repetidos'] = (patterns['Caracteres repetidos'] || 0) + 1;
    });
    
    document.getElementById('total-passwords').textContent = passwords.length;
    document.getElementById('weak-passwords').textContent = weak;
    document.getElementById('medium-passwords').textContent = medium;
    document.getElementById('strong-passwords').textContent = strong;
    
    // Mostrar patrones
    let patternsHtml = '<h4>Patrones detectados:</h4><ul>';
    for (const [pattern, count] of Object.entries(patterns)) {
        patternsHtml += `<li>${pattern}: ${count}</li>`;
    }
    patternsHtml += '</ul>';
    document.getElementById('common-patterns').innerHTML = patternsHtml;
    
    document.getElementById('dictionary-results').classList.remove('hidden');
}

function calculateScore(pwd) {
    let score = 0;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    if (!isCommonPassword(pwd)) score++;
    return score;
}

// ===== CHECKLIST =====
document.querySelectorAll('.checklist input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', updateProgress);
});

function updateProgress() {
    const total = document.querySelectorAll('.checklist input[type="checkbox"]').length;
    const checked = document.querySelectorAll('.checklist input[type="checkbox"]:checked').length;
    const percentage = (checked / total) * 100;
    
    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('progress-text').textContent = `${checked}/${total} completado`;
}

// Cargar diccionario por defecto (opcional)
fetch('password_list.txt')
    .then(r => r.text())
    .then(text => {
        const dictInput = document.getElementById('dictionaryInput');
        if (dictInput && !dictInput.value) {
            dictInput.placeholder = 'Diccionario cargado. Pega aquí o usa el texto por defecto...';
        }
    })
    .catch(() => {});