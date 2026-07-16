import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Calendar as CalendarIcon, X, Check, Bell, Book, Phone, 
  Edit2, Trash2, CheckCircle, Clock, Crown, User, Users, Lock, BookOpen, 
  Target, Settings, Download, Upload, Trash, LogOut, 
  StickyNote, Ban, Search, AlertCircle, ListTodo, CalendarCheck,
  History, Menu, FolderPlus, Folder, MoreVertical, Home, ChevronRight, FileText
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBeiyEC4guvjZKrzmVy5BGCF5R6uulAcEc",
  authDomain: "pk-navas-diary.firebaseapp.com",
  projectId: "pk-navas-diary",
  storageBucket: "pk-navas-diary.firebasestorage.app",
  messagingSenderId: "143597540046",
  appId: "1:143597540046:web:b0331b2730e602a49b369f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const PROJECT_ID = "pk-navas-diary"; 

const COLORS = {
  paper: '#F7F3EA',
  paperDark: '#EAE3D2',
  ink: '#2E2E2E',
  heading: '#1A1A1A',
  accent: '#B28A5A',
  shadow: 'rgba(0,0,0,0.08)',
  spine: '#3A2E25',
  redInk: '#C83232',
  blueInk: '#2563EB',
  leather: '#3b1c0a',
  gold: '#d4af37'
};

