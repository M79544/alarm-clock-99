// // =============original code=============
// const mainTime = document.querySelector("#mainTime");
// const modeText = document.querySelector("#modeText");
// const languageInput = document.querySelector("#languageInput");
// const languageLabel = document.querySelector("#languageLabel");
// const eyebrowText = document.querySelector("#eyebrowText");
// const appTitle = document.querySelector("#app-title");
// const subheadText = document.querySelector("#subheadText");
// const progressCircle = document.querySelector("#progressCircle");
// const completedCount = document.querySelector("#completedCount");
// const completedLabel = document.querySelector("#completedLabel");
// const targetCountText = document.querySelector("#targetCountText");
// const targetLabel = document.querySelector("#targetLabel");
// const remainingCount = document.querySelector("#remainingCount");
// const remainingLabel = document.querySelector("#remainingLabel");
// const pieces = document.querySelector("#pieces");
// const durationLabel = document.querySelector("#durationLabel");
// const minutesInput = document.querySelector("#minutesInput");
// const minutesLabel = document.querySelector("#minutesLabel");
// const secondsInput = document.querySelector("#secondsInput");
// const secondsLabel = document.querySelector("#secondsLabel");
// const ringDurationLabel = document.querySelector("#ringDurationLabel");
// const ringSecondsInput = document.querySelector("#ringSecondsInput");
// const ring3Option = document.querySelector("#ring3Option");
// const ring5Option = document.querySelector("#ring5Option");
// const ring10Option = document.querySelector("#ring10Option");
// const ring15Option = document.querySelector("#ring15Option");
// const targetInputLabel = document.querySelector("#targetInputLabel");
// const targetInput = document.querySelector("#targetInput");
// const toneLabel = document.querySelector("#toneLabel");
// const toneInput = document.querySelector("#toneInput");
// const toneClassicOption = document.querySelector("#toneClassicOption");
// const toneSoftOption = document.querySelector("#toneSoftOption");
// const toneUrgentOption = document.querySelector("#toneUrgentOption");
// const startButton = document.querySelector("#startButton");
// const pauseButton = document.querySelector("#pauseButton");
// const resetButton = document.querySelector("#resetButton");
// const notifyButton = document.querySelector("#notifyButton");
// const refreshButton = document.querySelector("#refreshButton");
// const offlineStatus = document.querySelector("#offlineStatus");
// const message = document.querySelector("#message");
// const completionScreen = document.querySelector("#completionScreen");
// const completionTitle = document.querySelector("#completionTitle");
// const completionText = document.querySelector("#completionText");
// const finishButton = document.querySelector("#finishButton");
// const limitNote = document.querySelector("#limitNote");

// const aboutButton = document.querySelector("#aboutButton");
// const aboutScreen = document.querySelector("#aboutScreen");
// const aboutCloseButton = document.querySelector("#aboutCloseButton");
// const aboutTitle = document.querySelector("#aboutTitle");
// const aboutTagline = document.querySelector("#aboutTagline");
// const aboutIntro = document.querySelector("#aboutIntro");
// const aboutLead = document.querySelector("#aboutLead");
// const aboutSimplicityTitle = document.querySelector("#aboutSimplicityTitle");
// const aboutSimplicityText = document.querySelector("#aboutSimplicityText");
// const aboutReliabilityTitle = document.querySelector("#aboutReliabilityTitle");
// const aboutReliabilityText = document.querySelector("#aboutReliabilityText");
// const aboutPrivacyTitle = document.querySelector("#aboutPrivacyTitle");
// const aboutPrivacyText = document.querySelector("#aboutPrivacyText");
// const aboutAvailableTitle = document.querySelector("#aboutAvailableTitle");
// const aboutAvailableText = document.querySelector("#aboutAvailableText");
// const aboutMissionTitle = document.querySelector("#aboutMissionTitle");
// const aboutMissionText = document.querySelector("#aboutMissionText");
// const aboutThanks = document.querySelector("#aboutThanks");
// const aboutContactLabel = document.querySelector("#aboutContactLabel");

// const STORAGE_KEY = "cycle-timer-state-v1";
// const RING_CIRCUMFERENCE = 2 * Math.PI * 52;

// let audioContext = null;
// let tickTimer = null;
// let ringTimer = null;
// let vibrationTimer = null;
// let wakeLock = null;
// let endAt = 0;
// let ringEndAt = 0;
// let ringRemainingMs = 0;
// let shouldCompleteAfterRing = false;
// let serviceWorkerRegistration = null;

// const state = {
//   language: "ar",
//   mode: "idle",
//   durationSeconds: 300,
//   remainingMs: 300000,
//   ringSeconds: 5,
//   tone: "classic",
//   target: 10,
//   completed: 0,
// };

