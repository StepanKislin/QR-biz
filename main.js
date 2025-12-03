// Элементы
const urlInput = document.getElementById('url-input');
const ssidInput = document.getElementById('ssid-input');
const wifiPassInput = document.getElementById('wifi-pass-input');
const wifiEncSelect = document.getElementById('wifi-enc');
const phoneInput = document.getElementById('phone-input');
const emailInput = document.getElementById('email-input');

const genUrlBtn = document.getElementById('gen-url');
const genWifiBtn = document.getElementById('gen-wifi');
const genPhoneBtn = document.getElementById('gen-phone');
const genEmailBtn = document.getElementById('gen-email');
const printBtn = document.getElementById('print-btn');

const printArea = document.getElementById('print-area');
const printInfo = document.getElementById('print-info');
const qrOutput = document.getElementById('qr-output');

// Генерация QR-содержимого
function getQRContent(type, data) {
  switch (type) {
    case 'url':
      if (!data.url) throw new Error('URL не указан');
      try {
        return new URL(data.url).toString();
      } catch {
        throw new Error('Некорректный URL');
      }

    case 'wifi':
      const { ssid, password, enc } = data;
      if (!ssid) throw new Error('SSID не указан');
      return `WIFI:S:${ssid};T:${enc};P:${password};;`;

    case 'phone':
      if (!data.phone) throw new Error('Номер телефона не указан');
      // Удаляем всё, кроме цифр и +
      const cleanPhone = data.phone.replace(/[^\d+]/g, '');
      if (!/^\+?\d{7,15}$/.test(cleanPhone)) {
        throw new Error('Некорректный номер телефона');
      }
      return `tel:${cleanPhone}`;

    case 'email':
      if (!data.email) throw new Error('Email не указан');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        throw new Error('Некорректный email');
      }
      return `mailto:${data.email}`;

    default:
      throw new Error('Неизвестный тип QR');
  }
}

// Очистка и отрисовка QR
function renderQR(content, infoText) {
  qrOutput.innerHTML = ''; // ✅ Убираем старый QR
  const qr = qrcode(0, 'M');
  qr.addData(content);
  qr.make();
  qrOutput.innerHTML = qr.createImgTag(6, 12);
  printInfo.innerHTML = infoText;
  printArea.classList.remove('hidden');
}

// Обработчики
genUrlBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (!url) {
    alert('Введите URL');
    return;
  }
  try {
    const content = getQRContent('url', { url });
    renderQR(content, `Сайт: <strong>${url}</strong>`);
  } catch (e) {
    alert('Ошибка: ' + e.message);
  }
});

genWifiBtn.addEventListener('click', () => {
  const ssid = ssidInput.value.trim();
  const password = wifiPassInput.value;
  const enc = wifiEncSelect.value;
  if (!ssid) {
    alert('Введите название Wi-Fi сети');
    return;
  }
  try {
    const content = getQRContent('wifi', { ssid, password, enc });
    const pass = password || '—';
    renderQR(content, `Точка доступа: <strong>${ssid}</strong><br>Пароль: <strong>${pass}</strong>`);
  } catch (e) {
    alert('Ошибка: ' + e.message);
  }
});

genPhoneBtn.addEventListener('click', () => {
  const phone = phoneInput.value.trim();
  if (!phone) {
    alert('Введите номер телефона');
    return;
  }
  try {
    const content = getQRContent('phone', { phone });
    renderQR(content, `Телефон: <strong>${phone}</strong>`);
  } catch (e) {
    alert('Ошибка: ' + e.message);
  }
});

genEmailBtn.addEventListener('click', () => {
  const email = emailInput.value.trim();
  if (!email) {
    alert('Введите email');
    return;
  }
  try {
    const content = getQRContent('email', { email });
    renderQR(content, `Email: <strong>${email}</strong>`);
  } catch (e) {
    alert('Ошибка: ' + e.message);
  }
});

// Печать
printBtn.addEventListener('click', () => {
  if (printArea.classList.contains('hidden')) {
    alert('Сначала сгенерируйте QR-код!');
    return;
  }
  window.print();
});