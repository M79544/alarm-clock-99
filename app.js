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

const copy = {
  ar: {
    language: "اللغة",
    title: " 🔥 مؤقت متكرر 🔥",
    eyebrow: " العداد الذكي",
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
    aboutLink: "من نحن",
    aboutTitle: "من نحن",
    aboutTagline: "وقت أوضح، يوم أسهل",
    aboutIntro:
      "مؤقت الدورات من Kallaa Tech هو أداة بسيطة وموثوقة لمساعدتك على تنظيم وقتك، دورة بعد دورة، دون تعقيد أو تشتيت.",
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
      "نؤمن أن التكنولوجيا الجيدة تجعل الحياة أسهل. لذلك صممنا المؤقت ليكون رفيقًا يوميًا هادئًا يساعدك على التركيز وإنجاز ما بدأته.",
    aboutThanks: "شكرًا لاستخدامك مؤقت الدورات.",
    aboutContactLabel: "للتواصل:",
  },
  en: {
    language: "Language",
    title: "🔥Repeating Timer🔥",
    eyebrow: " Smart Counter",
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
      "Works offline after the first launch. When the phone is locked, browser timers may pause; the Android wrapper keeps the alarm running through a foreground notification.",
    aboutLink: "About us",
    aboutTitle: "About us",
    aboutTagline: "Clearer time, easier day.",
    aboutIntro:
      "Kallaa Tech's Cycle Timer is a simple, reliable tool that helps you organize your time, cycle after cycle, without complexity or distraction.",
    aboutLead: "We designed it to stay simple.",
    aboutSimplicityTitle: "Simplicity",
    aboutSimplicityText:
      "A clear interface that helps you set the timer and start quickly, keeping everything you don't need out of your way.",
    aboutReliabilityTitle: "Reliability",
    aboutReliabilityText:
      "Audio and visual alerts with precise progress tracking, so you always know where you stand.",
    aboutPrivacyTitle: "Privacy",
    aboutPrivacyText:
      "We don't collect personal data. Your settings and timer state stay on your device.",
    aboutAvailableTitle: "Available to everyone",
    aboutAvailableText:
      "A free experience with no annoying ads or unnecessary steps.",
    aboutMissionTitle: "Our mission",
    aboutMissionText:
      "We believe good technology makes life easier. That's why we designed this timer to be a calm daily companion that helps you focus and finish what you started.",
    aboutThanks: "Thank you for using Cycle Timer.",
    aboutContactLabel: "Contact us:",
  },
  tr: {
    language: "Dil",
    title: "🔥Tekrarlı Zamanlayıcı🔥",
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
      "İlk açılıştan sonra çevrimdışı çalışır. Telefon kilitliyken sistem tarayıcı zamanlayıcılarını durdurabilir; kilit ekranında kesin alarm için yerel Android/iOS uygulaması gerekir.",
    aboutLink: "Hakkımızda",
    aboutTitle: "Hakkımızda",
    aboutTagline: "Daha net zaman, daha kolay gün.",
    aboutIntro:
      "Kallaa Tech'in Tekrarlı Zamanlayıcısı, zamanınızı tur tur, karmaşa ya da dikkat dağıtmadan düzenlemenize yardımcı olan basit ve güvenilir bir araçtır.",
    aboutLead: "Basit kalması için tasarladık.",
    aboutSimplicityTitle: "Basitlik",
    aboutSimplicityText:
      "Zamanlayıcıyı ayarlamanıza ve hızlıca başlamanıza yardımcı olan, ihtiyacınız olmayan her şeyi yolunuzdan uzak tutan net bir arayüz.",
    aboutReliabilityTitle: "Güvenilirlik",
    aboutReliabilityText:
      "Her zaman nerede olduğunuzu bilmeniz için sesli ve görsel uyarılar ile hassas ilerleme takibi.",
    aboutPrivacyTitle: "Gizlilik",
    aboutPrivacyText:
      "Kişisel veri toplamıyoruz. Ayarlarınız ve zamanlayıcı durumunuz cihazınızda kalır.",
    aboutAvailableTitle: "Herkese açık",
    aboutAvailableText:
      "Rahatsız edici reklamlar veya gereksiz adımlar olmadan ücretsiz bir deneyim.",
    aboutMissionTitle: "Misyonumuz",
    aboutMissionText:
      "İyi teknolojinin hayatı kolaylaştırdığına inanıyoruz. Bu yüzden bu zamanlayıcıyı, odaklanmanıza ve başladığınız işi bitirmenize yardımcı olacak sakin bir günlük yoldaş olarak tasarladık.",
    aboutThanks: "Tekrarlı Zamanlayıcı'yı kullandığınız için teşekkür ederiz.",
    aboutContactLabel: "İletişim:",
  },
};

