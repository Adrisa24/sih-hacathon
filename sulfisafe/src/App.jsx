import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { supabase } from "./supabaseClient";

/* =====================================================
   SULFISAFE - DEMO CREDENTIALS
===================================================== */

const ADMIN_ID = "admin";
const ADMIN_PASSWORD = "SulfiSafe@123";
const DEMO_OTP = "123456";

/* =====================================================
   TRANSLATIONS
===================================================== */

const translations = {
  en: {
    chooseLanguage: "Choose Your Language",
    languageDescription: "Select your preferred language to continue.",
    continue: "Continue",
    back: "Back",
    welcome: "Welcome to SulfiSafe",
    welcomeText: "Industrial safety monitoring and H₂S exposure management.",
    employeePortal: "Employee Portal",
    adminPortal: "Administrator Portal",
    employeePortalText:
      "Access your safety identity, exposure information and workplace records.",
    adminPortalText:
      "Monitor employees, safety conditions, reports and high-risk areas.",
    employeeLogin: "Employee Login",
    adminLogin: "Admin Login",
    employeeId: "Employee ID",
    adminId: "Admin ID",
    password: "Password",
    login: "Log In",
    logout: "Logout",
    forgotPassword: "Forgot Password?",
    signUp: "Sign Up",
    createAccount: "Create Employee Account",
    noAccount: "Don't have an account?",
    alreadyAccount: "Already have an account?",
    fullName: "Full Name",
    organisation: "Organisation",
    branch: "Branch / Location",
    sector: "Sector",
    bloodGroup: "Blood Group",
    phone: "Phone Number",
    profilePicture: "Profile Picture",
    confirmPassword: "Confirm Password",
    setPassword: "Set Password",
    save: "Save Changes",
    employeeDashboard: "Employee Dashboard",
    adminDashboard: "Admin Dashboard",
    notifications: "Notifications",
    digitalId: "Digital Safety ID",
    historyLogs: "History & Logs",
    exposure: "Exposure Analysis",
    h2sMonitoring: "H₂S Exposure Monitoring",
    profile: "Update Profile",
    emergency: "EMERGENCY SOS",
    reportIssue: "Report an Issue",
    emergencyNumber: "Emergency Number",
    currentStatus: "Current Safety Status",
    safe: "SAFE",
    risk: "AT RISK",
    temperature: "Temperature",
    humidity: "Humidity",
    cumulativeDose: "Estimated Cumulative H₂S Dose",
    wristband: "Wristband Status",
    valid: "Valid",
    expired: "Expired",
    exposureDay: "1 Day",
    exposureWeek: "1 Week",
    exposureMonth: "1 Month",
    entry: "Entry",
    exit: "Exit",
    estimated:
      "Estimated value – environmental conditions may influence colourimetric reaction speed.",
    issueTitle: "Issue Title",
    issueDescription: "Describe the issue",
    submitReport: "Submit Report",
    searchEmployee: "Search Employee ID or Name",
    totalEmployees: "Registered Employees",
    safeEmployees: "Safe Employees",
    riskEmployees: "At Risk",
    activeReports: "Active Reports",
    employeeReports: "Employee Reports",
    emergencyAlerts: "Emergency Alerts",
    sendAlert: "Send Safety Alert",
    alertMessage: "Safety alert message",
    noNotifications: "No new notifications",
    resetPassword: "Reset Password",
    enterPhone: "Enter your registered phone number",
    enterOtp: "Enter the 6-digit OTP",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    verifyOtp: "Verify OTP",
    updatePassword: "Update Password",
    otpHint: "Demo OTP: 123456",
    adminReset: "Admin Password Reset",
    employeeReset: "Employee Password Reset",
  },

  hi: {
    chooseLanguage: "अपनी भाषा चुनें",
    languageDescription: "आगे बढ़ने के लिए अपनी पसंदीदा भाषा चुनें।",
    continue: "जारी रखें",
    back: "वापस",
    welcome: "SulfiSafe में आपका स्वागत है",
    welcomeText: "औद्योगिक सुरक्षा और H₂S एक्सपोज़र प्रबंधन।",
    employeePortal: "कर्मचारी पोर्टल",
    adminPortal: "प्रशासक पोर्टल",
    employeePortalText: "अपनी सुरक्षा पहचान और कार्यस्थल रिकॉर्ड देखें।",
    adminPortalText: "कर्मचारियों और सुरक्षा स्थितियों की निगरानी करें।",
    employeeLogin: "कर्मचारी लॉगिन",
    adminLogin: "एडमिन लॉगिन",
    employeeId: "कर्मचारी आईडी",
    adminId: "एडमिन आईडी",
    password: "पासवर्ड",
    login: "लॉगिन",
    logout: "लॉग आउट",
    forgotPassword: "पासवर्ड भूल गए?",
    signUp: "साइन अप",
    createAccount: "कर्मचारी अकाउंट बनाएं",
    noAccount: "क्या आपका अकाउंट नहीं है?",
    alreadyAccount: "पहले से अकाउंट है?",
    fullName: "पूरा नाम",
    organisation: "संगठन",
    branch: "ब्रांच / स्थान",
    sector: "सेक्टर",
    bloodGroup: "ब्लड ग्रुप",
    phone: "फोन नंबर",
    profilePicture: "प्रोफाइल फोटो",
    confirmPassword: "पासवर्ड की पुष्टि करें",
    setPassword: "पासवर्ड सेट करें",
    save: "बदलाव सेव करें",
    employeeDashboard: "कर्मचारी डैशबोर्ड",
    adminDashboard: "एडमिन डैशबोर्ड",
    notifications: "सूचनाएं",
    digitalId: "डिजिटल सुरक्षा आईडी",
    historyLogs: "इतिहास और लॉग",
    exposure: "एक्सपोज़र विश्लेषण",
    profile: "प्रोफाइल अपडेट करें",
    emergency: "आपातकालीन SOS",
    reportIssue: "समस्या रिपोर्ट करें",
    emergencyNumber: "आपातकालीन नंबर",
    currentStatus: "वर्तमान सुरक्षा स्थिति",
    safe: "सुरक्षित",
    risk: "जोखिम में",
    temperature: "तापमान",
    humidity: "नमी",
    cumulativeDose: "अनुमानित H₂S डोज़",
    wristband: "रिस्टबैंड स्थिति",
    valid: "वैध",
    expired: "समाप्त",
    exposureDay: "1 दिन",
    exposureWeek: "1 सप्ताह",
    exposureMonth: "1 महीना",
    entry: "प्रवेश",
    exit: "निकास",
    estimated:
      "अनुमानित मूल्य – पर्यावरणीय परिस्थितियां परिणामों को प्रभावित कर सकती हैं।",
    issueTitle: "समस्या का शीर्षक",
    issueDescription: "समस्या का विवरण",
    submitReport: "रिपोर्ट भेजें",
    searchEmployee: "कर्मचारी खोजें",
    totalEmployees: "पंजीकृत कर्मचारी",
    safeEmployees: "सुरक्षित कर्मचारी",
    riskEmployees: "जोखिम वाले कर्मचारी",
    activeReports: "सक्रिय रिपोर्ट",
    employeeReports: "कर्मचारी रिपोर्ट",
    emergencyAlerts: "आपातकालीन अलर्ट",
    sendAlert: "सुरक्षा अलर्ट भेजें",
    alertMessage: "सुरक्षा अलर्ट संदेश",
    noNotifications: "कोई नई सूचना नहीं",
    resetPassword: "पासवर्ड रीसेट करें",
    enterPhone: "पंजीकृत फोन नंबर दर्ज करें",
    enterOtp: "6 अंकों का OTP दर्ज करें",
    newPassword: "नया पासवर्ड",
    confirmNewPassword: "नए पासवर्ड की पुष्टि करें",
    verifyOtp: "OTP सत्यापित करें",
    updatePassword: "पासवर्ड अपडेट करें",
    otpHint: "डेमो OTP: 123456",
  },

  kn: {
    chooseLanguage: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    languageDescription: "ಮುಂದುವರಿಯಲು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    continue: "ಮುಂದುವರಿಸಿ",
    back: "ಹಿಂದೆ",
    welcome: "SulfiSafe ಗೆ ಸ್ವಾಗತ",
    welcomeText: "ಕೈಗಾರಿಕಾ ಸುರಕ್ಷತೆ ಮತ್ತು H₂S ಎಕ್ಸ್‌ಪೋಸರ್ ನಿರ್ವಹಣೆ.",
    employeePortal: "ಉದ್ಯೋಗಿ ಪೋರ್ಟಲ್",
    adminPortal: "ನಿರ್ವಾಹಕ ಪೋರ್ಟಲ್",
    employeeLogin: "ಉದ್ಯೋಗಿ ಲಾಗಿನ್",
    adminLogin: "ನಿರ್ವಾಹಕ ಲಾಗಿನ್",
    employeeId: "ಉದ್ಯೋಗಿ ಐಡಿ",
    adminId: "ನಿರ್ವಾಹಕ ಐಡಿ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    login: "ಲಾಗಿನ್",
    logout: "ಲಾಗ್ ಔಟ್",
    forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿರಾ?",
    signUp: "ನೋಂದಣಿ",
    employeeDashboard: "ಉದ್ಯೋಗಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    adminDashboard: "ನಿರ್ವಾಹಕ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    notifications: "ಅಧಿಸೂಚನೆಗಳು",
    digitalId: "ಡಿಜಿಟಲ್ ಸುರಕ್ಷತಾ ಗುರುತಿನ ಚೀಟಿ",
    historyLogs: "ಇತಿಹಾಸ ಮತ್ತು ದಾಖಲೆಗಳು",
    exposure: "ಎಕ್ಸ್‌ಪೋಸರ್ ವಿಶ್ಲೇಷಣೆ",
    profile: "ಪ್ರೊಫೈಲ್ ನವೀಕರಿಸಿ",
    emergency: "ತುರ್ತು SOS",
    reportIssue: "ಸಮಸ್ಯೆ ವರದಿ ಮಾಡಿ",
    safe: "ಸುರಕ್ಷಿತ",
    risk: "ಅಪಾಯದಲ್ಲಿ",
    temperature: "ತಾಪಮಾನ",
    humidity: "ಆರ್ದ್ರತೆ",
  },

  ta: {
    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    languageDescription: "தொடர உங்கள் விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்.",
    continue: "தொடரவும்",
    back: "பின் செல்லவும்",
    welcome: "SulfiSafe-க்கு வரவேற்கிறோம்",
    welcomeText: "தொழில்துறை பாதுகாப்பு மற்றும் H₂S வெளிப்பாடு மேலாண்மை.",
    employeePortal: "பணியாளர் போர்டல்",
    adminPortal: "நிர்வாகி போர்டல்",
    employeeLogin: "பணியாளர் உள்நுழைவு",
    adminLogin: "நிர்வாகி உள்நுழைவு",
    employeeId: "பணியாளர் ஐடி",
    adminId: "நிர்வாகி ஐடி",
    password: "கடவுச்சொல்",
    login: "உள்நுழையவும்",
    logout: "வெளியேறு",
    forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
    signUp: "பதிவு செய்யவும்",
    employeeDashboard: "பணியாளர் டாஷ்போர்டு",
    adminDashboard: "நிர்வாக டாஷ்போர்டு",
    notifications: "அறிவிப்புகள்",
    digitalId: "டிஜிட்டல் பாதுகாப்பு அட்டை",
    historyLogs: "வரலாறு மற்றும் பதிவுகள்",
    exposure: "வெளிப்பாடு பகுப்பாய்வு",
    profile: "சுயவிவரத்தை புதுப்பிக்கவும்",
    emergency: "அவசர SOS",
    reportIssue: "சிக்கலைப் புகாரளிக்கவும்",
    safe: "பாதுகாப்பானது",
    risk: "ஆபத்தில்",
    temperature: "வெப்பநிலை",
    humidity: "ஈரப்பதம்",
  },

  ml: {
    chooseLanguage: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
    languageDescription: "തുടരുന്നതിന് നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക.",
    continue: "തുടരുക",
    back: "തിരികെ",
    welcome: "SulfiSafe-ലേക്ക് സ്വാഗതം",
    welcomeText: "വ്യാവസായിക സുരക്ഷയും H₂S എക്സ്പോഷർ മാനേജ്മെന്റും.",
    employeePortal: "ജീവനക്കാരുടെ പോർട്ടൽ",
    adminPortal: "അഡ്മിൻ പോർട്ടൽ",
    employeeLogin: "ജീവനക്കാരുടെ ലോഗിൻ",
    adminLogin: "അഡ്മിൻ ലോഗിൻ",
    employeeId: "ജീവനക്കാരുടെ ഐഡി",
    adminId: "അഡ്മിൻ ഐഡി",
    password: "പാസ്‌വേഡ്",
    login: "ലോഗിൻ",
    logout: "ലോഗ് ഔട്ട്",
    forgotPassword: "പാസ്‌വേഡ് മറന്നോ?",
    signUp: "സൈൻ അപ്പ്",
    employeeDashboard: "ജീവനക്കാരുടെ ഡാഷ്ബോർഡ്",
    adminDashboard: "അഡ്മിൻ ഡാഷ്ബോർഡ്",
    notifications: "അറിയിപ്പുകൾ",
    digitalId: "ഡിജിറ്റൽ സുരക്ഷാ ഐഡി",
    historyLogs: "ചരിത്രവും രേഖകളും",
    exposure: "എക്സ്പോഷർ വിശകലനം",
    profile: "പ്രൊഫൈൽ അപ്ഡേറ്റ് ചെയ്യുക",
    emergency: "അടിയന്തര SOS",
    reportIssue: "പ്രശ്നം റിപ്പോർട്ട് ചെയ്യുക",
    safe: "സുരക്ഷിതം",
    risk: "അപകടസാധ്യത",
    temperature: "താപനില",
    humidity: "ഈർപ്പം",
  },

  tcy: {
    chooseLanguage: "ನಿಕ್ಕ್ ಭಾಷೆ ಆಯ್ಕೆ ಮಲ್ಪುಲೆ",
    languageDescription: "ಮುಂದೆ ಪೊವೊಡ್ಗೆ ಭಾಷೆ ಆಯ್ಕೆ ಮಲ್ಪುಲೆ.",
    continue: "ಮುಂದೆ ಪೊಲೆ",
    back: "ಪಿರತ",
    welcome: "SulfiSafe ಗೆ ಸ್ವಾಗತ",
    welcomeText: "ಕೈಗಾರಿಕಾ ಸುರಕ್ಷತೆ ಮತ್ H₂S ಎಕ್ಸ್‌ಪೋಸರ್ ನಿರ್ವಹಣೆ.",
    employeePortal: "ಕೆಲಸಗಾರ ಪೋರ್ಟಲ್",
    adminPortal: "ಅಡ್ಮಿನ್ ಪೋರ್ಟಲ್",
    employeeLogin: "ಕೆಲಸಗಾರ ಲಾಗಿನ್",
    adminLogin: "ಅಡ್ಮಿನ್ ಲಾಗಿನ್",
    employeeId: "ಕೆಲಸಗಾರ ಐಡಿ",
    adminId: "ಅಡ್ಮಿನ್ ಐಡಿ",
    password: "ಪಾಸ್‌ವರ್ಡ್",
    login: "ಲಾಗಿನ್",
    logout: "ಲಾಗ್ ಔಟ್",
    forgotPassword: "ಪಾಸ್‌ವರ್ಡ್ ಮರೆತೆರಾ?",
    signUp: "ಸೈನ್ ಅಪ್",
    employeeDashboard: "ಕೆಲಸಗಾರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    adminDashboard: "ಅಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    notifications: "ಅಧಿಸೂಚನೆ",
    digitalId: "ಡಿಜಿಟಲ್ ಸುರಕ್ಷತಾ ಐಡಿ",
    historyLogs: "ಇತಿಹಾಸ",
    exposure: "ಎಕ್ಸ್‌ಪೋಸರ್",
    profile: "ಪ್ರೊಫೈಲ್",
    emergency: "ತುರ್ತು SOS",
    reportIssue: "ಸಮಸ್ಯೆ ವರದಿ",
    safe: "ಸುರಕ್ಷಿತ",
    risk: "ಅಪಾಯ",
    temperature: "ತಾಪಮಾನ",
    humidity: "ಆರ್ದ್ರತೆ",
  },
};