// const copy = {
//   ar: {
//     language: "اللغة",
//     title: " 🔥 مؤقت متكرر 🔥",
//     eyebrow: " العداد الذكي",
//     subhead: "كل دورة تنتهي بتنبيه قصير ثم يبدأ العد من جديد.",
//     completed: "مكتمل",
//     target: "الهدف",
//     remaining: "المتبقي",
//     duration: "مدة العد",
//     minute: "دقيقة",
//     second: "ثانية",
//     ringDuration: "مدة صوت التنبيه",
//     seconds3: "3 ثواني",
//     seconds5: "5 ثواني",
//     seconds10: "10 ثواني",
//     seconds15: "15 ثانية",
//     targetInput: "عدد القطع المطلوب",
//     tone: "نغمة الرنين",
//     classic: "كلاسيكية",
//     soft: "هادئة",
//     urgent: "قوية",
//     notifyEnable: "تفعيل الإشعارات",
//     notifyEnabled: "الإشعارات مفعلة",
//     notifyDenied: "الإشعارات مرفوضة",
//     notifyUnsupported: "الإشعارات غير مدعومة",
//     refresh: "تحديث",
//     online: "متصل",
//     offline: "بدون إنترنت",
//     start: "بدء",
//     restart: "إعادة",
//     pause: "إيقاف مؤقت",
//     resume: "متابعة",
//     reset: "تصفير",
//     done: "تم",
//     ready: "جاهز",
//     running: "العد يعمل",
//     paused: "متوقف مؤقتًا",
//     ringing: "تنبيه",
//     complete: "مكتمل",
//     choose: "اختر الإعدادات ثم اضغط بدء.",
//     cycle: (current, total) => `الدورة ${current} من ${total}`,
//     pausedMessage: "تم إيقاف العد مؤقتًا.",
//     ringPaused: "تم إيقاف صوت التنبيه مؤقتًا.",
//     ringResumed: "تمت متابعة صوت التنبيه.",
//     cycleDone: "انتهت دورة. سيبدأ العد التالي بعد التنبيه.",
//     finalCycleDone: "انتهت آخر دورة. سيظهر تنبيه الاكتمال بعد الصوت.",
//     completeMessage: "اكتمل العدد المطلوب.",
//     completionTitle: "اكتمل العدد",
//     notificationReadyTitle: "تم تفعيل الإشعارات",
//     notificationReadyBody: "سيظهر إشعار عند نهاية الدورة وعند اكتمال العدد.",
//     notificationPermissionDenied: "لم يتم تفعيل الإشعارات من المتصفح.",
//     open: "فتح",
//     cycleNotificationTitle: "انتهت دورة",
//     finalNotificationTitle: "انتهت آخر دورة",
//     runningNotificationTitle: "العداد يعمل",
//     runningNotificationBody: (current, target) =>
//       `الدورة ${current} من ${target}. استخدم زر الإيقاف المؤقت من الإشعار إن ظهر على شاشة القفل.`,
//     cycleNotificationBody: (completed, target) =>
//       `تمت إضافة قطعة. المكتمل ${completed} من ${target}.`,
//     finalNotificationBody: "سيظهر تنبيه اكتمال العدد بعد صوت التنبيه.",
//     completeNotificationTitle: "اكتمل العدد",
//     completeNotificationBody: (completed, target) =>
//       `اكتمل ${completed} من ${target}.`,
//     refreshed: "تم تحديث المعلومات من المنبه الذي يعمل.",
//     noRunningAlarm: "لا توجد معلومات لمنبه يعمل حاليًا.",
//     limit:
//       "يعمل بدون إنترنت بعد فتحه مرة واحدة. عند قفل الهاتف قد يوقف النظام مؤقتات المتصفح؛ للحصول على رنين مضمون والهاتف مقفل تمامًا تحتاج نسخة تطبيق أصلي.",
//     //---------
//     // داخل ar
//     aboutTitle: "من نحن",
//     aboutTagline: "وقت أوضح، يوم أسهل",
//     aboutIntro:
//       "مؤقت الدورات من Kallaa Tech أداة بسيطة وموثوقة لتنظيم وقتك، دورة بعد دورة، دون تعقيد أو تشتيت.",
//     aboutLead: "صممناه ليبقى بسيطًا.",
//     aboutSimplicityTitle: "البساطة",
//     aboutSimplicityText:
//       "واجهة واضحة تساعدك على ضبط المؤقت والبدء بسرعة، مع إبقاء كل ما لا تحتاجه بعيدًا عن طريقك.",
//     aboutReliabilityTitle: "الموثوقية",
//     aboutReliabilityText:
//       "تنبيهات صوتية ومرئية ومتابعة دقيقة للتقدم حتى تعرف دائمًا أين وصلت.",
//     aboutPrivacyTitle: "الخصوصية",
//     aboutPrivacyText:
//       "لا نجمع بيانات شخصية. إعداداتك وحالة المؤقت تبقى على جهازك.",
//     aboutAvailableTitle: "متاح للجميع",
//     aboutAvailableText: "تجربة مجانية بلا إعلانات مزعجة أو خطوات غير ضرورية.",
//     aboutMissionTitle: "رسالتنا",
//     aboutMissionText:
//       "نؤمن أن التكنولوجيا الجيدة تجعل الحياة أسهل، لذلك صممنا المؤقت ليكون رفيقًا يوميًا هادئًا يساعدك على التركيز وإنجاز ما بدأته.",
//     aboutThanks: "شكرًا لاستخدامك مؤقت الدورات.",
//     aboutContactLabel: "للتواصل:",
//     about: "من نحن",
//   },
//   en: {
//     language: "Language",
//     title: "🔥Repeating Timer🔥",
//     eyebrow: " Smart Counter",
//     subhead:
//       "Each cycle ends with a short alarm, then the countdown starts again.",
//     completed: "Completed",
//     target: "Target",
//     remaining: "Remaining",
//     duration: "Countdown duration",
//     minute: "minute",
//     second: "second",
//     ringDuration: "Alarm sound duration",
//     seconds3: "3 seconds",
//     seconds5: "5 seconds",
//     seconds10: "10 seconds",
//     seconds15: "15 seconds",
//     targetInput: "Required pieces",
//     tone: "Alarm tone",
//     classic: "Classic",
//     soft: "Soft",
//     urgent: "Strong",
//     notifyEnable: "Enable notifications",
//     notifyEnabled: "Notifications enabled",
//     notifyDenied: "Notifications blocked",
//     notifyUnsupported: "Notifications unsupported",
//     refresh: "Refresh",
//     online: "Online",
//     offline: "Offline",
//     start: "Start",
//     restart: "Restart",
//     pause: "Pause",
//     resume: "Resume",
//     reset: "Reset",
//     done: "Done",
//     ready: "Ready",
//     running: "Running",
//     paused: "Paused",
//     ringing: "Alarm",
//     complete: "Complete",
//     choose: "Choose the settings, then press Start.",
//     cycle: (current, total) => `Cycle ${current} of ${total}`,
//     pausedMessage: "The countdown is paused.",
//     ringPaused: "The alarm sound is paused.",
//     ringResumed: "The alarm sound resumed.",
//     cycleDone: "One cycle ended. The next countdown starts after the alarm.",
//     finalCycleDone:
//       "The final cycle ended. Completion appears after the alarm.",
//     completeMessage: "The required count is complete.",
//     completionTitle: "Count complete",
//     notificationReadyTitle: "Notifications enabled",
//     notificationReadyBody:
//       "A notification will appear at cycle end and when the target is complete.",
//     notificationPermissionDenied: "Browser notifications were not enabled.",
//     open: "Open",
//     cycleNotificationTitle: "Cycle ended",
//     finalNotificationTitle: "Final cycle ended",
//     runningNotificationTitle: "Timer running",
//     runningNotificationBody: (current, target) =>
//       `Cycle ${current} of ${target}. You can pause from the lock-screen notification if it appears.`,
//     cycleNotificationBody: (completed, target) =>
//       `One piece was added. Completed ${completed} of ${target}.`,
//     finalNotificationBody:
//       "The completion notification will appear after the alarm sound.",
//     completeNotificationTitle: "Count complete",
//     completeNotificationBody: (completed, target) =>
//       `${completed} of ${target} complete.`,
//     refreshed: "Information refreshed from the running alarm.",
//     noRunningAlarm: "No running alarm information was found.",
//     limit:
//       "Works offline after the first launch. When the phone is locked, browser timers may pause; the Android wrapper keeps the alarm running through a foreground notification.",
//     //--------------
//     // داخل en
//     aboutTitle: "About us",
//     aboutTagline: "Clearer time, easier day",
//     aboutIntro:
//       "Cycle Timer by Kallaa Tech is a simple, reliable tool to organize your time, cycle after cycle, without clutter or distraction.",
//     aboutLead: "We designed it to stay simple.",
//     aboutSimplicityTitle: "Simplicity",
//     aboutSimplicityText:
//       "A clear interface that lets you set the timer and start fast, keeping everything you don't need out of your way.",
//     aboutReliabilityTitle: "Reliability",
//     aboutReliabilityText:
//       "Sound and visual alerts with accurate progress tracking, so you always know where you stand.",
//     aboutPrivacyTitle: "Privacy",
//     aboutPrivacyText:
//       "We collect no personal data. Your settings and timer state stay on your device.",
//     aboutAvailableTitle: "Open to everyone",
//     aboutAvailableText:
//       "Free to use, with no intrusive ads and no unnecessary steps.",
//     aboutMissionTitle: "Our mission",
//     aboutMissionText:
//       "We believe good technology makes life easier, so we built this timer as a calm daily companion that helps you focus and finish what you started.",
//     aboutThanks: "Thank you for using Cycle Timer.",
//     aboutContactLabel: "Contact:",
//     about: "About us",
//   },
//   tr: {
//     language: "Dil",
//     title: "🔥Tekrarlı Zamanlayıcı🔥",
//     eyebrow: "Akıllı Sayaç",
//     subhead: "Her tur kısa bir uyarıyla biter, sonra sayaç yeniden başlar.",
//     completed: "Tamamlanan",
//     target: "Hedef",
//     remaining: "Kalan",
//     duration: "Sayaç süresi",
//     minute: "dakika",
//     second: "saniye",
//     ringDuration: "Alarm süresi",
//     seconds3: "3 saniye",
//     seconds5: "5 saniye",
//     seconds10: "10 saniye",
//     seconds15: "15 saniye",
//     targetInput: "Gerekli parça sayısı",
//     tone: "Alarm sesi",
//     classic: "Klasik",
//     soft: "Yumuşak",
//     urgent: "Güçlü",
//     notifyEnable: "Bildirimleri aç",
//     notifyEnabled: "Bildirimler açık",
//     notifyDenied: "Bildirimler engelli",
//     notifyUnsupported: "Bildirim desteklenmiyor",
//     refresh: "Yenile",
//     online: "Çevrimiçi",
//     offline: "Çevrimdışı",
//     start: "Başlat",
//     restart: "Yeniden",
//     pause: "Duraklat",
//     resume: "Devam et",
//     reset: "Sıfırla",
//     done: "Tamam",
//     ready: "Hazır",
//     running: "Sayaç çalışıyor",
//     paused: "Duraklatıldı",
//     ringing: "Alarm",
//     complete: "Tamamlandı",
//     choose: "Ayarları seçip başlatın.",
//     cycle: (current, total) => `Tur ${current} / ${total}`,
//     pausedMessage: "Sayaç duraklatıldı.",
//     ringPaused: "Alarm sesi duraklatıldı.",
//     ringResumed: "Alarm sesi devam ediyor.",
//     cycleDone: "Bir tur bitti. Alarmdan sonra sonraki tur başlayacak.",
//     finalCycleDone:
//       "Son tur bitti. Alarmdan sonra tamamlandı bildirimi görünecek.",
//     completeMessage: "Hedef sayı tamamlandı.",
//     completionTitle: "Sayı tamamlandı",
//     notificationReadyTitle: "Bildirimler açıldı",
//     notificationReadyBody:
//       "Tur sonunda ve hedef tamamlandığında bildirim gösterilecek.",
//     notificationPermissionDenied: "Tarayıcı bildirim izni verilmedi.",
//     open: "Aç",
//     cycleNotificationTitle: "Tur bitti",
//     finalNotificationTitle: "Son tur bitti",
//     runningNotificationTitle: "Sayaç çalışıyor",
//     runningNotificationBody: (current, target) =>
//       `Tur ${current} / ${target}. Kilit ekranında görünürse bildirimden duraklatabilirsiniz.`,
//     cycleNotificationBody: (completed, target) =>
//       `Bir parça eklendi. Tamamlanan ${completed} / ${target}.`,
//     finalNotificationBody: "Alarmdan sonra tamamlandı bildirimi gösterilecek.",
//     completeNotificationTitle: "Sayı tamamlandı",
//     completeNotificationBody: (completed, target) =>
//       `${completed} / ${target} tamamlandı.`,
//     refreshed: "Bilgiler çalışan alarmdan yenilendi.",
//     noRunningAlarm: "Çalışan alarm bilgisi bulunamadı.",
//     limit:
//       "İlk açılıştan sonra çevrimdışı çalışır. Telefon kilitliyken sistem tarayıcı zamanlayıcılarını durdurabilir; kilit ekranında kesin alarm için yerel Android/iOS uygulaması gerekir.",
//     //--------------
//     // داخل tr
//     aboutTitle: "Hakkımızda",
//     aboutTagline: "Daha net zaman, daha kolay gün",
//     aboutIntro:
//       "Kallaa Tech'in Tur Zamanlayıcısı; zamanınızı tur tur düzenlemeniz için karmaşadan uzak, basit ve güvenilir bir araçtır.",
//     aboutLead: "Basit kalması için tasarladık.",
//     aboutSimplicityTitle: "Basitlik",
//     aboutSimplicityText:
//       "Zamanlayıcıyı hızlıca ayarlayıp başlatmanızı sağlayan sade bir arayüz; ihtiyacınız olmayan her şey yolunuzdan uzakta.",
//     aboutReliabilityTitle: "Güvenilirlik",
//     aboutReliabilityText:
//       "Sesli ve görsel uyarılar ile net ilerleme takibi; nerede olduğunuzu her zaman bilirsiniz.",
//     aboutPrivacyTitle: "Gizlilik",
//     aboutPrivacyText:
//       "Kişisel veri toplamıyoruz. Ayarlarınız ve zamanlayıcı durumu cihazınızda kalır.",
//     aboutAvailableTitle: "Herkes için",
//     aboutAvailableText:
//       "Rahatsız edici reklamlar ve gereksiz adımlar olmadan ücretsiz kullanım.",
//     aboutMissionTitle: "Misyonumuz",
//     aboutMissionText:
//       "İyi teknolojinin hayatı kolaylaştırdığına inanıyoruz; bu yüzden zamanlayıcıyı, odaklanmanıza ve başladığınızı bitirmenize yardım eden sakin bir günlük yardımcı olarak tasarladık.",
//     aboutThanks: "Tur Zamanlayıcısı'nı kullandığınız için teşekkürler.",
//     aboutContactLabel: "İletişim:",
//     about: "Hakkımızda",
//   },
// };

// function t(key, ...args) {
//   const value = copy[state.language][key];
//   return typeof value === "function" ? value(...args) : value;
// }

// progressCircle.style.strokeDasharray = RING_CIRCUMFERENCE;

// function clamp(value, min, max) {
//   return Math.min(Math.max(value, min), max);
// }

// function formatTime(totalSeconds) {
//   const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
//   const minutes = Math.floor(safeSeconds / 60);
//   const seconds = safeSeconds % 60;
//   return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
// }

// function readSettings() {
//   const minutes = clamp(Number(minutesInput.value || 0), 0, 180);
//   const seconds = clamp(Number(secondsInput.value || 0), 0, 59);
//   const durationSeconds = Math.max(1, minutes * 60 + seconds);

//   state.durationSeconds = durationSeconds;
//   state.ringSeconds = clamp(Number(ringSecondsInput.value || 5), 1, 30);
//   state.tone = toneInput.value || "classic";
//   state.target = Math.max(1, Math.floor(Number(targetInput.value || 1)));
//   state.completed = Math.min(state.completed, state.target);

//   minutesInput.value = Math.floor(durationSeconds / 60);
//   secondsInput.value = durationSeconds % 60;
//   targetInput.value = state.target;
// }

// function saveState() {
//   localStorage.setItem(
//     STORAGE_KEY,
//     JSON.stringify({
//       durationSeconds: state.durationSeconds,
//       ringSeconds: state.ringSeconds,
//       tone: state.tone,
//       language: state.language,
//       target: state.target,
//       completed: state.completed,
//       mode: state.mode,
//       endAt,
//       ringEndAt,
//       ringRemainingMs,
//       shouldCompleteAfterRing,
//     }),
//   );
// }

// function loadState() {
//   try {
//     const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
//     if (!saved.durationSeconds) return;

//     state.durationSeconds = saved.durationSeconds;
//     state.remainingMs = saved.durationSeconds * 1000;
//     state.ringSeconds = saved.ringSeconds || 5;
//     state.tone = saved.tone || "classic";
//     state.language = saved.language || "ar";
//     state.target = saved.target || 10;
//     state.completed = saved.completed || 0;
//     state.mode = saved.mode || "idle";
//     endAt = saved.endAt || 0;
//     ringEndAt = saved.ringEndAt || 0;
//     ringRemainingMs = saved.ringRemainingMs || 0;
//     shouldCompleteAfterRing = Boolean(saved.shouldCompleteAfterRing);

//     if (state.mode === "running" && endAt > 0) {
//       state.remainingMs = Math.max(0, endAt - Date.now());
//       if (state.remainingMs <= 0) {
//         state.mode = "idle";
//         state.remainingMs = state.durationSeconds * 1000;
//       }
//     }

//     if (state.mode === "ringing" && ringEndAt > 0 && Date.now() >= ringEndAt) {
//       state.mode = shouldCompleteAfterRing ? "complete" : "idle";
//     }

//     minutesInput.value = Math.floor(state.durationSeconds / 60);
//     secondsInput.value = state.durationSeconds % 60;
//     ringSecondsInput.value = String(state.ringSeconds);
//     toneInput.value = state.tone;
//     languageInput.value = state.language;
//     targetInput.value = state.target;
//     pauseButton.disabled = state.mode === "idle" || state.mode === "complete";
//     startButton.textContent =
//       state.mode === "running" || state.mode === "ringing"
//         ? t("restart")
//         : t("start");
//   } catch {
//     localStorage.removeItem(STORAGE_KEY);
//   }
// }