function t(key, ...args) {
  const value = copy[state.language][key];
  return typeof value === "function" ? value(...args) : value;
}

progressCircle.style.strokeDasharray = RING_CIRCUMFERENCE;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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

function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      durationSeconds: state.durationSeconds,
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
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (!saved.durationSeconds) return;

    state.durationSeconds = saved.durationSeconds;
    state.remainingMs = saved.durationSeconds * 1000;
    state.ringSeconds = saved.ringSeconds || 5;
    state.tone = saved.tone || "classic";
    state.language = saved.language || "ar";
    state.target = saved.target || 10;
    state.completed = saved.completed || 0;
    state.mode = saved.mode || "idle";
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
    }

    minutesInput.value = Math.floor(state.durationSeconds / 60);
    secondsInput.value = state.durationSeconds % 60;
    ringSecondsInput.value = String(state.ringSeconds);
    toneInput.value = state.tone;
    languageInput.value = state.language;
    targetInput.value = state.target;
    pauseButton.disabled = state.mode === "idle" || state.mode === "complete";
    startButton.textContent =
      state.mode === "running" || state.mode === "ringing"
        ? t("restart")
        : t("start");
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function notificationsSupported() {
  return "Notification" in window;
}

function updateNotificationButton() {
  if (!notificationsSupported()) {
    notifyButton.textContent = t("notifyUnsupported");
    notifyButton.disabled = true;
    return;
  }

  if (Notification.permission === "granted") {
    notifyButton.textContent = t("notifyEnabled");
    notifyButton.disabled = true;
    return;
  }

  if (Notification.permission === "denied") {
    notifyButton.textContent = t("notifyDenied");
    notifyButton.disabled = true;
    return;
  }

  notifyButton.textContent = t("notifyEnable");
  notifyButton.disabled = false;
}

async function requestNotifications() {
  if (!notificationsSupported()) return;

  const permission = await Notification.requestPermission();
  updateNotificationButton();

  if (permission === "granted") {
    message.textContent = t("notificationReadyTitle");
    showNotification(t("notificationReadyTitle"), t("notificationReadyBody"));
  } else {
    message.textContent = t("notificationPermissionDenied");
  }
}

async function showNotification(title, body) {
  if (!notificationsSupported() || Notification.permission !== "granted")
    return;

  const options = {
    body,
    icon: "icon.svg",
    badge: "icon.svg",
    tag: "cycle-timer",
    renotify: true,
    requireInteraction: state.mode === "complete",
    actions: [
      { action: "pause", title: t("pause") },
      { action: "open", title: t("open") },
    ],
    data: {
      language: state.language,
      commandable: true,
    },
  };

  if (serviceWorkerRegistration?.showNotification) {
    await serviceWorkerRegistration.showNotification(title, options);
    return;
  }

  new Notification(title, options);
}

function updateConnectionStatus() {
  const isOnline = navigator.onLine;
  offlineStatus.textContent = isOnline ? t("online") : t("offline");
  offlineStatus.classList.toggle("offline", !isOnline);
}