const languages = [
  { code: "en", native: "English", name: "English" },
  { code: "hi", native: "हिंदी", name: "Hindi" },
  { code: "kn", native: "ಕನ್ನಡ", name: "Kannada" },
  { code: "ta", native: "தமிழ்", name: "Tamil" },
  { code: "ml", native: "മലയാളം", name: "Malayalam" },
  { code: "tcy", native: "ತುಳು", name: "Tulu" },
];

const colorimetryReference = [
  {
    id: "cream",
    label: "Cream",
    hex: "#eee9d8",
    deltaE: 4.2,
    ppm: 0.8,
    status: "NORMAL",
    riskStatus: "Safe",
  },
  {
    id: "yellow",
    label: "Yellow",
    hex: "#e5c84b",
    deltaE: 9.8,
    ppm: 3.6,
    status: "NORMAL",
    riskStatus: "Safe",
  },
  {
    id: "olive",
    label: "Olive",
    hex: "#9b9141",
    deltaE: 15.4,
    ppm: 6.8,
    status: "ACTION_REQUIRED",
    riskStatus: "At Risk",
  },
  {
    id: "brown",
    label: "Brown",
    hex: "#875534",
    deltaE: 21.7,
    ppm: 10.8,
    status: "DANGER_EXCEEDED",
    riskStatus: "At Risk",
  },
  {
    id: "black",
    label: "Black",
    hex: "#292724",
    deltaE: 28.6,
    ppm: 17.2,
    status: "DANGER_EXCEEDED",
    riskStatus: "At Risk",
  },
];

const createScanData = (color = colorimetryReference[1]) => ({
  badgeId: "SFS-EMP001-07",
  observedColor: color.id,
  colorLabel: color.label,
  colorHex: color.hex,
  deltaE: color.deltaE,
  ppm: color.ppm,
  cumulativeDose: `${(color.ppm * 8).toFixed(1)} ppm·h`,
  complianceStatus: color.status,
  scannedAt: "09 Sep 2026, 10:42 AM",
  source: "SulfScan colorimetry",
});

/* =====================================================
   DEFAULT EMPLOYEE
===================================================== */

const defaultEmployee = {
  id: "demo-employee",
  fullName: "Demo Employee",
  employeeId: "EMP001",
  organisation: "SulfiSafe Industries",
  branch: "Main Plant",
  sector: "Industrial Operations",
  bloodGroup: "O+",
  phone: "9876543210",
  password: "Employee@123",
  profilePicture: "",
  riskStatus: "Safe",
  cumulativeDose: "28.8 ppm·h",
  temperature: 29,
  humidity: 63,
  bandExpiry: "30 September 2026",
  scanData: createScanData(),
};

const normalizeEmployee = (employee) => ({
  ...employee,
  scanData: employee.scanData || defaultEmployee.scanData,
});

/* =====================================================
   APP
===================================================== */

