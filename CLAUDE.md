# CLAUDE.md

Bu dosya, bu depoda çalışan Claude Code için proje kurallarını içerir.

## Proje

Mahmut Hayıroğlu'nun kişisel tanıtım ve hizmet sayfası. Tek sayfalık bir landing page:
ziyaretçiye kim olduğunu, ne yaptığını ve hangi hizmetleri verdiğini anlatır, sonunda
iletişime yönlendirir.

- **İsim:** Mahmut Hayıroğlu
- **İş:** Dijital pazarlama danışmanı
- **Amaç:** Tanıtım + hizmet listesi + iletişim (lead toplama)

## Teknoloji

- HTML, CSS ve vanilla JavaScript. Başka hiçbir şey yok.
- **Harici kütüphane kullanma.** Framework yok, CSS kütüphanesi yok, jQuery yok,
  CDN'den script veya font çekme yok, build aracı yok, npm yok.
- İkonlar inline SVG olarak yazılır. Fontlar sistem font stack'i ile gelir.
- Sayfa `index.html` dosyası tarayıcıda çift tıklanarak açıldığında sorunsuz çalışmalı.

## Dosya yapısı

```
index.html      tek sayfa, tüm bölümler
css/style.css   tüm stiller
js/main.js      tüm etkileşim
assets/         görseller
```

Bu yapıyı koru. Yeni dosya eklemeden önce mevcut dosyalardan biri yeterli mi diye bak.

## Tasarım

- Modern, minimal, koyu tema. Varsayılan ve tek tema koyu.
- Bol boşluk, az eleman, net hiyerarşi. Süs için eklenen hiçbir şey olmasın.
- Renkler CSS değişkeni olarak `:root` içinde tanımlanır, tek yerden yönetilir.
  Renk kodlarını dosyanın içine dağıtma.
- Tipografi ölçekli olsun (başlık, alt başlık, gövde net ayrışsın).
- Animasyonlar sade ve kısa: hover geçişleri, yumuşak scroll, giriş fade'i.
  Dikkat dağıtan efekt yok.
- `prefers-reduced-motion` ayarına saygı göster.

## Responsive

- **Mobile-first.** Önce mobil için yaz, sonra `min-width` media query ile büyüt.
- Kırılma noktaları: 480px, 768px, 1024px.
- Dokunma hedefleri en az 44x44px.
- Yatay kaydırma asla olmasın.

## Dil ve metin

- Sayfadaki tüm metin **Türkçe**. Türkçe karakterler doğru kullanılır (ı, ğ, ü, ş, ö, ç).
- `<html lang="tr">`.
- Metinlerde uzun tire kullanma, kısa tire ( - ) kullan.
- Ton: net, sade, abartısız. "Dünyanın en iyisi" tarzı iddialı pazarlama dili yok.

## Kod standartları

- Semantik HTML: `header`, `nav`, `main`, `section`, `footer`.
- Erişilebilirlik: görsellerde `alt`, formda `label`, klavye ile gezilebilir olmalı,
  odak (focus) görünür kalmalı, kontrast oranı yeterli olmalı.
- CSS'te sınıf isimleri Türkçesiz ve okunur ingilizce (`.hero`, `.services`, `.contact`).
- JavaScript'te `const` / `let`, modern ES6+ sözdizimi. Global değişken kirliliği yok.
- SEO temeli: `title`, `meta description`, Open Graph etiketleri.

## Yapma

- Harici kaynak (CDN, Google Fonts, analytics script'i) ekleme.
- Sahte referans, sahte müşteri yorumu, sahte rakam veya uydurma başarı istatistiği yazma.
  Gerçek içerik yoksa yer tutucu olduğunu belli et.
- İletişim bilgilerini uydurma. Geçerli olanlar aşağıda yazılı, başkasını ekleme.

## Sayfa bölümleri

Sırayla: Hero, Hizmetler, Hakkımda, İletişim, Footer. Yeni bölüm eklemeden önce sor.

- **Hero:** isim, "Dijital Pazarlama Uzmanı" etiketi, tek cümlelik tanıtım,
  "Benimle İletişime Geç" butonu ve arka planda animasyonlu yükseliş çizgisi.
- **Yükseliş çizgisi imza öğedir.** Satış artışını temsil eder, inline SVG olarak
  `index.html` içinde durur, `.growth` sınıfıyla stillenir ve JS `is-live` sınıfını
  ekleyince çizilir. Kaldırma veya kütüphaneyle değiştirme.
- **Hizmetler:** Strateji & Sistem Kurulumu, Reklam Yönetimi, Optimizasyon & Raporlama.
  Her biri ikon + başlık + kısa açıklama.

## Renk ve tipografi

Hepsi `css/style.css` içindeki `:root` bloğunda tanımlı. Yeni renk kodu yazma,
mevcut değişkeni kullan.

| Amaç | Değer |
| --- | --- |
| Arka plan gradyanı | `#000000` → `#707070`, diyagonal (135deg) |
| Ana aksan yeşil | `#7ED957` |
| İkincil yeşil | `#00BF63` |
| Kart zemini | `#101210` |
| Koyu zeminde metin | `#FFFFFF` |
| Açık yeşil zeminde metin | `#062A45` |

- Font: `Arial, "Helvetica Neue", Helvetica, sans-serif`. Başka font yükleme.
- Başlıklar: bold, büyük harf (`text-transform: uppercase`), sola hizalı.
  Büyük harfe çevirme `lang="tr"` sayesinde doğru çalışır, `<html lang="tr">` etiketini bozma.

## Etkileşim kuralları

- Sayfa içi bağlantılarda yumuşak kaydırma (CSS `scroll-behavior`, JS'te yedeği var).
- Kartlar: hover'da hafif yükselme, kenarlık `#00BF63`, solda ince yeşil dikey çubuk.
- CTA butonu: hover'da hafif yukarı kayma ve yeşil gölge.
- Sayfa yüklenirken başlık, ana içerik ve alt bilgi sırayla fade-in olur (`page-in` animasyonu,
  CSS ile çalışır, JS gerektirmez).
- Bölümler scroll'da aşağıdan yukarı fade-in ile gelir (`.reveal` sınıfı + IntersectionObserver).
- Mobilde hamburger menü, 768px altında görünür.
- "Yukarı çık" butonu (`.to-top`) sağ altta, bir ekran boyu kaydırınca belirir.
- Animasyonlar bu kadarla sınırlı. Yenisini eklemeden önce sor.

## Gerçek bilgiler

- E-posta: `iletisim@mahmuthayiroglu.com`
- Instagram: `https://www.instagram.com/mahmuthayiroglu`
- Telif satırı: `© 2026 Mahmut Hayıroğlu. Tüm hakları saklıdır.`