// ----------------------------------------------------------------------
// Native alarm bridge (Android wrapper). When window.AndroidAlarm exists,
// the NATIVE side owns the countdown, the ringing sound, the vibration
// and the notification. The web/JS side must ONLY mirror the state for
// display purposes here — it must never independently run its own
// countdown/ring logic in this mode, or the two would ring/vibrate/
// notify at the same time (the overlap/duplication bug being fixed).
// ----------------------------------------------------------------------

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

// Single source of truth for mirroring the native alarm into the UI.
// Display-only: never plays sound, never vibrates, never fires a web
// Notification — the native side already does all of that.
function syncFromNativeAlarm() {
  const snapshot = getNativeAlarmState();

  if (!snapshot || !snapshot.mode || snapshot.mode === "IDLE") {
    stopTicking();
    return false;
  }

  const previousMode = state.mode;
  const mode = String(snapshot.mode).toLowerCase();
  const phaseEndAt = Number(snapshot.phaseEndAt || 0);

  state.mode = mode;
  state.durationSeconds = Number(
    snapshot.durationSeconds || state.durationSeconds,
  );
  state.ringSeconds = Number(snapshot.ringSeconds || state.ringSeconds);
  state.target = Number(snapshot.target || state.target);
  state.completed = Number(snapshot.completed || 0);
  state.tone = snapshot.tone || state.tone;
  state.language = snapshot.language || state.language;
  shouldCompleteAfterRing = Boolean(snapshot.completeAfterRing);
  ringEndAt = mode === "ringing" ? phaseEndAt : ringEndAt;
  endAt = mode === "running" ? phaseEndAt : endAt;

  if (mode === "running") {
    state.remainingMs = Math.max(0, phaseEndAt - Date.now());
  } else if (mode === "paused") {
    state.remainingMs = Math.max(0, Number(snapshot.remainingMs || 0));
  } else if (mode === "ringing" || mode === "complete") {
    state.remainingMs = 0;
  }

  minutesInput.value = Math.floor(state.durationSeconds / 60);
  secondsInput.value = state.durationSeconds % 60;
  ringSecondsInput.value = String(state.ringSeconds);
  targetInput.value = state.target;
  toneInput.value = state.tone;
  languageInput.value = state.language;
  pauseButton.disabled = mode === "idle" || mode === "complete";
  pauseButton.textContent = mode === "paused" ? t("resume") : t("pause");
  startButton.textContent =
    mode === "running" || mode === "ringing" ? t("restart") : t("start");

  applyLanguage();

  if (mode === "complete" && previousMode !== "complete") {
    completionText.textContent = `${state.completed} / ${state.target}`;
    completionScreen.hidden = false;
    message.textContent = t("completeMessage");
  }

  updateDisplay();
  saveState();

  if (mode === "idle" || mode === "complete") stopTicking();

  return true;
}

function refreshAlarmState(showMessage = true) {
  if (hasNativeAlarm()) {
    const found = syncFromNativeAlarm();
    if (showMessage) {
      message.textContent = found ? t("refreshed") : t("noRunningAlarm");
    }
    return;
  }

  loadState();
  if (state.mode === "running" && endAt > 0) {
    state.remainingMs = Math.max(0, endAt - Date.now());
    startTicking();
    updateDisplay();
    if (showMessage) message.textContent = t("refreshed");
    return;
  }

  updateDisplay();
  if (showMessage) message.textContent = t("noRunningAlarm");
}