export default function App() {
  const [page, setPage] = useState(() => localStorage.getItem('sulfisafe_page') || "language");
  const [language, setLanguage] = useState(() => localStorage.getItem('sulfisafe_lang') || "en");

  const [employees, setEmployees] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(() => {
    const saved = localStorage.getItem('sulfisafe_currentEmployee');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync auth and page state to localStorage
  useEffect(() => {
    localStorage.setItem('sulfisafe_page', page);
  }, [page]);

  useEffect(() => {
    localStorage.setItem('sulfisafe_lang', language);
  }, [language]);

  useEffect(() => {
    if (currentEmployee) {
      localStorage.setItem('sulfisafe_currentEmployee', JSON.stringify(currentEmployee));
    } else {
      localStorage.removeItem('sulfisafe_currentEmployee');
    }
  }, [currentEmployee]);

  const [issues, setIssues] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [resetRole, setResetRole] = useState("employee");
  const [resetPhone, setResetPhone] = useState("");
  const [resetTarget, setResetTarget] = useState(null);
  const [otp, setOtp] = useState("");

  const [exposurePeriod, setExposurePeriod] = useState("day");

  /* Profile image states */

  const [signupImage, setSignupImage] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraTarget, setCameraTarget] = useState("");

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraStreamRef = useRef(null);

  const t = {
    ...translations.en,
    ...(translations[language] || {}),
  };

  /* =====================================================
     LOCAL STORAGE
  ===================================================== */

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: empData } = await supabase.from('sulfisafe_employees').select('*');
        if (empData && empData.length > 0) {
          setEmployees(empData.map(e => normalizeEmployee(e.data)));
        } else {
          setEmployees([defaultEmployee]);
        }

        const { data: issueData } = await supabase.from('sulfisafe_issues').select('*');
        if (issueData) setIssues(issueData.map(i => i.data));

        const { data: emergData } = await supabase.from('sulfisafe_emergencies').select('*');
        if (emergData) setEmergencies(emergData.map(e => e.data));

        const { data: alertData } = await supabase.from('sulfisafe_alerts').select('*');
        if (alertData) setAlerts(alertData.map(a => a.data));
      } catch (err) {
        console.error('Supabase load error:', err);
        setEmployees([defaultEmployee]);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      const sync = async () => {
        await supabase.from('sulfisafe_employees').upsert(
          employees.map(e => ({ id: String(e.id), data: e }))
        );
      };
      sync();
      localStorage.setItem("sulfisafeEmployees", JSON.stringify(employees));
    }
  }, [employees]);

  useEffect(() => {
    const sync = async () => {
      if (issues.length > 0) {
        await supabase.from('sulfisafe_issues').upsert(
          issues.map(i => ({ id: String(i.id), data: i }))
        );
      }
    };
    sync();
    localStorage.setItem("sulfisafeIssues", JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(
      "sulfisafeEmergencies",
      JSON.stringify(emergencies)
    );
  }, [emergencies]);

  useEffect(() => {
    const sync = async () => {
      if (alerts.length > 0) {
        await supabase.from('sulfisafe_alerts').upsert(
          alerts.map(a => ({ id: String(a.id), data: a }))
        );
      }
    };
    sync();
    localStorage.setItem("sulfisafeAlerts", JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  /* =====================================================
     HELPERS
  ===================================================== */

  const showMessage = (text) => {
    setMessage(text);
    setError("");

    setTimeout(() => {
      setMessage("");
    }, 3500);
  };

  const goBack = () => {
    setError("");
    setMessage("");

    const previousPages = {
      loginChoice: "language",
      employeeLogin: "loginChoice",
      adminLogin: "loginChoice",
      signup: "employeeLogin",
      forgotPassword:
        resetRole === "admin" ? "adminLogin" : "employeeLogin",
      verifyOtp: "forgotPassword",
      newPassword: "verifyOtp",
      employeeProfile: "employeeDashboard",
      history: "employeeDashboard",
      exposure: "employeeDashboard",
      reportIssue: "employeeDashboard",
      adminEmployee: "adminDashboard",
    };

    setPage(previousPages[page] || "loginChoice");
  };

  const logout = () => {
    stopCamera();
    setCurrentEmployee(null);
    setSelectedEmployee(null);
    setShowNotifications(false);
    setPage("loginChoice");
  };

  const addNotification = (title, body) => {
    setNotifications((previous) => [
      {
        id: Date.now(),
        title,
        body,
        time: new Date().toLocaleString(),
      },
      ...previous,
    ]);
  };

  /* =====================================================
     CAMERA FUNCTIONS
  ===================================================== */

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      cameraStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  const openCamera = async (target) => {
    try {
      stopCamera();

      setCameraTarget(target);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
        },
        audio: false,
      });

      cameraStreamRef.current = stream;
      setCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }, 100);
    } catch (cameraError) {
      console.error(cameraError);

      setError(
        "Camera access was denied or is not available on this device."
      );
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const imageData = canvas.toDataURL("image/jpeg", 0.85);

    if (cameraTarget === "signup") {
      setSignupImage(imageData);
    }

    if (cameraTarget === "profile") {
      setProfileImage(imageData);
    }

    stopCamera();

    showMessage("Profile photo captured successfully.");
  };

  const handleGalleryImage = (event, target) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      if (target === "signup") {
        setSignupImage(reader.result);
      }

      if (target === "profile") {
        setProfileImage(reader.result);
      }

      showMessage("Profile photo selected successfully.");
    };

    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const deleteImage = (target) => {
    if (target === "signup") {
      setSignupImage("");
    }

    if (target === "profile") {
      setProfileImage("");
    }

    showMessage("Profile photo removed.");
  };

  /* =====================================================
     EMPLOYEE LOGIN
  ===================================================== */

  const handleEmployeeLogin = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const employeeId = formData.get("employeeId").trim();
    const password = formData.get("password");

    const employee = employees.find(
      (item) =>
        item.employeeId.toLowerCase() === employeeId.toLowerCase() &&
        item.password === password
    );

    if (!employee) {
      setError("Invalid Employee ID or password.");
      return;
    }

    setCurrentEmployee(employee);
    setError("");

    addNotification(
      "Welcome to SulfiSafe",
      "Your employee safety dashboard is ready."
    );

    setPage("employeeDashboard");
  };

  /* =====================================================
     ADMIN LOGIN
  ===================================================== */

  const handleAdminLogin = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const adminId = formData.get("adminId");
    const password = formData.get("password");

    if (
      adminId !== ADMIN_ID ||
      password !== ADMIN_PASSWORD
    ) {
      setError("Invalid Admin ID or password.");
      return;
    }

    setError("");
    setPage("adminDashboard");
  };

  /* =====================================================
     SIGNUP
  ===================================================== */

  const handleSignup = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const employeeId = formData
      .get("employeeId")
      .trim();

    const exists = employees.some(
      (employee) =>
        employee.employeeId.toLowerCase() ===
        employeeId.toLowerCase()
    );

    if (exists) {
      setError("This Employee ID is already registered.");
      return;
    }

    const newEmployee = {
      id: Date.now().toString(),
      fullName: formData.get("fullName"),
      employeeId,
      organisation: formData.get("organisation"),
      branch: formData.get("branch"),
      sector: formData.get("sector"),
      bloodGroup: formData.get("bloodGroup"),
      phone: formData.get("phone"),
      password,
      profilePicture: signupImage,
      riskStatus: "Safe",
      cumulativeDose: "0.0 ppm·h",
      temperature: 28,
      humidity: 60,
      bandExpiry: "30 September 2026",
      scanData: createScanData(),
    };

    setEmployees((previous) => [
      ...previous,
      newEmployee,
    ]);

    setError("");
    showMessage("Employee account created successfully.");

    setSignupImage("");

    event.target.reset();

    setTimeout(() => {
      setPage("employeeLogin");
    }, 1200);
  };

  /* =====================================================
     FORGOT PASSWORD
  ===================================================== */

  const openForgotPassword = (role) => {
    setResetRole(role);
    setResetPhone("");
    setResetTarget(null);
    setOtp("");
    setError("");
    setPage("forgotPassword");
  };

  const handlePhoneVerification = (event) => {
    event.preventDefault();

    if (resetRole === "admin") {
      setResetTarget({
        type: "admin",
      });

      setPage("verifyOtp");

      showMessage(
        `OTP sent successfully. Demo OTP: ${DEMO_OTP}`
      );

      return;
    }

    const employee = employees.find(
      (item) => item.phone === resetPhone
    );

    if (!employee) {
      setError(
        "No employee is registered with this phone number."
      );

      return;
    }

    setResetTarget(employee);
    setPage("verifyOtp");

    showMessage(
      `OTP sent successfully. Demo OTP: ${DEMO_OTP}`
    );
  };

  const handleOtpVerification = (event) => {
    event.preventDefault();

    if (otp !== DEMO_OTP) {
      setError("Invalid OTP. Please try again.");
      return;
    }

    setError("");
    setPage("newPassword");
  };

  const handlePasswordReset = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const newPassword = formData.get("newPassword");
    const confirmPassword =
      formData.get("confirmPassword");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (resetRole === "admin") {
      showMessage(
        "Demo admin password reset completed. The configured demo credentials remain unchanged."
      );

      setTimeout(
        () => setPage("adminLogin"),
        2000
      );

      return;
    }

    setEmployees((previous) =>
      previous.map((employee) =>
        employee.id === resetTarget.id
          ? {
              ...employee,
              password: newPassword,
            }
          : employee
      )
    );

    showMessage("Password reset successfully.");

    setTimeout(() => {
      setPage("employeeLogin");
    }, 1500);
  };

  /* =====================================================
     PROFILE UPDATE
  ===================================================== */

  const handleProfileUpdate = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const updatedEmployee = {
      ...currentEmployee,
      fullName: formData.get("fullName"),
      organisation: formData.get("organisation"),
      branch: formData.get("branch"),
      sector: formData.get("sector"),
      bloodGroup: formData.get("bloodGroup"),
      phone: formData.get("phone"),
      profilePicture: profileImage,
    };

    setEmployees((previous) =>
      previous.map((employee) =>
        employee.id === currentEmployee.id
          ? updatedEmployee
          : employee
      )
    );

    setCurrentEmployee(updatedEmployee);

    showMessage("Profile updated successfully.");
  };

  const handleColorimetryChange = (colorId) => {
    if (!currentEmployee) return;

    const color = colorimetryReference.find(
      (item) => item.id === colorId
    );

    if (!color) return;

    const updatedEmployee = {
      ...currentEmployee,
      riskStatus: color.riskStatus,
      cumulativeDose: `${(color.ppm * 8).toFixed(1)} ppm·h`,
      scanData: createScanData(color),
    };

    setEmployees((previous) =>
      previous.map((employee) =>
        employee.id === updatedEmployee.id
          ? updatedEmployee
          : employee
      )
    );

    setCurrentEmployee(updatedEmployee);

    if (selectedEmployee?.id === updatedEmployee.id) {
      setSelectedEmployee(updatedEmployee);
    }

    showMessage(
      `SulfScan updated: ${color.ppm.toFixed(1)} ppm (${color.status}).`
    );
  };

  /* =====================================================
     EMERGENCY
  ===================================================== */

  const triggerEmergency = () => {
    if (!currentEmployee) return;

    const emergency = {
      id: Date.now(),
      employeeId: currentEmployee.employeeId,
      employeeName: currentEmployee.fullName,
      time: new Date().toLocaleString(),
      status: "Active",
    };

    setEmergencies((previous) => [
      emergency,
      ...previous,
    ]);

    addNotification(
      "Emergency SOS Activated",
      "Your emergency alert has been recorded and sent to the administrator."
    );

    showMessage(
      "Emergency SOS alert sent successfully."
    );
  };

  /* =====================================================
     REPORT ISSUE
  ===================================================== */

  const handleIssueReport = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const issue = {
      id: Date.now(),
      employeeId: currentEmployee.employeeId,
      employeeName: currentEmployee.fullName,
      title: formData.get("title"),
      description: formData.get("description"),
      status: "Open",
      time: new Date().toLocaleString(),
    };

    setIssues((previous) => [
      issue,
      ...previous,
    ]);

    addNotification(
      "Issue Report Submitted",
      "Your issue report has been forwarded to the safety administrator."
    );

    showMessage(
      "Issue report submitted successfully."
    );

    event.target.reset();
  };

  const handleAdminAlert = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const alertText = formData.get("alertMessage").trim();

    if (!alertText) return;

    const alert = {
      id: Date.now(),
      message: alertText,
      time: new Date().toLocaleString(),
      status: "Broadcast",
    };

    setAlerts((previous) => [alert, ...previous]);
    showMessage("Safety alert broadcast successfully.");
    event.target.reset();
  };

  /* =====================================================
     ADMIN ALERT
  ===================================================== */

  /* =====================================================
     STATISTICS
  ===================================================== */

  const statistics = useMemo(() => {
    return {
      total: employees.length,

      safe: employees.filter(
        (employee) =>
          employee.riskStatus !== "At Risk"
      ).length,

      risk: employees.filter(
        (employee) =>
          employee.riskStatus === "At Risk"
      ).length,

      reports: issues.length,
    };
  }, [employees, issues]);

  const filteredEmployees = employees.filter(
    (employee) => {
      const query =
        searchTerm.toLowerCase();

      return (
        employee.fullName
          .toLowerCase()
          .includes(query) ||
        employee.employeeId
          .toLowerCase()
          .includes(query)
      );
    }
  );

  const averageExposure = employees.length
    ? (
        employees.reduce(
          (total, employee) =>
            total + (employee.scanData?.ppm || 0),
          0
        ) / employees.length
      ).toFixed(1)
    : "0.0";

  const activeEmergencies = emergencies.filter(
    (emergency) => emergency.status === "Active"
  );

  const hazardZones = [
    {
      area: "Main Plant",
      level: Number(averageExposure) >= 10 ? "High" : "Safe",
      employees: employees.length,
      reading: `${averageExposure} ppm avg`,
    },
    {
      area: "Processing Unit B",
      level: Number(averageExposure) >= 5 ? "Moderate" : "Safe",
      employees: Math.max(1, Math.ceil(employees.length * 0.35)),
      reading: `${Math.max(2, Number(averageExposure) - 1.2).toFixed(1)} ppm`,
    },
    {
      area: "Storage Zone 3",
      level: activeEmergencies.length > 0 ? "High" : "Moderate",
      employees: Math.max(1, Math.ceil(employees.length * 0.2)),
      reading: activeEmergencies.length > 0 ? "Critical" : "4.2 ppm",
    },
  ];

  const recentActivity = [
    ...activeEmergencies.map((emergency) => ({
      icon: "🚨",
      text: `${emergency.employeeName} activated Emergency SOS`,
      time: emergency.time,
      tone: "danger",
    })),
    ...issues.slice(0, 2).map((issue) => ({
      icon: "⚠️",
      text: `${issue.employeeName} submitted ${issue.title}`,
      time: issue.time,
      tone: "warning",
    })),
    ...employees.slice(0, 3).map((employee) => ({
      icon: employee.riskStatus === "At Risk" ? "⚠️" : "🟢",
      text: `${employee.fullName} is ${employee.riskStatus.toLowerCase()}`,
      time: employee.scanData?.scannedAt || "Latest scan",
      tone: employee.riskStatus === "At Risk" ? "warning" : "safe",
    })),
  ].slice(0, 6);

  const exposureData = {
    day: [10, 18, 25, 16, 32, 20, 12, 28],

    week: [
      22,
      35,
      18,
      42,
      28,
      50,
      31,
    ],

    month: [
      18,
      25,
      32,
      28,
      45,
      38,
      51,
      29,
      40,
      33,
      48,
      36,
    ],
  };

  const exposureLabels = {
    day: [
      "08:00",
      "10:00",
      "12:00",
      "14:00",
      "16:00",
      "18:00",
      "20:00",
      "22:00",
    ],

    week: [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
    ],

    month: [
      "1",
      "3",
      "6",
      "8",
      "11",
      "14",
      "16",
      "19",
      "22",
      "25",
      "28",
      "30",
    ],
  };

  const currentExposureData =
    exposureData[exposurePeriod];

  const currentExposureLabels =
    exposureLabels[exposurePeriod];

  const renderMessage = () => (
    <>
      {message && (
        <div className="global-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="global-message error">
          {error}
        </div>
      )}
    </>
  );

  /* =====================================================
     CAMERA MODAL
  ===================================================== */

  const renderCameraModal = () => {
    if (!cameraOpen) return null;

    return (
      <div className="camera-modal-overlay">
        <div className="camera-modal">
          <div className="camera-modal-header">
            <div>
              <span className="camera-modal-icon">
                📷
              </span>

              <h2>Take Profile Photo</h2>
            </div>

            <button
              className="camera-close-button"
              onClick={stopCamera}
              type="button"
            >
              ✕
            </button>
          </div>

          <div className="camera-preview">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
            />
          </div>

          <canvas
            ref={canvasRef}
            className="hidden-canvas"
          />

          <div className="camera-modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={stopCamera}
            >
              Cancel
            </button>

            <button
              type="button"
              className="capture-button"
              onClick={capturePhoto}
            >
              📸 Capture Photo
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* =====================================================
     LANGUAGE PAGE
  ===================================================== */

  if (page === "language") {
    return (
      <div
        className={`app language-${language}`}
      >
        <section className="language-page">
          <div className="language-card page-animate">
            <div className="hero-logo animated-logo">
              <img src="/sulfscan-logo.png" alt="SulfiSafe logo" />
            </div>

            <h1>{t.chooseLanguage}</h1>

            <p>{t.languageDescription}</p>

            <div className="language-grid">
              {languages.map((item) => (
                <button
                  key={item.code}
                  className={`language-option ${
                    language === item.code
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    setLanguage(item.code)
                  }
                >
                  <strong>{item.native}</strong>

                  <span>{item.name}</span>
                </button>
              ))}
            </div>

            <button
              className="primary-button large-button"
              onClick={() =>
                setPage("loginChoice")
              }
            >
              {t.continue} →
            </button>
          </div>
        </section>
      </div>
    );
  }

  /* =====================================================
     LOGIN CHOICE
  ===================================================== */

  if (page === "loginChoice") {
    return (
      <div
        className={`app language-${language}`}
      >
        <section className="auth-page role-page">
          <button
            className="back-floating"
            onClick={goBack}
          >
            ← {t.back}
          </button>

          <div className="role-container page-animate">
            <div className="hero-logo animated-logo">
              <img src="/sulfscan-logo.png" alt="SulfiSafe logo" />
            </div>

            <h1>{t.welcome}</h1>

            <p>{t.welcomeText}</p>

            <div className="role-list">
              <button
                className="role-card employee-role"
                onClick={() =>
                  setPage("employeeLogin")
                }
              >
                <div className="role-icon">
                  👷
                </div>

                <div>
                  <h2>
                    {t.employeePortal}
                  </h2>

                  <p>
                    {t.employeePortalText}
                  </p>
                </div>

                <span>→</span>
              </button>

              <button
                className="role-card admin-role"
                onClick={() =>
                  setPage("adminLogin")
                }
              >
                <div className="role-icon">
                  🛡️
                </div>

                <div>
                  <h2>
                    {t.adminPortal}
                  </h2>

                  <p>
                    {t.adminPortalText}
                  </p>
                </div>

                <span>→</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* =====================================================
     EMPLOYEE LOGIN
  ===================================================== */

  if (page === "employeeLogin") {
    return (
      <div
        className={`app language-${language}`}
      >
        <section className="auth-page">
          <button
            className="back-floating"
            onClick={goBack}
          >
            ← {t.back}
          </button>

          <div className="auth-card page-animate">
            <div className="auth-icon">
              👷
            </div>

            <h1>{t.employeeLogin}</h1>

            <p>
              Securely access your SulfiSafe
              safety account.
            </p>

            {renderMessage()}

            <form onSubmit={handleEmployeeLogin}>
              <label>
                {t.employeeId}
              </label>

              <input
                name="employeeId"
                required
              />

              <label>
                {t.password}
              </label>

              <input
                name="password"
                type="password"
                required
              />

              <button
                type="button"
                className="text-button"
                onClick={() =>
                  openForgotPassword(
                    "employee"
                  )
                }
              >
                {t.forgotPassword}
              </button>

              <button
                className="primary-button"
                type="submit"
              >
                {t.login}
              </button>
            </form>

            <div className="auth-footer">
              <span>
                {t.noAccount}
              </span>

              <button
                className="text-button"
                onClick={() => {
                  setError("");
                  setPage("signup");
                }}
              >
                {t.signUp}
              </button>
            </div>

            <div className="demo-box">
              <strong>
                Demo Employee
              </strong>

              <span>
                EMP001 / Employee@123
              </span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* =====================================================
     ADMIN LOGIN
  ===================================================== */

  if (page === "adminLogin") {
    return (
      <div
        className={`app language-${language}`}
      >
        <section className="auth-page">
          <button
            className="back-floating"
            onClick={goBack}
          >
            ← {t.back}
          </button>

          <div className="auth-card page-animate">
            <div className="auth-icon admin-icon">
              🛡️
            </div>

            <h1>{t.adminLogin}</h1>

            {renderMessage()}

            <form onSubmit={handleAdminLogin}>
              <label>{t.adminId}</label>

              <input
                name="adminId"
                required
              />

              <label>
                {t.password}
              </label>

              <input
                name="password"
                type="password"
                required
              />

              <button
                type="button"
                className="text-button"
                onClick={() =>
                  openForgotPassword(
                    "admin"
                  )
                }
              >
                {t.forgotPassword}
              </button>

              <button
                className="primary-button admin-button"
              >
                {t.login}
              </button>
            </form>

            <div className="demo-box">
              <strong>
                Demo Administrator
              </strong>

              <span>
                admin / SulfiSafe@123
              </span>
            </div>
          </div>
        </section>
      </div>
    );
  }

  /* =====================================================
     SIGNUP
  ===================================================== */

  if (page === "signup") {
    return (
      <div
        className={`app language-${language}`}
      >
        <section className="auth-page">
          <button
            className="back-floating"
            onClick={goBack}
          >
            ← {t.back}
          </button>

          <div className="auth-card wide-card page-animate">
            <div className="auth-icon">
              👷
            </div>

            <h1>
              {t.createAccount}
            </h1>

            {renderMessage()}

            <form
              className="form-grid"
              onSubmit={handleSignup}
            >
              <div className="profile-photo-field full-width">
                <label>{t.profilePicture}</label>

                <ProfilePhotoControls
                  image={signupImage}
                  onCamera={() => openCamera("signup")}
                  onGallery={(event) =>
                    handleGalleryImage(event, "signup")
                  }
                  onDelete={() => deleteImage("signup")}
                />
              </div>

              <div>
                <label>
                  {t.fullName}
                </label>

                <input
                  name="fullName"
                  required
                />
              </div>

              <div>
                <label>
                  {t.employeeId}
                </label>

                <input
                  name="employeeId"
                  required
                />
              </div>

              <div>
                <label>
                  {t.organisation}
                </label>

                <input
                  name="organisation"
                  required
                />
              </div>

              <div>
                <label>
                  {t.branch}
                </label>

                <input
                  name="branch"
                  required
                />
              </div>

              <div>
                <label>
                  {t.sector}
                </label>

                <input
                  name="sector"
                  required
                />
              </div>

              <div>
                <label>
                  {t.bloodGroup}
                </label>

                <select
                  name="bloodGroup"
                  required
                >
                  <option value="">
                    Select
                  </option>

                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                  <option>O+</option>
                  <option>O-</option>
                </select>
              </div>

              <div>
                <label>
                  {t.phone}
                </label>

                <input
                  name="phone"
                  type="tel"
                  required
                />
              </div>

              <div>
                <label>
                  {t.setPassword}
                </label>

                <input
                  name="password"
                  type="password"
                  required
                />
              </div>

              <div>
                <label>
                  {t.confirmPassword}
                </label>

                <input
                  name="confirmPassword"
                  type="password"
                  required
                />
              </div>

              <button className="primary-button full-width">
                {t.createAccount}
              </button>
            </form>

            <div className="auth-footer">
              <span>
                {t.alreadyAccount}
              </span>

              <button
                className="text-button"
                type="button"
                onClick={() =>
                  setPage("employeeLogin")
                }
              >
                {t.login}
              </button>
            </div>
          </div>
        </section>

        {renderCameraModal()}
      </div>
    );
  }

  /* =====================================================
     FORGOT PASSWORD
  ===================================================== */

  if (page === "forgotPassword") {
    return (
      <div
        className={`app language-${language}`}
      >
        <section className="auth-page">
          <button
            className="back-floating"
            onClick={goBack}
          >
            ← {t.back}
          </button>

          <div className="auth-card page-animate">
            <div className="auth-icon">
              📱
            </div>

            <h1>
              {resetRole === "admin"
                ? t.adminReset
                : t.employeeReset}
            </h1>

            <p>
              {t.enterPhone}
            </p>

            {renderMessage()}

            <form
              onSubmit={
                handlePhoneVerification
              }
            >
              <label>
                {t.phone}
              </label>

              <input
                value={resetPhone}
                onChange={(event) =>
                  setResetPhone(
                    event.target.value
                  )
                }
                type="tel"
                required={
                  resetRole !== "admin"
                }
              />

              <button className="primary-button">
                {t.continue}
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  /* =====================================================
     VERIFY OTP
  ===================================================== */

  if (page === "verifyOtp") {
    return (
      <div
        className={`app language-${language}`}
      >
        <section className="auth-page">
          <button
            className="back-floating"
            onClick={goBack}
          >
            ← {t.back}
          </button>

          <div className="auth-card page-animate">
            <div className="auth-icon">
              🔐
            </div>

            <h1>
              {t.verifyOtp}
            </h1>

            <p>
              {t.enterOtp}
            </p>

            <div className="demo-box">
              {t.otpHint}
            </div>

            {renderMessage()}

            <form
              onSubmit={
                handleOtpVerification
              }
            >
              <input
                value={otp}
                onChange={(event) =>
                  setOtp(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                className="otp-field"
                placeholder="123456"
                maxLength="6"
                required
              />

              <button className="primary-button">
                {t.verifyOtp}
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  /* =====================================================
     NEW PASSWORD
  ===================================================== */

  if (page === "newPassword") {
    return (
      <div
        className={`app language-${language}`}
      >
        <section className="auth-page">
          <button
            className="back-floating"
            onClick={goBack}
          >
            ← {t.back}
          </button>

          <div className="auth-card page-animate">
            <div className="auth-icon">
              🔑
            </div>

            <h1>
              {t.resetPassword}
            </h1>

            {renderMessage()}

            <form
              onSubmit={
                handlePasswordReset
              }
            >
              <label>
                {t.newPassword}
              </label>

              <input
                name="newPassword"
                type="password"
                required
              />

              <label>
                {t.confirmNewPassword}
              </label>

              <input
                name="confirmPassword"
                type="password"
                required
              />

              <button className="primary-button">
                {t.updatePassword}
              </button>
            </form>
          </div>
        </section>
      </div>
    );
  }

  /* =====================================================
     EMPLOYEE DASHBOARD
  ===================================================== */

  if (
    page === "employeeDashboard" &&
    currentEmployee
  ) {
    const bandExpired =
      currentEmployee.riskStatus ===
      "At Risk";

    return (
      <div
        className={`app dashboard-page language-${language}`}
      >
        <DashboardHeader
          title="SulfiSafe"
          subtitle={t.employeeDashboard}
          onLogout={logout}
          notifications={notifications}
          showNotifications={
            showNotifications
          }
          setShowNotifications={
            setShowNotifications
          }
          t={t}
        />

        <main className="dashboard-main page-animate">
          <section className="welcome-banner">
            <div>
              <p>Welcome back</p>

              <h1>
                {currentEmployee.fullName}
              </h1>

              <span>
                {t.employeeId}:{" "}
                {
                  currentEmployee.employeeId
                }
              </span>
            </div>

            <div
              className={`band-status ${
                bandExpired
                  ? "expired"
                  : ""
              }`}
            >
              <span>
                {t.wristband}
              </span>

              <strong>
                {bandExpired
                  ? "🔴 "
                  : "🟢 "}

                {bandExpired
                  ? t.expired
                  : t.valid}
              </strong>

              <small>
                Expires:{" "}
                {
                  currentEmployee.bandExpiry
                }
              </small>
            </div>
          </section>

          <section className="metrics-grid">
            <MetricCard
              icon="☣️"
              title={t.cumulativeDose}
              value={
                currentEmployee.cumulativeDose
              }
              text="Estimated exposure index"
            />

            <MetricCard
              icon="🌡️"
              title={t.temperature}
              value={`${currentEmployee.temperature}°C`}
              text="Current environment"
            />

            <MetricCard
              icon="💧"
              title={t.humidity}
              value={`${currentEmployee.humidity}%`}
              text="Environmental condition"
            />

            <MetricCard
              icon="🛡️"
              title={t.currentStatus}
              value={
                currentEmployee.riskStatus ===
                "At Risk"
                  ? t.risk
                  : t.safe
              }
              text="Based on latest monitoring"
              danger={
                currentEmployee.riskStatus ===
                "At Risk"
              }
            />
          </section>

          <ColorimetryCard
            employee={currentEmployee}
            editable
            onColorChange={handleColorimetryChange}
          />

          <section className="dashboard-grid-two">
            <div className="digital-id-card">
              <div className="id-card-top">
                <span>
                  🛡️ SULFISAFE
                </span>

                <span>
                  SAFETY ID
                </span>
              </div>

              <div className="id-card-body">
                <div className="profile-avatar large-avatar">
                  {currentEmployee.profilePicture ? (
                    <img
                      src={
                        currentEmployee.profilePicture
                      }
                      alt="Employee"
                    />
                  ) : (
                    "👷"
                  )}
                </div>

                <div>
                  <h2>
                    {
                      currentEmployee.fullName
                    }
                  </h2>

                  <p>
                    {
                      currentEmployee.employeeId
                    }
                  </p>

                  <span>
                    {
                      currentEmployee.organisation
                    }
                  </span>
                </div>
              </div>

              <div className="id-details">
                <span>
                  <strong>
                    {t.branch}:
                  </strong>{" "}
                  {
                    currentEmployee.branch
                  }
                </span>

                <span>
                  <strong>
                    {t.sector}:
                  </strong>{" "}
                  {
                    currentEmployee.sector
                  }
                </span>

                <span>
                  <strong>
                    {t.bloodGroup}:
                  </strong>{" "}
                  {
                    currentEmployee.bloodGroup
                  }
                </span>

                <span>
                  <strong>
                    {t.phone}:
                  </strong>{" "}
                  {
                    currentEmployee.phone
                  }
                </span>
              </div>

              <button
                className="secondary-button"
                onClick={() => {
                  setProfileImage(
                    currentEmployee.profilePicture ||
                      ""
                  );

                  setPage(
                    "employeeProfile"
                  );
                }}
              >
                {t.profile}
              </button>
            </div>

            <div className="quick-actions">
              <h2>
                Safety Actions
              </h2>

              <button
                className="action-card"
                onClick={() =>
                  setPage("history")
                }
              >
                <span>📋</span>

                <div>
                  <h3>
                    {t.historyLogs}
                  </h3>

                  <p>
                    View entry, exit and
                    wristband history.
                  </p>
                </div>
              </button>

              <button
                className="action-card"
                onClick={() =>
                  setPage("exposure")
                }
              >
                <span>📊</span>

                <div>
                  <h3>
                    {t.h2sMonitoring}
                  </h3>

                  <p>
                    Track ppm readings and
                    cumulative H₂S dose.
                  </p>
                </div>
              </button>

              <button
                className="action-card"
                onClick={() =>
                  setPage("reportIssue")
                }
              >
                <span>📝</span>

                <div>
                  <h3>
                    {t.reportIssue}
                  </h3>

                  <p>
                    Submit a workplace
                    safety issue.
                  </p>
                </div>
              </button>
            </div>
          </section>

          <section className="exposure-preview">
            <div className="section-heading">
              <div>
                <h2>
                  {t.h2sMonitoring}
                </h2>

                <p>
                  Track your latest H₂S readings and shift exposure.
                </p>
              </div>
            </div>

            <div className="period-buttons">
              <button
                className={
                  exposurePeriod === "day"
                    ? "active-period"
                    : ""
                }
                onClick={() =>
                  setExposurePeriod("day")
                }
              >
                {t.exposureDay}
              </button>

              <button
                className={
                  exposurePeriod === "week"
                    ? "active-period"
                    : ""
                }
                onClick={() =>
                  setExposurePeriod("week")
                }
              >
                {t.exposureWeek}
              </button>

              <button
                className={
                  exposurePeriod === "month"
                    ? "active-period"
                    : ""
                }
                onClick={() =>
                  setExposurePeriod(
                    "month"
                  )
                }
              >
                {t.exposureMonth}
              </button>
            </div>

            <ExposureChart
              data={currentExposureData}
              labels={
                currentExposureLabels
              }
              period={exposurePeriod}
            />
          </section>

          <section className="emergency-section">
            <div>
              <span className="emergency-icon">
                🚨
              </span>

              <h2>
                {t.emergency}
              </h2>

              <p>
                Use this button only when
                immediate workplace
                assistance is required.
              </p>

              <strong>
                {t.emergencyNumber}: 112
              </strong>
            </div>

            <button
              className="emergency-button"
              onClick={triggerEmergency}
            >
              🚨 SOS
            </button>
          </section>
        </main>
      </div>
    );
  }

  /* =====================================================
     HISTORY PAGE
  ===================================================== */

  if (
    page === "history" &&
    currentEmployee
  ) {
    const logs = [
      {
        date: "Today",
        type: t.entry,
        time: "08:42 AM",
        band: t.valid,
      },
      {
        date: "Yesterday",
        type: t.exit,
        time: "06:12 PM",
        band: t.valid,
      },
      {
        date: "Yesterday",
        type: t.entry,
        time: "08:35 AM",
        band: t.valid,
      },
    ];

    return (
      <div
        className={`app dashboard-page language-${language}`}
      >
        <SimpleHeader
          title={t.historyLogs}
          onBack={goBack}
        />

        <main className="dashboard-main page-animate">
          <div className="content-card">
            <h1>
              {t.historyLogs}
            </h1>

            <div className="log-list">
              {logs.map(
                (log, index) => (
                  <div
                    className="log-item"
                    key={index}
                  >
                    <div className="log-icon">
                      {log.type === t.entry
                        ? "🟢"
                        : "🔵"}
                    </div>

                    <div>
                      <h3>
                        {log.type}
                      </h3>

                      <p>
                        {log.date} •{" "}
                        {log.time}
                      </p>
                    </div>

                    <span className="status-pill safe-pill">
                      {t.wristband}:{" "}
                      {log.band}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     EXPOSURE PAGE
  ===================================================== */

  if (page === "exposure") {
    return (
      <div
        className={`app dashboard-page language-${language}`}
      >
        <SimpleHeader
          title={t.h2sMonitoring}
          onBack={goBack}
        />

        <main className="dashboard-main page-animate">
          <div className="content-card">
            <h1>
              {t.h2sMonitoring}
            </h1>

            <p className="information-note">
              Monitor your H₂S exposure readings across each work period.
            </p>

            <div className="exposure-live-strip">
              <div>
                <span>Latest H₂S reading</span>
                <strong>{currentEmployee?.scanData?.ppm || 0} ppm</strong>
                <small>{currentEmployee?.scanData?.scannedAt || "No scan yet"}</small>
              </div>

              <div>
                <span>Current shift dose</span>
                <strong>{currentEmployee?.cumulativeDose || "0 ppm·h"}</strong>
                <small>Estimated cumulative exposure</small>
              </div>

              <div>
                <span>Safety status</span>
                <strong className={currentEmployee?.riskStatus === "At Risk" ? "risk-text" : "safe-text"}>
                  {currentEmployee?.riskStatus || "Safe"}
                </strong>
                <small>Based on latest monitoring</small>
              </div>
            </div>

            <div className="period-buttons">
              <button
                className={
                  exposurePeriod === "day"
                    ? "active-period"
                    : ""
                }
                onClick={() =>
                  setExposurePeriod("day")
                }
              >
                {t.exposureDay}
              </button>

              <button
                className={
                  exposurePeriod === "week"
                    ? "active-period"
                    : ""
                }
                onClick={() =>
                  setExposurePeriod("week")
                }
              >
                {t.exposureWeek}
              </button>

              <button
                className={
                  exposurePeriod === "month"
                    ? "active-period"
                    : ""
                }
                onClick={() =>
                  setExposurePeriod(
                    "month"
                  )
                }
              >
                {t.exposureMonth}
              </button>
            </div>

            <ExposureChart
              data={currentExposureData}
              labels={
                currentExposureLabels
              }
              period={exposurePeriod}
            />

            <div className="exposure-summary">
              <div>
                <span>
                  Highest Reading
                </span>

                <strong>
                  {Math.max(
                    ...currentExposureData
                  )}{" "}
                  ppm
                </strong>
              </div>

              <div>
                <span>
                  Average Reading
                </span>

                <strong>
                  {(
                    currentExposureData.reduce(
                      (a, b) => a + b,
                      0
                    ) /
                    currentExposureData.length
                  ).toFixed(1)}{" "}
                  ppm
                </strong>
              </div>

              <div>
                <span>
                  Safety Assessment
                </span>

                <strong className="safe-text">
                  Normal
                </strong>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     PROFILE PAGE
  ===================================================== */

  if (
    page === "employeeProfile" &&
    currentEmployee
  ) {
    return (
      <div
        className={`app dashboard-page language-${language}`}
      >
        <SimpleHeader
          title={t.profile}
          onBack={goBack}
        />

        <main className="dashboard-main page-animate">
          <div className="content-card profile-update-card">
            <h1>
              {t.profile}
            </h1>

            {renderMessage()}

            <form
              className="form-grid"
              onSubmit={
                handleProfileUpdate
              }
            >
              <div>
                <label>
                  {t.fullName}
                </label>

                <input
                  name="fullName"
                  defaultValue={
                    currentEmployee.fullName
                  }
                  required
                />
              </div>

              <div>
                <label>
                  {t.organisation}
                </label>

                <input
                  name="organisation"
                  defaultValue={
                    currentEmployee.organisation
                  }
                  required
                />
              </div>

              <div>
                <label>
                  {t.branch}
                </label>

                <input
                  name="branch"
                  defaultValue={
                    currentEmployee.branch
                  }
                  required
                />
              </div>

              <div>
                <label>
                  {t.sector}
                </label>

                <input
                  name="sector"
                  defaultValue={
                    currentEmployee.sector
                  }
                  required
                />
              </div>

              <div>
                <label>
                  {t.bloodGroup}
                </label>

                <input
                  name="bloodGroup"
                  defaultValue={
                    currentEmployee.bloodGroup
                  }
                  required
                />
              </div>

              <div>
                <label>
                  {t.phone}
                </label>

                <input
                  name="phone"
                  defaultValue={
                    currentEmployee.phone
                  }
                  required
                />
              </div>

              <div className="full-width profile-photo-field">
                <label>
                  {t.profilePicture}
                </label>

                <ProfilePhotoControls
                  image={profileImage}
                  onCamera={() =>
                    openCamera("profile")
                  }
                  onGallery={(event) =>
                    handleGalleryImage(
                      event,
                      "profile"
                    )
                  }
                  onDelete={() =>
                    deleteImage("profile")
                  }
                />
              </div>

              <button className="primary-button full-width">
                {t.save}
              </button>
            </form>
          </div>
        </main>

        {renderCameraModal()}
      </div>
    );
  }

  /* =====================================================
     REPORT ISSUE
  ===================================================== */

  if (page === "reportIssue") {
    return (
      <div
        className={`app dashboard-page language-${language}`}
      >
        <SimpleHeader
          title={t.reportIssue}
          onBack={goBack}
        />

        <main className="dashboard-main page-animate">
          <div className="content-card issue-card">
            <div className="issue-header">
              <span>📝</span>

              <div>
                <h1>
                  {t.reportIssue}
                </h1>

                <p>
                  Report workplace safety
                  concerns for administrator
                  review.
                </p>
              </div>
            </div>

            {renderMessage()}

            <form
              onSubmit={
                handleIssueReport
              }
            >
              <label>
                {t.employeeId}
              </label>

              <input
                value={
                  currentEmployee?.employeeId ||
                  ""
                }
                disabled
              />

              <label>
                {t.issueTitle}
              </label>

              <input
                name="title"
                required
              />

              <label>
                {t.issueDescription}
              </label>

              <textarea
                name="description"
                rows="7"
                required
              />

              <button className="primary-button">
                {t.submitReport}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  /* =====================================================
     ADMIN DASHBOARD
  ===================================================== */

  if (page === "adminDashboard") {
    return (
      <div
        className={`app dashboard-page language-${language}`}
      >
        <DashboardHeader
          title="SulfiSafe"
          subtitle={t.adminDashboard}
          adminName="Safety Administrator"
          onLogout={logout}
          notifications={[
            ...issues.map((issue) => ({
              id: `issue-${issue.id}`,
              title:
                "New Employee Report",
              body: `${issue.employeeName}: ${issue.title}`,
              time: issue.time,
            })),

            ...emergencies.map(
              (emergency) => ({
                id: `emergency-${emergency.id}`,
                title:
                  "🚨 Emergency SOS",
                body: `${emergency.employeeName} has triggered an emergency alert.`,
                time: emergency.time,
              })
            ),
          ]}
          showNotifications={
            showNotifications
          }
          setShowNotifications={
            setShowNotifications
          }
          t={t}
        />

        <main className="dashboard-main page-animate">
          <section className="admin-welcome">
            <div>
              <p>
                Welcome, Safety Administrator 👋
              </p>

              <h1>
                {t.adminDashboard}
              </h1>

              <span>
                Monitor workplace safety and respond to potential hazards in real time.
              </span>
            </div>

            <div className="admin-live">
              <span className="live-dot" />
              System Monitoring Active
            </div>
          </section>

          <section className="admin-stat-grid">
            <AdminStat
              icon="👷"
              value={statistics.total}
              label={
                t.totalEmployees
              }
            />

            <AdminStat
              icon="🟢"
              value={statistics.safe}
              label={
                t.safeEmployees
              }
            />

            <AdminStat
              icon="⚠️"
              value={statistics.risk}
              label={
                t.riskEmployees
              }
              danger
            />

            <AdminStat
              icon="🚨"
              value={activeEmergencies.length}
              label="Emergency Alerts"
            />
          </section>

          <section className="admin-grid admin-command-grid">
            <div className="content-card live-alerts-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow light-eyebrow">LIVE RESPONSE</span>
                  <h2>🚨 Live Emergency Alerts</h2>
                  <p>Active SOS events requiring administrator attention.</p>
                </div>
                <span className="live-count">{activeEmergencies.length} active</span>
              </div>

              <div className="live-alert-list">
                {activeEmergencies.length === 0 ? (
                  <p className="empty-state">No active emergency alerts.</p>
                ) : (
                  activeEmergencies.map((emergency) => (
                    <div className="live-alert-item" key={emergency.id}>
                      <span className="alert-symbol">🚨</span>
                      <div>
                        <strong>{emergency.employeeName}</strong>
                        <span>{emergency.employeeId} · Main Plant</span>
                        <small>H₂S level: Critical · Alert received: {emergency.time}</small>
                      </div>
                      <span className="status-pill danger-pill">{emergency.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="content-card hazard-zones-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">FIELD OVERVIEW</span>
                  <h2>🗺️ Workplace Hazard Zones</h2>
                </div>
              </div>
              <div className="hazard-zone-list">
                {hazardZones.map((zone) => (
                  <div className="hazard-zone-row" key={zone.area}>
                    <span className={`zone-dot ${zone.level.toLowerCase()}`} />
                    <div>
                      <strong>{zone.area}</strong>
                      <small>{zone.employees} employees · {zone.reading}</small>
                    </div>
                    <span className={`zone-level ${zone.level.toLowerCase()}`}>{zone.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="admin-grid admin-command-grid">
            <div className="content-card exposure-monitor-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">SULFSCAN TELEMETRY</span>
                  <h2>📊 H₂S Exposure Monitoring</h2>
                  <p>Live readings from the latest colourimetric scans.</p>
                </div>
                <strong className="big-reading">{averageExposure} <small>ppm avg</small></strong>
              </div>
              <ExposureChart
                data={[4, 7, 5, 8, 6, Number(averageExposure), 3]}
                labels={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
                period="week"
              />
              <div className="analytics-strip">
                <span>🟢 Safe &lt; 5 ppm</span>
                <span>🟡 Action 5–10 ppm</span>
                <span>🔴 Critical &gt; 10 ppm</span>
              </div>
            </div>

            <div className="content-card analytics-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">SAFETY INTELLIGENCE</span>
                  <h2>📈 Safety Analytics</h2>
                </div>
              </div>
              <div className="analytics-grid">
                <div><strong>92%</strong><span>Safety Score</span><small>🟢 Stable this month</small></div>
                <div><strong>{issues.length + emergencies.length}</strong><span>Safety Incidents</span><small>Latest reported events</small></div>
                <div><strong>{hazardZones.filter((zone) => zone.level === "High").length}</strong><span>High-risk zones</span><small>Requires attention</small></div>
                <div><strong>{statistics.reports}</strong><span>Open reports</span><small>Employee submissions</small></div>
              </div>
            </div>
          </section>

          <section className="admin-grid admin-command-grid">
            <div className="content-card broadcast-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">ALL EMPLOYEES</span>
                  <h2>📢 Broadcast Safety Alerts</h2>
                  <p>Send a clear safety message to every employee.</p>
                </div>
              </div>
              <form onSubmit={handleAdminAlert}>
                <textarea
                  name="alertMessage"
                  rows="4"
                  placeholder="Example: Processing Area temporarily restricted until further notice."
                  required
                />
                <button className="primary-button" type="submit">📢 Send Alert</button>
              </form>
              {alerts.length > 0 && (
                <div className="broadcast-history compact-history">
                  {alerts.slice(0, 2).map((alert) => (
                    <div className="broadcast-item" key={alert.id}>
                      <span>📢</span><div><strong>{alert.message}</strong><small>{alert.time}</small></div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="content-card activity-card">
              <div className="section-heading">
                <div>
                  <span className="eyebrow">SYSTEM FEED</span>
                  <h2>🔔 Recent Activity</h2>
                </div>
              </div>
              <div className="activity-timeline">
                {recentActivity.length === 0 ? (
                  <p className="empty-state">Activity will appear after the first scan or report.</p>
                ) : recentActivity.map((activity, index) => (
                  <div className={`activity-item ${activity.tone}`} key={`${activity.text}-${index}`}>
                    <span>{activity.icon}</span>
                    <div><strong>{activity.text}</strong><small>{activity.time}</small></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="admin-grid employee-management-grid">
            <div className="content-card employee-search-card">
              <h2>
                Employee Management
              </h2>

              <input
                className="search-input"
                placeholder={
                  t.searchEmployee
                }
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(
                    event.target.value
                  )
                }
              />

              <div className="employee-results">
                {filteredEmployees.map(
                  (employee) => (
                    <button
                      key={employee.id}
                      className="employee-row"
                      onClick={() => {
                        setSelectedEmployee(
                          employee
                        );

                        setPage(
                          "adminEmployee"
                        );
                      }}
                    >
                      <div className="profile-avatar">
                        {employee.profilePicture ? (
                          <img
                            src={
                              employee.profilePicture
                            }
                            alt={
                              employee.fullName
                            }
                          />
                        ) : (
                          "👷"
                        )}
                      </div>

                      <div>
                        <strong>
                          {
                            employee.fullName
                          }
                        </strong>

                        <span>
                          {
                            employee.employeeId
                          }
                        </span>
                      </div>

                      <div className="employee-scan-summary">
                        <strong>
                          {employee.scanData?.ppm?.toFixed(1) || "0.0"} ppm
                        </strong>
                        <span>
                          {employee.scanData?.complianceStatus?.replace("_", " ") || "NO SCAN"}
                        </span>
                      </div>

                      <span className="row-arrow">
                        →
                      </span>
                    </button>
                  )
                )}
              </div>
            </div>

          </section>

          <section className="admin-grid">
            <div className="content-card">
              <h2>
                {t.employeeReports}
              </h2>

              <div className="report-list">
                {issues.length === 0 ? (
                  <p className="empty-state">
                    No employee reports yet.
                  </p>
                ) : (
                  issues.map((issue) => (
                    <div
                      className="report-item"
                      key={issue.id}
                    >
                      <div>
                        <strong>
                          {issue.title}
                        </strong>

                        <p>
                          {
                            issue.description
                          }
                        </p>

                        <small>
                          {
                            issue.employeeName
                          }{" "}
                          •{" "}
                          {
                            issue.employeeId
                          }
                        </small>
                      </div>

                      <span className="status-pill warning-pill">
                        {issue.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="content-card">
              <h2>
                {t.emergencyAlerts}
              </h2>

              <div className="report-list">
                {emergencies.length === 0 ? (
                  <p className="empty-state">
                    No emergency alerts.
                  </p>
                ) : (
                  emergencies.map(
                    (emergency) => (
                      <div
                        className="report-item emergency-report"
                        key={
                          emergency.id
                        }
                      >
                        <div>
                          <strong>
                            🚨 Emergency SOS
                          </strong>

                          <p>
                            {
                              emergency.employeeName
                            }
                          </p>

                          <small>
                            {
                              emergency.employeeId
                            }{" "}
                            •{" "}
                            {
                              emergency.time
                            }
                          </small>
                        </div>

                        <span className="status-pill danger-pill">
                          {
                            emergency.status
                          }
                        </span>
                      </div>
                    )
                  )
                )}
              </div>
            </div>
          </section>

          {alerts.length > 0 && (
            <section className="content-card broadcast-history">
              <h2>
                Broadcast Safety Alerts
              </h2>

              {alerts.map((alert) => (
                <div
                  className="broadcast-item"
                  key={alert.id}
                >
                  <span>📢</span>

                  <div>
                    <strong>
                      {alert.message}
                    </strong>

                    <small>
                      {alert.time}
                    </small>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    );
  }

  /* =====================================================
     ADMIN EMPLOYEE DETAIL
  ===================================================== */

  if (
    page === "adminEmployee" &&
    selectedEmployee
  ) {
    return (
      <div
        className={`app dashboard-page language-${language}`}
      >
        <SimpleHeader
          title="Employee Safety Profile"
          onBack={goBack}
        />

        <main className="dashboard-main page-animate">
          <section className="employee-detail-page">
            <div className="employee-detail-profile">
              <div className="profile-avatar employee-detail-avatar">
                {selectedEmployee.profilePicture ? (
                  <img
                    src={
                      selectedEmployee.profilePicture
                    }
                    alt={
                      selectedEmployee.fullName
                    }
                  />
                ) : (
                  "👷"
                )}
              </div>

              <div>
                <h1>
                  {
                    selectedEmployee.fullName
                  }
                </h1>

                <p>
                  {
                    selectedEmployee.employeeId
                  }
                </p>

                <span>
                  {
                    selectedEmployee.organisation
                  }
                </span>
              </div>
            </div>

            <section className="metrics-grid">
              <MetricCard
                icon="☣️"
                title="Estimated H₂S Dose"
                value={
                  selectedEmployee.cumulativeDose
                }
                text="Estimated monitoring value"
              />

              <MetricCard
                icon="🌡️"
                title="Temperature"
                value={`${selectedEmployee.temperature}°C`}
                text="Latest environment"
              />

              <MetricCard
                icon="💧"
                title="Humidity"
                value={`${selectedEmployee.humidity}%`}
                text="Latest environment"
              />

              <MetricCard
                icon="🛡️"
                title="Risk Status"
                value={
                  selectedEmployee.riskStatus
                }
                text="Current assessment"
              />
            </section>

            <ColorimetryCard employee={selectedEmployee} />

            <div className="content-card">
              <h2>
                Employee Information
              </h2>

              <div className="detail-grid">
                <Detail
                  label="Organisation"
                  value={
                    selectedEmployee.organisation
                  }
                />

                <Detail
                  label="Branch"
                  value={
                    selectedEmployee.branch
                  }
                />

                <Detail
                  label="Sector"
                  value={
                    selectedEmployee.sector
                  }
                />

                <Detail
                  label="Blood Group"
                  value={
                    selectedEmployee.bloodGroup
                  }
                />

                <Detail
                  label="Phone"
                  value={
                    selectedEmployee.phone
                  }
                />

                <Detail
                  label="Wristband Expiry"
                  value={
                    selectedEmployee.bandExpiry
                  }
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return null;
}

/* =====================================================
   COMPONENTS
===================================================== */

function DashboardHeader({
  title,
  subtitle,
  adminName,
  onLogout,
  notifications,
  showNotifications,
  setShowNotifications,
  t,
}) {
  return (
    <header className="top-header">
      <div className="brand">
        <div className="brand-logo">
          <img src="/sulfscan-logo.png" alt="SulfiSafe logo" />
        </div>

        <div>
          <h2>{title}</h2>

          <span>{subtitle}</span>
        </div>
      </div>

      <div className="header-actions">
        {adminName && (
          <div className="admin-profile-chip">
            <span className="admin-avatar">SA</span>
            <span>{adminName}</span>
          </div>
        )}
        <div className="notification-wrapper">
          <button
            className="notification-button"
            onClick={() =>
              setShowNotifications(
                !showNotifications
              )
            }
          >
            🔔

            {notifications.length > 0 && (
              <span className="notification-count">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="notification-panel">
              <h3>
                {t.notifications}
              </h3>

              {notifications.length ===
              0 ? (
                <p className="empty-state">
                  {t.noNotifications}
                </p>
              ) : (
                notifications
                  .slice(0, 8)
                  .map(
                    (notification) => (
                      <div
                        className="notification-item"
                        key={
                          notification.id
                        }
                      >
                        <strong>
                          {
                            notification.title
                          }
                        </strong>

                        <p>
                          {
                            notification.body
                          }
                        </p>

                        <small>
                          {
                            notification.time
                          }
                        </small>
                      </div>
                    )
                  )
              )}
            </div>
          )}
        </div>

        <button
          className="logout-button"
          onClick={onLogout}
        >
          {t.logout}
        </button>
      </div>
    </header>
  );
}

function SimpleHeader({
  title,
  onBack,
}) {
  return (
    <header className="top-header simple-header">
      <button
        className="header-back-button"
        onClick={onBack}
      >
        ← Back
      </button>

      <h2>{title}</h2>

      <div />
    </header>
  );
}

function ColorimetryCard({
  employee,
  editable = false,
  onColorChange,
}) {
  const scan = employee?.scanData || createScanData();
  const statusClass =
    scan.complianceStatus === "NORMAL"
      ? "normal"
      : scan.complianceStatus === "ACTION_REQUIRED"
        ? "action"
        : "danger";

  return (
    <section className="colorimetry-card">
      <div className="colorimetry-heading">
        <div>
          <span className="eyebrow">SULFSCAN / COLORIMETRY</span>
          <h2>pH paper colour to H₂S ppm</h2>
          <p>
            The observed strip colour is matched to the calibrated reference
            chart and converted into an estimated exposure value.
          </p>
        </div>

        <div
          className="scan-status-badge"
          data-status={statusClass}
        >
          {scan.complianceStatus.replace("_", " ")}
        </div>
      </div>

      <div className="colorimetry-body">
        <div className="colorimetry-reading">
          <div
            className="observed-swatch"
            style={{ backgroundColor: scan.colorHex }}
            title={scan.colorLabel}
          />

          <div>
            <span>Observed strip</span>
            <strong>{scan.colorLabel}</strong>
            <small>{scan.badgeId} · {scan.scannedAt}</small>
          </div>
        </div>

        <div className="colorimetry-values">
          <div>
            <span>Estimated H₂S</span>
            <strong>{scan.ppm.toFixed(1)} <small>ppm</small></strong>
          </div>
          <div>
            <span>CIE ΔE</span>
            <strong>{scan.deltaE.toFixed(1)} <small>units</small></strong>
          </div>
          <div>
            <span>Shift dose</span>
            <strong>{scan.cumulativeDose}</strong>
          </div>
        </div>
      </div>

      {editable && (
        <div className="colorimetry-picker">
          <span>Update observed colour</span>
          <div className="colorimetry-swatches">
            {colorimetryReference.map((color) => (
              <button
                type="button"
                key={color.id}
                className={
                  scan.observedColor === color.id
                    ? "color-swatch selected"
                    : "color-swatch"
                }
                style={{ backgroundColor: color.hex }}
                onClick={() => onColorChange(color.id)}
                title={`${color.label}: ${color.ppm.toFixed(1)} ppm`}
                aria-label={`${color.label}, ${color.ppm.toFixed(1)} ppm`}
              >
                <span>{color.label}</span>
                <small>{color.ppm.toFixed(1)} ppm</small>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

function MetricCard({
  icon,
  title,
  value,
  text,
  danger,
}) {
  return (
    <div
      className={`metric-card ${
        danger
          ? "danger-metric"
          : ""
      }`}
    >
      <div className="metric-icon">
        {icon}
      </div>

      <div>
        <p>{title}</p>

        <h2
          className={
            danger
              ? "risk-text"
              : ""
          }
        >
          {value}
        </h2>

        <small>{text}</small>
      </div>
    </div>
  );
}

/* =====================================================
   PROFILE PHOTO CONTROLS
===================================================== */

function ProfilePhotoControls({
  image,
  onCamera,
  onGallery,
  onDelete,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="profile-photo-controls">
      <div className="profile-image-preview">
        {image ? (
          <img
            src={image}
            alt="Profile preview"
          />
        ) : (
          <span>👷</span>
        )}

        <button
          type="button"
          className="photo-menu-toggle"
          aria-label="Profile picture options"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "×" : "⌄"}
        </button>
      </div>

      {menuOpen && (
        <div className="photo-action-buttons">
        <button
          type="button"
          className="photo-action-button camera-action"
          onClick={() => {
            setMenuOpen(false);
            onCamera();
          }}
        >
          📷 Open Camera
        </button>

        <label className="photo-action-button gallery-action">
          🖼️ Choose from Gallery

          <input
            type="file"
            accept="image/*"
            onChange={onGallery}
            hidden
          />
        </label>

        <button
          type="button"
          className="photo-action-button delete-action"
          onClick={() => {
            setMenuOpen(false);
            onDelete();
          }}
          disabled={!image}
        >
          🗑️ Delete
        </button>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   EXPOSURE CHART
===================================================== */

function ExposureChart({
  data,
  labels,
  period,
}) {
  const max = Math.max(...data);

  return (
    <div
      className={`chart-container chart-${period}`}
    >
      <div className="chart-bars">
        {data.map(
          (value, index) => (
            <div
              className="bar-group"
              key={index}
            >
              <div
                className="chart-bar"
                style={{
                  height: `${
                    (value / max) *
                    220
                  }px`,
                  animationDelay: `${
                    index * 0.08
                  }s`,
                }}
                title={`${value} ppm`}
              >
                <span>{value}</span>
              </div>

              <small
                className="chart-label"
                title={labels[index]}
              >
                {labels[index]}
              </small>
            </div>
          )
        )}
      </div>

      <div className="chart-period-note">
        {period === "day" &&
          "Time of day"}

        {period === "week" &&
          "Days of the week"}

        {period === "month" &&
          "Days of the month"}
      </div>
    </div>
  );
}

function AdminStat({
  icon,
  value,
  label,
  danger,
}) {
  return (
    <div
      className={`admin-stat ${
        danger
          ? "danger-stat"
          : ""
      }`}
    >
      <span>{icon}</span>

      <div>
        <strong>{value}</strong>

        <p>{label}</p>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}) {
  return (
    <div className="detail-item">
      <span>{label}</span>

      <strong>{value}</strong>
    </div>
  );
}