// function notificationsSupported() {
//   return "Notification" in window;
// }

// function updateNotificationButton() {
//   if (!notificationsSupported()) {
//     notifyButton.textContent = t("notifyUnsupported");
//     notifyButton.disabled = true;
//     return;
//   }

//   if (Notification.permission === "granted") {
//     notifyButton.textContent = t("notifyEnabled");
//     notifyButton.disabled = true;
//     return;
//   }

//   if (Notification.permission === "denied") {
//     notifyButton.textContent = t("notifyDenied");
//     notifyButton.disabled = true;
//     return;
//   }

//   notifyButton.textContent = t("notifyEnable");
//   notifyButton.disabled = false;
// }

// async function requestNotifications() {
//   if (!notificationsSupported()) return;

//   const permission = await Notification.requestPermission();
//   updateNotificationButton();

//   if (permission === "granted") {
//     message.textContent = t("notificationReadyTitle");
//     showNotification(t("notificationReadyTitle"), t("notificationReadyBody"));
//   } else {
//     message.textContent = t("notificationPermissionDenied");
//   }
// }

// async function showNotification(title, body) {
//   if (!notificationsSupported() || Notification.permission !== "granted")
//     return;

//   const options = {
//     body,
//     icon: "icon.svg",
//     badge: "icon.svg",
//     tag: "cycle-timer",
//     renotify: true,
//     requireInteraction: state.mode === "complete",
//     actions: [
//       { action: "pause", title: t("pause") },
//       { action: "open", title: t("open") },
//     ],
//     data: {
//       language: state.language,
//       commandable: true,
//     },
//   };

//   if (serviceWorkerRegistration?.showNotification) {
//     await serviceWorkerRegistration.showNotification(title, options);
//     return;
//   }

//   new Notification(title, options);
// }

// function updateConnectionStatus() {
//   const isOnline = navigator.onLine;
//   offlineStatus.textContent = isOnline ? t("online") : t("offline");
//   offlineStatus.classList.toggle("offline", !isOnline);
// }

// function hasNativeAlarm() {
//   return typeof window.AndroidAlarm !== "undefined";
// }

// function startNativeAlarm() {
//   if (!hasNativeAlarm()) return;

//   window.AndroidAlarm.start(
//     state.durationSeconds,
//     state.ringSeconds,
//     state.target,
//     state.tone,
//     state.language,
//   );
// }

// function pauseNativeAlarm() {
//   if (!hasNativeAlarm()) return;

//   window.AndroidAlarm.pauseOrResume();
// }

// function stopNativeAlarm() {
//   if (!hasNativeAlarm()) return;

//   window.AndroidAlarm.stop();
// }

// function updateNativeAlarm() {
//   if (!hasNativeAlarm() || typeof window.AndroidAlarm.update !== "function")
//     return;

//   window.AndroidAlarm.update(
//     state.durationSeconds,
//     state.ringSeconds,
//     state.target,
//     state.tone,
//     state.language,
//   );
// }

// function getNativeAlarmState() {
//   if (!hasNativeAlarm() || typeof window.AndroidAlarm.getState !== "function")
//     return null;

//   try {
//     return JSON.parse(window.AndroidAlarm.getState() || "{}");
//   } catch {
//     return null;
//   }
// }

// function applyAlarmSnapshot(snapshot, showMessage = false) {
//   if (!snapshot || !snapshot.mode || snapshot.mode === "IDLE") {
//     if (showMessage) message.textContent = t("noRunningAlarm");
//     return false;
//   }

//   state.mode = String(snapshot.mode).toLowerCase();
//   state.durationSeconds = Number(
//     snapshot.durationSeconds || state.durationSeconds,
//   );
//   state.ringSeconds = Number(snapshot.ringSeconds || state.ringSeconds);
//   state.target = Number(snapshot.target || state.target);
//   state.completed = Number(snapshot.completed || 0);
//   state.tone = snapshot.tone || state.tone;
//   state.language = snapshot.language || state.language;
//   shouldCompleteAfterRing = Boolean(snapshot.completeAfterRing);
//   endAt = Number(snapshot.phaseEndAt || 0);
//   ringEndAt = state.mode === "ringing" ? endAt : 0;

//   if (state.mode === "running") {
//     state.remainingMs = Math.max(0, endAt - Date.now());
//   } else if (state.mode === "paused") {
//     state.remainingMs = Math.max(0, Number(snapshot.remainingMs || 0));
//   } else if (state.mode === "ringing") {
//     state.remainingMs = 0;
//   } else if (state.mode === "complete") {
//     state.remainingMs = 0;
//     completionText.textContent = `${state.completed} / ${state.target}`;
//     completionScreen.hidden = false;
//   }

//   minutesInput.value = Math.floor(state.durationSeconds / 60);
//   secondsInput.value = state.durationSeconds % 60;
//   ringSecondsInput.value = String(state.ringSeconds);
//   targetInput.value = state.target;
//   toneInput.value = state.tone;
//   languageInput.value = state.language;
//   pauseButton.disabled = state.mode === "idle" || state.mode === "complete";
//   startButton.textContent =
//     state.mode === "running" || state.mode === "ringing"
//       ? t("restart")
//       : t("start");

//   applyLanguage();
//   if (state.mode === "running") startTicking();
//   saveState();
//   updateDisplay();
//   if (showMessage) message.textContent = t("refreshed");
//   return true;
// }

// function refreshAlarmState(showMessage = true) {
//   const nativeState = getNativeAlarmState();
//   if (applyAlarmSnapshot(nativeState, showMessage)) return;

//   loadState();
//   if (state.mode === "running" && endAt > 0) {
//     state.remainingMs = Math.max(0, endAt - Date.now());
//     startTicking();
//     updateDisplay();
//     if (showMessage) message.textContent = t("refreshed");
//     return;
//   }

//   updateDisplay();
//   if (showMessage) message.textContent = t("noRunningAlarm");
// }

// function applyLanguage() {
//   document.documentElement.lang = state.language;
//   document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
//   document.title = t("eyebrow").trim();
//   languageInput.value = state.language;
//   languageLabel.textContent = t("language");
//   eyebrowText.textContent = t("eyebrow");
//   appTitle.textContent = t("title");
//   if (subheadText) subheadText.textContent = t("subhead");
//   completedLabel.textContent = t("completed");
//   targetLabel.textContent = t("target");
//   remainingLabel.textContent = t("remaining");
//   durationLabel.textContent = t("duration");
//   minutesLabel.textContent = t("minute");
//   secondsLabel.textContent = t("second");
//   ringDurationLabel.textContent = t("ringDuration");
//   ring3Option.textContent = t("seconds3");
//   ring5Option.textContent = t("seconds5");
//   ring10Option.textContent = t("seconds10");
//   ring15Option.textContent = t("seconds15");
//   targetInputLabel.textContent = t("targetInput");
//   toneLabel.textContent = t("tone");
//   toneClassicOption.textContent = t("classic");
//   toneSoftOption.textContent = t("soft");
//   toneUrgentOption.textContent = t("urgent");
//   startButton.textContent =
//     state.mode === "running" || state.mode === "ringing"
//       ? t("restart")
//       : t("start");
//   pauseButton.textContent = state.mode === "paused" ? t("resume") : t("pause");
//   resetButton.textContent = t("reset");
//   refreshButton.textContent = t("refresh");
//   finishButton.textContent = t("done");
//   completionTitle.textContent = t("completionTitle");
//   limitNote.textContent = t("limit");
//   const setText = (el, value) => {
//     if (el) el.textContent = value;
//   };

//   setText(aboutButton, t("about"));
//   setText(aboutTitle, t("aboutTitle"));
//   setText(aboutTagline, t("aboutTagline"));
//   setText(aboutIntro, t("aboutIntro"));
//   setText(aboutLead, t("aboutLead"));
//   setText(aboutSimplicityTitle, t("aboutSimplicityTitle"));
//   setText(aboutSimplicityText, t("aboutSimplicityText"));
//   setText(aboutReliabilityTitle, t("aboutReliabilityTitle"));
//   setText(aboutReliabilityText, t("aboutReliabilityText"));
//   setText(aboutPrivacyTitle, t("aboutPrivacyTitle"));
//   setText(aboutPrivacyText, t("aboutPrivacyText"));
//   setText(aboutAvailableTitle, t("aboutAvailableTitle"));
//   setText(aboutAvailableText, t("aboutAvailableText"));
//   setText(aboutMissionTitle, t("aboutMissionTitle"));
//   setText(aboutMissionText, t("aboutMissionText"));
//   setText(aboutThanks, t("aboutThanks"));
//   setText(aboutContactLabel, t("aboutContactLabel"));
//   updateNotificationButton();
//   updateConnectionStatus();
// }

// async function unlockAudio() {
//   audioContext ||= new AudioContext();
//   if (audioContext.state === "suspended") {
//     await audioContext.resume();
//   }
// }

// function playTone(frequencies, duration = 0.5, type = "square", volume = 0.42) {
//   if (!audioContext) return;

//   const oscillator = audioContext.createOscillator();
//   const gain = audioContext.createGain();

//   oscillator.type = type;
//   frequencies.forEach((frequency, index) => {
//     oscillator.frequency.setValueAtTime(
//       frequency,
//       audioContext.currentTime + index * 0.16,
//     );
//   });
//   gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
//   gain.gain.exponentialRampToValueAtTime(
//     volume,
//     audioContext.currentTime + 0.03,
//   );
//   gain.gain.exponentialRampToValueAtTime(
//     0.0001,
//     audioContext.currentTime + duration,
//   );

//   oscillator.connect(gain);
//   gain.connect(audioContext.destination);
//   oscillator.start();
//   oscillator.stop(audioContext.currentTime + duration + 0.05);
// }

// function playBeep() {
//   if (state.tone === "soft") {
//     playTone([523, 659, 784], 0.62, "sine", 0.3);
//     return;
//   }

//   if (state.tone === "urgent") {
//     playTone([1040, 740, 1040], 0.45, "sawtooth", 0.48);
//     return;
//   }

//   playTone([920, 700], 0.5, "square", 0.42);
// }

// function playCompleteTone() {
//   playTone([523, 659, 784, 1046], 0.9, "triangle", 0.46);
//   window.setTimeout(
//     () => playTone([1046, 784, 1046], 0.7, "triangle", 0.42),
//     450,
//   );
// }

// function vibrate() {
//   navigator.vibrate?.([300, 120, 300]);
// }

// async function requestWakeLock() {
//   if (!("wakeLock" in navigator) || wakeLock) return;

//   try {
//     wakeLock = await navigator.wakeLock.request("screen");
//   } catch {
//     wakeLock = null;
//   }
// }

// async function releaseWakeLock() {
//   if (!wakeLock) return;

//   try {
//     await wakeLock.release();
//   } finally {
//     wakeLock = null;
//   }
// }

// function updatePieces() {
//   pieces.innerHTML = "";
//   const visiblePieces = Math.min(state.target, 200);

//   for (let index = 0; index < visiblePieces; index += 1) {
//     const piece = document.createElement("span");
//     piece.className = index < state.completed ? "piece done" : "piece";
//     pieces.append(piece);
//   }
// }

// function updateDisplay() {
//   const remainingSeconds =
//     state.mode === "ringing"
//       ? Math.max(0, (ringEndAt - Date.now()) / 1000)
//       : state.remainingMs / 1000;