function applyLanguage() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";
  document.title = t("eyebrow").trim();
  languageInput.value = state.language;
  languageLabel.textContent = t("language");
  eyebrowText.textContent = t("eyebrow");
  appTitle.textContent = t("title");
  if (subheadText) subheadText.textContent = t("subhead");
  completedLabel.textContent = t("completed");
  targetLabel.textContent = t("target");
  remainingLabel.textContent = t("remaining");
  durationLabel.textContent = t("duration");
  minutesLabel.textContent = t("minute");
  secondsLabel.textContent = t("second");
  ringDurationLabel.textContent = t("ringDuration");
  ring3Option.textContent = t("seconds3");
  ring5Option.textContent = t("seconds5");
  ring10Option.textContent = t("seconds10");
  ring15Option.textContent = t("seconds15");
  targetInputLabel.textContent = t("targetInput");
  toneLabel.textContent = t("tone");
  toneClassicOption.textContent = t("classic");
  toneSoftOption.textContent = t("soft");
  toneUrgentOption.textContent = t("urgent");
  startButton.textContent =
    state.mode === "running" || state.mode === "ringing"
      ? t("restart")
      : t("start");
  pauseButton.textContent = state.mode === "paused" ? t("resume") : t("pause");
  resetButton.textContent = t("reset");
  refreshButton.textContent = t("refresh");
  finishButton.textContent = t("done");
  completionTitle.textContent = t("completionTitle");
  limitNote.textContent = t("limit");
  aboutButton.textContent = t("aboutLink");
  aboutTitle.textContent = t("aboutTitle");
  aboutTagline.textContent = t("aboutTagline");
  aboutIntro.textContent = t("aboutIntro");
  aboutLead.textContent = t("aboutLead");
  aboutSimplicityTitle.textContent = t("aboutSimplicityTitle");
  aboutSimplicityText.textContent = t("aboutSimplicityText");
  aboutReliabilityTitle.textContent = t("aboutReliabilityTitle");
  aboutReliabilityText.textContent = t("aboutReliabilityText");
  aboutPrivacyTitle.textContent = t("aboutPrivacyTitle");
  aboutPrivacyText.textContent = t("aboutPrivacyText");
  aboutAvailableTitle.textContent = t("aboutAvailableTitle");
  aboutAvailableText.textContent = t("aboutAvailableText");
  aboutMissionTitle.textContent = t("aboutMissionTitle");
  aboutMissionText.textContent = t("aboutMissionText");
  aboutThanks.textContent = t("aboutThanks");
  aboutContactLabel.textContent = t("aboutContactLabel");
  updateNotificationButton();
  updateConnectionStatus();
}

async function unlockAudio() {
  audioContext ||= new AudioContext();
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }
}

function playTone(frequencies, duration = 0.5, type = "square", volume = 0.42) {
  if (!audioContext) return;

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
}

