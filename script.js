/* Spektrum Control Portal — vanilla JS.
   Responsibilities: theme toggle + 12-locale i18n switch.
   localStorage persists both. No build step. */

(function () {
  'use strict'

  /* ─── Locale metadata (12 locales — matches app/language-selector.tsx) ─── */
  const LOCALE_OPTIONS = [
    { code: 'sr-Latn', label: 'Srpski (Latinica)', short: 'SR · Latn', flag: '🇷🇸', htmlLang: 'sr-Latn' },
    { code: 'sr-Cyrl', label: 'Српски (Ћирилица)', short: 'СР · Ћир',  flag: '🇷🇸', htmlLang: 'sr-Cyrl' },
    { code: 'en',      label: 'English',           short: 'EN',         flag: '🇬🇧', htmlLang: 'en'      },
    { code: 'ro',      label: 'Română',            short: 'RO',         flag: '🇷🇴', htmlLang: 'ro'      },
    { code: 'mk',      label: 'Македонски',        short: 'МК',         flag: '🇲🇰', htmlLang: 'mk'      },
    { code: 'bg',      label: 'Български',         short: 'БГ',         flag: '🇧🇬', htmlLang: 'bg'      },
    { code: 'sl',      label: 'Slovenščina',       short: 'SL',         flag: '🇸🇮', htmlLang: 'sl'      },
    { code: 'hu',      label: 'Magyar',            short: 'HU',         flag: '🇭🇺', htmlLang: 'hu'      },
    { code: 'hr',      label: 'Hrvatski',          short: 'HR',         flag: '🇭🇷', htmlLang: 'hr',      beta: true },
    { code: 'bs-Latn', label: 'Bosanski (Latinica)', short: 'BS · Latn', flag: '🇧🇦', htmlLang: 'bs-Latn', beta: true },
    { code: 'bs-Cyrl', label: 'Босански (Ћирилица)', short: 'БС · Ћир',  flag: '🇧🇦', htmlLang: 'bs-Cyrl', beta: true },
    { code: 'cnr',     label: 'Crnogorski',        short: 'CNR',        flag: '🇲🇪', htmlLang: 'cnr',     beta: true },
  ]
  const SUPPORTED = LOCALE_OPTIONS.map(o => o.code)
  const DEFAULT_LOCALE = 'sr-Latn'

  /* ─── i18n catalog (12 locales) ────────────────────────────── */
  const CATALOG = {
    'sr-Latn': {
      pageTitle: 'Spektrum Control — Platforma za upravljanje protivpožarnim kontrolama',
      description: 'Spektrum Control je platforma za upravljanje protivpožarnim kontrolama, periodičnim ispravama i radnim nalozima.',
      pitch: 'Platforma za upravljanje protivpožarnim kontrolama',
      heroSub: 'Periodične isprave, radni nalozi, sertifikati i terenske kontrole — sve u jednoj platformi za firme koje pružaju usluge zaštite od požara.',
      openAdmin: 'Admin dashboard',
      openMobile: 'Mobilna aplikacija',
      featuresHeading: 'Šta dobijate',
      feature1Title: 'Periodične kontrole',
      feature1Body: 'Planiranje, izvođenje i evidencija svih periodičnih kontrola PP aparata, hidranata, panik rasvete, gas-detekcije i ostalih sistema zaštite od požara.',
      feature2Title: 'Dokumenti i radni nalozi',
      feature2Body: 'Periodične isprave, radni nalozi i sertifikati generišu se iz vaših šablona — PDF spreman za potpis i predaju klijentu u par klikova.',
      feature3Title: 'Terenska aplikacija',
      feature3Body: 'Mobilna aplikacija za kontrolore i servisere — skeniranje barkodova, popunjavanje na licu mesta, foto-evidencija i potpis. Radi i bez interneta.',
      feature4Title: 'Više firmi, jedna platforma',
      feature4Body: 'Referent, kontrole, serviseri — svaka uloga ima svoj pristup. Partnerstva među firmama, deljenje klijenata i radnih naloga preko granica organizacija.',
      feature5Title: '12 jezika',
      feature5Body: 'Srpski (latinica + ćirilica), engleski, rumunski, makedonski, bugarski, slovenački, mađarski, hrvatski, bosanski (latinica + ćirilica), crnogorski.',
      feature6Title: 'Šifrovano i sigurno',
      feature6Body: 'Row-level security na svakoj tabeli, šifrovanje u tranzitu i u mirovanju. Vaši podaci ostaju vaši — izvoz baze podataka u jednom kliku.',
      trustLine: 'Razvijen za potrebe firmi koje pružaju usluge zaštite od požara, baziran na praksi i propisima koji važe u regionu.',
      terms: 'Uslovi korišćenja',
      privacy: 'Politika privatnosti',
      cookies: 'Kolačići',
      impressum: 'Impresum',
      ownerLine: 'Vlasnik · MBS Spektrum d.o.o.',
      footerLocation: 'Sremska Mitrovica, 1992',
      themeToggleAria: 'Promeni temu',
      localeToggleAria: 'Promeni jezik',
      betaBadge: 'BETA',
    },
    'sr-Cyrl': {
      pageTitle: 'Спектрум Контрол — Платформа за управљање противпожарним контролама',
      description: 'Спектрум Контрол је платформа за управљање противпожарним контролама, периодичним исправама и радним налозима.',
      pitch: 'Платформа за управљање противпожарним контролама',
      heroSub: 'Периодичне исправе, радни налози, сертификати и теренске контроле — све у једној платформи за фирме које пружају услуге заштите од пожара.',
      openAdmin: 'Админ панел',
      openMobile: 'Мобилна апликација',
      featuresHeading: 'Шта добијате',
      feature1Title: 'Периодичне контроле',
      feature1Body: 'Планирање, извођење и евиденција свих периодичних контрола ПП апарата, хидраната, паник расвете, гас-детекције и осталих система заштите од пожара.',
      feature2Title: 'Документи и радни налози',
      feature2Body: 'Периодичне исправе, радни налози и сертификати генеришу се из ваших шаблона — ПДФ спреман за потпис и предају клијенту у пар кликова.',
      feature3Title: 'Теренска апликација',
      feature3Body: 'Мобилна апликација за контролоре и сервисере — скенирање баркодова, попуњавање на лицу места, фото-евиденција и потпис. Ради и без интернета.',
      feature4Title: 'Више фирми, једна платформа',
      feature4Body: 'Референт, контроле, сервисери — свака улога има свој приступ. Партнерства међу фирмама, дељење клијената и радних налога преко граница организација.',
      feature5Title: '12 језика',
      feature5Body: 'Српски (латиница + ћирилица), енглески, румунски, македонски, бугарски, словеначки, мађарски, хрватски, босански (латиница + ћирилица), црногорски.',
      feature6Title: 'Шифровано и сигурно',
      feature6Body: 'Row-level security на свакој табели, шифровање у транзиту и у мировању. Ваши подаци остају ваши — извоз базе података у једном клику.',
      trustLine: 'Развијен за потребе фирми које пружају услуге заштите од пожара, базиран на пракси и прописима који важе у региону.',
      terms: 'Услови коришћења',
      privacy: 'Политика приватности',
      cookies: 'Колачићи',
      impressum: 'Импресум',
      ownerLine: 'Власник · МБС Спектрум д.о.о.',
      footerLocation: 'Сремска Митровица, 1992',
      themeToggleAria: 'Промени тему',
      localeToggleAria: 'Промени језик',
      betaBadge: 'БЕТА',
    },
    'en': {
      pageTitle: 'Spektrum Control — Fire-protection inspection platform',
      description: 'Spektrum Control is a platform for managing fire-protection inspections, periodic certificates, and work orders.',
      pitch: 'Fire-protection inspection management platform',
      heroSub: 'Periodic certificates, work orders, certifications, and field inspections — all in one platform for fire-protection service companies.',
      openAdmin: 'Admin dashboard',
      openMobile: 'Mobile app',
      featuresHeading: 'What you get',
      feature1Title: 'Periodic inspections',
      feature1Body: 'Plan, execute and record every periodic inspection of fire extinguishers, hydrants, emergency lighting, gas detection and other fire-protection systems.',
      feature2Title: 'Documents and work orders',
      feature2Body: 'Periodic certificates, work orders, and certifications are generated from your templates — PDF ready to sign and hand to the client in a few clicks.',
      feature3Title: 'Field application',
      feature3Body: 'Mobile app for inspectors and service technicians — barcode scanning, on-site form filling, photo evidence and signature capture. Works offline.',
      feature4Title: 'Multiple companies, one platform',
      feature4Body: 'Manager, inspector, service technician — each role has its own access. Cross-company partnerships, shared clients and work orders across organisation boundaries.',
      feature5Title: '12 languages',
      feature5Body: 'Serbian (Latin + Cyrillic), English, Romanian, Macedonian, Bulgarian, Slovenian, Hungarian, Croatian, Bosnian (Latin + Cyrillic), Montenegrin.',
      feature6Title: 'Encrypted and secure',
      feature6Body: 'Row-level security on every table, encryption in transit and at rest. Your data stays yours — one-click database export.',
      trustLine: 'Built for fire-protection service companies, grounded in regional regulatory practice.',
      terms: 'Terms of Use',
      privacy: 'Privacy Policy',
      cookies: 'Cookies',
      impressum: 'Imprint',
      ownerLine: 'Owner · MBS Spektrum d.o.o.',
      footerLocation: 'Sremska Mitrovica, 1992',
      themeToggleAria: 'Toggle theme',
      localeToggleAria: 'Change language',
      betaBadge: 'BETA',
    },
    'ro': {
      pageTitle: 'Spektrum Control — Platformă pentru gestionarea controalelor PSI',
      description: 'Spektrum Control este o platformă pentru gestionarea controalelor PSI, certificatelor periodice și a ordinelor de lucru.',
      pitch: 'Platformă pentru gestionarea controalelor PSI',
      heroSub: 'Certificate periodice, ordine de lucru, certificări și controale pe teren — totul într-o singură platformă pentru companiile de servicii PSI.',
      openAdmin: 'Panou administrator',
      openMobile: 'Aplicație mobilă',
      featuresHeading: 'Ce obțineți',
      feature1Title: 'Controale periodice',
      feature1Body: 'Planificarea, executarea și evidența tuturor controalelor periodice ale stingătoarelor, hidranților, iluminatului de urgență, detecției de gaz și a celorlalte sisteme PSI.',
      feature2Title: 'Documente și ordine de lucru',
      feature2Body: 'Certificatele periodice, ordinele de lucru și certificările se generează din șabloanele dvs. — PDF gata de semnat și de predat clientului în câteva clicuri.',
      feature3Title: 'Aplicație de teren',
      feature3Body: 'Aplicație mobilă pentru inspectori și tehnicieni — scanare coduri de bare, completare la fața locului, dovezi foto și semnătură. Funcționează și offline.',
      feature4Title: 'Mai multe firme, o singură platformă',
      feature4Body: 'Referent, inspector, tehnician — fiecare rol cu propriul acces. Parteneriate între firme, clienți și ordine de lucru partajate peste organizații.',
      feature5Title: '12 limbi',
      feature5Body: 'Sârbă (latină + chirilică), engleză, română, macedoneană, bulgară, slovenă, maghiară, croată, bosniacă (latină + chirilică), muntenegreană.',
      feature6Title: 'Criptat și sigur',
      feature6Body: 'Securitate la nivel de rând pe fiecare tabel, criptare în tranzit și în repaus. Datele rămân ale dvs. — export baza de date cu un singur clic.',
      trustLine: 'Dezvoltat pentru companiile de servicii PSI, bazat pe practica și reglementările din regiune.',
      terms: 'Termeni de utilizare',
      privacy: 'Politică de confidențialitate',
      cookies: 'Cookie-uri',
      impressum: 'Date de identificare',
      ownerLine: 'Proprietar · MBS Spektrum d.o.o.',
      footerLocation: 'Sremska Mitrovica, 1992',
      themeToggleAria: 'Comutare temă',
      localeToggleAria: 'Schimbare limbă',
      betaBadge: 'BETA',
    },
    'mk': {
      pageTitle: 'Спектрум Контрол — Платформа за управување со противпожарни контроли',
      description: 'Спектрум Контрол е платформа за управување со противпожарни контроли, периодични исправи и работни налози.',
      pitch: 'Платформа за управување со противпожарни контроли',
      heroSub: 'Периодични исправи, работни налози, сертификати и теренски контроли — сè во една платформа за фирми што нудат услуги за заштита од пожар.',
      openAdmin: 'Админ панел',
      openMobile: 'Мобилна апликација',
      featuresHeading: 'Што добивате',
      feature1Title: 'Периодични контроли',
      feature1Body: 'Планирање, изведување и евиденција на сите периодични контроли на ПП апарати, хидранти, паник осветлување, гас-детекција и други системи за заштита од пожар.',
      feature2Title: 'Документи и работни налози',
      feature2Body: 'Периодичните исправи, работните налози и сертификатите се генерираат од вашите шаблони — PDF подготвен за потпис и предавање на клиентот.',
      feature3Title: 'Теренска апликација',
      feature3Body: 'Мобилна апликација за контролори и сервисери — скенирање баркодови, пополнување на лице место, фото-евиденција и потпис. Работи и без интернет.',
      feature4Title: 'Повеќе фирми, една платформа',
      feature4Body: 'Референт, контроли, сервисери — секоја улога има свој пристап. Партнерства меѓу фирмите, споделување клиенти и работни налози преку границите.',
      feature5Title: '12 јазици',
      feature5Body: 'Српски (латиница + кирилица), англиски, романски, македонски, бугарски, словенечки, унгарски, хрватски, босански (латиница + кирилица), црногорски.',
      feature6Title: 'Шифрирано и безбедно',
      feature6Body: 'Row-level security на секоја табела, шифрирање во транзит и во мирување. Вашите податоци остануваат ваши — извоз на базата со еден клик.',
      trustLine: 'Развиен за фирми што нудат услуги за заштита од пожар, базиран на пракса и прописи во регионот.',
      terms: 'Услови за користење',
      privacy: 'Политика на приватност',
      cookies: 'Колачиња',
      impressum: 'Импресум',
      ownerLine: 'Сопственик · MBS Спектрум д.о.о.',
      footerLocation: 'Сремска Митровица, 1992',
      themeToggleAria: 'Промени тема',
      localeToggleAria: 'Промени јазик',
      betaBadge: 'БЕТА',
    },
    'bg': {
      pageTitle: 'Спектрум Контрол — Платформа за управление на противопожарни проверки',
      description: 'Спектрум Контрол е платформа за управление на противопожарни проверки, периодични удостоверения и работни заявки.',
      pitch: 'Платформа за управление на противопожарни проверки',
      heroSub: 'Периодични удостоверения, работни заявки, сертификати и теренни проверки — всичко в една платформа за фирми, които предоставят пожарозащитни услуги.',
      openAdmin: 'Админ панел',
      openMobile: 'Мобилно приложение',
      featuresHeading: 'Какво получавате',
      feature1Title: 'Периодични проверки',
      feature1Body: 'Планиране, извършване и регистрация на всички периодични проверки на пожарогасители, хидранти, аварийно осветление, газ-детекция и други системи.',
      feature2Title: 'Документи и работни заявки',
      feature2Body: 'Периодичните удостоверения, работни заявки и сертификати се генерират от вашите шаблони — PDF, готов за подпис и предаване на клиента.',
      feature3Title: 'Полево приложение',
      feature3Body: 'Мобилно приложение за инспектори и сервизи — сканиране на баркодове, попълване на място, фото-доказателства и подпис. Работи офлайн.',
      feature4Title: 'Множество фирми, една платформа',
      feature4Body: 'Референт, инспектори, сервизи — всяка роля има свой достъп. Партньорства между фирми, споделени клиенти и заявки през организационните граници.',
      feature5Title: '12 езика',
      feature5Body: 'Сръбски (латиница + кирилица), английски, румънски, македонски, български, словенски, унгарски, хърватски, босненски (латиница + кирилица), черногорски.',
      feature6Title: 'Криптирано и сигурно',
      feature6Body: 'Row-level security на всяка таблица, криптиране в трафик и в покой. Вашите данни остават ваши — експорт на базата с един клик.',
      trustLine: 'Разработена за фирми, които предоставят пожарозащитни услуги, базирана на регионалната практика и регулации.',
      terms: 'Условия за ползване',
      privacy: 'Политика за поверителност',
      cookies: 'Бисквитки',
      impressum: 'Импресум',
      ownerLine: 'Собственик · MBS Spektrum d.o.o.',
      footerLocation: 'Сремска Митровица, 1992',
      themeToggleAria: 'Смяна на темата',
      localeToggleAria: 'Смяна на езика',
      betaBadge: 'БЕТА',
    },
    'sl': {
      pageTitle: 'Spektrum Control — Platforma za upravljanje protipožarnih pregledov',
      description: 'Spektrum Control je platforma za upravljanje protipožarnih pregledov, periodičnih potrdil in delovnih nalogov.',
      pitch: 'Platforma za upravljanje protipožarnih pregledov',
      heroSub: 'Periodična potrdila, delovni nalogi, certifikati in terenski pregledi — vse v eni platformi za podjetja, ki nudijo storitve protipožarne zaščite.',
      openAdmin: 'Skrbniška plošča',
      openMobile: 'Mobilna aplikacija',
      featuresHeading: 'Kaj dobite',
      feature1Title: 'Periodični pregledi',
      feature1Body: 'Načrtovanje, izvedba in evidenca vseh periodičnih pregledov gasilnikov, hidrantov, zasilne razsvetljave, detekcije plina in drugih protipožarnih sistemov.',
      feature2Title: 'Dokumenti in delovni nalogi',
      feature2Body: 'Periodična potrdila, delovni nalogi in certifikati se generirajo iz vaših predlog — PDF pripravljen za podpis in predajo stranki.',
      feature3Title: 'Terenska aplikacija',
      feature3Body: 'Mobilna aplikacija za nadzornike in serviserje — branje črtnih kod, izpolnjevanje na kraju, fotografska evidenca in podpis. Deluje brez interneta.',
      feature4Title: 'Več podjetij, ena platforma',
      feature4Body: 'Referent, nadzorniki, serviserji — vsaka vloga ima svoj dostop. Partnerstva med podjetji, deljene stranke in delovni nalogi preko meja organizacij.',
      feature5Title: '12 jezikov',
      feature5Body: 'Srbščina (latinica + cirilica), angleščina, romunščina, makedonščina, bolgarščina, slovenščina, madžarščina, hrvaščina, bosanščina (latinica + cirilica), črnogorščina.',
      feature6Title: 'Šifrirano in varno',
      feature6Body: 'Row-level security na vsaki tabeli, šifriranje v prenosu in v mirovanju. Vaši podatki ostanejo vaši — izvoz baze z enim klikom.',
      trustLine: 'Razvito za podjetja, ki nudijo storitve protipožarne zaščite, utemeljeno na regionalni praksi in predpisih.',
      terms: 'Pogoji uporabe',
      privacy: 'Politika zasebnosti',
      cookies: 'Piškotki',
      impressum: 'Impresum',
      ownerLine: 'Lastnik · MBS Spektrum d.o.o.',
      footerLocation: 'Sremska Mitrovica, 1992',
      themeToggleAria: 'Spremeni temo',
      localeToggleAria: 'Spremeni jezik',
      betaBadge: 'BETA',
    },
    'hu': {
      pageTitle: 'Spektrum Control — Tűzvédelmi ellenőrzések platformja',
      description: 'A Spektrum Control egy platform a tűzvédelmi ellenőrzések, időszakos tanúsítványok és munkalapok kezelésére.',
      pitch: 'Tűzvédelmi ellenőrzések kezelő platformja',
      heroSub: 'Időszakos tanúsítványok, munkalapok, igazolások és helyszíni ellenőrzések — minden egy platformon a tűzvédelmi szolgáltató cégek számára.',
      openAdmin: 'Adminisztrátor felület',
      openMobile: 'Mobilalkalmazás',
      featuresHeading: 'Amit kap',
      feature1Title: 'Időszakos ellenőrzések',
      feature1Body: 'Tűzoltó készülékek, tűzcsapok, vészvilágítás, gázérzékelés és egyéb tűzvédelmi rendszerek időszakos ellenőrzéseinek tervezése, végrehajtása és nyilvántartása.',
      feature2Title: 'Dokumentumok és munkalapok',
      feature2Body: 'Az időszakos tanúsítványok, munkalapok és igazolások az Ön sablonjaiból generálódnak — PDF aláírásra és átadásra kész.',
      feature3Title: 'Terepi alkalmazás',
      feature3Body: 'Mobilalkalmazás ellenőrök és szerviztechnikusok számára — vonalkód olvasás, helyszíni kitöltés, fotó bizonyíték és aláírás. Offline is működik.',
      feature4Title: 'Több cég, egy platform',
      feature4Body: 'Referens, ellenőr, szerviztechnikus — minden szerepkörnek saját hozzáférése van. Cégek közötti partnerségek, megosztott ügyfelek és munkalapok.',
      feature5Title: '12 nyelv',
      feature5Body: 'Szerb (latin + cirill), angol, román, macedón, bolgár, szlovén, magyar, horvát, bosnyák (latin + cirill), montenegrói.',
      feature6Title: 'Titkosított és biztonságos',
      feature6Body: 'Row-level security minden táblán, titkosítás átvitel közben és nyugalmi állapotban. Adatai az Önéi maradnak — egy kattintásos adatbázis-export.',
      trustLine: 'Tűzvédelmi szolgáltató cégek számára fejlesztve, a régió gyakorlatára és előírásaira alapozva.',
      terms: 'Felhasználási feltételek',
      privacy: 'Adatvédelmi szabályzat',
      cookies: 'Sütik',
      impressum: 'Impresszum',
      ownerLine: 'Tulajdonos · MBS Spektrum d.o.o.',
      footerLocation: 'Sremska Mitrovica, 1992',
      themeToggleAria: 'Téma váltása',
      localeToggleAria: 'Nyelv váltása',
      betaBadge: 'BÉTA',
    },
    'hr': {
      pageTitle: 'Spektrum Control — Platforma za upravljanje protupožarnim kontrolama',
      description: 'Spektrum Control je platforma za upravljanje protupožarnim kontrolama, periodičnim ispravama i radnim nalozima.',
      pitch: 'Platforma za upravljanje protupožarnim kontrolama',
      heroSub: 'Periodične isprave, radni nalozi, certifikati i terenske kontrole — sve u jednoj platformi za tvrtke koje pružaju usluge zaštite od požara.',
      openAdmin: 'Admin nadzorna ploča',
      openMobile: 'Mobilna aplikacija',
      featuresHeading: 'Što dobivate',
      feature1Title: 'Periodične kontrole',
      feature1Body: 'Planiranje, provođenje i evidencija svih periodičnih kontrola PP aparata, hidranata, panik rasvjete, plinodetekcije i ostalih sustava zaštite od požara.',
      feature2Title: 'Dokumenti i radni nalozi',
      feature2Body: 'Periodične isprave, radni nalozi i certifikati generiraju se iz vaših predložaka — PDF spreman za potpis i predaju klijentu.',
      feature3Title: 'Terenska aplikacija',
      feature3Body: 'Mobilna aplikacija za kontrolore i servisere — skeniranje barkodova, popunjavanje na licu mjesta, foto-evidencija i potpis. Radi i bez interneta.',
      feature4Title: 'Više tvrtki, jedna platforma',
      feature4Body: 'Referent, kontrole, serviseri — svaka uloga ima svoj pristup. Partnerstva među tvrtkama, dijeljenje klijenata i radnih naloga preko organizacijskih granica.',
      feature5Title: '12 jezika',
      feature5Body: 'Srpski (latinica + ćirilica), engleski, rumunjski, makedonski, bugarski, slovenski, mađarski, hrvatski, bosanski (latinica + ćirilica), crnogorski.',
      feature6Title: 'Šifrirano i sigurno',
      feature6Body: 'Row-level security na svakoj tablici, šifriranje u prijenosu i u mirovanju. Vaši podaci ostaju vaši — izvoz baze podataka u jednom kliku.',
      trustLine: 'Razvijen za tvrtke koje pružaju usluge zaštite od požara, utemeljen na praksi i propisima koji vrijede u regiji.',
      terms: 'Uvjeti korištenja',
      privacy: 'Politika privatnosti',
      cookies: 'Kolačići',
      impressum: 'Impresum',
      ownerLine: 'Vlasnik · MBS Spektrum d.o.o.',
      footerLocation: 'Sremska Mitrovica, 1992',
      themeToggleAria: 'Promijeni temu',
      localeToggleAria: 'Promijeni jezik',
      betaBadge: 'BETA',
    },
    'bs-Latn': {
      pageTitle: 'Spektrum Control — Platforma za upravljanje protivpožarnim kontrolama',
      description: 'Spektrum Control je platforma za upravljanje protivpožarnim kontrolama, periodičnim ispravama i radnim nalozima.',
      pitch: 'Platforma za upravljanje protivpožarnim kontrolama',
      heroSub: 'Periodične isprave, radni nalozi, certifikati i terenske kontrole — sve u jednoj platformi za firme koje pružaju usluge zaštite od požara.',
      openAdmin: 'Admin panel',
      openMobile: 'Mobilna aplikacija',
      featuresHeading: 'Šta dobijate',
      feature1Title: 'Periodične kontrole',
      feature1Body: 'Planiranje, provođenje i evidencija svih periodičnih kontrola PP aparata, hidranata, panik rasvjete, gas-detekcije i ostalih sistema zaštite od požara.',
      feature2Title: 'Dokumenti i radni nalozi',
      feature2Body: 'Periodične isprave, radni nalozi i certifikati generiraju se iz vaših šablona — PDF spreman za potpis i predaju klijentu.',
      feature3Title: 'Terenska aplikacija',
      feature3Body: 'Mobilna aplikacija za kontrolore i servisere — skeniranje barkodova, popunjavanje na licu mjesta, foto-evidencija i potpis. Radi i bez interneta.',
      feature4Title: 'Više firmi, jedna platforma',
      feature4Body: 'Referent, kontrole, serviseri — svaka uloga ima svoj pristup. Partnerstva među firmama, dijeljenje klijenata i radnih naloga preko organizacijskih granica.',
      feature5Title: '12 jezika',
      feature5Body: 'Srpski (latinica + ćirilica), engleski, rumunski, makedonski, bugarski, slovenački, mađarski, hrvatski, bosanski (latinica + ćirilica), crnogorski.',
      feature6Title: 'Šifrirano i sigurno',
      feature6Body: 'Row-level security na svakoj tabeli, šifriranje u prijenosu i u mirovanju. Vaši podaci ostaju vaši — izvoz baze podataka u jednom kliku.',
      trustLine: 'Razvijen za firme koje pružaju usluge zaštite od požara, utemeljen na praksi i propisima koji važe u regionu.',
      terms: 'Uvjeti korištenja',
      privacy: 'Politika privatnosti',
      cookies: 'Kolačići',
      impressum: 'Impresum',
      ownerLine: 'Vlasnik · MBS Spektrum d.o.o.',
      footerLocation: 'Sremska Mitrovica, 1992',
      themeToggleAria: 'Promijeni temu',
      localeToggleAria: 'Promijeni jezik',
      betaBadge: 'BETA',
    },
    'bs-Cyrl': {
      pageTitle: 'Спектрум Контрол — Платформа за управљање противпожарним контролама',
      description: 'Спектрум Контрол је платформа за управљање противпожарним контролама, периодичним исправама и радним налозима.',
      pitch: 'Платформа за управљање противпожарним контролама',
      heroSub: 'Периодичне исправе, радни налози, цертификати и теренске контроле — све у једној платформи за фирме које пружају услуге заштите од пожара.',
      openAdmin: 'Админ панел',
      openMobile: 'Мобилна апликација',
      featuresHeading: 'Шта добијате',
      feature1Title: 'Периодичне контроле',
      feature1Body: 'Планирање, провођење и евиденција свих периодичних контрола ПП апарата, хидраната, паник расвјете, гас-детекције и осталих система заштите од пожара.',
      feature2Title: 'Документи и радни налози',
      feature2Body: 'Периодичне исправе, радни налози и цертификати генеришу се из ваших шаблона — ПДФ спреман за потпис и предају клијенту.',
      feature3Title: 'Теренска апликација',
      feature3Body: 'Мобилна апликација за контролоре и сервисере — скенирање баркодова, попуњавање на лицу мјеста, фото-евиденција и потпис. Ради и без интернета.',
      feature4Title: 'Више фирми, једна платформа',
      feature4Body: 'Референт, контроле, сервисери — свака улога има свој приступ. Партнерства међу фирмама, дијељење клијената и радних налога преко организацијских граница.',
      feature5Title: '12 језика',
      feature5Body: 'Српски (латиница + ћирилица), енглески, руменски, македонски, бугарски, словеначки, мађарски, хрватски, босански (латиница + ћирилица), црногорски.',
      feature6Title: 'Шифрирано и сигурно',
      feature6Body: 'Row-level security на свакој табели, шифрирање у пријеносу и у мировању. Ваши подаци остају ваши — извоз базе података у једном клику.',
      trustLine: 'Развијен за фирме које пружају услуге заштите од пожара, утемељен на пракси и прописима који важе у региону.',
      terms: 'Увјети кориштења',
      privacy: 'Политика приватности',
      cookies: 'Колачићи',
      impressum: 'Импресум',
      ownerLine: 'Власник · MBS Спектрум д.о.о.',
      footerLocation: 'Сремска Митровица, 1992',
      themeToggleAria: 'Промијени тему',
      localeToggleAria: 'Промијени језик',
      betaBadge: 'БЕТА',
    },
    'cnr': {
      pageTitle: 'Spektrum Control — Platforma za upravljanje protivpožarnim kontrolama',
      description: 'Spektrum Control je platforma za upravljanje protivpožarnim kontrolama, periodičnim ispravama i radnim nalozima.',
      pitch: 'Platforma za upravljanje protivpožarnim kontrolama',
      heroSub: 'Periodične isprave, radni nalozi, sertifikati i terenske kontrole — sve u jednoj platformi za firme koje pružaju usluge zaštite od požara.',
      openAdmin: 'Admin panel',
      openMobile: 'Mobilna aplikacija',
      featuresHeading: 'Što dobijate',
      feature1Title: 'Periodične kontrole',
      feature1Body: 'Planiranje, izvođenje i evidencija svih periodičnih kontrola PP aparata, hidranata, panik rasvjete, gas-detekcije i ostalih sistema zaštite od požara.',
      feature2Title: 'Dokumenti i radni nalozi',
      feature2Body: 'Periodične isprave, radni nalozi i sertifikati generišu se iz vaših šablona — PDF spreman za potpis i predaju klijentu.',
      feature3Title: 'Terenska aplikacija',
      feature3Body: 'Mobilna aplikacija za kontrolore i servisere — skeniranje barkodova, popunjavanje na licu mjesta, foto-evidencija i potpis. Radi i bez interneta.',
      feature4Title: 'Više firmi, jedna platforma',
      feature4Body: 'Referent, kontrole, serviseri — svaka uloga ima svoj pristup. Partnerstva među firmama, dijeljenje klijenata i radnih naloga preko organizacijskih granica.',
      feature5Title: '12 jezika',
      feature5Body: 'Srpski (latinica + ćirilica), engleski, rumunski, makedonski, bugarski, slovenački, mađarski, hrvatski, bosanski (latinica + ćirilica), crnogorski.',
      feature6Title: 'Šifrovano i sigurno',
      feature6Body: 'Row-level security na svakoj tabeli, šifrovanje u prijenosu i u mirovanju. Vaši podaci ostaju vaši — izvoz baze podataka u jednom kliku.',
      trustLine: 'Razvijen za firme koje pružaju usluge zaštite od požara, utemeljen na praksi i propisima koji važe u regionu.',
      terms: 'Uslovi korišćenja',
      privacy: 'Politika privatnosti',
      cookies: 'Kolačići',
      impressum: 'Impresum',
      ownerLine: 'Vlasnik · MBS Spektrum d.o.o.',
      footerLocation: 'Sremska Mitrovica, 1992',
      themeToggleAria: 'Promijeni temu',
      localeToggleAria: 'Promijeni jezik',
      betaBadge: 'BETA',
    },
  }

  /* ─── Theme ───────────────────────────────────────────────── */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('spektrum-control-theme', theme) } catch (e) {}
  }
  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light'
  }

  const themeBtn = document.getElementById('theme-toggle')
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      applyTheme(currentTheme() === 'dark' ? 'light' : 'dark')
    })
  }

  /* ─── i18n ────────────────────────────────────────────────── */
  function detectInitialLocale() {
    try {
      const stored = localStorage.getItem('spektrum-control-locale')
      if (stored && SUPPORTED.includes(stored)) return stored
    } catch (e) {}
    const url = new URL(window.location.href)
    const qp = url.searchParams.get('lang')
    if (qp && SUPPORTED.includes(qp)) return qp
    const nav = (navigator.language || 'sr-Latn').toLowerCase()
    // Map browser locales to ours
    if (nav.startsWith('sr')) return nav.includes('cyrl') ? 'sr-Cyrl' : 'sr-Latn'
    if (nav.startsWith('hr')) return 'hr'
    if (nav.startsWith('bs')) return nav.includes('cyrl') ? 'bs-Cyrl' : 'bs-Latn'
    if (nav.startsWith('mk')) return 'mk'
    if (nav.startsWith('bg')) return 'bg'
    if (nav.startsWith('sl')) return 'sl'
    if (nav.startsWith('hu')) return 'hu'
    if (nav.startsWith('ro')) return 'ro'
    if (nav.startsWith('en')) return 'en'
    return DEFAULT_LOCALE
  }

  function applyLocale(locale) {
    if (!SUPPORTED.includes(locale)) locale = DEFAULT_LOCALE
    const dict = CATALOG[locale]
    const opt = LOCALE_OPTIONS.find(o => o.code === locale)
    document.documentElement.setAttribute('lang', opt ? opt.htmlLang : 'sr-Latn')

    // Title + meta description
    if (dict.pageTitle) document.title = dict.pageTitle
    const descEl = document.querySelector('meta[name="description"]')
    if (descEl && dict.description) descEl.setAttribute('content', dict.description)

    // Text nodes via data-i18n keys
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n')
      if (dict[key]) el.textContent = dict[key]
    })

    // Aria labels
    const themeBtnEl = document.getElementById('theme-toggle')
    if (themeBtnEl && dict.themeToggleAria) themeBtnEl.setAttribute('aria-label', dict.themeToggleAria)
    const localeBtnEl = document.getElementById('locale-toggle')
    if (localeBtnEl && dict.localeToggleAria) localeBtnEl.setAttribute('aria-label', dict.localeToggleAria)

    // Update current locale label in topbar
    const currentEl = document.getElementById('locale-current')
    if (currentEl && opt) currentEl.textContent = opt.short

    // Update menu active state + beta label
    document.querySelectorAll('.locale-option').forEach(function (btn) {
      const code = btn.getAttribute('data-locale')
      btn.classList.toggle('is-active', code === locale)
      const betaEl = btn.querySelector('.beta')
      if (betaEl && dict.betaBadge) betaEl.textContent = dict.betaBadge
    })

    try { localStorage.setItem('spektrum-control-locale', locale) } catch (e) {}
  }

  /* ─── Build locale menu ───────────────────────────────────── */
  const menuEl = document.getElementById('locale-menu')
  if (menuEl) {
    LOCALE_OPTIONS.forEach(function (opt) {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'locale-option'
      btn.setAttribute('role', 'option')
      btn.setAttribute('data-locale', opt.code)
      btn.innerHTML =
        '<span class="flag" aria-hidden="true">' + opt.flag + '</span>' +
        '<span class="label">' + opt.label + '</span>' +
        (opt.beta ? '<span class="beta">BETA</span>' : '')
      btn.addEventListener('click', function () {
        applyLocale(opt.code)
        closeMenu()
      })
      menuEl.appendChild(btn)
    })
  }

  /* ─── Toggle menu ─────────────────────────────────────────── */
  const toggleEl = document.getElementById('locale-toggle')
  function openMenu() {
    if (!menuEl) return
    menuEl.hidden = false
    toggleEl.setAttribute('aria-expanded', 'true')
  }
  function closeMenu() {
    if (!menuEl) return
    menuEl.hidden = true
    toggleEl.setAttribute('aria-expanded', 'false')
  }
  if (toggleEl) {
    toggleEl.addEventListener('click', function (e) {
      e.stopPropagation()
      if (menuEl.hidden) openMenu()
      else closeMenu()
    })
  }
  document.addEventListener('click', function (e) {
    if (menuEl && !menuEl.hidden && !menuEl.contains(e.target) && e.target !== toggleEl) {
      closeMenu()
    }
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu()
  })

  /* ─── Initial apply ───────────────────────────────────────── */
  applyLocale(detectInitialLocale())
})()