//   const progress =
//     state.mode === "ringing"
//       ? 1
//       : 1 - state.remainingMs / (state.durationSeconds * 1000);

//   mainTime.textContent = formatTime(remainingSeconds);
//   progressCircle.style.strokeDashoffset =
//     RING_CIRCUMFERENCE * (1 - clamp(progress, 0, 1));
//   completedCount.textContent = state.completed;
//   targetCountText.textContent = state.target;
//   remainingCount.textContent = Math.max(0, state.target - state.completed);
//   updatePieces();

//   document.body.dataset.mode = state.mode;

//   if (state.mode === "idle") modeText.textContent = t("ready");
//   if (state.mode === "running") modeText.textContent = t("running");
//   if (state.mode === "paused") modeText.textContent = t("paused");
//   if (state.mode === "ringing") modeText.textContent = t("ringing");
//   if (state.mode === "complete") modeText.textContent = t("complete");
// }

// function stopRingingSound() {
//   window.clearInterval(ringTimer);
//   window.clearInterval(vibrationTimer);
//   navigator.vibrate?.(0);
// }

// function startRingingSound() {
//   stopRingingSound(); //yeni ekledim
//   playBeep();
//   vibrate();
//   ringTimer = window.setInterval(playBeep, 850);
//   vibrationTimer = window.setInterval(vibrate, 1100);
// }

// function startTicking() {
//   window.clearInterval(tickTimer);
//   tickTimer = window.setInterval(tick, 200);
// }

// function stopTicking() {
//   window.clearInterval(tickTimer);
// }

// function beginCountdown() {
//   state.mode = "running";
//   state.remainingMs = state.durationSeconds * 1000;
//   endAt = Date.now() + state.remainingMs;
//   startButton.textContent = t("restart");
//   pauseButton.disabled = false;
//   pauseButton.textContent = t("pause");
//   message.textContent = t("cycle", state.completed + 1, state.target);
//   showNotification(
//     t("runningNotificationTitle"),
//     t("runningNotificationBody", state.completed + 1, state.target),
//   );
//   saveState();
//   startTicking();
//   updateDisplay();
// }

// function finishCycle() {
//   state.completed = clamp(state.completed + 1, 0, state.target);
//   shouldCompleteAfterRing = state.completed >= state.target;
//   saveState();

//   state.mode = "ringing";
//   ringEndAt = Date.now() + state.ringSeconds * 1000;
//   message.textContent = shouldCompleteAfterRing
//     ? t("finalCycleDone")
//     : t("cycleDone");
//   showNotification(
//     shouldCompleteAfterRing
//       ? t("finalNotificationTitle")
//       : t("cycleNotificationTitle"),
//     shouldCompleteAfterRing
//       ? t("finalNotificationBody")
//       : t("cycleNotificationBody", state.completed, state.target),
//   );
//   startRingingSound();
//   updateDisplay();
// }

// function completeTarget() {
//   state.mode = "complete";
//   stopTicking();
//   stopRingingSound();
//   releaseWakeLock();
//   startButton.disabled = false;
//   pauseButton.disabled = true;
//   completionText.textContent = `${state.completed} / ${state.target}`;
//   completionScreen.hidden = false;
//   message.textContent = t("completeMessage");
//   showNotification(
//     t("completeNotificationTitle"),
//     t("completeNotificationBody", state.completed, state.target),
//   );
//   playCompleteTone();
//   vibrate();
//   updateDisplay();
// }

// function tick() {
//   if (state.mode === "running") {
//     state.remainingMs = Math.max(0, endAt - Date.now());
//     if (state.remainingMs <= 0) finishCycle();
//   }

//   if (state.mode === "ringing") {
//     if (Date.now() >= ringEndAt) {
//       stopRingingSound();
//       if (shouldCompleteAfterRing) {
//         completeTarget();
//         return;
//       }
//       beginCountdown();
//       return;
//     }
//   }

//   updateDisplay();
// }

// async function startTimer() {
//   stopRingingSound(); //son ekledim
//   stopTicking(); //son ekledim
//   await unlockAudio();
//   await requestWakeLock();
//   readSettings();
//   completionScreen.hidden = true;

//   if (
//     state.mode === "running" ||
//     state.mode === "ringing" ||
//     state.mode === "complete"
//   ) {
//     stopRingingSound();
//     state.completed = 0;
//     shouldCompleteAfterRing = false;
//     ringRemainingMs = 0;
//   }

//   beginCountdown();
//   saveState();
//   startNativeAlarm();
// }

// function pauseTimer() {
//   pauseNativeAlarm();

//   if (state.mode === "running") {
//     state.remainingMs = Math.max(0, endAt - Date.now());
//     state.mode = "paused";
//     stopTicking();
//     pauseButton.textContent = t("resume");
//     message.textContent = t("pausedMessage");
//     saveState();
//     updateDisplay();
//     return;
//   }

//   if (state.mode === "ringing") {
//     ringRemainingMs = Math.max(1000, ringEndAt - Date.now());
//     state.mode = "paused";
//     stopRingingSound();
//     stopTicking();
//     pauseButton.textContent = t("resume");
//     message.textContent = t("ringPaused");
//     saveState();
//     updateDisplay();
//     return;
//   }

//   if (state.mode === "paused") {
//     if (ringRemainingMs > 0) {
//       state.mode = "ringing";
//       ringEndAt = Date.now() + ringRemainingMs;
//       ringRemainingMs = 0;
//       startRingingSound();
//       startTicking();
//       pauseButton.textContent = t("pause");
//       message.textContent = t("ringResumed");
//       saveState();
//       updateDisplay();
//       return;
//     }

//     state.mode = "running";
//     endAt = Date.now() + state.remainingMs;
//     pauseButton.textContent = t("pause");
//     message.textContent = t("cycle", state.completed + 1, state.target);
//     startTicking();
//     saveState();
//     updateDisplay();
//   }
// }

// async function resetTimer() {
//   stopNativeAlarm();
//   stopTicking();
//   stopRingingSound();
//   await releaseWakeLock();
//   readSettings();
//   state.mode = "idle";
//   state.completed = 0;
//   shouldCompleteAfterRing = false;
//   ringRemainingMs = 0;
//   state.remainingMs = state.durationSeconds * 1000;
//   startButton.disabled = false;
//   startButton.textContent = t("start");
//   pauseButton.disabled = true;
//   pauseButton.textContent = t("pause");
//   completionScreen.hidden = true;
//   message.textContent = t("choose");
//   saveState();
//   updateDisplay();
// }

// function applySettingsPreview() {
//   const previousMode = state.mode;
//   const previousDurationMs = Math.max(1000, state.durationSeconds * 1000);
//   const previousRemainingMs =
//     previousMode === "running"
//       ? Math.max(0, endAt - Date.now())
//       : state.remainingMs;
//   const remainingRatio = clamp(previousRemainingMs / previousDurationMs, 0, 1);

//   readSettings();

//   if (previousMode === "running") {
//     state.remainingMs = Math.max(
//       1000,
//       Math.round(state.durationSeconds * 1000 * remainingRatio),
//     );
//     endAt = Date.now() + state.remainingMs;
//     message.textContent = t("cycle", state.completed + 1, state.target);
//     updateNativeAlarm();
//   } else if (previousMode === "paused") {
//     state.remainingMs = Math.max(
//       1000,
//       Math.round(state.durationSeconds * 1000 * remainingRatio),
//     );
//     updateNativeAlarm();
//   } else if (previousMode === "ringing") {
//     updateNativeAlarm();
//   } else {
//     state.remainingMs = state.durationSeconds * 1000;
//   }

//   saveState();
//   updateDisplay();
// }

// function changeLanguage() {
//   state.language = languageInput.value;
//   applyLanguage();
//   if (state.mode === "idle" || state.mode === "complete") {
//     message.textContent = t("choose");
//   }
//   saveState();
//   updateDisplay();
// }

// // // ---------- شاشة "من نحن" ----------

// function openAbout() {
//   if (aboutScreen) aboutScreen.hidden = false;
// }

// function closeAbout() {
//   if (aboutScreen) aboutScreen.hidden = true;
// }
// function handleServiceWorkerMessage(event) {
//   const command = event.data?.command;
//   if (command === "pause-or-resume") {
//     if (!pauseButton.disabled) pauseTimer();
//   }
// }

// // // ---------- الأحداث ----------

// // startButton.addEventListener("click", startTimer);//yeni seldim
// //son ekledim
// if (aboutButton) aboutButton.addEventListener("click", openAbout);
// if (aboutCloseButton) aboutCloseButton.addEventListener("click", closeAbout);
// //// yeni ekledim
// pauseButton.addEventListener("click", pauseTimer);
// resetButton.addEventListener("click", resetTimer);
// finishButton.addEventListener("click", resetTimer);
// notifyButton.addEventListener("click", requestNotifications);
// refreshButton.addEventListener("click", () => {
//   recompute();
//   updateDisplay();
//   message.textContent = t("refreshed");
// });
// languageInput.addEventListener("change", changeLanguage);

// if (aboutButton) aboutButton.addEventListener("click", openAbout);
// if (aboutCloseButton) aboutCloseButton.addEventListener("click", closeAbout);

// [minutesInput, secondsInput, ringSecondsInput, targetInput, toneInput].forEach(
//   (input) => {
//     input.addEventListener("input", applySettingsPreview);
//     input.addEventListener("change", applySettingsPreview);
//   },
// );

// document.addEventListener("visibilitychange", () => {
//   if (document.visibilityState === "visible") {
//     requestWakeLock();
//     recompute();
//     updateDisplay();
//     if (state.mode === "running" || state.mode === "ringing")
//       startDisplayTicker();
//   }
// });

// window.addEventListener("focus", () => {
//   recompute();
//   updateDisplay();
// });

// window.addEventListener("online", updateConnectionStatus);
// window.addEventListener("offline", updateConnectionStatus);

// if (LocalNotifications?.addListener) {
//   LocalNotifications.addListener("localNotificationActionPerformed", () => {
//     recompute();
//     updateDisplay();
//   });
// }

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("sw.js")
//     .then((registration) => {
//       serviceWorkerRegistration = registration;
//     })
//     .catch(() => {});
// }

// startButton.addEventListener("click", startTimer);
// pauseButton.addEventListener("click", pauseTimer);
// resetButton.addEventListener("click", resetTimer);
// finishButton.addEventListener("click", resetTimer);
// notifyButton.addEventListener("click", requestNotifications);
// refreshButton.addEventListener("click", () => refreshAlarmState(true));
// languageInput.addEventListener("change", changeLanguage);

// [minutesInput, secondsInput, ringSecondsInput, targetInput, toneInput].forEach(
//   (input) => {
//     input.addEventListener("input", applySettingsPreview);
//     input.addEventListener("change", applySettingsPreview);
//   },
// );

// document.addEventListener("visibilitychange", () => {
//   if (document.visibilityState === "visible") {
//     requestWakeLock();
//     refreshAlarmState(false);
//   }
// });

// window.addEventListener("focus", () => refreshAlarmState(false));

// window.addEventListener("online", updateConnectionStatus);
// window.addEventListener("offline", updateConnectionStatus);

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("sw.js")
//     .then((registration) => {
//       serviceWorkerRegistration = registration;
//     })
//     .catch(() => {});
//   navigator.serviceWorker.addEventListener(
//     "message",
//     handleServiceWorkerMessage,
//   );
// }