function playBeep() {
  if (state.tone === "soft") {
    playTone([523, 659, 784], 0.62, "sine", 0.3);
    return;
  }

  if (state.tone === "urgent") {
    playTone([1040, 740, 1040], 0.45, "sawtooth", 0.48);
    return;
  }

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

async function requestWakeLock() {
  if (!("wakeLock" in navigator) || wakeLock) return;

  try {
    wakeLock = await navigator.wakeLock.request("screen");
  } catch {
    wakeLock = null;
  }
}

async function releaseWakeLock() {
  if (!wakeLock) return;

  try {
    await wakeLock.release();
  } finally {
    wakeLock = null;
  }
}

function updatePieces() {
  pieces.innerHTML = "";
  const visiblePieces = Math.min(state.target, 200);

  for (let index = 0; index < visiblePieces; index += 1) {
    const piece = document.createElement("span");
    piece.className = index < state.completed ? "piece done" : "piece";
    pieces.append(piece);
  }
}

function updateDisplay() {
  const remainingSeconds =
    state.mode === "ringing"
      ? Math.max(0, (ringEndAt - Date.now()) / 1000)
      : state.remainingMs / 1000;

  const progress =
    state.mode === "ringing"
      ? 1
      : 1 - state.remainingMs / (state.durationSeconds * 1000);

  mainTime.textContent = formatTime(remainingSeconds);
  progressCircle.style.strokeDashoffset =
    RING_CIRCUMFERENCE * (1 - clamp(progress, 0, 1));
  completedCount.textContent = state.completed;
  targetCountText.textContent = state.target;
  remainingCount.textContent = Math.max(0, state.target - state.completed);
  updatePieces();

  document.body.dataset.mode = state.mode;

  if (state.mode === "idle") modeText.textContent = t("ready");
  if (state.mode === "running") modeText.textContent = t("running");
  if (state.mode === "paused") modeText.textContent = t("paused");
  if (state.mode === "ringing") modeText.textContent = t("ringing");
  if (state.mode === "complete") modeText.textContent = t("complete");
}

function stopRingingSound() {
  window.clearInterval(ringTimer);
  window.clearInterval(vibrationTimer);
  navigator.vibrate?.(0);
}

function startRingingSound() {
  playBeep();
  vibrate();
  ringTimer = window.setInterval(playBeep, 850);
  vibrationTimer = window.setInterval(vibrate, 1100);
}

function startTicking() {
  window.clearInterval(tickTimer);
  tickTimer = window.setInterval(tick, 200);
}

function stopTicking() {
  window.clearInterval(tickTimer);
}

function beginCountdown() {
  state.mode = "running";
  state.remainingMs = state.durationSeconds * 1000;
  endAt = Date.now() + state.remainingMs;
  startButton.textContent = t("restart");
  pauseButton.disabled = false;
  pauseButton.textContent = t("pause");
  message.textContent = t("cycle", state.completed + 1, state.target);
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
  saveState();

  state.mode = "ringing";
  ringEndAt = Date.now() + state.ringSeconds * 1000;
  message.textContent = shouldCompleteAfterRing
    ? t("finalCycleDone")
    : t("cycleDone");
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
  pauseButton.disabled = true;
  completionText.textContent = `${state.completed} / ${state.target}`;
  completionScreen.hidden = false;
  message.textContent = t("completeMessage");
  showNotification(
    t("completeNotificationTitle"),
    t("completeNotificationBody", state.completed, state.target),
  );
  playCompleteTone();
  vibrate();
  updateDisplay();
}

function tick() {
  // Native mode: NEVER run our own countdown/ring math here — it would
  // race with the native alarm and cause double sound/vibration. Just
  // mirror the native state for display.
  if (hasNativeAlarm()) {
    syncFromNativeAlarm();
    return;
  }

  if (state.mode === "running") {
    state.remainingMs = Math.max(0, endAt - Date.now());
    if (state.remainingMs <= 0) finishCycle();
  }

  if (state.mode === "ringing") {
    if (Date.now() >= ringEndAt) {
      stopRingingSound();
      if (shouldCompleteAfterRing) {
        completeTarget();
        return;
      }
      beginCountdown();
      return;
    }
  }

  updateDisplay();
}

async function startTimer() {
  await unlockAudio();
  await requestWakeLock();
  readSettings();
  completionScreen.hidden = true;

  if (
    state.mode === "running" ||
    state.mode === "ringing" ||
    state.mode === "complete"
  ) {
    if (!hasNativeAlarm()) stopRingingSound();
    state.completed = 0;
    shouldCompleteAfterRing = false;
    ringRemainingMs = 0;
  }

  if (hasNativeAlarm()) {
    // Native alarm owns the countdown and the ringing sound entirely.
    // We only start it and then poll its state to update the UI.
    startNativeAlarm();
    syncFromNativeAlarm();
    startTicking();
  } else {
    beginCountdown();
  }

  saveState();
}

function pauseTimer() {
  if (hasNativeAlarm()) {
    pauseNativeAlarm();
    syncFromNativeAlarm();
    return;
  }

  if (state.mode === "running") {
    state.remainingMs = Math.max(0, endAt - Date.now());
    state.mode = "paused";
    stopTicking();
    pauseButton.textContent = t("resume");
    message.textContent = t("pausedMessage");
    saveState();
    updateDisplay();
    return;
  }

  if (state.mode === "ringing") {
    ringRemainingMs = Math.max(1000, ringEndAt - Date.now());
    state.mode = "paused";
    stopRingingSound();
    stopTicking();
    pauseButton.textContent = t("resume");
    message.textContent = t("ringPaused");
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
      pauseButton.textContent = t("pause");
      message.textContent = t("ringResumed");
      saveState();
      updateDisplay();
      return;
    }

    state.mode = "running";
    endAt = Date.now() + state.remainingMs;
    pauseButton.textContent = t("pause");
    message.textContent = t("cycle", state.completed + 1, state.target);
    startTicking();
    saveState();
    updateDisplay();
  }
}