const ISLAMIC_QUOTES = [
  { arabic: "إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ وَالْإِحْسَانِ", malayalam: "നിശ്ചയം, നീതി പാലിക്കാനും നന്മ ചെയ്യാനും അല്ലാഹു കല്‍പിക്കുന്നു. (16:90)" },
  { arabic: "كُلُّكُمْ رَاعٍ، وَكُلُّكُمْ مَسْئُولٌ عَنْ رَعِيَّتِهِ", malayalam: "നിങ്ങളെല്ലാവരും ഭരണാധികാരികളാണ്, തന്റെ ഭരണീയരെക്കുറിച്ച് നിങ്ങളെല്ലാവരും ചോദ്യം ചെയ്യപ്പെടും. (ഹദീസ്)" },
  { arabic: "وَإِذَا حَكَمْتُم بَيْنَ النَّاسِ أَن تَحْكُمُوا بِالْعَدْلِ", malayalam: "ജനങ്ങൾക്കിടയിൽ നിങ്ങൾ തീർപ്പുകൽപിക്കുകയാണെങ്കിൽ നീതിയോടെ വേണം തീർപ്പുകൽപിക്കാൻ. (4:58)" },
  { arabic: "خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ", malayalam: "ജനങ്ങൾക്ക് ഏറ്റവും ഉപകാരപ്രദമായവനത്രെ ജനങ്ങളിൽ ഉത്തമൻ. (ഹദീസ്)" },
  { arabic: "وَلَا تَبْخَسُوا النَّاسَ أَشْيَاءَهُمْ", malayalam: "ജനങ്ങളുടെ അവകാശങ്ങൾ നിങ്ങൾ കുറച്ചുകൊടുക്കരുത്. (26:183)" },
  { arabic: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ بِالْقِسْطِ", malayalam: "വിശ്വസിച്ചവരേ, നിങ്ങൾ നീതിക്ക് വേണ്ടി നിലകൊള്ളുന്നവരാകുക. (4:135)" },
  { arabic: "إِنَّ اللَّهَ لَا يُحِبُّ الْخَائِنِينَ", malayalam: "വഞ്ചന കാണിക്കുന്നവരെ അല്ലാഹു ഒരിക്കലും ഇഷ്ടപ്പെടുകയില്ല. (8:58)" },
  { arabic: "الرَّاشِي وَالْمُرْتَشِي فِي النَّارِ", malayalam: "കൈക്കൂലി നൽകുന്നവനും വാങ്ങുന്നവനും നരകത്തിലാണ്. (ഹദീസ്)" },
  { arabic: "مَنْ غَشَّنَا فَلَيْسَ مِنَّا", malayalam: "നമ്മെ വഞ്ചിച്ചവൻ നമ്മിൽ പെട്ടവനല്ല. (ഹദീസ്)" },
  { arabic: "أَعْطُوا الْأَجِيرَ أَجْرَهُ قَبْلَ أَنْ يَجِفَّ عَرَقُهُ", malayalam: "തൊഴിലാളിയുടെ വിയർപ്പ് ഉണങ്ങുന്നതിന് മുമ്പ് അവന് കൂലി നൽകുക. (ഹദീസ്)" },
  { arabic: "وَيْلٌ لِّلْمُطَفِّفِينَ", malayalam: "അളവിലും തൂക്കത്തിലും കുറവ് വരുത്തുന്നവർക്ക് മഹാനാശം. (83:1)" },
  { arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", malayalam: "തനിക്കിഷ്ടമുള്ളത് തന്റെ സഹോദരനും ഇഷ്ടപ്പെടുന്നതുവരെ നിങ്ങളിലൊരാളും പൂർണ്ണവിശ്വാസിയാവുകയില്ല. (ഹദീസ്)" },
  { arabic: "إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ", malayalam: "സത്യവിശ്വാസികൾ പരസ്പരം സഹോദരങ്ങളാണ്. (49:10)" },
  { arabic: "ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ", malayalam: "തിന്മയെ ഏറ്റവും നല്ല നന്മ കൊണ്ട് നേരിടുക. (41:34)" },
  { arabic: "وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ", malayalam: "നന്മയിലും ധർമ്മനിഷ്ഠയിലും നിങ്ങൾ അന്യോന്യം സഹായിക്കുക. (5:2)" },
  { arabic: "وَأَوْفُوا بِالْعَهْدِ ۖ إِنَّ الْعَهْدَ كَانَ مَسْئُولًا", malayalam: "നിങ്ങൾ കരാറുകൾ പൂർത്തീകരിക്കുക, തീർച്ചയായും കരാറുകളെപ്പറ്റി ചോദ്യം ചെയ്യപ്പെടുന്നതാണ്. (17:34)" },
  { arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ", malayalam: "ഏതൊരുവന്റെ നാവില്‍നിന്നും കൈകളില്‍നിന്നും മറ്റുള്ളവര്‍ സുരക്ഷിതരാണോ അവനാണ് യഥാർത്ഥ മുസ്ലിം. (ഹദീസ്)" },
  { arabic: "لَا يَرْحَمُ اللَّهُ مَنْ لَا يَرْحَمُ النَّاسَ", malayalam: "ജനങ്ങളോട് കരുണ കാണിക്കാത്തവനോട് അല്ലാഹുവും കരുണ കാണിക്കുകയില്ല. (ഹദീസ്)" },
  { arabic: "اتَّقِ دَعْوَةَ الْمَظْلُومِ فَإِنَّهَا لَيْسَ بَيْنَهَا وَبَيْنَ اللَّهِ حِجَابٌ", malayalam: "മർദ്ദിതന്റെ പ്രാർത്ഥനയെ നീ ഭയപ്പെടുക, അതിനും അല്ലാഹുവിനുമിടയിൽ യാതൊരു മറയുമില്ല. (ഹദീസ്)" },
  { arabic: "وَلَا تَعْتَدُوا ۚ إِنَّ اللَّهَ لَا يُحِبُّ الْمُعْتَدِينَ", malayalam: "നിങ്ങൾ അതിക്രമം പ്രവർത്തിക്കരുത്. അതിക്രമം പ്രവർത്തിക്കുന്നവരെ അല്ലാഹു സ്നേഹിക്കുകയില്ല. (2:190)" },
  { arabic: "وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا", malayalam: "ഭൂമിയിലൂടെ നീ അഹങ്കാരത്തോടെ നടക്കരുത്. (17:37)" },
  { arabic: "فَاسْتَبِقُوا الْخَيْرَاتِ", malayalam: "അതിനാൽ നിങ്ങൾ നന്മകളിലേക്ക് മത്സരിച്ചു മുന്നേറുക. (2:148)" },
  { arabic: "وَقُولُوا لِلنَّاسِ حُسْنًا", malayalam: "ജനങ്ങളോട് നിങ്ങൾ നല്ല വാക്ക് പറയുക. (2:83)" },
  { arabic: "وَأَصْلِحُوا ذَاتَ بَيْنِكُمْ", malayalam: "നിങ്ങൾക്കിടയിലുള്ള ബന്ധങ്ങൾ നിങ്ങൾ നന്നാക്കിത്തീർക്കുക. (8:1)" },
  { arabic: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", malayalam: "തീർച്ചയായും അല്ലാഹു ക്ഷമിക്കുന്നവരോടൊപ്പമാണ്. (2:153)" }
];

let audioCtx = null;
const playFlipSound = () => {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) output[i] = Math.random() * 2 - 1; 
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, audioCtx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    noiseSource.connect(filter); filter.connect(gainNode); gainNode.connect(audioCtx.destination);
    noiseSource.start();
  } catch (e) { console.log("Audio play failed.", e); }
};

const formatDate = (date) => new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
const getDayName = (date) => new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(date);
const formatTime = (date) => new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
const generateId = () => Math.random().toString(36).substr(2, 9);

const toLocalISODate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

const isRecurringOnDate = (reminder, targetDateStr) => {
  if (!reminder.frequency || reminder.frequency === 'none') return reminder.dateString === new Date(targetDateStr).toDateString();
  if (reminder.deletedDates?.includes(targetDateStr)) return false;

  const start = new Date(reminder.startDateStr); start.setHours(0,0,0,0);
  const target = new Date(targetDateStr); target.setHours(0,0,0,0);
  if (target < start) return false;

  const diffDays = Math.round((target - start) / (1000 * 60 * 60 * 24));
  if (reminder.frequency === '15d') return diffDays % 15 === 0;

  const diffMonths = (target.getFullYear() - start.getFullYear()) * 12 + (target.getMonth() - start.getMonth());
  if (target.getDate() !== start.getDate()) return false;
  if (reminder.frequency === '1m') return diffMonths % 1 === 0;
  if (reminder.frequency === '2m') return diffMonths % 2 === 0;
  if (reminder.frequency === '3m') return diffMonths % 3 === 0;
  
  return false;
};

const PaperTexture = () => (
  <svg className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply z-0 w-full h-full">
    <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter>
    <rect width="100%" height="100%" filter="url(#noiseFilter)"/>
  </svg>
);

const LeatherTexture = () => (
  <svg className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply z-0 w-full h-full rounded-[2rem] sm:rounded-3xl">
    <filter id="leatherNoise">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
      <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#leatherNoise)"/>
  </svg>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allData, setAllData] = useState([]);
  
  const [direction, setDirection] = useState(0); 
  const [isFastFlipping, setIsFastFlipping] = useState(false);
  
  // Auth
  const [loginRole, setLoginRole] = useState(null); 
  const [loginModal, setLoginModal] = useState({ isOpen: false, role: null });
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Modals & Forms
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [newEntryText, setNewEntryText] = useState("");
  const [entryDate, setEntryDate] = useState("");
  const [entryType, setEntryType] = useState("diary");
  const [entryPhone, setEntryPhone] = useState("");
  
  // Time Picker states
  const [entryHour, setEntryHour] = useState("12");
  const [entryMinute, setEntryMinute] = useState("00");
  const [entryAmPm, setEntryAmPm] = useState("AM");
  const [entryEndHour, setEntryEndHour] = useState("01");
  const [entryEndMinute, setEntryEndMinute] = useState("15");
  const [entryEndAmPm, setEntryEndAmPm] = useState("PM");

  const [reminderFrequency, setReminderFrequency] = useState("none");
  const [entryPrivate, setEntryPrivate] = useState(false);
  const [entryIsEvent, setEntryIsEvent] = useState(false);
  const [psTimeSlot, setPsTimeSlot] = useState("10:00 AM - 11:30 AM");

  const [activeEntryMenu, setActiveEntryMenu] = useState(null);
  const [deleteSeriesModal, setDeleteSeriesModal] = useState(null); 
  const [showRemindersModal, setShowRemindersModal] = useState(false);
  const [currentNoteFolderId, setCurrentNoteFolderId] = useState(null);
  const [noteFolderPath, setNoteFolderPath] = useState([]);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [closeDayModal, setCloseDayModal] = useState(false);
  const [uncloseDayModal, setUncloseDayModal] = useState(null);
  const [closeDayReason, setCloseDayReason] = useState("");
  const [uncheckConfirmEntry, setUncheckConfirmEntry] = useState(null);
  const uncheckTimerRef = useRef(null);

  // Footer Panels
  const [activePanel, setActivePanel] = useState(null); 
  
  // App Config
  const [appConfig, setAppConfig] = useState({ psPassword: 'afsi@diary', ps2Password: 'ad@diary', lastBackup: null });

  // Cover Quote State
  const [quoteIndex, setQuoteIndex] = useState(0);

  const holdTimer = useRef(null);
  const entryTextRef = useRef(null);
  const flipTimeoutRef = useRef(null);
  const flipIntervalRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Recent additions logic (Last 7 Days based on createdAt)
  const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  const recentAdditions = allData.filter(e =>
    e.type === 'diary' &&
    !e.isPrivate &&
    (e.createdAt || 0) >= sevenDaysAgo
  ).sort((a, b) => {
    const timeA = a.createdAt || 0;
    const timeB = b.createdAt || 0;
    return timeB - timeA; 
  });

  const recentUncopiedCount = recentAdditions.filter(e => !e.copiedToPhysical).length;

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400&family=Berkshire+Swash&family=Comic+Neue:wght@400;600;700&family=Sora:wght@400;600;700&family=Chilanka&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const initAuth = async () => {
      try { await signInAnonymously(auth); } 
      catch (error) { console.error("Firebase Auth Error:", error); }
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const entriesRef = collection(db, 'artifacts', PROJECT_ID, 'public', 'data', 'entries');
    const unsubscribe = onSnapshot(entriesRef, (snapshot) => {
      const loadedData = [];
      let loadedConfig = { psPassword: 'afsi@diary', ps2Password: 'ad@diary', lastBackup: null };
      
      snapshot.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        if (data.type === 'config') loadedConfig = { ...loadedConfig, ...data };
        else loadedData.push(data);
      });
      
      setAllData(loadedData);
      setAppConfig(loadedConfig);

      const savedRole = localStorage.getItem('diary_role');
      if (savedRole === 'main') setLoginRole('main');
      else if (savedRole === 'sub') setLoginRole('sub');
      else if (savedRole === 'sub2') setLoginRole('sub2');

    }, (error) => console.error("Firestore loading error:", error));

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (loginRole) return; 
    const currentQuote = ISLAMIC_QUOTES[quoteIndex];
    const duration = Math.min(Math.max(4000, (currentQuote.arabic.length + currentQuote.malayalam.length) * 50), 8000);
    
    const timer = setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % ISLAMIC_QUOTES.length);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [quoteIndex, loginRole]);

  const saveToFirebase = async (id, dataToSave) => {
    try {
      const docRef = doc(db, 'artifacts', PROJECT_ID, 'public', 'data', 'entries', id);
      await setDoc(docRef, dataToSave);
    } catch (e) { console.error("Error saving:", e); }
  };

  const deleteFromFirebase = async (id) => {
    try {
      const docRef = doc(db, 'artifacts', PROJECT_ID, 'public', 'data', 'entries', id);
      await deleteDoc(docRef);
    } catch (e) { console.error("Error deleting:", e); }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginModal.role === 'main' && password === 'Navas@2026') {
      setLoginRole('main'); localStorage.setItem('diary_role', 'main');
      setLoginModal({ isOpen: false, role: null }); setPassword(""); setLoginError(false);
      playFlipSound();
    } else if (loginModal.role === 'sub' && (password === appConfig.psPassword || password === 'afsi@diary')) {
      setLoginRole('sub'); localStorage.setItem('diary_role', 'sub');
      setLoginModal({ isOpen: false, role: null }); setPassword(""); setLoginError(false);
      playFlipSound();
    } else if (loginModal.role === 'sub2' && (password === appConfig.ps2Password || password === 'ad@diary')) {
      setLoginRole('sub2'); localStorage.setItem('diary_role', 'sub2');
      setLoginModal({ isOpen: false, role: null }); setPassword(""); setLoginError(false);
      playFlipSound();
    } else {
      setLoginError(true);
    }
  };

  const confirmLogout = () => {
    setActivePanel(null);
    setActiveEntryMenu(null);
    setIsModalOpen(false);
    setShowRemindersModal(false);
    setShowRecentModal(false);
    setCloseDayModal(false);
    setUncloseDayModal(null);
    setDeleteSeriesModal(null);
    setShowLogoutConfirm(false); 
    
    setLoginRole(null); 
    localStorage.removeItem('diary_role');
    
    playFlipSound();
  };

  const startContinuousFlip = (dir) => {
    if (isFastFlipping) return;
    let currentLoopDate = new Date(currentDate);

    const executeFlip = () => {
      playFlipSound(); setDirection(dir);
      currentLoopDate.setDate(currentLoopDate.getDate() + dir);
      setCurrentDate(new Date(currentLoopDate));
      setActiveEntryMenu(null); setActivePanel(null);
      return true;
    };

    if (!executeFlip()) return;

    flipTimeoutRef.current = setTimeout(() => {
      const loop = () => { if (executeFlip()) flipIntervalRef.current = setTimeout(loop, 120); };
      loop();
    }, 400); 
  };

  const stopContinuousFlip = () => {
    if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    if (flipIntervalRef.current) clearTimeout(flipIntervalRef.current);
  };

  const handleJumpDate = async (newDateStr) => {
    if (!newDateStr || isFastFlipping) return;
    const [y, m, d] = newDateStr.split('-');
    const targetDate = new Date(y, m - 1, d); targetDate.setHours(0,0,0,0);
    
    const curDate = new Date(currentDate); curDate.setHours(0,0,0,0);
    const timeDiff = targetDate.getTime() - curDate.getTime();
    const daysDiff = Math.round(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff === 0) return;
    
    setIsFastFlipping(true);
    const dir = daysDiff > 0 ? 1 : -1;
    setDirection(dir); setActiveEntryMenu(null); setActivePanel(null);
    
    const flipCount = Math.min(Math.abs(daysDiff), 6); 
    for (let i = 1; i <= flipCount; i++) {
      playFlipSound();
      const tempDate = new Date(currentDate);
      tempDate.setDate(tempDate.getDate() + (dir * i * Math.ceil(Math.abs(daysDiff)/flipCount)));
      if (i === flipCount) setCurrentDate(targetDate);
      else setCurrentDate(tempDate);
      await new Promise(resolve => setTimeout(resolve, 130));
    }
    setIsFastFlipping(false);
  };

  const handleJumpToToday = async () => {
    if (isFastFlipping) return;
    const today = new Date(); today.setHours(0,0,0,0);
    const curDate = new Date(currentDate); curDate.setHours(0,0,0,0);
    const daysDiff = Math.round((today.getTime() - curDate.getTime()) / (1000 * 3600 * 24));
    
    if (daysDiff === 0) return;
    if (Math.abs(daysDiff) <= 5) { handleJumpDate(toLocalISODate(today)); return; }
    
    setIsFastFlipping(true);
    const dir = daysDiff > 0 ? 1 : -1;
    setDirection(dir); setActiveEntryMenu(null); setActivePanel(null);
    
    const flipCount = 10;
    const step = daysDiff / flipCount;
    for (let i = 1; i <= flipCount; i++) {
      playFlipSound();
      const tempDate = new Date(curDate);
      tempDate.setDate(tempDate.getDate() + Math.round(step * i));
      if (i === flipCount) setCurrentDate(today); else setCurrentDate(tempDate);
      await new Promise(resolve => setTimeout(resolve, 80)); 
    }
    setIsFastFlipping(false);
  };

  const calculateEndTime = (hStr, mStr, ampmStr) => {
    let h = parseInt(hStr, 10);
    let m = parseInt(mStr, 10);
    if (ampmStr === 'PM' && h !== 12) h += 12;
    if (ampmStr === 'AM' && h === 12) h = 0;
    
    m += 15;
    if (m >= 60) { m -= 60; h += 1; }
    h += 1; 
    
    const endAmPm = h >= 12 && h < 24 ? 'PM' : 'AM';
    let endH = h % 12;
    if (endH === 0) endH = 12;
    
    return {
       endH: String(endH).padStart(2, '0'),
       endM: String(m).padStart(2, '0'),
       endAmPm: endAmPm
    };
  };

  const handleHourChange = (val) => {
    setEntryHour(val);
    setEntryMinute("00");
    const { endH, endM, endAmPm } = calculateEndTime(val, "00", entryAmPm);
    setEntryEndHour(endH); setEntryEndMinute(endM); setEntryEndAmPm(endAmPm);
  };

  const handleMinuteChange = (val) => {
    setEntryMinute(val);
    const { endH, endM, endAmPm } = calculateEndTime(entryHour, val, entryAmPm);
    setEntryEndHour(endH); setEntryEndMinute(endM); setEntryEndAmPm(endAmPm);
  };

  const handleAmPmChange = () => {
    const newAmPm = entryAmPm === 'AM' ? 'PM' : 'AM';
    setEntryAmPm(newAmPm);
    const { endH, endM, endAmPm } = calculateEndTime(entryHour, entryMinute, newAmPm);
    setEntryEndHour(endH); setEntryEndMinute(endM); setEntryEndAmPm(endAmPm);
  };

  const handleOpenModal = (entryToEdit = null) => {
    if (entryToEdit) {
      const d = new Date(entryToEdit.timestamp || entryToEdit.startDateStr);
      setEntryDate(toLocalISODate(d));
      
      let h = d.getHours(); const m = d.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      
      setEntryHour(String(h).padStart(2, '0')); setEntryMinute(String(m).padStart(2, '0')); setEntryAmPm(ampm);
      
      if (entryToEdit.endTimestamp) {
        const ed = new Date(entryToEdit.endTimestamp);
        let eh = ed.getHours(); const em = ed.getMinutes();
        const eampm = eh >= 12 ? 'PM' : 'AM';
        eh = eh % 12 || 12;
        setEntryEndHour(String(eh).padStart(2, '0'));
        setEntryEndMinute(String(em).padStart(2, '0'));
        setEntryEndAmPm(eampm);
      } else {
        const { endH, endM, endAmPm } = calculateEndTime(String(h).padStart(2, '0'), String(m).padStart(2, '0'), ampm);
        setEntryEndHour(endH); setEntryEndMinute(endM); setEntryEndAmPm(endAmPm);
      }

      setNewEntryText(entryToEdit.content);
      setEntryType(entryToEdit.type || "diary");
      setEntryPhone(entryToEdit.phone || "");
      setReminderFrequency(entryToEdit.frequency || "none");
      setEditingEntryId(entryToEdit.id);
      setEntryPrivate(entryToEdit.isPrivate || false);
      setEntryIsEvent(entryToEdit.isEvent || false);
      setPsTimeSlot(entryToEdit.time || "10:00 AM - 11:30 AM");
    } else {
      setEntryDate(toLocalISODate(currentDate));
      const now = new Date();
      let h = now.getHours(); const m = now.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      
      setEntryHour(String(h).padStart(2, '0')); setEntryMinute(String(m).padStart(2, '0')); setEntryAmPm(ampm);
      const { endH, endM, endAmPm } = calculateEndTime(String(h).padStart(2, '0'), String(m).padStart(2, '0'), ampm);
      setEntryEndHour(endH); setEntryEndMinute(endM); setEntryEndAmPm(endAmPm);

      setNewEntryText(""); setEntryType("diary"); setEntryPhone(""); setReminderFrequency("none");
      setEditingEntryId(null);
      setEntryPrivate(false);
      setEntryIsEvent(false);
      setPsTimeSlot("10:00 AM - 11:30 AM");
    }
    setIsModalOpen(true); setActiveEntryMenu(null); setActivePanel(null);
    setTimeout(() => entryTextRef.current?.focus(), 300);
  };

  const handleSaveEntry = async () => {
    if (!newEntryText.trim() || !entryDate) return;
    
    const [year, month, day] = entryDate.split('-').map(Number);
    let entryDateTime, endDateTime, finalTimeStr;

    if (loginRole === 'sub' && entryType === 'diary' && !entryIsEvent) {
      finalTimeStr = psTimeSlot;
      const parts = psTimeSlot.split(' - ');
      const parseTime = (tStr) => {
         const [time, period] = tStr.split(' ');
         let [h, m] = time.split(':').map(Number);
         if (period === 'PM' && h !== 12) h += 12;
         if (period === 'AM' && h === 12) h = 0;
         return new Date(year, month - 1, day, h, m);
      };
      entryDateTime = parseTime(parts[0]);
      endDateTime = parseTime(parts[1]);
      
      const existingEntry = allData.find(e => 
         e.type === 'diary' && 
         !e.isEvent && 
         e.dateString === entryDateTime.toDateString() && 
         e.time === finalTimeStr &&
         e.id !== editingEntryId
      );
      if (existingEntry) {
         alert("Time slot already booked. Double entry not allowed.");
         return;
      }
    } else {
      let hours24 = parseInt(entryHour, 10);
      if (entryAmPm === 'PM' && hours24 !== 12) hours24 += 12;
      if (entryAmPm === 'AM' && hours24 === 12) hours24 = 0;
      entryDateTime = new Date(year, month - 1, day, hours24, parseInt(entryMinute, 10));

      let endH24 = parseInt(entryEndHour, 10);
      if (entryEndAmPm === 'PM' && endH24 !== 12) endH24 += 12;
      if (entryEndAmPm === 'AM' && endH24 === 12) endH24 = 0;
      endDateTime = new Date(year, month - 1, day, endH24, parseInt(entryEndMinute, 10));
      
      const startTimeStr = formatTime(entryDateTime);
      const endTimeStr = formatTime(endDateTime);
      finalTimeStr = entryType === 'diary' ? `${startTimeStr} - ${endTimeStr}` : startTimeStr;
    }

    const newEntryId = editingEntryId || generateId();
    
    const baseEntry = {
      id: newEntryId,
      type: entryType,
      content: newEntryText.trim(),
      timestamp: entryDateTime.getTime(),
      createdAt: editingEntryId ? (allData.find(e => e.id === editingEntryId)?.createdAt || 0) : Date.now()
    };

    let newEntry;
    if (entryType === 'diary') {
      newEntry = {
        ...baseEntry,
        time: finalTimeStr,
        endTimestamp: endDateTime.getTime(),
        dateString: entryDateTime.toDateString(), 
        phone: entryPhone.trim(),
        completed: editingEntryId ? allData.find(e => e.id === editingEntryId)?.completed : false,
        copiedToPhysical: editingEntryId ? allData.find(e => e.id === editingEntryId)?.copiedToPhysical : false,
        isPrivate: entryPrivate,
        isEvent: entryIsEvent
      };
    } else if (entryType === 'reminder') {
      newEntry = {
        ...baseEntry,
        time: finalTimeStr,
        dateString: entryDateTime.toDateString(),
        startDateStr: toLocalISODate(entryDateTime),
        phone: entryPhone.trim(),
        frequency: reminderFrequency,
        deletedDates: editingEntryId ? allData.find(e => e.id === editingEntryId)?.deletedDates || [] : []
      };
    } else if (entryType === 'note') {
      newEntry = {
        ...baseEntry,
        parentId: currentNoteFolderId
      };
    }
    
    setIsModalOpen(false); setEditingEntryId(null); setEntryPrivate(false);
    if (entryType !== 'note') handleJumpDate(toLocalISODate(entryDateTime));
    await saveToFirebase(newEntryId, newEntry);
  };

  const handleCloseDay = async () => {
    if (!closeDayReason.trim()) return;
    const targetDateStr = toLocalISODate(currentDate);
    const newId = generateId();
    await saveToFirebase(newId, {
      id: newId,
      type: 'closed_day',
      dateStr: targetDateStr,
      content: closeDayReason.trim(),
      timestamp: Date.now()
    });
    setCloseDayModal(false);
    setCloseDayReason("");
  };

  const handleDelete = async (id, targetDateStr = null) => {
    const entry = allData.find(e => e.id === id); if (!entry) return;
    setActiveEntryMenu(null);

    if (entry.type === 'reminder' && entry.frequency !== 'none') {
      setDeleteSeriesModal({ id, dateStr: targetDateStr || toLocalISODate(currentDate) });
    } else {
      await deleteFromFirebase(id);
    }
  };

  const handlePointerDown = (e, id) => {
    if (loginRole === 'sub' || loginRole === 'sub2') return; 
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input') || e.target.closest('select')) return;
    if (activeEntryMenu === id) return;
    holdTimer.current = setTimeout(() => {
      setActiveEntryMenu(id);
      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
    }, 500);
  };

  const handlePointerUpOrLeave = () => {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null; }
  };

  const renderCoverPage = () => (
    <motion.div 
      key="cover"
      initial={{ rotateY: -90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: -90, opacity: 0, transition: { duration: 0.6 } }}
      style={{ transformOrigin: "left center" }}
      className="absolute inset-0 bg-gradient-to-br from-[#4a2412] to-[#251006] rounded-[2rem] sm:rounded-3xl shadow-[inset_0_0_80px_rgba(0,0,0,0.9),_0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col items-center justify-center z-50 border-r-8 border-[#1a0b04]"
    >
      <LeatherTexture />
      <div className="absolute inset-4 sm:inset-5 border-[2px] border-dashed border-[#8b5a2b] opacity-60 rounded-2xl sm:rounded-[20px] pointer-events-none z-10" />
      <div className="absolute inset-5 sm:inset-6 border border-solid border-[#1a0b04] opacity-80 rounded-xl sm:rounded-[18px] pointer-events-none z-10" />
      
      <div className="absolute top-12 left-4 right-4 z-20 flex flex-col items-center text-center">
        <AnimatePresence mode="wait">
          <motion.div 
            key={quoteIndex}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.5 }}
            className="max-w-md w-full px-2"
          >
             <p className="text-[#fceabb] text-[16px] mb-2 leading-relaxed font-normal tracking-wide opacity-90" style={{ fontFamily: "'Amiri', serif", fontWeight: 400 }}>
               {ISLAMIC_QUOTES[quoteIndex].arabic}
             </p>
             <div className="w-16 h-px bg-[#8b5a2b] mx-auto mb-2 opacity-50" />
             <p className="text-[#d4c1ac] text-[13px] leading-tight opacity-90" style={{ fontFamily: "'A10', sans-serif", fontWeight: 400 }}>
               {ISLAMIC_QUOTES[quoteIndex].malayalam}
             </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-20 flex flex-col items-center gap-6 px-6 text-center mt-12 sm:mt-20">
        <h1 
          className="text-5xl sm:text-6xl font-normal drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: "'Berkshire Swash', cursive", background: "linear-gradient(to bottom, #fceabb, #f8b500)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          MLA Diary {currentYear}
        </h1>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-[#f8b500] to-transparent opacity-60" />
        <h2 
          className="text-2xl sm:text-3xl font-normal drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
          style={{ fontFamily: "'Berkshire Swash', cursive", background: "linear-gradient(to bottom, #fceabb, #e6b980)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
        >
          by PK Navas
        </h2>
      </div>

      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-6 sm:gap-12 z-20 px-4">
        <button onClick={() => setLoginModal({ isOpen: true, role: 'main' })} className="flex flex-col items-center gap-2 text-[#e6b980] hover:text-[#fceabb] transition-colors active:scale-95 group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#e6b980]/30 bg-black/30 flex items-center justify-center group-hover:bg-black/50 shadow-lg backdrop-blur-sm"><Crown size={24} className="sm:w-7 sm:h-7" /></div>
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-80" style={{fontFamily: "'Sora', sans-serif"}}>MLA</span>
        </button>

        <button onClick={() => setLoginModal({ isOpen: true, role: 'sub' })} className="flex flex-col items-center gap-2 text-[#b09b85] hover:text-[#d4c1ac] transition-colors active:scale-95 group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#b09b85]/30 bg-black/30 flex items-center justify-center group-hover:bg-black/50 shadow-lg backdrop-blur-sm"><User size={24} className="sm:w-7 sm:h-7" /></div>
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-80" style={{fontFamily: "'Sora', sans-serif"}}>PS</span>
        </button>

        <button onClick={() => setLoginModal({ isOpen: true, role: 'sub2' })} className="flex flex-col items-center gap-2 text-[#b09b85] hover:text-[#d4c1ac] transition-colors active:scale-95 group">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-[#b09b85]/30 bg-black/30 flex items-center justify-center group-hover:bg-black/50 shadow-lg backdrop-blur-sm"><Users size={24} className="sm:w-7 sm:h-7" /></div>
          <span className="text-[10px] sm:text-xs font-bold tracking-widest uppercase opacity-80" style={{fontFamily: "'Sora', sans-serif"}}>PS 2</span>
        </button>
      </div>

      <AnimatePresence>
        {loginModal.isOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={() => { setLoginModal({isOpen: false, role: null}); setPassword(""); setLoginError(false); }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-[#2a130c] border border-[#d4af37]/30 p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm relative" onClick={e=>e.stopPropagation()}>
              <button onClick={() => { setLoginModal({isOpen: false, role: null}); setPassword(""); setLoginError(false); }} className="absolute top-4 right-4 text-white/50 hover:text-white"><X size={20} /></button>
              
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]"><Lock size={24} /></div>
                <h3 className="text-[#d4af37] font-serif text-xl" style={{ fontFamily: "'Berkshire Swash', cursive" }}>{loginModal.role === 'main' ? 'MLA Access' : loginModal.role === 'sub' ? 'PS Access' : 'PS 2 Access'}</h3>
                
                <form onSubmit={handleLoginSubmit} className="w-full flex flex-col gap-3 mt-2">
                  <input 
                    type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter Password"
                    className={`w-full bg-black/50 border ${loginError ? 'border-red-500' : 'border-[#d4af37]/30'} rounded-xl px-4 py-3 text-white outline-none focus:border-[#d4af37] transition-colors`}
                    style={{ fontFamily: "'Sora', sans-serif" }} autoFocus
                  />
                  {loginError && <p className="text-red-400 text-xs font-medium">Incorrect password</p>}
                  <button type="submit" className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold py-3 rounded-xl mt-2 active:scale-95 transition-transform shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                    Unlock Diary
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const EntryList = ({ entriesList, currentDateStr, isClosed }) => {
    if (entriesList.length === 0 && !isClosed) return <div className="flex-1 pb-[96px]" />;

    const amEntries = entriesList.filter(e => !e.isEvent && new Date(e.timestamp).getHours() < 12);
    const pmEntries = entriesList.filter(e => !e.isEvent && new Date(e.timestamp).getHours() >= 12);
    const eventEntries = entriesList.filter(e => e.isEvent);

    const renderItems = (items) => items.map((entry) => (
      <div 
        key={entry.id + (entry.type === 'reminder' ? currentDateStr : '')} 
        className="relative transition-all duration-300 select-none touch-manipulation mb-[32px] min-h-[32px]" 
        onPointerDown={(e) => handlePointerDown(e, entry.id)} onPointerUp={handlePointerUpOrLeave} onPointerLeave={handlePointerUpOrLeave} onPointerCancel={handlePointerUpOrLeave}
      >
        <div className="flex items-start justify-between gap-4">
          <p 
            className={`text-[20px] leading-[32px] whitespace-pre-wrap break-words m-0 flex-1 transition-all duration-300 ${entry.completed ? 'line-through opacity-40 grayscale' : ''}`}
            style={{ fontFamily: "'Comic Neue', 'A10', 'Chilanka', cursive", color: COLORS.ink, fontWeight: 600 }}
          >
            <span className="tracking-tight inline whitespace-nowrap" style={{ color: COLORS.redInk, fontSize: '15px', fontFamily: "'Comic Neue', 'A10', 'Chilanka', cursive", fontWeight: 'bold' }}>
              {entry.time} - 
            </span>
            {entry.content}
            {entry.type === 'reminder' && entry.frequency !== 'none' && (
              <span className="text-xs bg-black/5 rounded px-2 py-0.5 ml-2 font-sans tracking-wide text-black/40">⟳ {entry.frequency.toUpperCase()}</span>
            )}
            {entry.isPrivate && loginRole === 'main' && (
              <span className="inline-flex items-center ml-2 text-red-500 relative z-[60]" title="Private Entry">
                <Lock size={14} />
              </span>
            )}
            {entry.phone && (
              <span className="inline whitespace-nowrap" style={{ fontFamily: "'Comic Neue', 'A10', 'Chilanka', cursive", fontSize: '20px', fontWeight: 600 }}>
                &nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;&nbsp;<a href={`tel:${entry.phone}`} className="text-[#2563EB] decoration-1 underline-offset-4 inline relative z-[60]" onClick={(e) => e.stopPropagation()}>{entry.phone}</a>
              </span>
            )}
          </p>

          {loginRole === 'sub' && entry.type === 'diary' && (
            <div className="flex items-center justify-center shrink-0 min-w-[50px] h-[40px] pl-2 pr-2 relative z-[70]" onPointerDown={(e) => e.stopPropagation()}>
              {!entry.copiedToPhysical ? (
                <button onClick={(e) => { e.stopPropagation(); saveToFirebase(entry.id, { ...entry, copiedToPhysical: true }); }} className="w-12 h-12 -m-2 flex items-center justify-center text-[#B28A5A]/60 hover:text-[#B28A5A] hover:bg-[#B28A5A]/10 rounded-full transition-all active:scale-90 relative z-[80]" title="Mark as copied to Physical Diary">
                  <BookOpen size={24} />
                </button>
              ) : (
                <span className="text-green-600 font-bold select-none relative z-[80] cursor-pointer" style={{ fontFamily: "'Comic Neue', cursive", fontSize: '28px', lineHeight: '32px' }} onPointerDown={(e) => { e.stopPropagation(); uncheckTimerRef.current = setTimeout(() => { if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50); setUncheckConfirmEntry(entry); }, 3500); }} onPointerUp={(e) => { e.stopPropagation(); if (uncheckTimerRef.current) clearTimeout(uncheckTimerRef.current); }} onPointerLeave={(e) => { e.stopPropagation(); if (uncheckTimerRef.current) clearTimeout(uncheckTimerRef.current); }} onPointerCancel={(e) => { e.stopPropagation(); if (uncheckTimerRef.current) clearTimeout(uncheckTimerRef.current); }} title="Hold for 3.5s to uncheck">✓</span>
              )}
            </div>
          )}
          {loginRole === 'sub2' && entry.type === 'diary' && entry.copiedToPhysical && (
            <div className="flex items-center justify-center shrink-0 min-w-[50px] h-[40px] pl-2 pr-2 relative z-[70]" onPointerDown={(e) => e.stopPropagation()}>
              <span className="text-green-600 font-bold select-none relative z-[80]" style={{ fontFamily: "'Comic Neue', cursive", fontSize: '28px', lineHeight: '32px' }}>✓</span>
            </div>
          )}
        </div>

        <AnimatePresence>
          {activeEntryMenu === entry.id && loginRole === 'main' && (
            <motion.div initial={{ opacity: 0, y: -5, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="absolute top-[28px] left-0 bg-white/95 backdrop-blur-md shadow-lg rounded-xl flex items-center gap-1 p-1 z-[80] border border-black/5" onPointerDown={(e) => e.stopPropagation()}>
              <button onClick={(e) => { e.stopPropagation(); saveToFirebase(entry.id, { ...entry, completed: !entry.completed }); setActiveEntryMenu(null); }} className="p-2.5 rounded-lg hover:bg-black/5 text-[#1A1A1A] transition-colors active:scale-90">
                <CheckCircle size={22} className={entry.completed ? 'fill-green-500 text-white' : ''} />
              </button>
              <div className="w-px h-6 bg-black/10 mx-0.5" />
              <button onClick={(e) => { e.stopPropagation(); handleOpenModal(entry); }} className="p-2.5 rounded-lg hover:bg-black/5 text-[#1A1A1A] transition-colors active:scale-90">
                <Edit2 size={20} />
              </button>
              <div className="w-px h-6 bg-black/10 mx-0.5" />
              <button onClick={(e) => { e.stopPropagation(); handleDelete(entry.id, currentDateStr); }} className="p-2.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors active:scale-90">
                <Trash2 size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ));

    return (
      <div className="pt-[4px] pb-[120px] min-h-full flex flex-col relative z-[45]">
        {isClosed && (
          <div className="mb-[64px] min-h-[32px]">
             <p className="text-[22px] sm:text-[24px] leading-[32px] font-bold text-red-700 tracking-wide break-words m-0" style={{ fontFamily: "'Sora', sans-serif" }}>
               {isClosed.content}
             </p>
          </div>
        )}

        {amEntries.length > 0 && (
          <div className="relative">
             {renderItems(amEntries)}
          </div>
        )}

        {pmEntries.length > 0 && (
          <>
            {amEntries.length > 0 && (
              <div className="w-full border-t border-dashed border-[#B28A5A]/30 my-6 relative">
                <span className="absolute -top-[10px] left-1/2 -translate-x-1/2 bg-[#F7F3EA] px-3 text-[11px] text-[#B28A5A] font-bold tracking-widest uppercase">Afternoon</span>
              </div>
            )}
            <div className={`relative flex-1 ${amEntries.length === 0 ? 'min-h-full' : ''} bg-yellow-600/10 -mx-4 sm:-mx-10 px-4 sm:px-10 py-6 rounded-t-[2rem] border-t border-yellow-600/10 shadow-[inset_0_10px_20px_rgba(202,138,4,0.05)]`}>
               {renderItems(pmEntries)}
            </div>
          </>
        )}

        {eventEntries.length > 0 && (
          <>
            {(amEntries.length > 0 || pmEntries.length > 0) && (
              <div className="w-full border-t border-dashed border-blue-500/30 my-6 relative">
                <span className="absolute -top-[10px] left-1/2 -translate-x-1/2 bg-[#F7F3EA] px-3 text-[11px] text-blue-600 font-bold tracking-widest uppercase">Events</span>
              </div>
            )}
            <div className={`relative flex-1 bg-blue-500/10 -mx-4 sm:-mx-10 px-4 sm:px-10 py-6 rounded-t-[2rem] border-t border-blue-500/20 shadow-[inset_0_10px_20px_rgba(59,130,246,0.05)]`}>
               {renderItems(eventEntries)}
            </div>
          </>
        )}
      </div>
    );
  };

  const DiaryPage = ({ date, isVisible, customDir, isFast }) => {
    const targetDateStr = toLocalISODate(date);
    
    const reminders = allData.filter(e => e.type === 'reminder' && isRecurringOnDate(e, targetDateStr));
    const diaryEntries = allData.filter(e => e.type === 'diary' && e.dateString === date.toDateString());
    const isClosed = allData.find(e => e.type === 'closed_day' && e.dateStr === targetDateStr);
    
    let sortedDisplayEntries = [];
    if (loginRole === 'sub' || loginRole === 'sub2') {
      const visibleDiaryEntries = diaryEntries.filter(e => !e.isPrivate);
      const unmarked = visibleDiaryEntries.filter(e => !e.copiedToPhysical).sort((a, b) => a.timestamp - b.timestamp);
      const marked = visibleDiaryEntries.filter(e => e.copiedToPhysical).sort((a, b) => a.timestamp - b.timestamp);
      sortedDisplayEntries = [...unmarked, ...marked];
    } else {
      sortedDisplayEntries = [...reminders, ...diaryEntries].sort((a, b) => a.timestamp - b.timestamp);
    }

    const transitionOptions = isFast ? { type: "tween", duration: 0.1, ease: "linear" } : { type: "tween", duration: 0.6, ease: [0.25, 1, 0.5, 1] };

    return (
      <motion.div
        className="absolute inset-0 flex flex-col items-center overflow-hidden"
        style={{ backgroundColor: isClosed ? '#FFF0F0' : COLORS.paper, backfaceVisibility: 'hidden', transformOrigin: 'center', boxShadow: 'inset -2px 0 10px rgba(0,0,0,0.02), inset 10px 0 20px rgba(0,0,0,0.04)' }}
        initial={isVisible ? false : { x: customDir > 0 ? '60%' : '-60%', rotateY: customDir > 0 ? 45 : -45, opacity: 0, zIndex: 10, scale: 0.95 }}
        animate={{ x: '0%', rotateY: 0, opacity: 1, zIndex: 5, scale: 1 }}
        exit={{ x: customDir > 0 ? '-60%' : '60%', rotateY: customDir > 0 ? -45 : 45, opacity: 0, zIndex: 10, scale: 0.95, boxShadow: customDir > 0 ? '20px 0 40px rgba(0,0,0,0.3)' : '-20px 0 40px rgba(0,0,0,0.3)' }}
        transition={transitionOptions} onClick={() => {setActiveEntryMenu(null); setActivePanel(null);}}
      >
        <PaperTexture />
        {isClosed && <div className="absolute inset-0 bg-red-900/5 pointer-events-none z-0 mix-blend-multiply" />}
        
        <motion.div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent pointer-events-none z-20" initial={{ opacity: 1, x: customDir > 0 ? '100%' : '-100%' }} animate={{ opacity: 0, x: '0%' }} exit={{ opacity: 1, x: customDir > 0 ? '-100%' : '100%' }} transition={{ duration: transitionOptions.duration, ease: "easeOut" }} />
        
        <div className="w-full z-[60] flex items-center justify-between pt-5 pb-3 border-b border-[rgba(178,138,90,0.3)] bg-transparent backdrop-blur-sm shrink-0 px-4 sm:px-8 relative" onPointerDown={(e) => e.stopPropagation()}>
          <div className="w-auto flex items-center justify-start gap-1 z-50 min-w-[50px]">
            {loginRole === 'main' && (
              <button 
                onClick={(e) => { e.stopPropagation(); setShowRemindersModal(true); }} 
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-90 relative ${reminders.length > 0 ? 'bg-red-500 text-white animate-reminder-pulse shadow-md border-none' : 'text-[#B28A5A] hover:bg-black/5'}`} 
                title="Today's Reminders"
              >
                <Bell size={22} />
              </button>
            )}
            
            {loginRole === 'sub' && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setShowLogoutConfirm(true); }} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors active:scale-90 relative" title="Sign Out">
                   <LogOut size={20} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setShowRecentModal(true); }} className="w-10 h-10 flex items-center justify-center text-[#B28A5A] hover:bg-black/5 rounded-full transition-colors active:scale-90 relative" title="Recent Additions">
                  <History size={22} />
                  {recentUncopiedCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-[#F7F3EA]">
                      {recentUncopiedCount}
                    </span>
                  )}
                </button>
              </>
            )}

            {loginRole === 'sub2' && (
              <button onClick={(e) => { e.stopPropagation(); setShowLogoutConfirm(true); }} className="w-10 h-10 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-full transition-colors active:scale-90 relative" title="Sign Out">
                 <LogOut size={20} />
              </button>
            )}
          </div> 
          
          <label className="text-center cursor-pointer active:scale-95 transition-transform relative group z-[70] mx-2 flex flex-col items-center">
            <input type="date" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" value={targetDateStr} onChange={(e) => handleJumpDate(e.target.value)} />
            <h1 className="text-[20px] sm:text-2xl font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#B28A5A] transition-colors">{formatDate(date)}</h1>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
              <span className="text-[#B28A5A]">{getDayName(date)}</span>
              {sortedDisplayEntries.length > 0 && (
                 <span className="bg-[#B28A5A]/10 text-[#B28A5A] px-2 py-0.5 rounded-md font-extrabold">{sortedDisplayEntries.length} Events</span>
              )}
            </p>
          </label>

          <div className="flex items-center gap-1 z-[70] w-auto min-w-[50px] justify-end">
            {loginRole === 'main' && (
              <button 
                onPointerDown={(e) => {
                  e.stopPropagation();
                  if (isClosed) {
                    holdTimer.current = setTimeout(() => {
                      setUncloseDayModal(isClosed.id);
                      if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50);
                    }, 800);
                  }
                }}
                onPointerUp={(e) => { if (holdTimer.current) clearTimeout(holdTimer.current); }}
                onPointerLeave={(e) => { if (holdTimer.current) clearTimeout(holdTimer.current); }}
                onClick={(e) => { e.stopPropagation(); if (!isClosed) setCloseDayModal(true); }} 
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors active:scale-90 ${isClosed ? 'text-red-600 bg-red-100 border border-red-200 shadow-sm' : 'text-red-400 hover:text-red-600 hover:bg-red-50'}`} 
                title={isClosed ? "Hold to Reopen Day" : "Close Day"}
              >
                <Ban size={18} strokeWidth={isClosed ? 2.5 : 2.5} />
              </button>
            )}
            <button onClick={(e) => { e.stopPropagation(); handleJumpToToday(); }} className="w-10 h-10 flex items-center justify-center text-[#B28A5A] hover:bg-black/5 rounded-full transition-colors active:scale-90" title="Go to Today"><Target size={22} /></button>
          </div>
        </div>

        <div className="w-full flex-1 overflow-y-auto z-10 scrollbar-hide relative px-4 sm:px-10" style={{ backgroundImage: `repeating-linear-gradient(transparent, transparent 31px, rgba(178, 138, 90, 0.2) 31px, rgba(178, 138, 90, 0.2) 32px)`, backgroundAttachment: 'local', backgroundPosition: '0 0' }}>
          <EntryList entriesList={sortedDisplayEntries} currentDateStr={targetDateStr} isClosed={isClosed} />
        </div>
      </motion.div>
    );
  };

  const renderFooter = () => {
    if (loginRole !== 'main') return null;
    return (
      <div className="absolute bottom-0 left-0 right-0 h-[64px] bg-[#DCD2BE] border-t border-[#B28A5A]/50 z-[60] flex items-center justify-between px-2 sm:px-6 rounded-b-[2rem] sm:rounded-b-3xl shadow-[inset_0_4px_10px_rgba(0,0,0,0.03),_0_-4px_15px_rgba(0,0,0,0.05)]">
        <PaperTexture />
        <div className="relative z-10 w-full flex justify-between items-center text-[#3A2E25]/80" onPointerDown={(e) => e.stopPropagation()}>
          <button onClick={() => setShowLogoutConfirm(true)} className="p-3 text-red-600 hover:text-red-800 transition-colors" title="Log Out"><LogOut size={22} /></button>
          <button onClick={() => setActivePanel(p => p === 'settings' ? null : 'settings')} className={`p-3 transition-colors ${activePanel === 'settings' ? 'text-[#B28A5A]' : 'hover:text-[#3A2E25]'}`} title="Settings"><Settings size={22} /></button>
          {loginRole !== 'sub2' && (
            <button onClick={() => setActivePanel(p => p === 'reading' ? null : 'reading')} className={`p-3 transition-colors ${activePanel === 'reading' ? 'text-[#B28A5A]' : 'hover:text-[#3A2E25]'}`} title="Reading Targets"><BookOpen size={22} /></button>
          )}
          <button onClick={() => setActivePanel(p => p === 'todo' ? null : 'todo')} className={`p-3 transition-colors ${activePanel === 'todo' ? 'text-[#B28A5A]' : 'hover:text-[#3A2E25]'}`} title="To-Do List"><ListTodo size={22} /></button>
          <button onClick={() => { if (activePanel !== 'note') { window.history.pushState(null, '', '#notes'); setActivePanel('note'); } else { window.history.back(); } }} className={`p-3 transition-colors ${activePanel === 'note' ? 'text-[#B28A5A]' : 'hover:text-[#3A2E25]'}`} title="Keep Notes"><StickyNote size={22} /></button>
          <button onClick={() => setActivePanel(p => p === 'event' ? null : 'event')} className={`p-3 transition-colors ${activePanel === 'event' ? 'text-[#B28A5A]' : 'hover:text-[#3A2E25]'}`} title="Event Records"><CalendarCheck size={22} /></button>
        </div>
      </div>
    );
  };

  const DatePickerBadge = () => (
    <label className="cursor-pointer relative group flex items-center gap-1 border border-[#B28A5A]/30 rounded-lg px-2 py-1 bg-white/50" onPointerDown={(e) => e.stopPropagation()}>
        <input type="date" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50" value={toLocalISODate(currentDate)} onChange={(e) => handleJumpDate(e.target.value)} />
        <CalendarIcon size={12} className="text-[#B28A5A]"/>
        <span className="text-xs font-bold text-[#B28A5A] group-hover:text-[#3A2E25] transition-colors">{formatDate(currentDate)}</span>
    </label>
  );

  const ReadingPanel = () => {
    const [showAdd, setShowAdd] = useState(false);
    const [newBook, setNewBook] = useState({ title: '', totalPages: '', targetDays: '' });
    const todayStr = toLocalISODate(currentDate);
    const books = allData.filter(e => e.type === 'book');

    const handleAddBook = async (e) => {
      e.preventDefault(); if (!newBook.title || !newBook.totalPages || !newBook.targetDays) return;
      await saveToFirebase(generateId(), { type: 'book', title: newBook.title, totalPages: Number(newBook.totalPages), targetDays: Number(newBook.targetDays), startDateStr: todayStr, progress: {}, timestamp: Date.now() });
      setNewBook({ title: '', totalPages: '', targetDays: '' }); setShowAdd(false);
    };

    const handleLogPages = async (book, pages) => {
      const p = Number(pages); if (isNaN(p)) return;
      await saveToFirebase(book.id, { ...book, progress: { ...(book.progress || {}), [todayStr]: p } });
    };

    const getStats = (book) => {
      let readBefore = 0; let daysPassed = 0;
      const start = new Date(book.startDateStr); start.setHours(0,0,0,0);
      const target = new Date(todayStr); target.setHours(0,0,0,0);
      if (target < start) return { status: 'pending' };
      const loop = new Date(start);
      while(loop < target) {
        if (book.progress?.[toLocalISODate(loop)]) readBefore += book.progress[toLocalISODate(loop)];
        daysPassed++; loop.setDate(loop.getDate() + 1);
      }
      const remPages = book.totalPages - readBefore;
      const remDays = book.targetDays - daysPassed;
      if (remPages <= 0 && !book.progress?.[todayStr]) return { status: 'completed' };
      let dailyTarget = remPages > 0 ? (remDays > 0 ? Math.ceil(remPages / remDays) : remPages) : 0;
      return { status: 'active', dailyTarget, remPages, readToday: book.progress?.[todayStr] || '' };
    };

    return (
      <div className="absolute inset-x-0 bottom-[64px] h-[60%] bg-[#F7F3EA] z-[55] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col border-t border-[#B28A5A]/30" onPointerDown={(e) => e.stopPropagation()}>
        <PaperTexture />
        <div className="p-4 border-b border-[#B28A5A]/20 flex justify-between items-center relative z-10 bg-[#EAE3D2]/80 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[#3A2E25] flex items-center gap-2"><BookOpen size={18}/> Reading</h3>
            <div className="h-4 w-px bg-[#B28A5A]/30" />
            <DatePickerBadge />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAdd(true)} className="p-2 text-[#B28A5A] hover:bg-black/5 rounded-full"><Plus size={22}/></button>
            <div className="w-px h-6 bg-black/10"/>
            <button onClick={() => setActivePanel(null)} className="p-2 text-black/50 hover:text-black rounded-full"><X size={20}/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 relative z-10 space-y-4">
          {books.map(book => {
            const stats = getStats(book); if (stats.status === 'completed') return null;
            return (
              <div key={book.id} className="bg-white/60 border border-[#B28A5A]/30 p-4 rounded-xl shadow-sm relative" onPointerDown={(e) => handlePointerDown(e, book.id)} onPointerUp={handlePointerUpOrLeave} onPointerLeave={handlePointerUpOrLeave}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-[#1A1A1A] text-[18px] leading-tight" style={{ fontFamily: "'Comic Neue', 'A10', 'Chilanka', cursive", fontWeight: 600 }}>{book.title}</h4>
                  {stats.status === 'active' && <span className="text-xs bg-[#B28A5A] text-white px-2 py-1 rounded font-bold ml-2 shrink-0">Target: {stats.dailyTarget} pgs</span>}
                </div>
                {stats.status === 'active' ? (
                  <div className="flex items-center gap-2 mt-3">
                    <input type="number" placeholder="Pages read today" value={stats.readToday} onChange={(e) => handleLogPages(book, e.target.value)} className="flex-1 bg-transparent border-b border-black/20 outline-none px-1 py-1 text-sm font-medium" />
                  </div>
                ) : <p className="text-xs text-black/40 italic mt-2">Starts on {formatDate(new Date(book.startDateStr))}</p>}
                {activeEntryMenu === book.id && <button onClick={() => deleteFromFirebase(book.id)} className="absolute top-2 right-2 bg-red-100 text-red-600 p-1.5 rounded-lg shadow z-[60]"><Trash2 size={16}/></button>}
              </div>
            );
          })}
        </div>

        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#F7F3EA] z-[60] flex flex-col p-6 rounded-t-3xl border-t border-[#B28A5A]/30">
              <PaperTexture />
              <div className="flex justify-between items-center relative z-10 mb-6 border-b border-black/10 pb-2">
                <h4 className="font-bold text-[#1A1A1A]">Add New Book</h4>
                <button onClick={() => setShowAdd(false)} className="text-black/50 hover:text-black p-2"><X size={20}/></button>
              </div>
              <form onSubmit={handleAddBook} className="relative z-10 flex flex-col gap-4">
                <input placeholder="Book Title" value={newBook.title} onChange={e => setNewBook(p => ({...p, title: e.target.value}))} className="bg-white/80 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-[#B28A5A]" />
                <div className="flex gap-3">
                  <input type="number" placeholder="Total Pgs" value={newBook.totalPages} onChange={e => setNewBook(p => ({...p, totalPages: e.target.value}))} className="flex-1 bg-white/80 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-[#B28A5A]" />
                  <input type="number" placeholder="Days Target" value={newBook.targetDays} onChange={e => setNewBook(p => ({...p, targetDays: e.target.value}))} className="flex-1 bg-white/80 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-[#B28A5A]" />
                </div>
                <button type="submit" className="bg-[#B28A5A] text-white py-3 rounded-xl font-bold mt-2 shadow-lg active:scale-95 transition-transform">Start Reading</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const TodoPanel = () => {
    const [showAdd, setShowAdd] = useState(false);
    const [newTodo, setNewTodo] = useState({ content: "", priority: "Medium", phone: "" });
    const targetDateStr = toLocalISODate(currentDate);
    
    const todos = allData.filter(e => e.type === 'todo' && e.createdAtStr <= targetDateStr && (!e.completedAtStr || e.completedAtStr >= targetDateStr)).sort((a,b) => a.timestamp - b.timestamp);

    const handleAdd = async (e) => {
      e.preventDefault(); if (!newTodo.content.trim()) return;
      await saveToFirebase(generateId(), { type: 'todo', ...newTodo, createdAtStr: targetDateStr, completedAtStr: null, timestamp: Date.now() });
      setNewTodo({ content: "", priority: "Medium", phone: "" }); setShowAdd(false);
    };

    return (
      <div className="absolute inset-x-0 bottom-[64px] h-[60%] bg-[#F7F3EA] z-[55] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col border-t border-[#B28A5A]/30" onPointerDown={(e) => e.stopPropagation()}>
        <PaperTexture />
        <div className="p-4 border-b border-[#B28A5A]/20 flex justify-between items-center relative z-10 bg-[#EAE3D2]/80 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[#3A2E25] flex items-center gap-2"><ListTodo size={18}/> To-Do List</h3>
            <div className="h-4 w-px bg-[#B28A5A]/30" />
            <DatePickerBadge />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAdd(true)} className="p-2 text-[#B28A5A] hover:bg-black/5 rounded-full"><Plus size={22}/></button>
            <div className="w-px h-6 bg-black/10"/>
            <button onClick={() => setActivePanel(null)} className="p-2 text-black/50 hover:text-black rounded-full"><X size={20}/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 relative z-10">
          {todos.map(todo => (
            <div key={todo.id} className="flex flex-col mb-4 bg-white/40 p-3 rounded-xl border border-black/5 group relative" onPointerDown={(e) => handlePointerDown(e, todo.id)} onPointerUp={handlePointerUpOrLeave} onPointerLeave={handlePointerUpOrLeave}>
              <div className="flex items-start gap-3">
                <button onClick={() => saveToFirebase(todo.id, { ...todo, completedAtStr: todo.completedAtStr === targetDateStr ? null : targetDateStr })} className={`mt-1 shrink-0 w-5 h-5 rounded border relative z-[60] ${todo.completedAtStr === targetDateStr ? 'bg-green-600 border-green-600 flex items-center justify-center' : 'border-black/30'}`}>
                  {todo.completedAtStr === targetDateStr && <Check size={14} className="text-white"/>}
                </button>
                <div className="flex-1">
                  <p className={`text-[17px] leading-tight ${todo.completedAtStr === targetDateStr ? 'line-through text-black/40' : 'text-[#1A1A1A]'}`} style={{ fontFamily: "'Comic Neue', 'A10', 'Chilanka', cursive", fontWeight: 600 }}>{todo.content}</p>
                  <div className="flex items-center gap-3 mt-1.5 opacity-70 text-xs">
                    <span className={`font-bold ${todo.priority === 'High' ? 'text-red-500' : todo.priority === 'Medium' ? 'text-orange-500' : 'text-blue-500'}`}>{todo.priority}</span>
                    {todo.phone && <a href={`tel:${todo.phone}`} className="flex items-center gap-1 text-blue-600 relative z-[60]" style={{ fontFamily: "'Comic Neue', 'A10', sans-serif" }}><Phone size={12}/> {todo.phone}</a>}
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {activeEntryMenu === todo.id && (
                  <motion.button initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.8}} onClick={() => deleteFromFirebase(todo.id)} className="absolute top-2 right-2 text-red-500 bg-red-50 p-2 rounded-lg shadow-sm z-[60]"><Trash2 size={16}/></motion.button>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#F7F3EA] z-[60] flex flex-col p-6 rounded-t-3xl border-t border-[#B28A5A]/30">
              <PaperTexture />
              <div className="flex justify-between items-center relative z-10 mb-6 border-b border-black/10 pb-2">
                <h4 className="font-bold text-[#1A1A1A]">New Task</h4>
                <button onClick={() => setShowAdd(false)} className="text-black/50 hover:text-black p-2"><X size={20}/></button>
              </div>
              <form onSubmit={handleAdd} className="relative z-10 flex flex-col gap-4">
                <input placeholder="Task description..." value={newTodo.content} onChange={e => setNewTodo(p => ({...p, content: e.target.value}))} className="bg-white/80 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-[#B28A5A]" autoFocus/>
                <div className="flex gap-3">
                  <select value={newTodo.priority} onChange={e => setNewTodo(p => ({...p, priority: e.target.value}))} className="flex-1 bg-white/80 border border-black/10 rounded-xl px-4 py-3 outline-none text-[#1A1A1A]">
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <input type="tel" placeholder="Phone (Optional)" value={newTodo.phone} onChange={e => setNewTodo(p => ({...p, phone: e.target.value}))} className="flex-1 bg-white/80 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-[#B28A5A]" />
                </div>
                <button type="submit" className="bg-[#B28A5A] text-white py-3 rounded-xl font-bold mt-2 shadow-lg active:scale-95 transition-transform">Add Task</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const EventPanel = () => {
    const [showAdd, setShowAdd] = useState(false);
    const [newEvent, setNewEvent] = useState({ content: "", phone: "" });
    const targetDateStr = toLocalISODate(currentDate);
    
    const events = allData.filter(e => e.type === 'event' && e.createdAtStr <= targetDateStr && (!e.completedAtStr || e.completedAtStr >= targetDateStr)).sort((a,b) => a.timestamp - b.timestamp);

    const handleAdd = async (e) => {
      e.preventDefault(); if (!newEvent.content.trim()) return;
      await saveToFirebase(generateId(), { type: 'event', ...newEvent, createdAtStr: targetDateStr, completedAtStr: null, timestamp: Date.now() });
      setNewEvent({ content: "", phone: "" }); setShowAdd(false);
    };

    return (
      <div className="absolute inset-x-0 bottom-[64px] h-[60%] bg-[#F7F3EA] z-[55] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col border-t border-[#B28A5A]/30" onPointerDown={(e) => e.stopPropagation()}>
        <PaperTexture />
        <div className="p-4 border-b border-[#B28A5A]/20 flex justify-between items-center relative z-10 bg-[#EAE3D2]/80 backdrop-blur-sm rounded-t-3xl">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[#3A2E25] flex items-center gap-2"><CalendarCheck size={18}/> Events</h3>
            <div className="h-4 w-px bg-[#B28A5A]/30" />
            <DatePickerBadge />
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowAdd(true)} className="p-2 text-[#B28A5A] hover:bg-black/5 rounded-full"><Plus size={22}/></button>
            <div className="w-px h-6 bg-black/10"/>
            <button onClick={() => setActivePanel(null)} className="p-2 text-black/50 hover:text-black rounded-full"><X size={20}/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 relative z-10">
          {events.map(ev => (
            <div key={ev.id} className="flex flex-col mb-4 bg-[#B28A5A]/5 p-3 rounded-xl border border-[#B28A5A]/20 relative" onPointerDown={(e) => handlePointerDown(e, ev.id)} onPointerUp={handlePointerUpOrLeave} onPointerLeave={handlePointerUpOrLeave}>
              <div className="flex items-start gap-3">
                <button onClick={() => saveToFirebase(ev.id, { ...ev, completedAtStr: ev.completedAtStr === targetDateStr ? null : targetDateStr })} className={`mt-1 shrink-0 w-5 h-5 rounded-full border relative z-[60] ${ev.completedAtStr === targetDateStr ? 'bg-[#B28A5A] border-[#B28A5A] flex items-center justify-center' : 'border-[#B28A5A]/50'}`}>
                  {ev.completedAtStr === targetDateStr && <Check size={14} className="text-white"/>}
                </button>
                <div className="flex-1">
                  <p className={`text-[17px] leading-tight ${ev.completedAtStr === targetDateStr ? 'line-through text-black/40' : 'text-[#3A2E25]'}`} style={{ fontFamily: "'Comic Neue', 'A10', 'Chilanka', cursive", fontWeight: 600 }}>{ev.content}</p>
                  {ev.phone && <a href={`tel:${ev.phone}`} className="inline-flex items-center gap-1 text-blue-600 relative z-[60] text-sm mt-2" style={{ fontFamily: "'Comic Neue', 'A10', sans-serif" }}><Phone size={14}/> {ev.phone}</a>}
                </div>
              </div>
              <AnimatePresence>
                {activeEntryMenu === ev.id && (
                  <motion.button initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.8}} onClick={() => deleteFromFirebase(ev.id)} className="absolute top-2 right-2 text-red-500 bg-red-50 p-2 rounded-lg shadow-sm z-[60]"><Trash2 size={16}/></motion.button>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {showAdd && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-[#F7F3EA] z-[60] flex flex-col p-6 rounded-t-3xl border-t border-[#B28A5A]/30">
              <PaperTexture />
              <div className="flex justify-between items-center relative z-10 mb-6 border-b border-black/10 pb-2">
                <h4 className="font-bold text-[#1A1A1A]">Record Event</h4>
                <button onClick={() => setShowAdd(false)} className="text-black/50 hover:text-black p-2"><X size={20}/></button>
              </div>
              <form onSubmit={handleAdd} className="relative z-10 flex flex-col gap-4">
                <input placeholder="Event Details..." value={newEvent.content} onChange={e => setNewEvent(p => ({...p, content: e.target.value}))} className="bg-white/80 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-[#B28A5A]" autoFocus/>
                <input type="tel" placeholder="Phone (Optional)" value={newEvent.phone} onChange={e => setNewEvent(p => ({...p, phone: e.target.value}))} className="w-full bg-white/80 border border-black/10 rounded-xl px-4 py-3 outline-none focus:border-[#B28A5A]" />
                <button type="submit" className="bg-[#B28A5A] text-white py-3 rounded-xl font-bold mt-2 shadow-lg active:scale-95 transition-transform">Save Event</button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const NotePanel = () => {
    const [search, setSearch] = useState("");
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [contextMenuPos, setContextMenuPos] = useState(null);
    const [longPressedItem, setLongPressedItem] = useState(null);
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [renameValue, setRenameValue] = useState("");
    const [deleteConfirmItem, setDeleteConfirmItem] = useState(null);
    const [activeNote, setActiveNote] = useState(null);

    const allNotesAndFolders = allData.filter(e => (e.type === 'note' || e.type === 'folder'));
    
    // Hash routing for back button
    useEffect(() => {
      const handlePopState = () => {
        if (window.location.hash !== '#notes') {
          setActivePanel(p => p === 'note' ? null : p);
        }
      };
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const deleteRecursive = async (id, type) => {
      if (type === 'note') {
        await deleteFromFirebase(id);
      } else {
        const children = allData.filter(e => e.parentId === id && (e.type === 'note' || e.type === 'folder'));
        for (const child of children) {
          await deleteRecursive(child.id, child.type);
        }
        await deleteFromFirebase(id);
      }
    };

    const handleCreateFolder = async () => {
      if (!newFolderName.trim()) return;
      const id = generateId();
      await saveToFirebase(id, {
        type: 'folder',
        name: newFolderName.trim(),
        parentId: currentNoteFolderId,
        timestamp: Date.now()
      });
      setIsCreateFolderOpen(false);
      setNewFolderName("");
    };

    const handleRename = async () => {
      if (!renameValue.trim() || !longPressedItem) return;
      if (longPressedItem.type === 'folder') {
        await saveToFirebase(longPressedItem.id, { ...longPressedItem, name: renameValue.trim() });
      } else {
        await saveToFirebase(longPressedItem.id, { ...longPressedItem, content: renameValue.trim(), title: renameValue.trim() });
      }
      setIsRenameOpen(false);
      setLongPressedItem(null);
      setContextMenuPos(null);
    };

    const handleDelete = (item) => {
      setDeleteConfirmItem(item);
    };

    const confirmDelete = async () => {
      if (deleteConfirmItem) {
        await deleteRecursive(deleteConfirmItem.id, deleteConfirmItem.type);
        setLongPressedItem(null);
        setContextMenuPos(null);
        setDeleteConfirmItem(null);
      }
    };

    const handleNavigate = (folder) => {
      setCurrentNoteFolderId(folder.id);
      setNoteFolderPath([...noteFolderPath, folder]);
    };

    const handleNavigateUp = (index) => {
      if (index === -1) {
         setCurrentNoteFolderId(null);
         setNoteFolderPath([]);
      } else {
         const newPath = noteFolderPath.slice(0, index + 1);
         setCurrentNoteFolderId(newPath[newPath.length - 1].id);
         setNoteFolderPath(newPath);
      }
    };

    // Global Search vs Local items
    const isSearching = search.trim().length > 0;
    const currentItems = isSearching 
      ? allNotesAndFolders.filter(i => [i.name, i.title, i.content, i.phone].join(' ').toLowerCase().includes(search.toLowerCase()))
      : allNotesAndFolders.filter(e => (e.parentId || null) === currentNoteFolderId).sort((a,b) => b.timestamp - a.timestamp);

    const folders = currentItems.filter(i => i.type === 'folder');
    const notes = currentItems.filter(i => i.type === 'note');

    const handleAddNote = () => {
      setActiveNote({ id: generateId(), type: 'note', parentId: currentNoteFolderId, title: '', content: '', timestamp: Date.now(), isNew: true });
    };

    const closeNotePanel = () => {
      window.history.back(); // This will pop '#notes' and trigger popstate
    };
    
    const getFolderCounts = (folderId) => {
      const children = allData.filter(e => e.parentId === folderId && (e.type === 'note' || e.type === 'folder'));
      let fCount = children.filter(c => c.type === 'folder').length;
      let nCount = children.filter(c => c.type === 'note').length;
      return { fCount, nCount };
    };

    const renderLinks = (text) => {
      if (!text) return null;
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const phoneRegex = /(\+?\d{10,13})/g;
      const parts = text.split(new RegExp(`(${urlRegex.source}|${phoneRegex.source})`, 'gi')).filter(Boolean);
      return parts.map((part, i) => {
        if (part.match(urlRegex)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" onClick={e=>e.stopPropagation()}>{part}</a>;
        if (part.match(phoneRegex)) return <a key={i} href={`tel:${part}`} className="text-blue-600 underline" onClick={e=>e.stopPropagation()}>{part}</a>;
        return <span key={i}>{part}</span>;
      });
    };

    if (activeNote) {
      return (
        <NoteEditor 
          note={activeNote} 
          onClose={() => setActiveNote(null)} 
          onSave={async (updated) => {
            await saveToFirebase(updated.id, {
               type: 'note',
               parentId: updated.parentId,
               title: updated.title,
               content: updated.content,
               timestamp: updated.isNew ? Date.now() : updated.timestamp,
            });
          }} 
        />
      );
    }

    return (
      <div className="absolute inset-0 bg-[#F4F4F4] z-[60] flex flex-col" onPointerDown={(e) => e.stopPropagation()}>
        {/* Header / Toolbar */}
        <div className="pt-6 pb-2 px-4 flex justify-between items-center bg-[#F4F4F4] sticky top-0 z-20">
           <button onClick={closeNotePanel} className="p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform">
             <X size={24} className="text-black/80" />
           </button>
           <div className="flex-1 px-4 max-w-[200px]">
             <div className="relative">
               <Search size={16} className="absolute left-2.5 top-2 text-black/40" />
               <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-black/5 rounded-full pl-8 pr-3 py-1.5 outline-none focus:bg-white focus:shadow-sm text-sm text-black transition-all" />
             </div>
           </div>
           <div className="flex gap-1">
             <button onClick={() => setIsCreateFolderOpen(true)} className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform" title="Add Folder">
               <FolderPlus size={22} className="text-black/80" />
             </button>
           </div>
        </div>

        {/* Title Area */}
        {!isSearching && (
          <div className="px-6 py-2 flex flex-col items-center">
             <h1 className="text-3xl font-bold text-black mb-1 tracking-tight truncate max-w-[80vw]" style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
               {noteFolderPath.length === 0 ? 'Folders' : noteFolderPath[noteFolderPath.length - 1].name}
             </h1>
             <p className="text-black/50 text-xs font-medium">
               {folders.length} {folders.length === 1 ? 'folder' : 'folders'}{notes.length > 0 && `, ${notes.length} ${notes.length === 1 ? 'note' : 'notes'}`}
             </p>
          </div>
        )}
        {isSearching && (
          <div className="px-6 py-2 flex flex-col items-center">
             <h1 className="text-xl font-bold text-black mb-1">Search Results</h1>
          </div>
        )}

        {/* Breadcrumbs */}
        {!isSearching && noteFolderPath.length > 0 && (
          <div className="px-4 py-2">
             <div className="flex items-center gap-1 overflow-x-auto whitespace-nowrap bg-black/5 px-3 py-2 rounded-2xl">
               <button onClick={() => handleNavigateUp(-1)} className="p-1 hover:bg-black/10 rounded-full flex items-center justify-center active:scale-95 transition-transform"><Home size={16} className="text-black/60"/></button>
               {noteFolderPath.map((f, i) => (
                  <React.Fragment key={f.id}>
                    <ChevronRight size={14} className="text-black/30 shrink-0 mx-1" />
                    <button onClick={() => handleNavigateUp(i)} className={`font-medium px-2 py-1 rounded-lg hover:bg-black/10 truncate max-w-[120px] text-[14px] active:scale-95 transition-transform ${i === noteFolderPath.length - 1 ? 'text-black font-bold' : 'text-black/60'}`} style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
                      {f.name}
                    </button>
                  </React.Fragment>
               ))}
             </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[120px]">
           {/* Folders */}
           {folders.length > 0 && (
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 mb-6">
                {folders.map(folder => {
                   const { nCount, fCount } = getFolderCounts(folder.id);
                   const totalItems = nCount + fCount;
                   // Stable random color
                   const hash = folder.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
                   const colorIdx = hash % 5;
                   // Tab colors mimicking the screenshot: yellow, blue, grey, red, etc.
                   const tabColors = ['#fbbc04', '#669df6', '#9e9e9e', '#f28b82', '#ccff90'];
                   const bodyColors = ['#fdf3da', '#e8f0fe', '#f1f3f4', '#fce8e6', '#f4fce8'];

                   return (
                     <div key={folder.id} 
                       className="relative select-none cursor-pointer active:scale-95 transition-transform group bg-transparent h-[100px]"
                       onContextMenu={(e) => {
                         e.preventDefault();
                         setLongPressedItem(folder);
                         setContextMenuPos({ x: e.clientX, y: e.clientY });
                       }}
                       onPointerDown={(e) => {
                         let timer = setTimeout(() => {
                           const rect = e.target.getBoundingClientRect();
                           setLongPressedItem(folder);
                           setContextMenuPos({ x: rect.left + rect.width/2, y: rect.bottom });
                         }, 500);
                         e.target.dataset.timer = timer;
                       }}
                       onPointerUp={(e) => {
                         clearTimeout(e.target.dataset.timer);
                         if (!longPressedItem) handleNavigate(folder);
                       }}
                       onPointerLeave={(e) => clearTimeout(e.target.dataset.timer)}
                     >
                       {/* SVG Tabbed Folder exactly matching screenshot */}
                       <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.05))' }}>
                          <path d="M0,20 C0,12 6,8 14,8 L40,8 C45,8 48,11 50,15 L55,20 L86,20 C94,20 100,26 100,34 L100,86 C100,94 94,100 86,100 L14,100 C6,100 0,94 0,86 Z" fill={bodyColors[colorIdx]} />
                          <path d="M50,15 L55,20 L86,20 C94,20 100,26 100,34 L100,20 C100,12 94,8 86,8 L60,8 C55,8 52,11 50,15 Z" fill={tabColors[colorIdx]} />
                       </svg>
                       <div className="absolute inset-0 p-3 pt-5 flex flex-col justify-between pointer-events-none">
                          <span className="text-[10px] font-bold text-black/40 ml-1">{totalItems}</span>
                          <span className="font-bold text-black/80 leading-tight text-sm line-clamp-2 pb-1 ml-1" style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>{folder.name}</span>
                       </div>
                     </div>
                   );
                })}
             </div>
           )}

           {/* Notes */}
           {notes.length > 0 && (
             <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
                {notes.map(note => (
                   <div key={note.id} 
                     className="bg-white rounded-[20px] p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] aspect-square relative select-none cursor-pointer active:scale-95 transition-transform flex flex-col border border-black/5"
                     onContextMenu={(e) => {
                       e.preventDefault();
                       setLongPressedItem(note);
                       setContextMenuPos({ x: e.clientX, y: e.clientY });
                     }}
                     onPointerDown={(e) => {
                       let timer = setTimeout(() => {
                           const rect = e.target.getBoundingClientRect();
                           setLongPressedItem(note);
                           setContextMenuPos({ x: rect.left + rect.width/2, y: rect.bottom });
                       }, 500);
                       e.target.dataset.timer = timer;
                     }}
                     onPointerUp={(e) => {
                       clearTimeout(e.target.dataset.timer);
                       if (!longPressedItem) {
                         setActiveNote(note);
                       }
                     }}
                     onPointerLeave={(e) => clearTimeout(e.target.dataset.timer)}
                   >
                      <h3 className="font-bold text-black text-xs line-clamp-1 mb-1" style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>{note.title || 'Untitled'}</h3>
                      <p className="text-black/70 text-[10px] leading-relaxed line-clamp-4 overflow-hidden break-words" style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
                        {note.content}
                      </p>
                      <p className="text-[9px] text-black/30 absolute bottom-3 left-3">{(new Date(note.timestamp)).toLocaleDateString('en-GB', {day: 'numeric', month:'short'})}</p>
                   </div>
                ))}
             </div>
           )}
           
           {allNotesAndFolders.length === 0 && !isSearching && (
             <div className="flex flex-col items-center justify-center h-[40vh] text-black/30">
                <Folder size={48} className="mb-3 opacity-30" />
                <p className="font-medium text-sm">No folders or notes yet</p>
             </div>
           )}
        </div>

        {/* FAB */}
        <button onClick={handleAddNote} className="absolute right-6 bottom-24 w-14 h-14 bg-white border border-black/10 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.15)] flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-30">
          <Edit2 size={24} className="text-black" />
        </button>

        {/* Minimal Context Menu (Dropdown) */}
        <AnimatePresence>
          {longPressedItem && contextMenuPos && (
            <React.Fragment>
               <div className="fixed inset-0 z-[100]" onPointerDown={(e) => { e.stopPropagation(); setLongPressedItem(null); setContextMenuPos(null); }} />
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9 }} 
                 animate={{ opacity: 1, scale: 1 }} 
                 exit={{ opacity: 0, scale: 0.9 }}
                 className="fixed z-[105] bg-white rounded-xl shadow-xl border border-black/5 py-1 min-w-[120px]"
                 style={{ 
                   left: Math.min(contextMenuPos.x, window.innerWidth - 130), 
                   top: Math.min(contextMenuPos.y, window.innerHeight - 100) 
                 }}
               >
                  <button onClick={() => {
                    setIsRenameOpen(true);
                    setRenameValue(longPressedItem.type === 'folder' ? longPressedItem.name : (longPressedItem.title || ''));
                  }} className="w-full text-left px-4 py-2 hover:bg-black/5 text-sm font-medium text-black flex items-center gap-2">
                    <Edit2 size={14}/> Rename
                  </button>
                  <div className="h-px bg-black/5 w-full my-1"/>
                  <button onClick={() => handleDelete(longPressedItem)} className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm font-medium text-red-600 flex items-center gap-2">
                    <Trash2 size={14}/> Delete
                  </button>
               </motion.div>
            </React.Fragment>
          )}
        </AnimatePresence>

        {/* Create Folder Modal */}
        <AnimatePresence>
          {isCreateFolderOpen && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center p-6" onClick={() => setIsCreateFolderOpen(false)}>
               <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e=>e.stopPropagation()}>
                 <h2 className="text-xl font-bold text-black mb-4">Create Folder</h2>
                 <input autoFocus type="text" value={newFolderName} onChange={e => setNewFolderName(e.target.value)} placeholder="Folder name" className="w-full border-b-2 border-black/10 focus:border-black outline-none text-lg py-2 mb-6 font-medium" />
                 <div className="flex justify-end gap-2">
                   <button onClick={() => { setIsCreateFolderOpen(false); setNewFolderName(""); }} className="px-5 py-2.5 rounded-xl font-bold text-black/60 hover:bg-black/5">Cancel</button>
                   <button onClick={handleCreateFolder} className="px-5 py-2.5 rounded-xl font-bold text-white bg-black hover:bg-black/80">Create</button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rename Modal */}
        <AnimatePresence>
          {isRenameOpen && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/40 z-[110] flex items-center justify-center p-6" onClick={() => setIsRenameOpen(false)}>
               <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e=>e.stopPropagation()}>
                 <h2 className="text-xl font-bold text-black mb-4">{longPressedItem?.type === 'folder' ? 'Rename Folder' : 'Rename Note'}</h2>
                 <input autoFocus type="text" value={renameValue} onChange={e => setRenameValue(e.target.value)} placeholder="New name" className="w-full border-b-2 border-black/10 focus:border-black outline-none text-lg py-2 mb-6 font-medium" />
                 <div className="flex justify-end gap-2">
                   <button onClick={() => { setIsRenameOpen(false); setRenameValue(""); }} className="px-5 py-2.5 rounded-xl font-bold text-black/60 hover:bg-black/5">Cancel</button>
                   <button onClick={handleRename} className="px-5 py-2.5 rounded-xl font-bold text-white bg-black hover:bg-black/80">Save</button>
                 </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirm Modal */}
        <AnimatePresence>
          {deleteConfirmItem && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/40 z-[120] flex items-center justify-center p-6" onClick={() => setDeleteConfirmItem(null)}>
               <motion.div initial={{scale:0.95}} animate={{scale:1}} exit={{scale:0.95}} className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl" onClick={e=>e.stopPropagation()}>
                 <h2 className="text-xl font-bold text-black mb-2">Delete {deleteConfirmItem.type === 'folder' ? 'Folder' : 'Note'}?</h2>
                 <p className="text-black/60 mb-6 font-medium">Are you sure you want to delete this {deleteConfirmItem.type}? This action cannot be undone.</p>
                 <div className="flex justify-end gap-2">
                   <button onClick={() => setDeleteConfirmItem(null)} className="px-5 py-2.5 rounded-xl font-bold text-black/60 hover:bg-black/5">Cancel</button>
                   <button onClick={confirmDelete} className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700">Delete</button>
                 </div>
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const NoteEditor = ({ note, onSave, onClose }) => {
    const [title, setTitle] = useState(note.title || "");
    const [content, setContent] = useState(note.content || "");
    const [isEditing, setIsEditing] = useState(note.isNew || false);
    const textAreaRef = useRef(null);

    const handleSave = () => {
      onSave({ ...note, title: title.trim(), content: content.trim() });
      setIsEditing(false);
    };

    const handleBack = () => {
      if (isEditing) {
        handleSave();
      }
      onClose();
    };

    const addBullet = () => {
       if (!textAreaRef.current) return;
       const { selectionStart, selectionEnd } = textAreaRef.current;
       const newContent = content.substring(0, selectionStart) + "\n• " + content.substring(selectionEnd);
       setContent(newContent);
       setTimeout(() => {
         textAreaRef.current.focus();
         textAreaRef.current.setSelectionRange(selectionStart + 3, selectionStart + 3);
       }, 0);
    };

    const renderLinks = (text) => {
      if (!text) return null;
      const urlRegex = /https?:\/\/[^\s]+/g;
      const phoneRegex = /\+?\d{10,13}/g;
      const parts = text.split(new RegExp(`(${urlRegex.source}|${phoneRegex.source})`, 'gi')).filter(Boolean);
      return parts.map((part, i) => {
        if (part.match(urlRegex)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" onClick={e=>e.stopPropagation()}>{part}</a>;
        if (part.match(phoneRegex)) return <a key={i} href={`tel:${part}`} className="text-blue-600 underline" onClick={e=>e.stopPropagation()}>{part}</a>;
        return <span key={i}>{part}</span>;
      });
    };

    return (
      <div className="absolute inset-0 bg-white z-[70] flex flex-col" onPointerDown={(e) => e.stopPropagation()}>
         {/* Toolbar */}
         <div className="pt-6 pb-2 px-4 flex justify-between items-center bg-white sticky top-0 z-20 border-b border-black/5">
            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform flex items-center gap-1 text-black">
              <ChevronRight size={24} className="rotate-180" />
            </button>
            <div className="flex gap-2">
               {isEditing ? (
                 <React.Fragment>
                   <button onClick={addBullet} className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform text-black/70" title="Bullet Point">
                     <ListTodo size={22} />
                   </button>
                   <button onClick={handleSave} className="px-4 py-1.5 rounded-full bg-black text-white text-sm font-bold active:scale-95 transition-transform">
                     Done
                   </button>
                 </React.Fragment>
               ) : (
                 <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-black/5 active:scale-95 transition-transform text-black">
                   <Edit2 size={22} />
                 </button>
               )}
            </div>
         </div>

         {/* Editor Content */}
         <div className="flex-1 overflow-y-auto px-6 pt-6 pb-[120px] bg-white flex flex-col">
            {isEditing ? (
               <input 
                 type="text" 
                 value={title} 
                 onChange={e => setTitle(e.target.value)} 
                 placeholder="Heading" 
                 className="w-full outline-none text-3xl font-bold text-black mb-6 bg-transparent" 
                 style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}
               />
            ) : (
               <h1 className="w-full text-3xl font-bold text-black mb-6" style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}>
                 {title || 'Untitled'}
               </h1>
            )}

            {isEditing ? (
               <textarea
                 ref={textAreaRef}
                 value={content}
                 onChange={e => setContent(e.target.value)}
                 placeholder="Type your note here..."
                 className="w-full flex-1 outline-none resize-none text-lg text-black/90 leading-relaxed bg-transparent"
                 style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}
               />
            ) : (
               <div 
                 className="w-full flex-1 text-lg text-black/90 leading-relaxed whitespace-pre-wrap"
                 style={{ fontFamily: "'Noto Sans Malayalam', sans-serif" }}
               >
                 {content ? renderLinks(content) : <span className="text-black/30">Tap to edit...</span>}
               </div>
            )}
         </div>
      </div>
    );
  };


  const SettingsPanel = () => {
    const [newPsPass, setNewPsPass] = useState("");
    const [newPs2Pass, setNewPs2Pass] = useState("");
    const [deleteInput, setDeleteInput] = useState("");
    const [deleteCat, setDeleteCat] = useState("all");
    const fileRef = useRef(null);

    const handleSavePsPass = async () => {
      if(!newPsPass.trim()) return;
      await saveToFirebase('app_config', { type: 'config', psPassword: newPsPass.trim(), ps2Password: appConfig.ps2Password, lastBackup: appConfig.lastBackup });
      setNewPsPass(""); 
    };

    const handleSavePs2Pass = async () => {
      if(!newPs2Pass.trim()) return;
      await saveToFirebase('app_config', { type: 'config', psPassword: appConfig.psPassword, ps2Password: newPs2Pass.trim(), lastBackup: appConfig.lastBackup });
      setNewPs2Pass(""); 
    };

    const handleBackup = async () => {
      const dataStr = JSON.stringify(allData);
      const blob = new Blob([dataStr], {type: "application/json"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `diary_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click(); URL.revokeObjectURL(url);
      await saveToFirebase('app_config', { type: 'config', psPassword: appConfig.psPassword, ps2Password: appConfig.ps2Password, lastBackup: Date.now() });
    };

    const handleRestore = async (e) => {
      const file = e.target.files[0]; if(!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if(Array.isArray(parsed)) {
            for(const item of parsed) if(item.id) await saveToFirebase(item.id, item);
          }
        } catch(err) { console.error("Invalid Backup File"); }
      };
      reader.readAsText(file);
    };

    const handleMegaDelete = async () => {
      if(deleteInput.toLowerCase() !== 'delete') return;
      const docsToDelete = allData.filter(d => deleteCat === 'all' || d.type === deleteCat);
      for(const doc of docsToDelete) await deleteFromFirebase(doc.id);
      setDeleteInput(""); setDeleteCat("all"); 
    };

    return (
      <div className="absolute inset-x-0 bottom-[64px] h-[75%] bg-[#F7F3EA] text-[#3A2E25] z-[55] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col border-t border-[#B28A5A]/30" onPointerDown={(e) => e.stopPropagation()}>
        <PaperTexture />
        <div className="p-4 border-b border-[#B28A5A]/20 flex justify-between items-center shrink-0 relative z-10 bg-[#EAE3D2]/80 backdrop-blur-sm rounded-t-3xl">
          <h3 className="font-bold text-[#3A2E25] flex items-center gap-2"><Settings size={18}/> MLA Settings</h3>
          <button onClick={() => setActivePanel(null)} className="p-2 text-black/50 hover:text-black rounded-full"><X size={20}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-6 relative z-10">
          <div className="space-y-4 bg-white/40 p-4 rounded-xl border border-black/5">
            <h4 className="text-[#3A2E25] text-sm font-bold">Change Passwords</h4>
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <input type="text" placeholder="New PS Password" value={newPsPass} onChange={e=>setNewPsPass(e.target.value)} className="flex-1 bg-white/80 border border-black/10 rounded-lg px-3 py-2 outline-none focus:border-[#B28A5A] text-sm" />
                <button onClick={handleSavePsPass} className="bg-[#B28A5A] text-white px-4 rounded-lg font-bold text-sm">Save</button>
              </div>
              <div className="flex gap-2">
                <input type="text" placeholder="New PS 2 Password" value={newPs2Pass} onChange={e=>setNewPs2Pass(e.target.value)} className="flex-1 bg-white/80 border border-black/10 rounded-lg px-3 py-2 outline-none focus:border-[#B28A5A] text-sm" />
                <button onClick={handleSavePs2Pass} className="bg-[#B28A5A] text-white px-4 rounded-lg font-bold text-sm">Save</button>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-black/10">
            <h4 className="text-[#3A2E25] text-sm font-bold">Data Management</h4>
            <button onClick={handleBackup} className="w-full flex items-center justify-center gap-2 bg-white/80 py-3 rounded-xl hover:bg-white transition-colors shadow-sm">
              <Download size={18}/> Download Backup (JSON)
            </button>
            {appConfig.lastBackup && <p className="text-xs text-center opacity-50">Last Backup: {new Date(appConfig.lastBackup).toLocaleString()}</p>}
            
            <input type="file" accept=".json" ref={fileRef} className="hidden" onChange={handleRestore} />
            <button onClick={() => fileRef.current?.click()} className="w-full flex items-center justify-center gap-2 bg-[#B28A5A]/10 text-[#B28A5A] font-bold py-3 rounded-xl hover:bg-[#B28A5A]/20 transition-colors">
              <Upload size={18}/> Restore from Backup
            </button>
          </div>

          <div className="space-y-3 pt-4 border-t border-black/10 bg-red-50 p-4 rounded-xl border border-red-200">
            <h4 className="text-red-600 text-sm font-bold flex items-center gap-2"><Trash size={16}/> Danger Zone</h4>
            <select value={deleteCat} onChange={e=>setDeleteCat(e.target.value)} className="w-full bg-white/80 border border-red-200 rounded-lg px-3 py-2 outline-none text-sm text-red-800">
              <option value="all">Delete ALL App Data</option>
              <option value="diary">Delete Only Diary</option>
              <option value="reminder">Delete Only Reminders</option>
              <option value="todo">Delete Only To-Dos</option>
              <option value="book">Delete Only Books</option>
              <option value="event">Delete Only Events</option>
              <option value="note">Delete Only Notes</option>
            </select>
            <input type="text" placeholder="Type 'delete' to confirm" value={deleteInput} onChange={e=>setDeleteInput(e.target.value)} className="w-full bg-white/80 border border-red-200 rounded-lg px-3 py-2 outline-none focus:border-red-500 text-sm text-red-600 placeholder:text-red-300" />
            <button onClick={handleMegaDelete} disabled={deleteInput.toLowerCase() !== 'delete'} className="w-full bg-red-600 text-white font-bold py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed">Execute Deletion</button>
          </div>
        </div>
      </div>
    );
  };

  const renderEntryModal = () => {
    if (!isModalOpen) return null;
    return (
      <motion.div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onPointerDown={(e) => e.stopPropagation()}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
        <motion.div className="relative w-full max-w-lg rounded-t-[2rem] sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col" style={{ backgroundColor: COLORS.paper }} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "100%", opacity: 0 }} transition={{ type: 'spring', damping: 28, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>
          <PaperTexture />
          <div className="flex items-start justify-between p-4 sm:p-5 border-b border-[#B28A5A]/20 relative z-10 bg-[#F7F3EA]/90 backdrop-blur-md">
            <div className="flex flex-col gap-2 relative z-20 min-w-[120px]">
              {entryType !== 'note' && (
                <label className="flex items-center gap-1.5 cursor-pointer relative group w-fit">
                  <input type="date" value={entryDate} onChange={(e) => setEntryDate(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" />
                  <CalendarIcon size={16} className="text-[#B28A5A] shrink-0" />
                  <span className="font-bold text-[#1A1A1A] text-[14px] sm:text-[15px] group-hover:text-[#B28A5A] transition-colors whitespace-nowrap">
                    {entryDate ? formatDate(new Date(entryDate.split('-')[0], entryDate.split('-')[1]-1, entryDate.split('-')[2])) : ''}
                  </span>
                </label>
              )}
              {entryType === 'note' && <span className="font-bold text-[#1A1A1A] text-[15px] flex items-center gap-1.5"><StickyNote size={16} className="text-[#B28A5A]"/> Keep Note</span>}
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 relative z-20 min-w-[80px] justify-end">
              <div className="flex items-center bg-black/5 rounded-full p-1">
                <button onPointerDown={(e) => { e.preventDefault(); setEntryType('diary'); }} className={`p-1.5 rounded-full transition-all ${entryType === 'diary' ? 'bg-white shadow-sm text-[#B28A5A]' : 'text-black/40 hover:text-black/70'}`}><Book size={16} /></button>
                {loginRole === 'main' && (
                  <button onPointerDown={(e) => { e.preventDefault(); setEntryType('reminder'); }} className={`p-1.5 rounded-full transition-all ${entryType === 'reminder' ? 'bg-white shadow-sm text-[#B28A5A]' : 'text-black/40 hover:text-black/70'}`}><Bell size={16} /></button>
                )}
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 rounded-full hover:bg-black/5 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors -mr-1"><X size={20} /></button>
            </div>
          </div>
          
          <div className="p-4 sm:p-6 relative z-10 flex-1 flex flex-col">
            
            {entryType !== 'note' && (
              <div className="flex flex-col gap-3 mb-4 bg-white/50 p-4 rounded-2xl border border-black/5 shadow-sm shrink-0">
                {loginRole === 'sub' && entryType === 'diary' && !entryIsEvent ? (
                  <div className="flex items-center justify-between">
                     <span className="text-[13px] sm:text-[15px] font-bold text-[#B28A5A] uppercase tracking-wider">Time Slot</span>
                     <select value={psTimeSlot} onChange={e => setPsTimeSlot(e.target.value)} className="appearance-none bg-white px-3 py-2 sm:py-2.5 rounded-xl font-bold text-[16px] sm:text-[18px] border border-black/10 outline-none text-[#1A1A1A] w-[220px]">
                        <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                        <option value="11:30 AM - 1:00 PM">11:30 AM - 1:00 PM</option>
                        <option value="3:30 PM - 5:00 PM">3:30 PM - 5:00 PM</option>
                        <option value="5:00 PM - 6:00 PM">5:00 PM - 6:00 PM</option>
                     </select>
                  </div>
                ) : (
                  <>
                     <div className="flex items-center justify-between">
                        <span className="text-[13px] sm:text-[15px] font-bold text-[#B28A5A] uppercase tracking-wider">Start Time</span>
                        <div className="flex items-center gap-1">
                           <select value={entryHour} onChange={e => handleHourChange(e.target.value)} className="appearance-none bg-white px-3 py-2 sm:py-2.5 rounded-xl font-bold text-[18px] sm:text-[20px] border border-black/10 outline-none text-center min-w-[60px] shadow-sm text-[#1A1A1A]">
                              {Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                           </select>
                           <span className="font-bold text-[18px] sm:text-[20px] text-[#1A1A1A]">:</span>
                           <select value={entryMinute} onChange={e => handleMinuteChange(e.target.value)} className="appearance-none bg-white px-3 py-2 sm:py-2.5 rounded-xl font-bold text-[18px] sm:text-[20px] border border-black/10 outline-none text-center min-w-[60px] shadow-sm text-[#1A1A1A]">
                              {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                           </select>
                           <button type="button" onClick={handleAmPmChange} className="bg-[#B28A5A] text-white px-4 py-2 sm:py-2.5 rounded-xl font-bold text-[18px] sm:text-[20px] shadow-sm active:scale-95 transition-transform ml-2">{entryAmPm}</button>
                        </div>
                     </div>
                     
                     {entryType === 'diary' && (
                       <div className="flex items-center justify-between mt-2 pt-3 border-t border-black/5">
                          <span className="text-[13px] sm:text-[15px] font-bold text-[#B28A5A] uppercase tracking-wider">End Time</span>
                          <div className="flex items-center gap-1">
                             <select value={entryEndHour} onChange={e => setEntryEndHour(e.target.value)} className="appearance-none bg-white/60 px-3 py-2 rounded-xl font-bold text-[16px] sm:text-[18px] border border-black/10 outline-none text-center min-w-[60px] text-[#1A1A1A]">
                                {Array.from({length: 12}, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                             </select>
                             <span className="font-bold text-[16px] sm:text-[18px] text-[#1A1A1A]">:</span>
                             <select value={entryEndMinute} onChange={e => setEntryEndMinute(e.target.value)} className="appearance-none bg-white/60 px-3 py-2 rounded-xl font-bold text-[16px] sm:text-[18px] border border-black/10 outline-none text-center min-w-[60px] text-[#1A1A1A]">
                                {Array.from({length: 60}, (_, i) => String(i).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
                             </select>
                             <button type="button" onClick={() => setEntryEndAmPm(p => p === 'AM' ? 'PM' : 'AM')} className="bg-[#B28A5A]/10 text-[#B28A5A] px-4 py-2 rounded-xl font-bold text-[16px] sm:text-[18px] active:scale-95 transition-transform ml-2">{entryEndAmPm}</button>
                          </div>
                       </div>
                     )}
                  </>
                )}
              </div>
            )}

            <textarea ref={entryTextRef} className="w-full flex-1 min-h-[120px] bg-transparent outline-none resize-none text-[20px] leading-[32px] m-0 pt-[4px]" style={{ fontFamily: entryType === 'note' ? "'Comic Neue', 'A10', 'Chilanka', cursive" : "'Comic Neue', 'A10', 'Chilanka', cursive", fontWeight: 600, color: COLORS.ink, backgroundImage: entryType==='note'?'none':`repeating-linear-gradient(transparent, transparent 31px, rgba(178, 138, 90, 0.2) 31px, rgba(178, 138, 90, 0.2) 32px)`, backgroundPosition: '0 0', backgroundAttachment: 'local' }} value={newEntryText} onChange={(e) => setNewEntryText(e.target.value)} placeholder={entryType === 'reminder' ? "What do you need to remember?" : entryType === 'note' ? "Write a permanent note..." : "Dear Diary..."} />
            
            <div className="mt-4 flex items-center gap-3 border-b border-black/10 pb-2 shrink-0">
              <Phone size={18} className="text-black/30" />
              <input type="tel" placeholder="Phone Number (Optional)" value={entryPhone} onChange={(e) => setEntryPhone(e.target.value)} className="bg-transparent outline-none text-[15px] w-full placeholder:text-black/30 text-[#1A1A1A]" />
            </div>
            
            {entryType === 'reminder' && (
              <div className="mt-4 flex items-center justify-between border-b border-black/10 pb-2 shrink-0">
                <span className="text-sm font-bold text-black/40 flex items-center gap-2"><Settings size={14}/> Repeat:</span>
                <div className="flex gap-1">
                  {[ {l:'None', v:'none'}, {l:'15D', v:'15d'}, {l:'1M', v:'1m'}, {l:'2M', v:'2m'}, {l:'3M', v:'3m'}].map(opt => (
                    <button key={opt.v} onClick={() => setReminderFrequency(opt.v)} className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors ${reminderFrequency === opt.v ? 'bg-[#B28A5A] text-white shadow' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}>
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 sm:p-5 bg-[#EAE3D2]/80 backdrop-blur-md relative z-10 flex justify-between items-center border-t border-[#B28A5A]/20">
            <div className="flex items-center gap-2">
              {loginRole === 'main' && entryType === 'diary' && (
                <button onClick={() => setEntryPrivate(!entryPrivate)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold transition-colors shadow-sm ${entryPrivate ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-white/50 text-black/60 hover:bg-white border border-black/5'}`}>
                  {entryPrivate ? <Lock size={16} /> : <User size={16} />}
                  <span className="hidden sm:inline">{entryPrivate ? 'Private' : 'Visible to PS'}</span>
                </button>
              )}
              {entryType === 'diary' && (
                <button onClick={() => setEntryIsEvent(!entryIsEvent)} className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold transition-colors shadow-sm ${entryIsEvent ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-white/50 text-black/60 hover:bg-white border border-black/5'}`}>
                  <CalendarIcon size={16} />
                  <span className="hidden sm:inline">Event</span>
                </button>
              )}
            </div>
            <button onClick={handleSaveEntry} disabled={!newEntryText.trim() || (entryType!=='note' && !entryDate)} className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 text-white shadow-lg shadow-[#B28A5A]/20 hover:scale-[1.02] active:scale-95 text-[13px] sm:text-[14px]" style={{ backgroundColor: COLORS.accent }}>
              <Check size={18} /> {editingEntryId ? "UPDATE" : "SAVE"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 overflow-hidden select-none flex items-center justify-center bg-zinc-900 p-2 sm:p-4 md:p-8" style={{ fontFamily: "'Sora', sans-serif" }}>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] to-black opacity-90"/>

      <AnimatePresence>
        {(loginRole === 'main' || loginRole === 'sub') && !activePanel && (
          <motion.button 
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} 
            onClick={() => {
              handleOpenModal(null); 
            }} 
            className="fixed right-6 bottom-[84px] sm:right-8 sm:bottom-[96px] z-[50] w-[60px] h-[60px] sm:w-[64px] sm:h-[64px] rounded-full text-white shadow-[0_8px_30px_rgba(178,138,90,0.4)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all" style={{ backgroundColor: COLORS.accent }} title="Add Entry">
            <Plus size={30} strokeWidth={2.5} />
          </motion.button>
        )}
      </AnimatePresence>

      <div className="relative w-full h-full max-w-[650px] max-h-[850px] perspective-[2500px]">
        <AnimatePresence mode="wait">
          {!loginRole ? renderCoverPage() : (
            <motion.div key="book-inside" initial={{ rotateY: 90, opacity: 0 }} animate={{ rotateY: 0, opacity: 1 }} exit={{ rotateY: 90, opacity: 0, transition: { duration: 0.6 } }} style={{ transformOrigin: "right center" }} className="absolute inset-0 bg-[#EAE3D2] rounded-[2rem] sm:rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="hidden sm:flex absolute right-0 top-3 bottom-3 w-4 bg-gradient-to-r from-transparent to-[#dcd2be] opacity-70 flex-col justify-evenly">{[...Array(60)].map((_,i) => <div key={i} className="h-[1px] bg-[#c4b79f] w-full opacity-30"/>)}</div>
              
              <div 
                className="absolute inset-2 sm:inset-3 md:inset-4 md:mr-6 overflow-hidden rounded-2xl sm:rounded-[20px]"
                onPointerDown={(e) => {
                   if(e.target.closest('button') || e.target.closest('input') || e.target.closest('a') || e.target.closest('label') || e.target.closest('select')) return;
                   const rect = e.currentTarget.getBoundingClientRect();
                   const x = e.clientX - rect.left;
                   if(x < rect.width * 0.15) { e.preventDefault(); startContinuousFlip(-1); }
                   else if(x > rect.width * 0.85) { e.preventDefault(); startContinuousFlip(1); }
                }}
                onPointerUp={stopContinuousFlip} onPointerLeave={stopContinuousFlip} onPointerCancel={stopContinuousFlip}
              >
                <AnimatePresence initial={false} custom={direction}>
                  <DiaryPage key={currentDate.toDateString()} date={currentDate} isVisible={true} customDir={direction} isFast={isFastFlipping} />
                </AnimatePresence>
              </div>

              {renderFooter()}
              <AnimatePresence>
                {activePanel === 'reading' && <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-[54]"><div className="absolute inset-0 bg-black/40" onClick={()=>setActivePanel(null)}/><ReadingPanel /></motion.div>}
                {activePanel === 'todo' && <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-[54]"><div className="absolute inset-0 bg-black/40" onClick={()=>setActivePanel(null)}/><TodoPanel /></motion.div>}
                {activePanel === 'event' && <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-[54]"><div className="absolute inset-0 bg-black/40" onClick={()=>setActivePanel(null)}/><EventPanel /></motion.div>}
                {activePanel === 'note' && <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-[54]"><div className="absolute inset-0 bg-black/40" onClick={()=>setActivePanel(null)}/><NotePanel /></motion.div>}
                {activePanel === 'settings' && <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="absolute inset-0 z-[54]"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={()=>setActivePanel(null)}/><SettingsPanel /></motion.div>}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {renderEntryModal()}

      <AnimatePresence>
        {showRecentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowRecentModal(false)}>
            <div className="bg-[#F7F3EA] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative flex flex-col max-h-[80vh]" onClick={e=>e.stopPropagation()}>
              <PaperTexture />
              <div className="p-4 border-b border-[#B28A5A]/20 flex justify-between items-center relative z-10 bg-[#EAE3D2]">
                <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2"><History size={18}/> Recent Additions (7 Days)</h3>
                <button onClick={() => setShowRecentModal(false)} className="text-black/50 hover:text-black p-1"><X size={20}/></button>
              </div>
              <div className="p-4 relative z-10 overflow-y-auto flex-1">
                {recentAdditions.length === 0 ? (
                  <p className="text-center text-black/40 py-4 font-medium">No recent additions in the last 7 days.</p>
                ) : (
                  recentAdditions.map(entry => (
                    <div key={entry.id} className="mb-3 p-3 bg-white/60 border border-[#B28A5A]/30 rounded-xl flex justify-between items-start gap-3 relative shadow-sm">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="text-[11px] font-bold text-[#B28A5A] bg-[#B28A5A]/10 border border-[#B28A5A]/20 px-2 py-0.5 rounded">
                            {formatDate(new Date(entry.timestamp))}
                          </span>
                          <span className="text-[11px] font-bold text-red-600 bg-red-100 border border-red-200 px-2 py-0.5 rounded whitespace-nowrap">
                            {entry.time}
                          </span>
                        </div>
                        <p className="text-[#1A1A1A] text-[17px] leading-tight mt-1" style={{ fontFamily: "'Comic Neue', 'A10', 'Chilanka', cursive", fontWeight: 600 }}>{entry.content}</p>
                      </div>
                      <div className="flex items-center justify-center shrink-0 pt-1">
                        {!entry.copiedToPhysical ? (
                          <button onClick={(e) => { e.stopPropagation(); saveToFirebase(entry.id, { ...entry, copiedToPhysical: true }); }} className="w-10 h-10 flex items-center justify-center text-[#B28A5A]/60 hover:text-[#B28A5A] hover:bg-[#B28A5A]/10 rounded-full transition-all active:scale-90" title="Mark as copied to Physical Diary">
                            <BookOpen size={20} />
                          </button>
                        ) : (
                          <span className="text-green-600 font-bold select-none text-2xl pr-2 cursor-pointer" onPointerDown={(e) => { e.stopPropagation(); uncheckTimerRef.current = setTimeout(() => { if (window.navigator && window.navigator.vibrate) window.navigator.vibrate(50); setUncheckConfirmEntry(entry); }, 3500); }} onPointerUp={(e) => { e.stopPropagation(); if (uncheckTimerRef.current) clearTimeout(uncheckTimerRef.current); }} onPointerLeave={(e) => { e.stopPropagation(); if (uncheckTimerRef.current) clearTimeout(uncheckTimerRef.current); }} onPointerCancel={(e) => { e.stopPropagation(); if (uncheckTimerRef.current) clearTimeout(uncheckTimerRef.current); }} title="Hold for 3.5s to uncheck">✓</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uncheckConfirmEntry && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setUncheckConfirmEntry(null)}>
            <div className="bg-[#FFF0F0] p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-red-200" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto mb-4"><BookOpen size={32} /></div>
              <h3 className="text-red-900 font-bold text-lg mb-2">Uncheck Entry?</h3>
              <p className="text-red-700/70 text-sm mb-6">This will mark the entry as NOT copied to the Physical Diary.</p>
              <div className="flex flex-col gap-2">
                <button onClick={async () => { await saveToFirebase(uncheckConfirmEntry.id, { ...uncheckConfirmEntry, copiedToPhysical: false }); setUncheckConfirmEntry(null); }} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold transition-colors active:scale-95">Confirm Uncheck</button>
                <button onClick={() => setUncheckConfirmEntry(null)} className="w-full py-2 rounded-xl text-red-900/60 font-medium transition-colors hover:text-red-900">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {uncloseDayModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setUncloseDayModal(null)}>
            <div className="bg-[#FFF0F0] p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center border border-red-200" onClick={e => e.stopPropagation()}>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto mb-4"><Ban size={32} /></div>
              <h3 className="text-red-900 font-bold text-lg mb-2">Reopen This Day?</h3>
              <p className="text-red-700/70 text-sm mb-6">This will remove the closed status and allow new entries to be added to this date again.</p>
              <div className="flex flex-col gap-2">
                <button onClick={async () => { await deleteFromFirebase(uncloseDayModal); setUncloseDayModal(null); }} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold transition-colors active:scale-95">Confirm Reopen</button>
                <button onClick={() => setUncloseDayModal(null)} className="w-full py-2 rounded-xl text-red-900/60 font-medium transition-colors hover:text-red-900">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRemindersModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowRemindersModal(false)}>
            <div className="bg-[#F7F3EA] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden relative" onClick={e=>e.stopPropagation()}>
              <PaperTexture />
              <div className="p-4 border-b border-[#B28A5A]/20 flex justify-between items-center relative z-10 bg-[#EAE3D2]">
                <h3 className="font-bold text-[#1A1A1A] flex items-center gap-2"><Bell size={18}/> Today's Reminders</h3>
                <button onClick={() => setShowRemindersModal(false)} className="text-black/50 hover:text-black p-1"><X size={20}/></button>
              </div>
              <div className="p-4 relative z-10 max-h-[60vh] overflow-y-auto">
                {allData.filter(e => e.type === 'reminder' && isRecurringOnDate(e, toLocalISODate(currentDate))).length === 0 ? (
                  <p className="text-center text-black/40 py-4">No reminders for today.</p>
                ) : (
                  allData.filter(e => e.type === 'reminder' && isRecurringOnDate(e, toLocalISODate(currentDate))).map(rem => (
                    <div key={rem.id} className="mb-3 p-3 bg-white/60 border border-[#B28A5A]/30 rounded-xl">
                      <p className="font-bold text-red-600 mb-1">{rem.time}</p>
                      <p className="text-[#1A1A1A]">{rem.content}</p>
                      {rem.phone && <p className="mt-1"><a href={`tel:${rem.phone}`} className="text-blue-600 font-medium text-sm"><Phone size={12} className="inline"/> {rem.phone}</a></p>}
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {closeDayModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#FFF0F0] p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center relative overflow-hidden border border-red-200">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto mb-4"><Ban size={32} /></div>
              <h3 className="text-red-900 font-bold text-lg mb-2">Close This Day</h3>
              <p className="text-red-700/70 text-sm mb-4">Mark this date as closed. You can still manually add notes later if needed.</p>
              <input type="text" placeholder="Reason (e.g. Legislative Assembly)" value={closeDayReason} onChange={e=>setCloseDayReason(e.target.value)} className="w-full bg-white border border-red-200 rounded-xl px-4 py-3 outline-none focus:border-red-500 mb-4 text-[#1A1A1A]" autoFocus />
              <div className="flex flex-col gap-2">
                <button onClick={handleCloseDay} disabled={!closeDayReason.trim()} className="py-3 rounded-xl bg-red-500 text-white font-bold transition-colors disabled:opacity-50">Confirm Close Day</button>
                <button onClick={() => {setCloseDayModal(false); setCloseDayReason("");}} className="py-2 text-sm text-red-900/60 hover:text-red-900">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteSeriesModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#EAE3D2] p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center relative overflow-hidden border border-[#B28A5A]/30">
              <h3 className="text-[#3A2E25] font-bold text-lg mb-2">Delete Recurring Reminder</h3>
              <p className="text-black/60 text-sm mb-6">Do you want to delete just this occurrence, or the entire series?</p>
              <div className="flex flex-col gap-3 relative z-10">
                <button onClick={async () => {
                  const entry = allData.find(e => e.id === deleteSeriesModal.id);
                  const updatedDates = [...(entry.deletedDates || []), deleteSeriesModal.dateStr];
                  await saveToFirebase(entry.id, { ...entry, deletedDates: updatedDates });
                  setDeleteSeriesModal(null);
                }} className="py-3 rounded-xl bg-white/50 border border-black/10 hover:bg-white text-[#1A1A1A] font-medium transition-colors shadow-sm">
                  Delete Only Today
                </button>
                <button onClick={async () => {
                  await deleteFromFirebase(deleteSeriesModal.id);
                  setDeleteSeriesModal(null);
                }} className="py-3 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 font-bold transition-colors shadow-sm">
                  Delete Entire Series
                </button>
                <button onClick={() => setDeleteSeriesModal(null)} className="py-2 text-sm text-black/40 hover:text-black">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 10 }} className="bg-[#2a130c] border border-[#d4af37]/30 p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center relative overflow-hidden">
              <LeatherTexture />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-4 border border-red-500/20"><AlertCircle size={32} /></div>
                <h3 className="text-[#fceabb] font-serif text-xl mb-2" style={{ fontFamily: "'Berkshire Swash', cursive" }}>Lock Diary?</h3>
                <p className="text-[#d4c1ac] text-sm mb-6">Are you sure you want to securely lock your diary and log out?</p>
                <div className="flex w-full gap-3">
                  <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">Cancel</button>
                  <button onClick={confirmLogout} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold transition-all shadow-[0_0_15px_rgba(220,38,38,0.4)]">Lock Now</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{__html: `
        @font-face { font-family: 'A10'; src: url('/fonts/A10-Regular.ttf') format('truetype'), url('/fonts/A10.ttf') format('truetype'), url('/A10.ttf') format('truetype'), url('A10-Regular.ttf') format('truetype'); font-weight: normal; font-style: normal; font-display: swap; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0; width: 100%; height: 100%; position: absolute; top: 0; left: 0; }
        
        @keyframes reminderPulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          5% { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          10% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          15% { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          20% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        .animate-reminder-pulse {
          animation: reminderPulse 5s infinite cubic-bezier(0.66, 0, 0, 1);
        }
      `}} />
    </div>
  );
}