// loadState();
// applyLanguage();
// updateNotificationButton();
// updateConnectionStatus();
// refreshAlarmState(false);
// updateDisplay();

//==================================
/* ==========================================================
   Kallaa Tech — Cycle Timer
   نسخة مصححة: إصلاح توقف التنفيذ، المستمعات المكررة، والأداء.
   ========================================================== */

// ---------- عناصر الواجهة ----------
const mainTime = document.querySelector("#mainTime");
const modeText = document.querySelector("#modeText");
const languageInput = document.querySelector("#languageInput");
const languageLabel = document.querySelector("#languageLabel");
const eyebrowText = document.querySelector("#eyebrowText");
const appTitle = document.querySelector("#app-title");
const subheadText = document.querySelector("#subheadText");
const progressCircle = document.querySelector("#progressCircle");
const completedCount = document.querySelector("#completedCount");
const completedLabel = document.querySelector("#completedLabel");
const targetCountText = document.querySelector("#targetCountText");
const targetLabel = document.querySelector("#targetLabel");
const remainingCount = document.querySelector("#remainingCount");
const remainingLabel = document.querySelector("#remainingLabel");
const pieces = document.querySelector("#pieces");
const durationLabel = document.querySelector("#durationLabel");
const minutesInput = document.querySelector("#minutesInput");
const minutesLabel = document.querySelector("#minutesLabel");
const secondsInput = document.querySelector("#secondsInput");
const secondsLabel = document.querySelector("#secondsLabel");
const ringDurationLabel = document.querySelector("#ringDurationLabel");
const ringSecondsInput = document.querySelector("#ringSecondsInput");
const ring3Option = document.querySelector("#ring3Option");
const ring5Option = document.querySelector("#ring5Option");
const ring10Option = document.querySelector("#ring10Option");
const ring15Option = document.querySelector("#ring15Option");
const targetInputLabel = document.querySelector("#targetInputLabel");
const targetInput = document.querySelector("#targetInput");
const toneLabel = document.querySelector("#toneLabel");
const toneInput = document.querySelector("#toneInput");
const toneClassicOption = document.querySelector("#toneClassicOption");
const toneSoftOption = document.querySelector("#toneSoftOption");
const toneUrgentOption = document.querySelector("#toneUrgentOption");
const startButton = document.querySelector("#startButton");
const pauseButton = document.querySelector("#pauseButton");
const resetButton = document.querySelector("#resetButton");
const notifyButton = document.querySelector("#notifyButton");
const refreshButton = document.querySelector("#refreshButton");
const offlineStatus = document.querySelector("#offlineStatus");
const message = document.querySelector("#message");
const completionScreen = document.querySelector("#completionScreen");
const completionTitle = document.querySelector("#completionTitle");
const completionText = document.querySelector("#completionText");
const finishButton = document.querySelector("#finishButton");
const limitNote = document.querySelector("#limitNote");

const aboutButton = document.querySelector("#aboutButton");
const aboutScreen = document.querySelector("#aboutScreen");
const aboutCloseButton = document.querySelector("#aboutCloseButton");
const aboutTitle = document.querySelector("#aboutTitle");
const aboutTagline = document.querySelector("#aboutTagline");
const aboutIntro = document.querySelector("#aboutIntro");
const aboutLead = document.querySelector("#aboutLead");
const aboutSimplicityTitle = document.querySelector("#aboutSimplicityTitle");
const aboutSimplicityText = document.querySelector("#aboutSimplicityText");
const aboutReliabilityTitle = document.querySelector("#aboutReliabilityTitle");
const aboutReliabilityText = document.querySelector("#aboutReliabilityText");
const aboutPrivacyTitle = document.querySelector("#aboutPrivacyTitle");
const aboutPrivacyText = document.querySelector("#aboutPrivacyText");
const aboutAvailableTitle = document.querySelector("#aboutAvailableTitle");
const aboutAvailableText = document.querySelector("#aboutAvailableText");
const aboutMissionTitle = document.querySelector("#aboutMissionTitle");
const aboutMissionText = document.querySelector("#aboutMissionText");
const aboutThanks = document.querySelector("#aboutThanks");
const aboutContactLabel = document.querySelector("#aboutContactLabel");

const STORAGE_KEY = "cycle-timer-state-v1";
const RING_CIRCUMFERENCE = 2 * Math.PI * 52;
const MAX_VISIBLE_PIECES = 200;

// تشخيص: يظهر أي خطأ JS مباشرة في شريط الرسالة بدل أن يتوقف الملف بصمت
window.addEventListener("error", (e) => {
  if (message)
    message.textContent = `JS: ${e.message} @${(e.filename || "").split("/").pop()}:${e.lineno}`;
});
window.addEventListener("unhandledrejection", (e) => {
  if (message)
    message.textContent = `PROMISE: ${e.reason?.message || e.reason}`;
});

// هل نعمل داخل تطبيق Capacitor الأصلي؟
const isNativeApp =
  typeof window.Capacitor !== "undefined" &&
  window.Capacitor.isNativePlatform?.();

let audioContext = null;
let tickTimer = null;
let ringTimer = null;
let vibrationTimer = null;
let wakeLock = null;
let endAt = 0;
let ringEndAt = 0;
let ringRemainingMs = 0;
let shouldCompleteAfterRing = false;
let serviceWorkerRegistration = null;
let lastFocusedBeforeAbout = null;

const activeSoundNodes = new Set();

const state = {
  language: "ar",
  mode: "idle",
  durationSeconds: 300,
  remainingMs: 300000,
  ringSeconds: 5,
  tone: "classic",
  target: 10,
  completed: 0,
};

