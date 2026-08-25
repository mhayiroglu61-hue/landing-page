# İletişim formu şablonu (henüz siteye eklenmedi)

Bu dosya bir referanstır, `index.html` içinde kullanılmıyor. Form eklemeye karar
verildiğinde buradaki parçalar kopyalanacak.

Üç katmanlı spam koruması içerir. Hiçbiri tek başına yeterli değildir, birlikte
çalışırlar. Hiçbiri CAPTCHA gerektirmez, yani ziyaretçi ek bir iş yapmaz.

1. **Honeypot** - insanın göremediği bir alan. Botlar formdaki her alanı doldurma
   eğilimindedir, bu alan doluysa gönderim bottur.
2. **Zaman eşiği** - form açıldıktan 3 saniyeden kısa sürede gönderildiyse bottur.
   İnsan bir formu üç saniyede dolduramaz.
3. **Sunucu tarafı doğrulama** - istemci tarafı her zaman atlatılabilir, asıl
   karar sunucuda verilir.

---

## 1. HTML

Netlify Forms kullanıldığı varsayılmıştır. Sunucu kodu yazmadan form almanın
en pratik yolu bu ve `data-netlify-honeypot` desteği hazır geliyor.

```html
<form
  class="contact-form"
  id="contactForm"
  name="iletisim"
  method="POST"
  data-netlify="true"
  data-netlify-honeypot="website-url"
  novalidate>

  <!-- Netlify'ın formu tanıması için gerekli gizli alan -->
  <input type="hidden" name="form-name" value="iletisim">

  <!-- HONEYPOT: insan görmez, bot doldurur.
       Ekran okuyucudan da gizli, klavye ile de ulaşılamaz. -->
  <div class="hp-field" aria-hidden="true">
    <label for="website-url">Bu alanı boş bırakın</label>
    <input
      type="text"
      id="website-url"
      name="website-url"
      tabindex="-1"
      autocomplete="off">
  </div>

  <!-- ZAMAN EŞİĞİ: form yüklenince JS dolduracak -->
  <input type="hidden" name="form-start" id="formStart" value="">

  <div class="field">
    <label for="name">Ad soyad</label>
    <input type="text" id="name" name="name" autocomplete="name"
           maxlength="80" required>
    <p class="error" id="nameError" role="alert"></p>
  </div>

  <div class="field">
    <label for="email">E-posta</label>
    <input type="email" id="email" name="email" autocomplete="email"
           maxlength="120" required>
    <p class="error" id="emailError" role="alert"></p>
  </div>

  <div class="field">
    <label for="message">Mesajınız</label>
    <textarea id="message" name="message" rows="5"
              maxlength="2000" required></textarea>
    <p class="error" id="messageError" role="alert"></p>
  </div>

  <button class="btn btn-primary btn-block" type="submit">Mesajı gönder</button>
  <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
</form>
```

### Honeypot alanının adı neden `website-url`

Botlar `honeypot`, `bot-field`, `trap` gibi isimleri tanıyıp atlayabiliyor.
Gerçek bir alan gibi görünen bir isim (`website-url`, `company-fax`) daha çok
bot yakalar. İsmi değiştirirsen `data-netlify-honeypot` değerini de değiştir.

---

## 2. CSS

Honeypot'u gizlemenin doğru yolu. `display: none` kullanma: bazı botlar bunu
fark edip alanı atlıyor. Aşağıdaki yöntem görsel olarak gizler ama DOM'da
normal bir alan gibi durur.

```css
.hp-field {
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}
```

---

## 3. JavaScript

```js
/* ---------- İletişim formu: spam koruması + doğrulama ---------- */
var form = document.getElementById("contactForm");

if (form) {
  var startedAt = Date.now();
  var startField = document.getElementById("formStart");
  if (startField) startField.value = String(startedAt);

  var MIN_SECONDS = 3;

  form.addEventListener("submit", function (event) {
    // 1. Honeypot dolu mu
    var hp = form.querySelector('[name="website-url"]');
    if (hp && hp.value.trim() !== "") {
      event.preventDefault();
      return; // Sessizce yut. Bota hata gösterme, davranışını öğrenmesin.
    }

    // 2. Çok hızlı gönderildi mi
    if ((Date.now() - startedAt) / 1000 < MIN_SECONDS) {
      event.preventDefault();
      setStatus("Formu biraz daha yavaş doldurur musunuz?", "is-error");
      return;
    }

    // 3. Alan doğrulaması buraya
    // ...
  });
}
```

**Önemli:** honeypot yakalandığında kullanıcıya hata gösterme. "Bot algılandı"
gibi bir mesaj, saldırganın hangi alanın tuzak olduğunu anlamasını sağlar.
Sessizce reddet.

---

## 4. netlify.toml değişikliği (ŞART)

Sitedeki CSP şu an formları tamamen engelliyor. Form eklenirse bu satır
güncellenmezse form **çalışmaz**:

```
form-action 'none';     ->    form-action 'self';
```

Form JavaScript ile (fetch/XHR) gönderilecekse şu da gerekir:

```
connect-src 'none';     ->    connect-src 'self';
```

Netlify Forms'un varsayılan (JS'siz) gönderimi normal bir POST olduğu için
sadece `form-action 'self'` yeterlidir.

---

## 5. Sunucu tarafı: Netlify ayarları

Netlify panelinde **Forms** bölümünden:

- **Spam filtering**: Akismet varsayılan olarak açık, açık bırak.
- **reCAPTCHA**: spam yoğunlaşırsa `data-netlify-recaptcha="true"` ile
  eklenebilir. Ziyaretçiye yük bindirdiği için son çare olarak düşün.
- **Form notifications**: gelen mesajın e-posta olarak iletileceği adresi tanımla.

Ücretsiz planda aylık 100 form gönderimi hakkı var, bu site için fazlasıyla yeterli.

---

## 6. Kontrol listesi

Form yayına alınmadan önce:

- [ ] `form-action 'self'` netlify.toml içinde güncellendi
- [ ] Honeypot alanı görsel olarak gizli, `tabindex="-1"` ve `aria-hidden="true"` var
- [ ] Honeypot yakalandığında kullanıcıya hata gösterilmiyor
- [ ] Tüm alanlarda `maxlength` var (aşırı büyük gönderim engeli)
- [ ] Netlify Forms bildirimleri doğru e-posta adresine gidiyor
- [ ] Akismet spam filtresi açık
- [ ] Gerçek bir tarayıcıdan test gönderimi yapıldı ve mesaj ulaştı