async function resetTimer() {
  stopTicking();

  if (hasNativeAlarm()) {
    stopNativeAlarm();
  } else {
    stopRingingSound();
    await releaseWakeLock();
  }

  readSettings();
  state.mode = "idle";
  state.completed = 0;
  shouldCompleteAfterRing = false;
  ringRemainingMs = 0;
  state.remainingMs = state.durationSeconds * 1000;
  startButton.disabled = false;
  startButton.textContent = t("start");
  pauseButton.disabled = true;
  pauseButton.textContent = t("pause");
  completionScreen.hidden = true;
  message.textContent = t("choose");
  saveState();
  updateDisplay();
}

function applySettingsPreview() {
  if (
    hasNativeAlarm() &&
    (state.mode === "running" ||
      state.mode === "paused" ||
      state.mode === "ringing")
  ) {
    // Let the native side recompute timing from the new settings, then
    // just mirror it back — don't also recompute remaining time locally.
    readSettings();
    updateNativeAlarm();
    syncFromNativeAlarm();
    return;
  }

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
    message.textContent = t("cycle", state.completed + 1, state.target);
  } else if (previousMode === "paused") {
    state.remainingMs = Math.max(
      1000,
      Math.round(state.durationSeconds * 1000 * remainingRatio),
    );
  } else {
    state.remainingMs = state.durationSeconds * 1000;
  }

  saveState();
  updateDisplay();
}

function changeLanguage() {
  state.language = languageInput.value;
  applyLanguage();
  if (state.mode === "idle" || state.mode === "complete") {
    message.textContent = t("choose");
  }
  saveState();
  updateDisplay();
}

function handleServiceWorkerMessage(event) {
  const command = event.data?.command;
  if (command === "pause-or-resume") {
    if (!pauseButton.disabled) pauseTimer();
  }
}

startButton.addEventListener("click", startTimer);
pauseButton.addEventListener("click", pauseTimer);
resetButton.addEventListener("click", resetTimer);
finishButton.addEventListener("click", resetTimer);
notifyButton.addEventListener("click", requestNotifications);
refreshButton.addEventListener("click", () => refreshAlarmState(true));
languageInput.addEventListener("change", changeLanguage);

aboutButton.addEventListener("click", () => {
  aboutScreen.hidden = false;
});
aboutCloseButton.addEventListener("click", () => {
  aboutScreen.hidden = true;
});
aboutScreen.addEventListener("click", (event) => {
  if (event.target === aboutScreen) aboutScreen.hidden = true;
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !aboutScreen.hidden) {
    aboutScreen.hidden = true;
  }
});

[minutesInput, secondsInput, ringSecondsInput, targetInput, toneInput].forEach(
  (input) => {
    input.addEventListener("input", applySettingsPreview);
    input.addEventListener("change", applySettingsPreview);
  },
);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    requestWakeLock();
    refreshAlarmState(false);
  }
});

window.addEventListener("focus", () => refreshAlarmState(false));

window.addEventListener("online", updateConnectionStatus);
window.addEventListener("offline", updateConnectionStatus);

if ("serviceWorker" in navigator) {
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
}

loadState();
applyLanguage();
updateNotificationButton();
updateConnectionStatus();
refreshAlarmState(false);
updateDisplay();