// ---------- النصوص ----------
const copy = {
  ar: {
    language: "اللغة",
    title: "🔥 مؤقت متكرر 🔥",
    eyebrow: "العداد الذكي",
    subhead: "كل دورة تنتهي بتنبيه قصير ثم يبدأ العد من جديد.",
    completed: "مكتمل",
    target: "الهدف",
    remaining: "المتبقي",
    duration: "مدة العد",
    minute: "دقيقة",
    second: "ثانية",
    ringDuration: "مدة صوت التنبيه",
    seconds3: "3 ثواني",
    seconds5: "5 ثواني",
    seconds10: "10 ثواني",
    seconds15: "15 ثانية",
    targetInput: "عدد القطع المطلوب",
    tone: "نغمة الرنين",
    classic: "كلاسيكية",
    soft: "هادئة",
    urgent: "قوية",
    notifyEnable: "تفعيل الإشعارات",
    notifyEnabled: "الإشعارات مفعلة",
    notifyDenied: "الإشعارات مرفوضة",
    notifyUnsupported: "الإشعارات غير مدعومة",
    refresh: "تحديث",
    online: "متصل",
    offline: "بدون إنترنت",
    start: "بدء",
    restart: "إعادة",
    pause: "إيقاف مؤقت",
    resume: "متابعة",
    reset: "تصفير",
    done: "تم",
    close: "إغلاق",
    ready: "جاهز",
    running: "العد يعمل",
    paused: "متوقف مؤقتًا",
    ringing: "تنبيه",
    complete: "مكتمل",
    choose: "اختر الإعدادات ثم اضغط بدء.",
    cycle: (current, total) => `الدورة ${current} من ${total}`,
    pausedMessage: "تم إيقاف العد مؤقتًا.",
    ringPaused: "تم إيقاف صوت التنبيه مؤقتًا.",
    ringResumed: "تمت متابعة صوت التنبيه.",
    cycleDone: "انتهت دورة. سيبدأ العد التالي بعد التنبيه.",
    finalCycleDone: "انتهت آخر دورة. سيظهر تنبيه الاكتمال بعد الصوت.",
    completeMessage: "اكتمل العدد المطلوب.",
    completionTitle: "اكتمل العدد",
    notificationReadyTitle: "تم تفعيل الإشعارات",
    notificationReadyBody: "سيظهر إشعار عند نهاية الدورة وعند اكتمال العدد.",
    notificationPermissionDenied: "لم يتم تفعيل الإشعارات من المتصفح.",
    open: "فتح",
    cycleNotificationTitle: "انتهت دورة",
    finalNotificationTitle: "انتهت آخر دورة",
    runningNotificationTitle: "العداد يعمل",
    runningNotificationBody: (current, target) =>
      `الدورة ${current} من ${target}. استخدم زر الإيقاف المؤقت من الإشعار إن ظهر على شاشة القفل.`,
    cycleNotificationBody: (completed, target) =>
      `تمت إضافة قطعة. المكتمل ${completed} من ${target}.`,
    finalNotificationBody: "سيظهر تنبيه اكتمال العدد بعد صوت التنبيه.",
    completeNotificationTitle: "اكتمل العدد",
    completeNotificationBody: (completed, target) =>
      `اكتمل ${completed} من ${target}.`,
    refreshed: "تم تحديث المعلومات من المنبه الذي يعمل.",
    noRunningAlarm: "لا توجد معلومات لمنبه يعمل حاليًا.",
    limit:
      "يعمل بدون إنترنت بعد فتحه مرة واحدة. عند قفل الهاتف قد يوقف النظام مؤقتات المتصفح؛ للحصول على رنين مضمون والهاتف مقفل تمامًا تحتاج نسخة تطبيق أصلي.",
    about: "من نحن",
    aboutTitle: "من نحن",
    aboutTagline: "وقت أوضح، يوم أسهل",
    aboutIntro:
      "مؤقت الدورات من Kallaa Tech أداة بسيطة وموثوقة لتنظيم وقتك، دورة بعد دورة، دون تعقيد أو تشتيت.",
    aboutLead: "صممناه ليبقى بسيطًا.",
    aboutSimplicityTitle: "البساطة",
    aboutSimplicityText:
      "واجهة واضحة تساعدك على ضبط المؤقت والبدء بسرعة، مع إبقاء كل ما لا تحتاجه بعيدًا عن طريقك.",
    aboutReliabilityTitle: "الموثوقية",
    aboutReliabilityText:
      "تنبيهات صوتية ومرئية ومتابعة دقيقة للتقدم حتى تعرف دائمًا أين وصلت.",
    aboutPrivacyTitle: "الخصوصية",
    aboutPrivacyText:
      "لا نجمع بيانات شخصية. إعداداتك وحالة المؤقت تبقى على جهازك.",
    aboutAvailableTitle: "متاح للجميع",
    aboutAvailableText: "تجربة مجانية بلا إعلانات مزعجة أو خطوات غير ضرورية.",
    aboutMissionTitle: "رسالتنا",
    aboutMissionText:
      "نؤمن أن التكنولوجيا الجيدة تجعل الحياة أسهل، لذلك صممنا المؤقت ليكون رفيقًا يوميًا هادئًا يساعدك على التركيز وإنجاز ما بدأته.",
    aboutThanks: "شكرًا لاستخدامك مؤقت الدورات.",
    aboutContactLabel: "للتواصل:",
  },
  en: {
    language: "Language",
    title: "🔥 Repeating Timer 🔥",
    eyebrow: "Smart Counter",
    subhead:
      "Each cycle ends with a short alarm, then the countdown starts again.",
    completed: "Completed",
    target: "Target",
    remaining: "Remaining",
    duration: "Countdown duration",
    minute: "minute",
    second: "second",
    ringDuration: "Alarm sound duration",
    seconds3: "3 seconds",
    seconds5: "5 seconds",
    seconds10: "10 seconds",
    seconds15: "15 seconds",
    targetInput: "Required pieces",
    tone: "Alarm tone",
    classic: "Classic",
    soft: "Soft",
    urgent: "Strong",
    notifyEnable: "Enable notifications",
    notifyEnabled: "Notifications enabled",
    notifyDenied: "Notifications blocked",
    notifyUnsupported: "Notifications unsupported",
    refresh: "Refresh",
    online: "Online",
    offline: "Offline",
    start: "Start",
    restart: "Restart",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    done: "Done",
    close: "Close",
    ready: "Ready",
    running: "Running",
    paused: "Paused",
    ringing: "Alarm",
    complete: "Complete",
    choose: "Choose the settings, then press Start.",
    cycle: (current, total) => `Cycle ${current} of ${total}`,
    pausedMessage: "The countdown is paused.",
    ringPaused: "The alarm sound is paused.",
    ringResumed: "The alarm sound resumed.",
    cycleDone: "One cycle ended. The next countdown starts after the alarm.",
    finalCycleDone:
      "The final cycle ended. Completion appears after the alarm.",
    completeMessage: "The required count is complete.",
    completionTitle: "Count complete",
    notificationReadyTitle: "Notifications enabled",
    notificationReadyBody:
      "A notification will appear at cycle end and when the target is complete.",
    notificationPermissionDenied: "Browser notifications were not enabled.",
    open: "Open",
    cycleNotificationTitle: "Cycle ended",
    finalNotificationTitle: "Final cycle ended",
    runningNotificationTitle: "Timer running",
    runningNotificationBody: (current, target) =>
      `Cycle ${current} of ${target}. You can pause from the lock-screen notification if it appears.`,
    cycleNotificationBody: (completed, target) =>
      `One piece was added. Completed ${completed} of ${target}.`,
    finalNotificationBody:
      "The completion notification will appear after the alarm sound.",
    completeNotificationTitle: "Count complete",
    completeNotificationBody: (completed, target) =>
      `${completed} of ${target} complete.`,
    refreshed: "Information refreshed from the running alarm.",
    noRunningAlarm: "No running alarm information was found.",
    limit:
      "Works offline after the first launch. When the phone is locked, browser timers may pause; a native app build is needed for a guaranteed alarm.",
    about: "About us",
    aboutTitle: "About us",
    aboutTagline: "Clearer time, easier day",
    aboutIntro:
      "Cycle Timer by Kallaa Tech is a simple, reliable tool to organize your time, cycle after cycle, without clutter or distraction.",
    aboutLead: "We designed it to stay simple.",
    aboutSimplicityTitle: "Simplicity",
    aboutSimplicityText:
      "A clear interface that lets you set the timer and start fast, keeping everything you don't need out of your way.",
    aboutReliabilityTitle: "Reliability",
    aboutReliabilityText:
      "Sound and visual alerts with accurate progress tracking, so you always know where you stand.",
    aboutPrivacyTitle: "Privacy",
    aboutPrivacyText:
      "We collect no personal data. Your settings and timer state stay on your device.",
    aboutAvailableTitle: "Open to everyone",
    aboutAvailableText:
      "Free to use, with no intrusive ads and no unnecessary steps.",
    aboutMissionTitle: "Our mission",
    aboutMissionText:
      "We believe good technology makes life easier, so we built this timer as a calm daily companion that helps you focus and finish what you started.",
    aboutThanks: "Thank you for using Cycle Timer.",
    aboutContactLabel: "Contact:",
  },
  tr: {
    language: "Dil",
    title: "🔥 Tekrarlı Zamanlayıcı 🔥",
    eyebrow: "Akıllı Sayaç",
    subhead: "Her tur kısa bir uyarıyla biter, sonra sayaç yeniden başlar.",
    completed: "Tamamlanan",
    target: "Hedef",
    remaining: "Kalan",
    duration: "Sayaç süresi",
    minute: "dakika",
    second: "saniye",
    ringDuration: "Alarm süresi",
    seconds3: "3 saniye",
    seconds5: "5 saniye",
    seconds10: "10 saniye",
    seconds15: "15 saniye",
    targetInput: "Gerekli parça sayısı",
    tone: "Alarm sesi",
    classic: "Klasik",
    soft: "Yumuşak",
    urgent: "Güçlü",
    notifyEnable: "Bildirimleri aç",
    notifyEnabled: "Bildirimler açık",
    notifyDenied: "Bildirimler engelli",
    notifyUnsupported: "Bildirim desteklenmiyor",
    refresh: "Yenile",
    online: "Çevrimiçi",
    offline: "Çevrimdışı",
    start: "Başlat",
    restart: "Yeniden",
    pause: "Duraklat",
    resume: "Devam et",
    reset: "Sıfırla",
    done: "Tamam",
    close: "Kapat",
    ready: "Hazır",
    running: "Sayaç çalışıyor",
    paused: "Duraklatıldı",
    ringing: "Alarm",
    complete: "Tamamlandı",
    choose: "Ayarları seçip başlatın.",
    cycle: (current, total) => `Tur ${current} / ${total}`,
    pausedMessage: "Sayaç duraklatıldı.",
    ringPaused: "Alarm sesi duraklatıldı.",
    ringResumed: "Alarm sesi devam ediyor.",
    cycleDone: "Bir tur bitti. Alarmdan sonra sonraki tur başlayacak.",
    finalCycleDone:
      "Son tur bitti. Alarmdan sonra tamamlandı bildirimi görünecek.",
    completeMessage: "Hedef sayı tamamlandı.",
    completionTitle: "Sayı tamamlandı",
    notificationReadyTitle: "Bildirimler açıldı",
    notificationReadyBody:
      "Tur sonunda ve hedef tamamlandığında bildirim gösterilecek.",
    notificationPermissionDenied: "Tarayıcı bildirim izni verilmedi.",
    open: "Aç",
    cycleNotificationTitle: "Tur bitti",
    finalNotificationTitle: "Son tur bitti",
    runningNotificationTitle: "Sayaç çalışıyor",
    runningNotificationBody: (current, target) =>
      `Tur ${current} / ${target}. Kilit ekranında görünürse bildirimden duraklatabilirsiniz.`,
    cycleNotificationBody: (completed, target) =>
      `Bir parça eklendi. Tamamlanan ${completed} / ${target}.`,
    finalNotificationBody: "Alarmdan sonra tamamlandı bildirimi gösterilecek.",
    completeNotificationTitle: "Sayı tamamlandı",
    completeNotificationBody: (completed, target) =>
      `${completed} / ${target} tamamlandı.`,
    refreshed: "Bilgiler çalışan alarmdan yenilendi.",
    noRunningAlarm: "Çalışan alarm bilgisi bulunamadı.",
    limit:
      "İlk açılıştan sonra çevrimdışı çalışır. Telefon kilitliyken sistem tarayıcı zamanlayıcılarını durdurabilir; kesin alarm için yerel uygulama gerekir.",
    about: "Hakkımızda",
    aboutTitle: "Hakkımızda",
    aboutTagline: "Daha net zaman, daha kolay gün",
    aboutIntro:
      "Kallaa Tech'in Tur Zamanlayıcısı; zamanınızı tur tur düzenlemeniz için karmaşadan uzak, basit ve güvenilir bir araçtır.",
    aboutLead: "Basit kalması için tasarladık.",
    aboutSimplicityTitle: "Basitlik",
    aboutSimplicityText:
      "Zamanlayıcıyı hızlıca ayarlayıp başlatmanızı sağlayan sade bir arayüz; ihtiyacınız olmayan her şey yolunuzdan uzakta.",
    aboutReliabilityTitle: "Güvenilirlik",
    aboutReliabilityText:
      "Sesli ve görsel uyarılar ile net ilerleme takibi; nerede olduğunuzu her zaman bilirsiniz.",
    aboutPrivacyTitle: "Gizlilik",
    aboutPrivacyText:
      "Kişisel veri toplamıyoruz. Ayarlarınız ve zamanlayıcı durumu cihazınızda kalır.",
    aboutAvailableTitle: "Herkes için",
    aboutAvailableText:
      "Rahatsız edici reklamlar ve gereksiz adımlar olmadan ücretsiz kullanım.",
    aboutMissionTitle: "Misyonumuz",
    aboutMissionText:
      "İyi teknolojinin hayatı kolaylaştırdığına inanıyoruz; bu yüzden zamanlayıcıyı, odaklanmanıza ve başladığınızı bitirmenize yardım eden sakin bir günlük yardımcı olarak tasarladık.",
    aboutThanks: "Tur Zamanlayıcısı'nı kullandığınız için teşekkürler.",
    aboutContactLabel: "İletişim:",
  },
};

function t(key, ...args) {
  const pack = copy[state.language] || copy.ar;
  const value = pack[key] ?? copy.ar[key] ?? "";
  return typeof value === "function" ? value(...args) : value;
}

// جدول واحد يربط كل عنصر بمفتاح الترجمة (بدل تكرار عشرات الأسطر)
const TEXT_BINDINGS = [
  [languageLabel, "language"],
  [eyebrowText, "eyebrow"],
  [appTitle, "title"],
  [subheadText, "subhead"],
  [completedLabel, "completed"],
  [targetLabel, "target"],
  [remainingLabel, "remaining"],
  [durationLabel, "duration"],
  [minutesLabel, "minute"],
  [secondsLabel, "second"],
  [ringDurationLabel, "ringDuration"],
  [ring3Option, "seconds3"],
  [ring5Option, "seconds5"],
  [ring10Option, "seconds10"],
  [ring15Option, "seconds15"],
  [targetInputLabel, "targetInput"],
  [toneLabel, "tone"],
  [toneClassicOption, "classic"],
  [toneSoftOption, "soft"],
  [toneUrgentOption, "urgent"],
  [resetButton, "reset"],
  [refreshButton, "refresh"],
  [finishButton, "done"],
  [completionTitle, "completionTitle"],
  [limitNote, "limit"],
  [aboutButton, "about"],
  [aboutTitle, "aboutTitle"],
  [aboutTagline, "aboutTagline"],
  [aboutIntro, "aboutIntro"],
  [aboutLead, "aboutLead"],
  [aboutSimplicityTitle, "aboutSimplicityTitle"],
  [aboutSimplicityText, "aboutSimplicityText"],
  [aboutReliabilityTitle, "aboutReliabilityTitle"],
  [aboutReliabilityText, "aboutReliabilityText"],
  [aboutPrivacyTitle, "aboutPrivacyTitle"],
  [aboutPrivacyText, "aboutPrivacyText"],
  [aboutAvailableTitle, "aboutAvailableTitle"],
  [aboutAvailableText, "aboutAvailableText"],
  [aboutMissionTitle, "aboutMissionTitle"],
  [aboutMissionText, "aboutMissionText"],
  [aboutThanks, "aboutThanks"],
  [aboutContactLabel, "aboutContactLabel"],
];

progressCircle.style.strokeDasharray = RING_CIRCUMFERENCE;

// ---------- أدوات عامة ----------
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function setText(element, value) {
  if (element && element.textContent !== value) element.textContent = value;
}

function formatTime(totalSeconds) {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function readSettings() {
  const minutes = clamp(Number(minutesInput.value || 0), 0, 180);
  const seconds = clamp(Number(secondsInput.value || 0), 0, 59);
  const durationSeconds = Math.max(1, minutes * 60 + seconds);

  state.durationSeconds = durationSeconds;
  state.ringSeconds = clamp(Number(ringSecondsInput.value || 5), 1, 30);
  state.tone = toneInput.value || "classic";
  state.target = Math.max(1, Math.floor(Number(targetInput.value || 1)));
  state.completed = Math.min(state.completed, state.target);

  minutesInput.value = Math.floor(durationSeconds / 60);
  secondsInput.value = durationSeconds % 60;
  targetInput.value = state.target;
}

function syncInputsFromState() {
  minutesInput.value = Math.floor(state.durationSeconds / 60);
  secondsInput.value = state.durationSeconds % 60;
  ringSecondsInput.value = String(state.ringSeconds);
  toneInput.value = state.tone;
  languageInput.value = state.language;
  targetInput.value = state.target;
  pauseButton.disabled = state.mode === "idle" || state.mode === "complete";
  setText(
    startButton,
    state.mode === "running" || state.mode === "ringing"
      ? t("restart")
      : t("start"),
  );
}

// ---------- الحفظ والاسترجاع ----------
function saveState() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        durationSeconds: state.durationSeconds,
        remainingMs: state.remainingMs,
        ringSeconds: state.ringSeconds,
        tone: state.tone,
        language: state.language,
        target: state.target,
        completed: state.completed,
        mode: state.mode,
        endAt,
        ringEndAt,
        ringRemainingMs,
        shouldCompleteAfterRing,
      }),
    );
  } catch {
    /* التخزين ممتلئ أو محظور — نتجاهل بهدوء */
  }
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (!saved.durationSeconds) return;

    state.durationSeconds = saved.durationSeconds;
    state.ringSeconds = saved.ringSeconds || 5;
    state.tone = saved.tone || "classic";
    state.language = copy[saved.language] ? saved.language : "ar";
    state.target = saved.target || 10;
    state.completed = saved.completed || 0;
    state.mode = saved.mode || "idle";
    state.remainingMs =
      Number(saved.remainingMs) || saved.durationSeconds * 1000;
    endAt = saved.endAt || 0;
    ringEndAt = saved.ringEndAt || 0;
    ringRemainingMs = saved.ringRemainingMs || 0;
    shouldCompleteAfterRing = Boolean(saved.shouldCompleteAfterRing);

    if (state.mode === "running" && endAt > 0) {
      state.remainingMs = Math.max(0, endAt - Date.now());
      if (state.remainingMs <= 0) {
        state.mode = "idle";
        state.remainingMs = state.durationSeconds * 1000;
      }
    }

    if (state.mode === "ringing" && ringEndAt > 0 && Date.now() >= ringEndAt) {
      state.mode = shouldCompleteAfterRing ? "complete" : "idle";
      if (state.mode === "idle")
        state.remainingMs = state.durationSeconds * 1000;
    }

    syncInputsFromState();
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ---------- الإشعارات ----------
function notificationsSupported() {
  return "Notification" in window;
}

function updateNotificationButton() {
  if (!notificationsSupported()) {
    setText(notifyButton, t("notifyUnsupported"));
    notifyButton.disabled = true;
    return;
  }

  if (Notification.permission === "granted") {
    setText(notifyButton, t("notifyEnabled"));
    notifyButton.disabled = true;
    return;
  }

  if (Notification.permission === "denied") {
    setText(notifyButton, t("notifyDenied"));
    notifyButton.disabled = true;
    return;
  }

  setText(notifyButton, t("notifyEnable"));
  notifyButton.disabled = false;
}

async function requestNotifications() {
  if (!notificationsSupported()) return;

  const permission = await Notification.requestPermission();
  updateNotificationButton();

  if (permission === "granted") {
    setText(message, t("notificationReadyTitle"));
    showNotification(t("notificationReadyTitle"), t("notificationReadyBody"));
  } else {
    setText(message, t("notificationPermissionDenied"));
  }
}

async function showNotification(title, body) {
  if (!notificationsSupported() || Notification.permission !== "granted")
    return;

  const baseOptions = {
    body,
    icon: "icon.svg",
    badge: "icon.svg",
    tag: "cycle-timer",
    requireInteraction: state.mode === "complete",
    data: { language: state.language, commandable: true },
  };

  try {
    if (serviceWorkerRegistration?.showNotification) {
      // actions و renotify مدعومة فقط لإشعارات الـ service worker
      await serviceWorkerRegistration.showNotification(title, {
        ...baseOptions,
        renotify: true,
        actions: [
          { action: "pause", title: t("pause") },
          { action: "open", title: t("open") },
        ],
      });
      return;
    }
    new Notification(title, baseOptions);
  } catch {
    /* بعض المتصفحات ترفض الإشعار — لا نوقف المؤقت بسببها */
  }
}

function updateConnectionStatus() {
  const isOnline = navigator.onLine;
  setText(offlineStatus, isOnline ? t("online") : t("offline"));
  offlineStatus.classList.toggle("offline", !isOnline);
}

// ---------- جسر التطبيق الأصلي (Android) ----------
function hasNativeAlarm() {
  return typeof window.AndroidAlarm !== "undefined";
}

function startNativeAlarm() {
  if (!hasNativeAlarm()) return;
  window.AndroidAlarm.start(
    state.durationSeconds,
    state.ringSeconds,
    state.target,
    state.tone,
    state.language,
  );
}

function pauseNativeAlarm() {
  if (!hasNativeAlarm()) return;
  window.AndroidAlarm.pauseOrResume();
}

function stopNativeAlarm() {
  if (!hasNativeAlarm()) return;
  window.AndroidAlarm.stop();
}

function updateNativeAlarm() {
  if (!hasNativeAlarm() || typeof window.AndroidAlarm.update !== "function")
    return;
  window.AndroidAlarm.update(
    state.durationSeconds,
    state.ringSeconds,
    state.target,
    state.tone,
    state.language,
  );
}

function getNativeAlarmState() {
  if (!hasNativeAlarm() || typeof window.AndroidAlarm.getState !== "function")
    return null;
  try {
    return JSON.parse(window.AndroidAlarm.getState() || "{}");
  } catch {
    return null;
  }
}

function applyAlarmSnapshot(snapshot, showMessage = false) {
  if (!snapshot || !snapshot.mode || snapshot.mode === "IDLE") {
    if (showMessage) setText(message, t("noRunningAlarm"));
    return false;
  }

  state.mode = String(snapshot.mode).toLowerCase();
  state.durationSeconds = Number(
    snapshot.durationSeconds || state.durationSeconds,
  );
  state.ringSeconds = Number(snapshot.ringSeconds || state.ringSeconds);
  state.target = Number(snapshot.target || state.target);
  state.completed = Number(snapshot.completed || 0);
  state.tone = snapshot.tone || state.tone;
  if (copy[snapshot.language]) state.language = snapshot.language;
  shouldCompleteAfterRing = Boolean(snapshot.completeAfterRing);
  endAt = Number(snapshot.phaseEndAt || 0);
  ringEndAt = state.mode === "ringing" ? endAt : 0;

  if (state.mode === "running") {
    state.remainingMs = Math.max(0, endAt - Date.now());
  } else if (state.mode === "paused") {
    state.remainingMs = Math.max(0, Number(snapshot.remainingMs || 0));
  } else if (state.mode === "ringing") {
    state.remainingMs = 0;
  } else if (state.mode === "complete") {
    state.remainingMs = 0;
    setText(completionText, `${state.completed} / ${state.target}`);
    completionScreen.hidden = false;
  }

  syncInputsFromState();
  applyLanguage();

  if (state.mode === "running") startTicking();
  else stopTicking();

  saveState();
  updateDisplay();
  if (showMessage) setText(message, t("refreshed"));
  return true;
}

function refreshAlarmState(showMessage = true) {
  const nativeState = getNativeAlarmState();
  if (applyAlarmSnapshot(nativeState, showMessage)) return;

  // بدون تطبيق أصلي: نعيد حساب الوقت المتبقي محليًا فقط
  if (state.mode === "running" && endAt > 0) {
    state.remainingMs = Math.max(0, endAt - Date.now());
    startTicking();
    updateDisplay();
    if (showMessage) setText(message, t("refreshed"));
    return;
  }

  if (state.mode === "ringing" && ringEndAt > 0 && Date.now() >= ringEndAt) {
    startTicking();
  }

  updateDisplay();
  if (showMessage) setText(message, t("noRunningAlarm"));
}

// ---------- اللغة ----------
function applyLanguage() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
  document.title = t("eyebrow");
  languageInput.value = state.language;

  for (const [element, key] of TEXT_BINDINGS) setText(element, t(key));

  setText(
    startButton,
    state.mode === "running" || state.mode === "ringing"
      ? t("restart")
      : t("start"),
  );
  setText(pauseButton, state.mode === "paused" ? t("resume") : t("pause"));

  if (aboutCloseButton) aboutCloseButton.setAttribute("aria-label", t("close"));

  updateNotificationButton();
  updateConnectionStatus();
}

function changeLanguage() {
  if (!copy[languageInput.value]) return;
  state.language = languageInput.value;
  applyLanguage();
  if (state.mode === "idle" || state.mode === "complete") {
    setText(message, t("choose"));
  }
  updateNativeAlarm();
  saveState();
  updateDisplay();
}

// ---------- الصوت ----------
async function unlockAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  audioContext ||= new AudioCtx();
  if (audioContext.state === "suspended") {
    try {
      await audioContext.resume();
    } catch {
      /* يحتاج تفاعل المستخدم */
    }
  }
}

function playTone(frequencies, duration = 0.5, type = "square", volume = 0.42) {
  if (!audioContext || audioContext.state !== "running") return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = type;
  frequencies.forEach((frequency, index) => {
    oscillator.frequency.setValueAtTime(
      frequency,
      audioContext.currentTime + index * 0.16,
    );
  });
  gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    volume,
    audioContext.currentTime + 0.03,
  );
  gain.gain.exponentialRampToValueAtTime(
    0.0001,
    audioContext.currentTime + duration,
  );

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration + 0.05);

  activeSoundNodes.add(oscillator);
  oscillator.onended = () => {
    activeSoundNodes.delete(oscillator);
    try {
      gain.disconnect();
      oscillator.disconnect();
    } catch {
      /* تم فصلها مسبقًا */
    }
  };
}

function playBeep() {
  if (state.tone === "soft")
    return playTone([523, 659, 784], 0.62, "sine", 0.3);
  if (state.tone === "urgent")
    return playTone([1040, 740, 1040], 0.45, "sawtooth", 0.48);
  playTone([920, 700], 0.5, "square", 0.42);
}

function playCompleteTone() {
  playTone([523, 659, 784, 1046], 0.9, "triangle", 0.46);
  window.setTimeout(
    () => playTone([1046, 784, 1046], 0.7, "triangle", 0.42),
    450,
  );
}

function vibrate() {
  navigator.vibrate?.([300, 120, 300]);
}

function stopRingingSound() {
  window.clearInterval(ringTimer);
  window.clearInterval(vibrationTimer);
  ringTimer = null;
  vibrationTimer = null;
  navigator.vibrate?.(0);

  // إيقاف أي نغمة ما زالت تعمل فورًا
  for (const node of activeSoundNodes) {
    try {
      node.stop();
    } catch {
      /* توقفت بالفعل */
    }
  }
  activeSoundNodes.clear();
}

function startRingingSound() {
  stopRingingSound();
  playBeep();
  vibrate();
  ringTimer = window.setInterval(playBeep, 850);
  vibrationTimer = window.setInterval(vibrate, 1100);
}

// ---------- قفل الشاشة ----------
async function requestWakeLock() {
  if (!("wakeLock" in navigator) || wakeLock) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener?.("release", () => {
      wakeLock = null;
    });
  } catch {
    wakeLock = null;
  }
}

async function releaseWakeLock() {
  if (!wakeLock) return;
  try {
    await wakeLock.release();
  } catch {
    /* تم تحريره مسبقًا */
  } finally {
    wakeLock = null;
  }
}

// ---------- العرض (محسّن: لا يعيد بناء DOM كل 200ms) ----------
let pieceNodes = [];
let renderedPieceCount = -1;
let renderedCompleted = -1;
let renderedTime = "";
let renderedOffset = -1;
let renderedMode = "";

function updatePieces() {
  const visiblePieces = Math.min(state.target, MAX_VISIBLE_PIECES);

  if (renderedPieceCount !== visiblePieces) {
    const fragment = document.createDocumentFragment();
    pieceNodes = new Array(visiblePieces);
    for (let index = 0; index < visiblePieces; index += 1) {
      const piece = document.createElement("span");
      piece.className = "piece";
      pieceNodes[index] = piece;
      fragment.append(piece);
    }
    pieces.replaceChildren(fragment);
    renderedPieceCount = visiblePieces;
    renderedCompleted = -1;
  }

  if (renderedCompleted !== state.completed) {
    for (let index = 0; index < pieceNodes.length; index += 1) {
      pieceNodes[index].classList.toggle("done", index < state.completed);
    }
    renderedCompleted = state.completed;
  }
}

const MODE_TEXT_KEYS = {
  idle: "ready",
  running: "running",
  paused: "paused",
  ringing: "ringing",
  complete: "complete",
};

function updateDisplay() {
  const remainingSeconds =
    state.mode === "ringing"
      ? Math.max(0, (ringEndAt - Date.now()) / 1000)
      : state.remainingMs / 1000;

  const progress =
    state.mode === "ringing"
      ? 1
      : 1 - state.remainingMs / (state.durationSeconds * 1000);

  const timeText = formatTime(remainingSeconds);
  if (timeText !== renderedTime) {
    mainTime.textContent = timeText;
    renderedTime = timeText;
  }

  const offset = Math.round(RING_CIRCUMFERENCE * (1 - clamp(progress, 0, 1)));
  if (offset !== renderedOffset) {
    progressCircle.style.strokeDashoffset = offset;
    renderedOffset = offset;
  }

  setText(completedCount, String(state.completed));
  setText(targetCountText, String(state.target));
  setText(remainingCount, String(Math.max(0, state.target - state.completed)));
  updatePieces();

  if (renderedMode !== state.mode) {
    document.body.dataset.mode = state.mode;
    renderedMode = state.mode;
  }
  setText(modeText, t(MODE_TEXT_KEYS[state.mode] || "ready"));
}

// ---------- منطق المؤقت ----------
function startTicking() {
  window.clearInterval(tickTimer);
  tickTimer = window.setInterval(tick, 200);
}

function stopTicking() {
  window.clearInterval(tickTimer);
  tickTimer = null;
}

function beginCountdown() {
  state.mode = "running";
  state.remainingMs = state.durationSeconds * 1000;
  endAt = Date.now() + state.remainingMs;
  setText(startButton, t("restart"));
  pauseButton.disabled = false;
  setText(pauseButton, t("pause"));
  setText(message, t("cycle", state.completed + 1, state.target));
  showNotification(
    t("runningNotificationTitle"),
    t("runningNotificationBody", state.completed + 1, state.target),
  );
  saveState();
  startTicking();
  updateDisplay();
}

function finishCycle() {
  state.completed = clamp(state.completed + 1, 0, state.target);
  shouldCompleteAfterRing = state.completed >= state.target;

  state.mode = "ringing";
  state.remainingMs = 0;
  ringEndAt = Date.now() + state.ringSeconds * 1000;
  saveState();

  setText(
    message,
    shouldCompleteAfterRing ? t("finalCycleDone") : t("cycleDone"),
  );
  showNotification(
    shouldCompleteAfterRing
      ? t("finalNotificationTitle")
      : t("cycleNotificationTitle"),
    shouldCompleteAfterRing
      ? t("finalNotificationBody")
      : t("cycleNotificationBody", state.completed, state.target),
  );
  startRingingSound();
  updateDisplay();
}

function completeTarget() {
  state.mode = "complete";
  stopTicking();
  stopRingingSound();
  releaseWakeLock();
  startButton.disabled = false;
  setText(startButton, t("start"));
  pauseButton.disabled = true;
  setText(completionText, `${state.completed} / ${state.target}`);
  completionScreen.hidden = false;
  setText(message, t("completeMessage"));
  showNotification(
    t("completeNotificationTitle"),
    t("completeNotificationBody", state.completed, state.target),
  );
  playCompleteTone();
  vibrate();
  saveState();
  updateDisplay();
}

function tick() {
  if (state.mode === "running") {
    state.remainingMs = Math.max(0, endAt - Date.now());
    if (state.remainingMs <= 0) {
      finishCycle();
      return;
    }
  } else if (state.mode === "ringing") {
    if (Date.now() >= ringEndAt) {
      stopRingingSound();
      if (shouldCompleteAfterRing) {
        completeTarget();
        return;
      }
      beginCountdown();
      return;
    }
  } else {
    // لا حاجة للمؤقت في الحالات الساكنة
    stopTicking();
  }

  updateDisplay();
}

async function startTimer() {
  stopTicking();
  stopRingingSound();
  await unlockAudio();
  requestWakeLock();
  readSettings();
  completionScreen.hidden = true;
  startButton.disabled = false;

  if (
    state.mode === "running" ||
    state.mode === "ringing" ||
    state.mode === "complete"
  ) {
    state.completed = 0;
    shouldCompleteAfterRing = false;
    ringRemainingMs = 0;
  }

  beginCountdown();
  startNativeAlarm();
}

function pauseTimer() {
  pauseNativeAlarm();

  if (state.mode === "running") {
    state.remainingMs = Math.max(0, endAt - Date.now());
    state.mode = "paused";
    stopTicking();
    setText(pauseButton, t("resume"));
    setText(message, t("pausedMessage"));
    saveState();
    updateDisplay();
    return;
  }

  if (state.mode === "ringing") {
    ringRemainingMs = Math.max(1000, ringEndAt - Date.now());
    state.mode = "paused";
    stopRingingSound();
    stopTicking();
    setText(pauseButton, t("resume"));
    setText(message, t("ringPaused"));
    saveState();
    updateDisplay();
    return;
  }

  if (state.mode === "paused") {
    if (ringRemainingMs > 0) {
      state.mode = "ringing";
      ringEndAt = Date.now() + ringRemainingMs;
      ringRemainingMs = 0;
      startRingingSound();
      startTicking();
      setText(pauseButton, t("pause"));
      setText(message, t("ringResumed"));
      saveState();
      updateDisplay();
      return;
    }

    state.mode = "running";
    endAt = Date.now() + state.remainingMs;
    setText(pauseButton, t("pause"));
    setText(message, t("cycle", state.completed + 1, state.target));
    startTicking();
    saveState();
    updateDisplay();
  }
}

async function resetTimer() {
  stopNativeAlarm();
  stopTicking();
  stopRingingSound();
  await releaseWakeLock();
  readSettings();
  state.mode = "idle";
  state.completed = 0;
  shouldCompleteAfterRing = false;
  ringRemainingMs = 0;
  endAt = 0;
  ringEndAt = 0;
  state.remainingMs = state.durationSeconds * 1000;
  startButton.disabled = false;
  setText(startButton, t("start"));
  pauseButton.disabled = true;
  setText(pauseButton, t("pause"));
  completionScreen.hidden = true;
  setText(message, t("choose"));
  saveState();
  updateDisplay();
}

function applySettingsPreview() {
  const previousMode = state.mode;
  const previousDurationMs = Math.max(1000, state.durationSeconds * 1000);
  const previousRemainingMs =
    previousMode === "running"
      ? Math.max(0, endAt - Date.now())
      : state.remainingMs;
  const remainingRatio = clamp(previousRemainingMs / previousDurationMs, 0, 1);

  readSettings();

  if (previousMode === "running") {
    state.remainingMs = Math.max(
      1000,
      Math.round(state.durationSeconds * 1000 * remainingRatio),
    );
    endAt = Date.now() + state.remainingMs;
    setText(message, t("cycle", state.completed + 1, state.target));
    updateNativeAlarm();
  } else if (previousMode === "paused") {
    state.remainingMs = Math.max(
      1000,
      Math.round(state.durationSeconds * 1000 * remainingRatio),
    );
    updateNativeAlarm();
  } else if (previousMode === "ringing") {
    updateNativeAlarm();
  } else {
    state.remainingMs = state.durationSeconds * 1000;
  }

  saveState();
  updateDisplay();
}

// ---------- شاشة "من نحن" ----------
function openAbout() {
  if (!aboutScreen) return;
  lastFocusedBeforeAbout = document.activeElement;
  aboutScreen.hidden = false;
  aboutCloseButton?.focus();
}

function closeAbout() {
  if (!aboutScreen) return;
  aboutScreen.hidden = true;
  lastFocusedBeforeAbout?.focus?.();
}

// ---------- رسائل الـ service worker ----------
function handleServiceWorkerMessage(event) {
  const command = event.data?.command;
  if (command === "pause-or-resume" && !pauseButton.disabled) pauseTimer();
}

// ---------- الأحداث (مجموعة واحدة فقط) ----------
startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
finishButton.addEventListener("click", resetTimer);
notifyButton.addEventListener("click", requestNotifications);
refreshButton.addEventListener("click", () => refreshAlarmState(true));
languageInput.addEventListener("change", changeLanguage);

aboutButton?.addEventListener("click", openAbout);
aboutCloseButton?.addEventListener("click", closeAbout);
aboutScreen?.addEventListener("click", (event) => {
  if (event.target === aboutScreen) closeAbout();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && aboutScreen && !aboutScreen.hidden)
    closeAbout();
});

for (const input of [
  minutesInput,
  secondsInput,
  ringSecondsInput,
  targetInput,
  toneInput,
]) {
  input.addEventListener("change", applySettingsPreview);
}
// الحقول الرقمية فقط تحتاج تحديثًا أثناء الكتابة
minutesInput.addEventListener("input", applySettingsPreview);
secondsInput.addEventListener("input", applySettingsPreview);
targetInput.addEventListener("input", applySettingsPreview);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible") return;
  if (state.mode === "running" || state.mode === "ringing") requestWakeLock();
  refreshAlarmState(false);
});

window.addEventListener("focus", () => refreshAlarmState(false));
window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

if (!isNativeApp && "serviceWorker" in navigator) {
  // الـ service worker مفيد فقط على الويب العادي، وليس داخل غلاف Capacitor
  navigator.serviceWorker
    .register("sw.js")
    .then((registration) => {
      serviceWorkerRegistration = registration;
    })
    .catch(() => {});
  navigator.serviceWorker.addEventListener(
    "message",
    handleServiceWorkerMessage,
  );
} else if (isNativeApp && "serviceWorker" in navigator) {
  // تنظيف أي تسجيل قديم قد يقدّم نسخة app.js مخبأة
  navigator.serviceWorker
    .getRegistrations?.()
    .then((list) => list.forEach((registration) => registration.unregister()));
}

// ربط إشعارات Capacitor المحلية بالاسم الصحيح (وليس المتغير العام غير المعرّف)
const LocalNotifications = window.Capacitor?.Plugins?.LocalNotifications;
if (LocalNotifications?.addListener) {
  LocalNotifications.addListener("localNotificationActionPerformed", () => {
    refreshAlarmState(false);
  });
}

// ---------- التشغيل الأولي ----------
loadState();
applyLanguage();
updateDisplay();
refreshAlarmState(false);
if (state.mode === "idle") setText(message, t("choose"));
if (state.mode === "running" || state.mode === "ringing") startTicking();
