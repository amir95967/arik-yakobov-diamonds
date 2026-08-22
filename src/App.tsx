import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import { 
  Gem, ShieldCheck, Award, 
  Plus, Trash2, Edit3, MapPin, Clock, Upload, 
  Lock, X, Phone,
  FileText, ChevronDown, Menu,
  Eye, Type, Contrast, ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';

const WhatsAppIcon = ({ className = "w-5 h-5 text-white" }: { className?: string }) => (
  <svg viewBox="0 0 32 32" className={className} fill="currentColor">
    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.72.78 5.27 2.13 7.43L2.24 29.5l6.32-1.85C10.61 28.87 13.22 29.67 16 29.67c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.33c-2.42 0-4.69-.7-6.62-1.92l-.47-.3-3.75 1.1 1.12-3.66-.32-.49A11.59 11.59 0 0 1 4.33 16C4.33 9.57 9.57 4.33 16 4.33S27.67 9.57 27.67 16 22.43 27.33 16 27.33zm6.47-8.38c-.35-.18-2.09-1.03-2.41-1.15-.32-.12-.56-.18-.8.18s-.92 1.15-1.13 1.39c-.21.24-.42.27-.77.09-.35-.18-1.49-.55-2.83-1.75-1.05-.93-1.75-2.09-1.96-2.44-.21-.35-.02-.54.15-.72.16-.16.35-.42.53-.63.18-.21.24-.35.35-.59.12-.24.06-.44-.03-.62s-.8-1.92-1.1-2.63c-.29-.69-.58-.6-.8-.61h-.68c-.24 0-.62.09-.94.44s-1.24 1.21-1.24 2.95 1.27 3.42 1.45 3.66c.18.24 2.5 3.82 6.06 5.35.85.37 1.51.58 2.02.75.85.27 1.63.23 2.24.14.69-.1 2.09-.85 2.38-1.68.29-.82.29-1.53.2-1.68-.08-.14-.32-.23-.67-.41z"/>
  </svg>
);

const InstagramIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r=".5" fill="currentColor" />
  </svg>
);

const AccessibilityIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="4.5" r="2.5"/>
    <path d="m4.5 9 7.5 1.5L19.5 9"/>
    <path d="M12 10.5V16l-3.5 5"/>
    <path d="m12 16 3.5 5"/>
  </svg>
);

interface DiamondProduct {
  id: string;
  sku: string;
  title: string;
  category: 'engagement' | 'loose' | 'tennis' | 'earrings' | 'high_jewelry';
  shape: 'Round' | 'Oval' | 'Emerald' | 'Radiant' | 'Cushion' | 'Pear' | 'Princess';
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  image: string;
  certificate: string;
}

const PHONE_NUMBER = "972544847078";
const DISPLAY_PHONE = "054-484-7078";
const OFFICE_ADDRESS = "בורסת היהלומים, בניין שמשון, ז'בוטינסקי 1, רמת גן";

const INITIAL_PRODUCTS: DiamondProduct[] = [
  {
    id: '1',
    sku: 'AY-ENG-101',
    title: 'טבעת אירוסין סוליטר 1.50 קראט זהב צהוב 18K',
    category: 'engagement',
    shape: 'Round',
    carat: 1.50,
    color: 'D',
    clarity: 'VVS1',
    cut: 'Triple Excellent',
    price: 38000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85',
    certificate: 'GIA'
  },
  {
    id: '2',
    sku: 'AY-ENG-102',
    title: 'טבעת אירוסין היילו אובל משובצת יהלומי צד',
    category: 'engagement',
    shape: 'Oval',
    carat: 2.01,
    color: 'E',
    clarity: 'VS1',
    cut: 'Excellent',
    price: 68000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    certificate: 'GIA'
  },
  {
    id: '3',
    sku: 'AY-TEN-201',
    title: 'צמיד טניס יוקרתי 4 שיניים 5.00 קראט סה״כ',
    category: 'tennis',
    shape: 'Round',
    carat: 5.00,
    color: 'F',
    clarity: 'VS',
    cut: 'Excellent',
    price: 29000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85',
    certificate: 'IGI'
  },
  {
    id: '4',
    sku: 'AY-ENG-103',
    title: 'טבעת אירוסין אמרלד Cut בעיצוב נקי',
    category: 'engagement',
    shape: 'Emerald',
    carat: 1.80,
    color: 'D',
    clarity: 'VVS2',
    cut: 'Excellent',
    price: 54000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=1000&q=85',
    certificate: 'GIA'
  },
  {
    id: '5',
    sku: 'AY-LOOSE-301',
    title: 'יהלום משוחרר רדיאנט 3.05 קראט תעודת GIA',
    category: 'loose',
    shape: 'Radiant',
    carat: 3.05,
    color: 'E',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: 115000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=85',
    certificate: 'GIA'
  },
  {
    id: '6',
    sku: 'AY-EAR-401',
    title: 'עגילי צמודים יהלומים 2.00 קראט סה״כ בזהב לבן 18K',
    category: 'earrings',
    shape: 'Round',
    carat: 2.00,
    color: 'D',
    clarity: 'VS1',
    cut: 'Triple Excellent',
    price: 24000,
    status: 'available',
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=1000&q=85',
    certificate: 'GIA'
  }
];

export default function App() {
  type AuthStep = 'credentials' | 'enroll_qr' | 'verify_code';

  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('credentials');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [isAccessibilityStatementOpen, setIsAccessibilityStatementOpen] = useState(false);

  const [fontSizeOffset, setFontSizeOffset] = useState(0);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscaleMode, setGrayscaleMode] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [readableFont, setReadableFont] = useState(false);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const checkAdminRoute = () => {
      const isPathAdmin = window.location.pathname.toLowerCase().endsWith('/admin') || 
                          window.location.hash.toLowerCase() === '#/admin' ||
                          window.location.hash.toLowerCase() === '#admin';
      setIsAdminRoute(isPathAdmin);
    };

    checkAdminRoute();
    window.addEventListener('popstate', checkAdminRoute);
    window.addEventListener('hashchange', checkAdminRoute);
    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
    };
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsAdminAuthenticated(false);
        return;
      }

      const { data: mfaData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (mfaData && mfaData.currentLevel === 'aal2') {
        setIsAdminAuthenticated(true);
      } else if (mfaData && mfaData.nextLevel !== 'aal2') {
        setIsAdminAuthenticated(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setIsAdminAuthenticated(false);
        setAuthStep('credentials');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const [products, setProducts] = useState<DiamondProduct[]>(INITIAL_PRODUCTS);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error loading products from Supabase:', err);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<DiamondProduct | null>(null);
  const [editingProduct, setEditingProduct] = useState<DiamondProduct | null>(null);

  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    sku: '',
    title: '',
    category: 'engagement' as 'engagement' | 'loose' | 'tennis' | 'earrings' | 'high_jewelry',
    shape: 'Round' as 'Round' | 'Oval' | 'Emerald' | 'Radiant' | 'Cushion' | 'Pear' | 'Princess',
    carat: '',
    color: 'D',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: '',
    certificate: 'GIA',
    status: 'available' as 'available' | 'reserved' | 'sold'
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      let imageUrl = editingProduct.image;

      // העלאת תמונה חדשה אם נבחר קובץ
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `edit_${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage
            .from('product-images')
            .getPublicUrl(fileName);
          imageUrl = data.publicUrl;
        }
      }

      const { error } = await supabase
        .from('products')
        .update({
          sku: editingProduct.sku,
          title: editingProduct.title,
          category: editingProduct.category,
          shape: editingProduct.shape,
          carat: parseFloat(String(editingProduct.carat)) || 1.0,
          color: editingProduct.color,
          clarity: editingProduct.clarity,
          cut: editingProduct.cut,
          price: parseFloat(String(editingProduct.price)) || 0,
          status: editingProduct.status,
          certificate: editingProduct.certificate || 'GIA',
          image: imageUrl
        })
        .eq('id', editingProduct.id);

      if (error) {
        console.error('Supabase update error:', error);
        alert(`שגיאה בעדכון הפריט: ${error.message}`);
      } else {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...editingProduct, image: imageUrl } : p));
        setEditingProduct(null);
        setUploadedImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        alert('הפריט עודכן בהצלחה!');
      }
    } catch (err: any) {
      console.error(err);
      alert('שגיאה בעדכון הפריט');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAuth(true);
    setLoginError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailInput.trim(),
        password: passwordInput,
      });

      if (error || !data.user) {
        setLoginError('אימייל או סיסמה שגויים');
        setIsLoadingAuth(false);
        return;
      }

      const { data: factorsData } = await supabase.auth.mfa.listFactors();
      const verifiedTotp = factorsData?.totp[0];

      if (verifiedTotp) {
        setMfaFactorId(verifiedTotp.id);
        setAuthStep('verify_code');
      } else {
        const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          issuer: 'Arik Yakobov Admin',
        });

        if (enrollError || !enrollData) {
          setLoginError('שגיאה ביצירת מפתח 2FA');
        } else {
          setMfaFactorId(enrollData.id);
          setQrCodeUrl(enrollData.totp.qr_code);
          setAuthStep('enroll_qr');
        }
      }
    } catch (err) {
      setLoginError('אירעה שגיאה בחיבור לשרת');
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const handleVerifyEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaFactorId || !verifyCode) return;
    setIsLoadingAuth(true);
    setLoginError('');

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: mfaFactorId,
      code: verifyCode.trim(),
    });

    if (error) {
      setLoginError('קוד אימות שגוי, נסה שוב');
    } else {
      setIsAdminAuthenticated(true);
      setAuthStep('credentials');
      setVerifyCode('');
      setEmailInput('');
      setPasswordInput('');
    }
    setIsLoadingAuth(false);
  };

  const handleVerifyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaFactorId || !verifyCode) return;
    setIsLoadingAuth(true);
    setLoginError('');

    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: mfaFactorId,
      code: verifyCode.trim(),
    });

    if (error) {
      setLoginError('קוד 2FA שגוי, נסה שוב');
    } else {
      setIsAdminAuthenticated(true);
      setAuthStep('credentials');
      setVerifyCode('');
      setEmailInput('');
      setPasswordInput('');
    }
    setIsLoadingAuth(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminAuthenticated(false);
    setAuthStep('credentials');
    setVerifyCode('');
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.sku || !newProduct.title || !newProduct.price) {
      alert('נא למלא את כל שדות החובה');
      return;
    }

    let imageUrl = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85';

    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }
    }

    const { data, error } = await supabase.from('products').insert([
      {
        sku: newProduct.sku,
        title: newProduct.title,
        category: newProduct.category,
        shape: newProduct.shape,
        carat: parseFloat(newProduct.carat) || 1.0,
        color: newProduct.color,
        clarity: newProduct.clarity,
        cut: newProduct.cut,
        price: parseFloat(newProduct.price),
        status: newProduct.status,
        certificate: newProduct.certificate || 'GIA',
        image: imageUrl
      }
    ]).select();

    if (error) {
      console.error(error);
      alert('שגיאה בשמירת הפריט ב-Supabase');
    } else if (data) {
      setProducts(prev => [data[0], ...prev]);
      setNewProduct({
        sku: '',
        title: '',
        category: 'engagement',
        shape: 'Round',
        carat: '',
        color: 'D',
        clarity: 'VVS1',
        cut: 'Excellent',
        price: '',
        certificate: 'GIA',
        status: 'available'
      });
      setUploadedImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      alert('הפריט נוסף ונשמר בהצלחה ב-Supabase!');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('האם למחוק פריט זה מהאתר?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(error);
      alert('שגיאה במחיקת הפריט');
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleStatusChange = async (id: string, status: 'available' | 'reserved' | 'sold') => {
    const { error } = await supabase
      .from('products')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error(error);
    } else {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    }
  };

  const resetAccessibility = () => {
    setFontSizeOffset(0);
    setHighContrast(false);
    setGrayscaleMode(false);
    setHighlightLinks(false);
    setReadableFont(false);
  };

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchShape = selectedShape === 'all' || p.shape === selectedShape;
    return matchCategory && matchShape && p.status !== 'sold';
  });

  const getWhatsAppLink = (product?: DiamondProduct) => {
    const text = product 
      ? `שלום, אני מתעניין בפריט: ${product.title} (מק"ט: ${product.sku}, ${product.carat} קראט, ₪${product.price.toLocaleString()}). אשמח לקבל פרטים נוספים ולתאם הגעה למשרד בבורסת היהלומים.`
      : `שלום, אשמח לקבל פרטים נוספים ולתאם פגישה במשרד בבורסת היהלומים.`;
    return `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const accessibilityClasses = `
    ${highContrast ? 'contrast-150 brightness-95 bg-white text-black' : ''}
    ${grayscaleMode ? 'grayscale' : ''}
    ${highlightLinks ? '[&_a]:underline [&_a]:font-bold [&_a]:text-blue-900' : ''}
    ${readableFont ? 'font-sans' : ''}
  `;

  // --- תצוגת פאנל ניהול (נתיב /admin) ---
  if (isAdminRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1B18] font-sans antialiased" dir="rtl">
        <header className="border-b border-[#EDE6DC] bg-white px-4 sm:px-8 py-4 sm:py-5 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F4EFE6] border border-[#D5C7B2] flex items-center justify-center">
              <Gem className="w-5 h-5 text-[#9E8255]" />
            </div>
            <span className="font-serif font-bold text-sm sm:text-lg text-[#1C1A17]">Arik Yakobov • מרכז ניהול</span>
          </div>
          <button
            onClick={() => {
              window.location.hash = '';
              setIsAdminRoute(false);
            }}
            className="px-4 py-2 text-xs rounded-full bg-[#1C1A17] text-white hover:bg-[#332F2A] font-semibold transition-colors"
          >
            חזרה לאתר
          </button>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 w-full space-y-6 sm:space-y-8">
          {!isAdminAuthenticated ? (
            <div className="max-w-md mx-auto my-10 sm:my-20 p-5 sm:p-8 rounded-3xl bg-white border border-[#EDE6DC] shadow-xl text-center space-y-5">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#9E8255]">
                <Lock className="w-6 h-6" />
              </div>

              {authStep === 'credentials' && (
                <>
                  <h2 className="text-xl font-serif font-bold text-[#1C1A17]">כניסת מנהל מערכת</h2>
                  <p className="text-xs text-[#8C8275]">הזן אימייל וסיסמה כדי להמשיך</p>

                  <form onSubmit={handleLogin} className="space-y-3.5 text-right">
                    <div>
                      <label className="block text-xs font-semibold text-[#575047] mb-1">אימייל מנהל</label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@example.com"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] text-sm focus:outline-none focus:border-[#9E8255]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#575047] mb-1">סיסמה</label>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] text-sm focus:outline-none focus:border-[#9E8255]"
                      />
                    </div>

                    {loginError && <p className="text-xs text-red-600 font-semibold text-center">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3 rounded-xl bg-[#1C1A17] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#332F2A] transition-colors disabled:opacity-50 cursor-pointer mt-2"
                    >
                      {isLoadingAuth ? 'בודק פרטים...' : 'המשך'}
                    </button>
                  </form>
                </>
              )}

              {authStep === 'enroll_qr' && (
                <>
                  <h2 className="text-xl font-serif font-bold text-[#1C1A17]">הגדרת אימות דו-שלבי (2FA)</h2>
                  <p className="text-xs text-[#8C8275] leading-relaxed">
                    סרוק את הברקוד באפליקציית האימות שלך (Google / Microsoft Authenticator) והזן את 6 הספרות לאישור.
                  </p>

                  {qrCodeUrl && (
                    <div className="flex justify-center p-3 bg-white border border-[#EDE6DC] rounded-2xl max-w-[200px] mx-auto shadow-xs">
                      <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-auto" />
                    </div>
                  )}

                  <form onSubmit={handleVerifyEnroll} className="space-y-3.5">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="123456"
                      dir="ltr"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] text-center text-lg font-mono tracking-widest focus:outline-none focus:border-[#9E8255]"
                    />

                    {loginError && <p className="text-xs text-red-600 font-semibold">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3 rounded-xl bg-[#1C1A17] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#332F2A] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isLoadingAuth ? 'מאמת ומפעיל...' : 'הפעל 2FA והיכנס'}
                    </button>
                  </form>
                </>
              )}

              {authStep === 'verify_code' && (
                <>
                  <h2 className="text-xl font-serif font-bold text-[#1C1A17]">אימות דו-שלבי</h2>
                  <p className="text-xs text-[#8C8275]">הזן את קוד 6 הספרות מאפליקציית ה-Authenticator שלך</p>

                  <form onSubmit={handleVerifyLogin} className="space-y-3.5">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="123456"
                      dir="ltr"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] text-center text-lg font-mono tracking-widest focus:outline-none focus:border-[#9E8255]"
                    />

                    {loginError && <p className="text-xs text-red-600 font-semibold">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3 rounded-xl bg-[#1C1A17] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#332F2A] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isLoadingAuth ? 'מאמת...' : 'כניסה'}
                    </button>
                  </form>
                </>
              )}
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EDE6DC] pb-4">
                <h1 className="text-xl sm:text-2xl font-serif font-bold">ניהול מלאי ותמונות</h1>
                <button
                  onClick={handleLogout}
                  className="text-xs px-3.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2] hover:bg-[#EDE6DC] font-semibold cursor-pointer"
                >
                  התנתק
                </button>
              </div>

              {/* טופס הוספה */}
              <div className="p-4 sm:p-6 rounded-2xl bg-white border border-[#EDE6DC] space-y-4">
                <h2 className="text-lg font-serif font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-[#9E8255]" />
                  הוספת מוצר חדש
                </h2>
                <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">מק"ט *</label>
                    <input
                      type="text"
                      required
                      placeholder="AY-ENG-107"
                      value={newProduct.sku}
                      onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-1 font-semibold text-[#575047]">כותרת הפריט *</label>
                    <input
                      type="text"
                      required
                      placeholder="טבעת אירוסין סוליטר 2.00 קראט"
                      value={newProduct.title}
                      onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">קטגוריה</label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      <option value="engagement">טבעות אירוסין</option>
                      <option value="loose">יהלומים משוחררים</option>
                      <option value="tennis">צמידי טניס</option>
                      <option value="earrings">עגילים</option>
                      <option value="high_jewelry">תכשיטי יוקרה</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">צורת ליטוש</label>
                    <select
                      value={newProduct.shape}
                      onChange={e => setNewProduct({ ...newProduct, shape: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      <option value="Round">Round</option>
                      <option value="Oval">Oval</option>
                      <option value="Emerald">Emerald</option>
                      <option value="Radiant">Radiant</option>
                      <option value="Cushion">Cushion</option>
                      <option value="Pear">Pear</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">קראט</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="1.50"
                      value={newProduct.carat}
                      onChange={e => setNewProduct({ ...newProduct, carat: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">מחיר (₪) *</label>
                    <input
                      type="number"
                      required
                      placeholder="45000"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">תעודה</label>
                    <input
                      type="text"
                      placeholder="GIA"
                      value={newProduct.certificate}
                      onChange={e => setNewProduct({ ...newProduct, certificate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 p-4 rounded-xl bg-[#FAF8F5] border-2 border-dashed border-[#D5C7B2] text-center">
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={(e) => handleImageUpload(e)}
                      className="hidden"
                      id="file-upload-input"
                    />
                    {uploadedImagePreview ? (
                      <div className="relative inline-block">
                        <img src={uploadedImagePreview} alt="Preview" className="h-28 w-28 object-cover rounded-xl border border-[#D5C7B2]" />
                        <button
                          type="button"
                          onClick={() => { setUploadedImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                          className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <label htmlFor="file-upload-input" className="cursor-pointer flex flex-col items-center gap-1">
                        <Upload className="w-5 h-5 text-[#9E8255]" />
                        <span className="font-semibold text-[#1C1A17]">העלאת תמונת מוצר מהמחשב/טלפון</span>
                      </label>
                    )}
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4">
                    <button type="submit" className="px-6 py-2.5 bg-[#1C1A17] text-white rounded-xl font-semibold hover:bg-[#332F2A] transition-colors">
                      שמור מוצר
                    </button>
                  </div>
                </form>
              </div>

              {/* טבלת פריטים בדסקטופ */}
              <div className="hidden md:block p-4 sm:p-6 rounded-2xl bg-white border border-[#EDE6DC] overflow-x-auto">
                <table className="min-w-[680px] w-full text-right text-xs">
                  <thead className="border-b border-[#EDE6DC] text-[#8C8275]">
                    <tr>
                      <th className="pb-3 px-2">תמונה</th>
                      <th className="pb-3 px-2">מק"ט וכותרת</th>
                      <th className="pb-3 px-2">צורה וקראט</th>
                      <th className="pb-3 px-2">מחיר</th>
                      <th className="pb-3 px-2">סטטוס</th>
                      <th className="pb-3 px-2 text-center">פעולות</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4EFE6]">
                    {products.map(p => (
                      <tr key={p.id}>
                        <td className="py-2.5 px-2">
                          <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-[#F4EFE6]" />
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="font-bold text-[#1C1A17]">{p.title}</div>
                          <div className="text-[10px] text-[#8C8275]">{p.sku}</div>
                        </td>
                        <td className="py-2.5 px-2">{p.shape} • {p.carat}ct</td>
                        <td className="py-2.5 px-2 font-bold">₪{p.price.toLocaleString()}</td>
                        <td className="py-2.5 px-2">
                          <select
                            value={p.status}
                            onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                            className="px-2 py-1 rounded bg-[#FAF8F5] border border-[#D5C7B2]"
                          >
                            <option value="available">זמין</option>
                            <option value="reserved">שמור</option>
                            <option value="sold">נמכר</option>
                          </select>
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setUploadedImagePreview(p.image);
                              }}
                              className="p-1.5 text-[#9E8255] hover:bg-[#F4EFE6] rounded-lg transition-colors cursor-pointer"
                              title="ערוך פריט"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer" title="מחק פריט">
                            <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* כרטיסי פריטים במובייל */}
              <div className="md:hidden space-y-3">
                {products.map(p => (
                  <article key={p.id} className="p-4 rounded-2xl bg-white border border-[#EDE6DC] shadow-xs space-y-3">
                    <div className="flex items-start gap-3">
                      <img src={p.image} alt={p.title} className="w-16 h-16 rounded-xl object-cover bg-[#F4EFE6] shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-sm leading-snug break-words text-[#1C1A17]">{p.title}</h3>
                        <p className="text-[10px] text-[#8C8275] mt-1">{p.sku}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EDE6DC]">
                        <span className="block text-[10px] text-[#8C8275]">צורה וקראט</span>
                        <span className="font-semibold">{p.shape} • {p.carat}ct</span>
                      </div>
                      <div className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EDE6DC]">
                        <span className="block text-[10px] text-[#8C8275]">מחיר</span>
                        <span className="font-bold">₪{p.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-1">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value as DiamondProduct['status'])}
                        className="min-w-0 flex-1 px-2.5 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2] text-xs"
                        aria-label={`סטטוס ${p.title}`}
                      >
                        <option value="available">זמין</option>
                        <option value="reserved">שמור</option>
                        <option value="sold">נמכר</option>
                      </select>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => { setEditingProduct(p); setUploadedImagePreview(p.image); }}
                          className="p-2 text-[#9E8255] hover:bg-[#F4EFE6] rounded-lg transition-colors cursor-pointer"
                          title="ערוך פריט"
                          aria-label={`ערוך ${p.title}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="מחק פריט"
                          aria-label={`מחק ${p.title}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}

          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white border border-[#EDE6DC] rounded-3xl max-w-2xl w-full p-5 sm:p-6 md:p-8 space-y-5 relative shadow-2xl max-h-[calc(100vh-2rem)] overflow-y-auto">
                <div className="flex items-start justify-between gap-3 border-b border-[#EDE6DC] pb-4">
                  <div className="flex items-center gap-2 min-w-0">
                    <Edit3 className="w-5 h-5 text-[#9E8255] shrink-0" />
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1A17] break-words">עריכת פריט: {editingProduct.sku}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setUploadedImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 rounded-full hover:bg-[#FAF8F5] cursor-pointer shrink-0"
                    aria-label="סגור עריכה"
                  >
                    <X className="w-5 h-5 text-[#8C8275]" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">מק"ט</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.sku}
                      onChange={e => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">מחיר (₪)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block mb-1 font-semibold text-[#575047]">כותרת הפריט</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.title}
                      onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">קטגוריה</label>
                    <select
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as DiamondProduct['category'] })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      <option value="engagement">טבעות אירוסין</option>
                      <option value="loose">יהלומים משוחררים</option>
                      <option value="tennis">צמידי טניס</option>
                      <option value="earrings">עגילים</option>
                      <option value="high_jewelry">תכשיטי יוקרה</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">צורת ליטוש</label>
                    <select
                      value={editingProduct.shape}
                      onChange={e => setEditingProduct({ ...editingProduct, shape: e.target.value as DiamondProduct['shape'] })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      <option value="Round">Round</option>
                      <option value="Oval">Oval</option>
                      <option value="Emerald">Emerald</option>
                      <option value="Radiant">Radiant</option>
                      <option value="Cushion">Cushion</option>
                      <option value="Pear">Pear</option>
                      <option value="Princess">Princess</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">משקל קראט</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.carat}
                      onChange={e => setEditingProduct({ ...editingProduct, carat: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">צבע</label>
                    <input
                      type="text"
                      value={editingProduct.color}
                      onChange={e => setEditingProduct({ ...editingProduct, color: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">ניקיון</label>
                    <input
                      type="text"
                      value={editingProduct.clarity}
                      onChange={e => setEditingProduct({ ...editingProduct, clarity: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">חיתוך</label>
                    <input
                      type="text"
                      value={editingProduct.cut}
                      onChange={e => setEditingProduct({ ...editingProduct, cut: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">תעודה</label>
                    <input
                      type="text"
                      value={editingProduct.certificate}
                      onChange={e => setEditingProduct({ ...editingProduct, certificate: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">סטטוס</label>
                    <select
                      value={editingProduct.status}
                      onChange={e => setEditingProduct({ ...editingProduct, status: e.target.value as DiamondProduct['status'] })}
                      className="w-full px-3 py-2 rounded-lg bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      <option value="available">זמין</option>
                      <option value="reserved">שמור</option>
                      <option value="sold">נמכר</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 p-3 bg-[#FAF8F5] border border-[#EDE6DC] rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={uploadedImagePreview || editingProduct.image}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-[#D5C7B2] shrink-0"
                      />
                      <span className="text-[11px] text-[#575047]">תמונה נוכחית</span>
                    </div>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        id="edit-file-upload-input"
                      />
                      <label htmlFor="edit-file-upload-input" className="block text-center px-3 py-2 bg-[#1C1A17] text-white rounded-lg cursor-pointer text-[11px] font-semibold hover:bg-[#332F2A]">
                        החלף תמונה
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-3 border-t border-[#EDE6DC]">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setUploadedImagePreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="px-4 py-2 bg-[#EFE9DF] text-[#1C1A17] rounded-xl font-semibold hover:bg-[#E5DDCF]"
                    >
                      ביטול
                    </button>
                    <button type="submit" className="px-5 py-2 bg-[#1C1A17] text-white rounded-xl font-semibold hover:bg-[#332F2A]">
                      שמור שינויים
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // --- תצוגת האתר הראשית ---
  return (
    <div 
      className={`min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1B18] antialiased selection:bg-[#E8DFC8] selection:text-[#1E1B18] relative overflow-x-hidden ${accessibilityClasses}`} 
      style={{ fontSize: `${100 + fontSizeOffset * 10}%` }}
      dir="rtl"
    >
      
      {/* תמונת רקע קבועה מלאה (Full-Screen Luxury Background) */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 bg-cover bg-center bg-no-repeat opacity-[0.12] mix-blend-multiply"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=2560&q=85')` }}
      />

      {/* Top Header Strip - טקסט רץ אלגנטי */}
      <div className="bg-[#EFE9DF] border-b border-[#E3DACB] text-[#6E6457] py-2.5 overflow-hidden relative z-10">
        <div className="flex items-center justify-center gap-8 whitespace-nowrap text-xs font-medium tracking-wide">
          <div className="flex items-center gap-2">
            <Gem className="w-3.5 h-3.5 text-[#9E8255]" />
            <span>בורסת היהלומים, בניין שמשון, רמת גן</span>
          </div>
          <span className="text-[#C5BAAA]">•</span>
          <div className="flex items-center gap-2">
            <Gem className="w-3.5 h-3.5 text-[#9E8255]" />
            <span>פגישות  בתיאום מראש בלבד</span>
          </div>
          <span className="text-[#C5BAAA]">•</span>
          <div className="flex items-center gap-2">
            <Gem className="w-3.5 h-3.5 text-[#9E8255]" />
            <span>טלפון: {DISPLAY_PHONE}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EDE6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-[#D5C7B2] bg-[#F4EFE6] flex items-center justify-center shadow-xs">
              <Gem className="w-5 h-5 text-[#9E8255]" />
            </div>
            <span className="font-serif tracking-[0.08em] sm:tracking-[0.15em] text-sm sm:text-xl font-bold uppercase text-[#1C1A17] block leading-none">
              Arik Yakobov
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-wider font-semibold text-[#575047]">
            <button onClick={() => scrollToSection('catalog')} className="hover:text-[#9E8255] transition-colors cursor-pointer">קולקציה</button>
            <button onClick={() => scrollToSection('guide')} className="hover:text-[#9E8255] transition-colors cursor-pointer">היהלום המושלם</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-[#9E8255] transition-colors cursor-pointer">אודות</button>
            <button onClick={() => scrollToSection('faq')} className="hover:text-[#9E8255] transition-colors cursor-pointer">שאלות נפוצות</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[#9E8255] transition-colors cursor-pointer">יצירת קשר</button>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(prev => !prev)}
              className="md:hidden w-10 h-10 rounded-full bg-[#EFE9DF] text-[#1C1A17] flex items-center justify-center shadow-sm cursor-pointer"
              aria-label={isMobileMenuOpen ? 'סגור תפריט ניווט' : 'פתח תפריט ניווט'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center shadow-md transition-all"
              title="WhatsApp"
            >
              <WhatsAppIcon className="w-5 h-5 text-white" />
            </a>
            <a
              href="https://www.instagram.com/arik.diamonds/"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-full bg-[#E9DFD2] hover:bg-[#DCCDBB] text-[#1C1A17] flex items-center justify-center shadow-md transition-all"
              title="Instagram"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a 
              href={`tel:${PHONE_NUMBER}`}
              className="w-10 h-10 rounded-full bg-[#1C1A17] hover:bg-[#332F2A] text-white flex items-center justify-center shadow-md transition-all"
              title="טלפון"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-[#EDE6DC] bg-[#FAF8F5] px-4 py-3 space-y-1 text-sm font-semibold text-[#575047]">
            {[
              { label: 'קולקציה', id: 'catalog' },
              { label: 'היהלום המושלם', id: 'guide' },
              { label: 'אודות', id: 'about' },
              { label: 'שאלות נפוצות', id: 'faq' },
              { label: 'יצירת קשר', id: 'contact' }
            ].map(item => (
              <button
                key={item.id}
                type="button"
                onClick={() => { scrollToSection(item.id); setIsMobileMenuOpen(false); }}
                className="w-full text-right px-3 py-2.5 rounded-lg hover:bg-[#EFE9DF] hover:text-[#9E8255] transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      {/* Hero Section עם רקע יהלומים מלא */}
      <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-6 border-b border-[#EDE6DC] text-center overflow-hidden z-10">
        
        {/* תמונת רקע ייעודית באיכות גבוהה */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=2000&q=90" 
            alt="Diamonds Macro Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF8F5]/85 via-[#FAF8F5]/70 to-[#FAF8F5]" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9DF]/90 border border-[#DFCDB7] text-[#8C7355] text-xs font-semibold tracking-wider uppercase backdrop-blur-xs">
            <Gem className="w-3.5 h-3.5 text-[#9E8255]" />
            <span> Israel Diamond Exchange</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-[#1C1A17] leading-tight">
            Arik Yakobov
          </h1>

          <p className="max-w-xl mx-auto text-[#665E54] text-sm md:text-base font-light leading-relaxed">
            ייצור תכשיטים בעיצוב אישי, יהלומי Lab & Natural, טבעות אירוסין ותכשיטי יוקרה ישירות ממתחם בורסת היהלומים הישראלית ברמת גן.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
            <button 
              type="button"
              onClick={() => scrollToSection('catalog')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1C1A17] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#332F2A] transition-all shadow-md cursor-pointer"
            >
              לצפייה בקולקציה
            </button>
            <a 
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center shadow-md transition-all"
              title="WhatsApp"
            >
              <WhatsAppIcon className="w-6 h-6 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* Catalog & Filters */}
      <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 flex-1 w-full space-y-8 sm:space-y-10 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EDE6DC] pb-6">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-[#1C1A17]">קולקציית תכשיטים ויהלומים</h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { label: 'הכל', value: 'all' },
              { label: 'טבעות אירוסין', value: 'engagement' },
              { label: 'יהלומים משוחררים', value: 'loose' },
              { label: 'צמידי טניס', value: 'tennis' },
              { label: 'עגילים', value: 'earrings' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setSelectedCategory(tab.value)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  selectedCategory === tab.value
                    ? 'bg-[#1C1A17] text-white'
                    : 'bg-[#EFE9DF] text-[#575047] hover:bg-[#E5DDCF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shape Filters */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <span className="text-xs font-semibold text-[#8C8275] shrink-0">חיתוך:</span>
          {['all', 'Round', 'Oval', 'Emerald', 'Radiant', 'Cushion', 'Pear'].map(shape => (
            <button
              key={shape}
              onClick={() => setSelectedShape(shape)}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                selectedShape === shape
                  ? 'bg-[#9E8255] text-white'
                  : 'bg-white border border-[#EDE6DC] text-[#575047] hover:bg-[#FAF8F5]'
              }`}
            >
              {shape === 'all' ? 'כל הצורות' : shape}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
          {filteredProducts.map((item) => (
            <div 
              key={item.id}
              className="group bg-white/95 backdrop-blur-xs border border-[#EDE6DC] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col shadow-xs"
            >
              <div className="relative aspect-square overflow-hidden bg-[#F4EFE6]">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-white/90 text-[#1C1A17] border border-[#EDE6DC]">
                  {item.certificate}
                </span>
              </div>

              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] text-[#8C8275] font-mono">{item.sku}</span>
                  <h3 className="text-base font-serif font-bold text-[#1C1A17] mt-0.5 leading-snug">{item.title}</h3>
                  
                  <div className="grid grid-cols-3 gap-2 my-3 p-2 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC] text-center text-xs">
                    <div>
                      <span className="text-[9px] text-[#8C8275] block">קראט</span>
                      <span className="font-bold">{item.carat}ct</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#8C8275] block">צבע</span>
                      <span className="font-bold text-[#9E8255]">{item.color}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-[#8C8275] block">ניקיון</span>
                      <span className="font-bold text-[#9E8255]">{item.clarity}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EDE6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-[#8C8275] block">מחיר</span>
                    <span className="text-base font-serif font-bold text-[#1C1A17]">₪{item.price.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setSelectedProduct(item)}
                      className="px-3.5 py-2 rounded-full bg-[#EFE9DF] text-[#1C1A17] text-xs font-semibold hover:bg-[#1C1A17] hover:text-white transition-colors cursor-pointer"
                    >
                      פרטים
                    </button>
                    <a
                      href={getWhatsAppLink(item)}
                      target="_blank"
                      rel="noreferrer"
                      className="w-8 h-8 rounded-full bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center shadow-sm transition-all"
                      title="WhatsApp"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* מדריך ה-4Cs עם רקע יהלומים מלא ומעוצב */}
      <section id="guide" className="border-t border-b border-[#EDE6DC] bg-white/95 py-12 sm:py-20 px-4 sm:px-6 relative z-10 overflow-hidden">
        
        {/* תמונת רקע ברוחב מלא למדריך */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=2000&q=85" 
            alt="Diamonds Sparkle" 
            className="w-full h-full object-cover opacity-[0.12]"
          />
        </div>

        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 relative z-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-semibold tracking-widest text-[#9E8255] uppercase">מדריך מקצועי</span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1A17]">איך לבחור יהלום מושלם?</h2>
            <p className="text-xs text-[#665E54] max-w-xl mx-auto">ארבעת הפרמטרים הבינלאומיים של מכון GIA הקובעים את ערכו, איכותו ויופיו של היהלום.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5]/90 border border-[#EDE6DC] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#9E8255] font-bold font-serif">1</div>
              <h3 className="font-serif font-bold text-base text-[#1C1A17]">חיתוך (Cut)</h3>
              <p className="text-xs text-[#665E54] leading-relaxed">הפרמטר החשוב ביותר להחזרת האור והנצנוץ. דירוג הליטוש מ-Excellent ועד Poor קובע את חדות וזוהר האבן.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5]/90 border border-[#EDE6DC] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#9E8255] font-bold font-serif">2</div>
              <h3 className="font-serif font-bold text-base text-[#1C1A17]">צבע (Color)</h3>
              <p className="text-xs text-[#665E54] leading-relaxed">דירוג עולמי הנע בין D (חסר צבע וטהור לחלוטין) ועד Z (גוון צהבהב). אנו מתמחים ביהלומים ברמות צבע D-F.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5]/90 border border-[#EDE6DC] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#9E8255] font-bold font-serif">3</div>
              <h3 className="font-serif font-bold text-base text-[#1C1A17]">ניקיון (Clarity)</h3>
              <p className="text-xs text-[#665E54] leading-relaxed">כמות הפגמים הפנימיים והחיצוניים הנבדקים בהגדלה של פי 10 (מ-FL/IF ועד SI). כל יהלומינו נקיים לעין בלתי מזוינת.</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#FAF8F5]/90 border border-[#EDE6DC] space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#F4EFE6] flex items-center justify-center text-[#9E8255] font-bold font-serif">4</div>
              <h3 className="font-serif font-bold text-base text-[#1C1A17]">קראט (Carat)</h3>
              <p className="text-xs text-[#665E54] leading-relaxed">יחידת המשקל של היהלום (1 קראט = 0.2 גרם). ניתן לשלב בין חיתוך אופטימלי לקראט מרשים לקבלת המראה המושלם.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About & Trust */}
      <section id="about" className="border-b border-[#EDE6DC] bg-[#F4EFE6]/90 py-12 sm:py-16 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#9E8255]" />
            <h4 className="font-serif font-bold text-lg text-[#1C1A17]">תעודות גמולוגיות GIA</h4>
            <p className="text-xs text-[#665E54]">כל יהלום נמסר עם חריטת לייזר מקורית ותעודה בינלאומית.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Award className="w-8 h-8 text-[#9E8255]" />
            <h4 className="font-serif font-bold text-lg text-[#1C1A17]">חבר בורסת היהלומים</h4>
            <p className="text-xs text-[#665E54]">סחר ישיר ללא פערי תיווך ממתחם הבורסה ברמת גן.</p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <Clock className="w-8 h-8 text-[#9E8255]" />
            <h4 className="font-serif font-bold text-lg text-[#1C1A17]">פגישה אישית בבורסה</h4>
            <p className="text-xs text-[#665E54]">התרשמות ובדיקה מקרוב בתיאום מראש.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-12 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full relative z-10">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-semibold tracking-widest text-[#9E8255] uppercase">שאלות נפוצות</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1A17]">שאלות ותשובות לקראת רכישה</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "כיצד מתבצעת הפגישה במתחם בורסת היהלומים?",
              a: "הפגישה מתקיימת בחדר עסקאות פרטי ומאובטח בבניין שמשון בבורסת היהלומים ברמת גן. במהלך הפגישה תוכלו לבחון מספר יהלומים תחת מיקרוסקופ וציוד גמולוגי מתקדם בליווי אישי ומקצועי."
            },
            {
              q: "האם היהלומים מגיעים עם תעודות גמולוגיות?",
              a: "כן, כל היהלומים המרכזיים נמסרים עם תעודה גמולוגית בינלאומית מקורית (בעיקר GIA או IGI), הכוללת חריטת לייזר מיקרוסקופית על גבי שפת היהלום (Girdle) התואמת בדיוק למספר התעודה."
            },
            {
              q: "האם ניתן לעצב תכשיט בהתאמה אישית מלאה?",
              a: "בהחלט. אנו מתמחים בייצור אישי של טבעות אירוסין ותכשיטי יוקרה לפי תקציב, סגנון ועיצוב מבוקש בזהב 14K או 18K (צהוב, לבן או ורוד)."
            },
            {
              q: "האם ניתן לבצע שינוי מידה לטבעת לאחר הרכישה?",
              a: "כן, התאמת מידה ראשונית לאחר הצעת הנישואין מתבצעת ללא עלות נוספת במעבדת הצורפות שלנו."
            }
          ].map((faq, idx) => (
            <div key={idx} className="bg-white/95 border border-[#EDE6DC] rounded-2xl overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-right flex items-start gap-3 justify-between font-serif font-bold text-sm text-[#1C1A17] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#9E8255] transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-xs text-[#665E54] leading-relaxed border-t border-[#FAF8F5] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact & Location */}
      <section id="contact" className="py-12 sm:py-16 px-4 sm:px-6 max-w-5xl mx-auto w-full relative z-10">
        <div className="bg-white/95 border border-[#EDE6DC] rounded-3xl p-5 sm:p-8 md:p-12 flex flex-col md:flex-row gap-6 sm:gap-8 items-stretch md:items-center justify-between shadow-sm">
          <div className="space-y-3">
            <span className="text-[10px] tracking-[0.2em] font-bold text-[#9E8255] uppercase block"></span>
            <h3 className="text-2xl font-serif font-bold text-[#1C1A17]">אריק יעקובוב</h3>
            <div className="space-y-2 text-xs text-[#665E54] pt-1">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#9E8255] shrink-0" />
                <span>{OFFICE_ADDRESS}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#9E8255] shrink-0" />
                <span dir="ltr">{DISPLAY_PHONE}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#9E8255] shrink-0" />
                <span>ימים א'-ה': 09:30 - 18:30 (בתיאום מראש בלבד)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
            <a 
              href={getWhatsAppLink()} 
              target="_blank" 
              rel="noreferrer"
              className="justify-center px-6 py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs flex items-center gap-2.5 shadow-md"
            >
              <WhatsAppIcon className="w-4 h-4 text-white" />
              <span>WhatsApp</span>
            </a>
            <a 
              href={`tel:${PHONE_NUMBER}`}
              className="justify-center px-6 py-3.5 rounded-full bg-[#1C1A17] hover:bg-[#332F2A] text-white font-semibold text-xs flex items-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>חיוג ישיר</span>
            </a>
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#EDE6DC] rounded-3xl max-w-lg w-full max-h-[calc(100vh-2rem)] overflow-y-auto p-5 sm:p-6 md:p-8 space-y-5 relative shadow-2xl">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 left-5 text-[#8C8275] hover:text-[#1C1A17] p-1.5 rounded-full bg-[#FAF8F5] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#9E8255]">
                <Gem className="w-6 h-6" />
              </div>
              <div className="min-w-0 pr-8">
                <h3 className="text-base sm:text-lg font-serif font-bold text-[#1C1A17] break-words">{selectedProduct.title}</h3>
                <span className="text-xs text-[#8C8275] font-mono">מק"ט: {selectedProduct.sku}</span>
              </div>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-[#EDE6DC] bg-[#FAF8F5]">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-full h-full object-cover" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs text-center">
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EDE6DC]">
                <span className="text-[10px] text-[#8C8275] block">משקל וצורה</span>
                <span className="font-bold">{selectedProduct.carat}ct • {selectedProduct.shape}</span>
              </div>
              <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#EDE6DC]">
                <span className="text-[10px] text-[#8C8275] block">צבע וניקיון</span>
                <span className="font-bold text-[#9E8255]">{selectedProduct.color} / {selectedProduct.clarity}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F4EFE6] border border-[#EDE6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-[#8C8275] block">מחיר</span>
                <span className="text-xl font-serif font-bold text-[#1C1A17]">₪{selectedProduct.price.toLocaleString()}</span>
              </div>
              <a
                href={getWhatsAppLink(selectedProduct)}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold text-xs flex items-center gap-2 shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4 text-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* מודאל תקנון */}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#EDE6DC] rounded-3xl max-w-2xl w-full max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl relative">
            <div className="p-4 sm:p-6 border-b border-[#EDE6DC] flex items-start gap-3 justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#9E8255]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1A17]">תקנון האתר ומדיניות משפטית</h3>
              </div>
              <button onClick={() => setIsTermsOpen(false)} className="p-1 rounded-full hover:bg-[#FAF8F5] cursor-pointer">
                <X className="w-5 h-5 text-[#8C8275]" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#575047] leading-relaxed break-words">
              <h4 className="font-bold text-sm text-[#1C1A17]">1. כללי</h4>
              <p>אתר זה מופעל ע"י אריק יעקובוב (להלן: "העסק"), הפועל במתחם בורסת היהלומים , רמת גן. הגלישה והשימוש באתר כפופים לתנאי תקנון זה.</p>

              <h4 className="font-bold text-sm text-[#1C1A17]">2. מחירי מוצרים וזמינות מלאי</h4>
              <p>מחירי היהלומים והתכשיטים נקבעים בהתאם למדדי שוק היהלומים העולמי ושערי המטבע. האתר משמש כקטלוג תצוגה. זמינות פריט ספציפי כפופה לבדיקת מלאי ואישור סופי מול מנהל המכירות.</p>

              <h4 className="font-bold text-sm text-[#1C1A17]">3. ביטול עסקאות והחזרות (בהתאם לחוק הגנת הצרכן)</h4>
              <p>ביטול עסקאות ייעשה בהתאם להוראות חוק הגנת הצרכן, התשמ"א-1981 ותקנות הגנת הצרכן (ביטול עסקה), התשע"א-2010. מובהר כי תכשיטים או יהלומים שיוצרו, נחתכו או שובצו בהתאמה אישית (Custom Made) לפי דרישות מיוחדות של הלקוח אינם ניתנים להחזרה או ביטול.</p>

              <h4 className="font-bold text-sm text-[#1C1A17]">4. תעודות גמולוגיות ואחריות</h4>
              <p>כל יהלום נמסר עם תעודה גמולוגית של מעבדה בינלאומית מוסמכת (GIA / IGI) בהתאם למפרט. התעודה מהווה אסמכתא בלעדית לתכונות האבן.</p>

              <h4 className="font-bold text-sm text-[#1C1A17]">5. שמירה על סודיות ופרטיות</h4>
              <p>פרטי יצירת קשר הנמסרים באתר או בוואטסאפ מיועדים לצורך תיאום פגישה ומענה לפניות בלבד ואינם מועברים לצדדים שלישיים.</p>
            </div>

            <div className="p-4 border-t border-[#EDE6DC] bg-[#FAF8F5] rounded-b-3xl text-left">
              <button onClick={() => setIsTermsOpen(false)} className="px-6 py-2 rounded-full bg-[#1C1A17] text-white text-xs font-semibold cursor-pointer">
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* מודאל הצהרת נגישות */}
      {isAccessibilityStatementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-[#EDE6DC] rounded-3xl max-w-2xl w-full max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl relative">
            <div className="p-4 sm:p-6 border-b border-[#EDE6DC] flex items-start gap-3 justify-between">
              <div className="flex items-center gap-2.5">
                <AccessibilityIcon className="w-5 h-5 text-[#9E8255]" />
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1A17]">הצהרת נגישות (תקן ת"י 5568 / AA)</h3>
              </div>
              <button onClick={() => setIsAccessibilityStatementOpen(false)} className="p-1 rounded-full hover:bg-[#FAF8F5] cursor-pointer">
                <X className="w-5 h-5 text-[#8C8275]" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#575047] leading-relaxed break-words">
              <p>עסק אריק יעקובוב רואה חשיבות עליונה בהנגשת האתר והמשרדים לאנשים עם מוגבלויות, מתוך שוויון זכויות וכבוד הדדי.</p>
              
              <h4 className="font-bold text-sm text-[#1C1A17]">התאמות הנגישות באתר האינטרנט</h4>
              <p>אתר זה נבנה בהתאם לתקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), תשע"ג-2013 ולהנחיות התקן הישראלי ת"י 5568 ברמת AA (המבוסס על הנחיות WCAG 2.1 בינלאומיות).</p>
              
              <ul className="list-disc pr-5 space-y-1.5">
                <li>התאמה מלאה לניווט באמצעות מקלדת (Tab, Enter, חיצים).</li>
                <li>ניגודיות צבעים מוקפדת המותאמת לקויי ראייה ועיוורי צבעים.</li>
                <li>סרגל נגישות המאפשר הגדלת גופנים, מצב ניגודיות גבוהה והדגשת קישורים.</li>
                <li>תמיכה בקוראי מסך וסמנטיקת HTML תקנית.</li>
              </ul>

              <h4 className="font-bold text-sm text-[#1C1A17]">הסדרי נגישות פיזיים במשרד המסחר</h4>
              <p>משרדנו בבניין שמשון בבורסת היהלומים ברמת גן כולל גישה נגישה מלאה לנכים:</p>
              <ul className="list-disc pr-5 space-y-1.5">
                <li>מעליות מונגשות לכסאות גלגלים מהחניון ומהכניסה הראשית.</li>
                <li>שירותי נכים מוסדרים בכל קומה במתחם הבורסה.</li>
                <li>כניסה מותרת עם חיות שירות.</li>
              </ul>

              <h4 className="font-bold text-sm text-[#1C1A17]">רכז הנגישות ופניות בנושא</h4>
              <p>אם נתקלתם בקושי בגלישה או שיש לכם הצעה לשיפור הנגישות, נשמח לעמוד לרשותכם:</p>
              <p><strong>רכז נגישות:</strong> אריק יעקובוב • <strong>טלפון / וואטסאפ:</strong> {DISPLAY_PHONE}</p>
            </div>

            <div className="p-4 border-t border-[#EDE6DC] bg-[#FAF8F5] rounded-b-3xl text-left">
              <button onClick={() => setIsAccessibilityStatementOpen(false)} className="px-6 py-2 rounded-full bg-[#1C1A17] text-white text-xs font-semibold cursor-pointer">
                סגור
              </button>
            </div>
          </div>
        </div>
      )}

      {/* סרגל נגישות צף */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-40">
        <button
          onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
          className="w-12 h-12 rounded-full bg-[#1C1A17] text-white hover:bg-[#332F2A] flex items-center justify-center shadow-2xl border-2 border-[#D5C7B2] cursor-pointer transition-transform hover:scale-105"
          title="תפריט נגישות"
          aria-label="פתח תפריט נגישות"
        >
          <AccessibilityIcon className="w-6 h-6 text-[#E6D4BA]" />
        </button>

        {isAccessibilityOpen && (
          <div className="absolute bottom-16 left-0 bg-white border border-[#EDE6DC] rounded-3xl p-4 sm:p-5 shadow-2xl w-[calc(100vw-2rem)] max-w-72 space-y-4 text-xs animate-in fade-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-3">
              <span className="font-serif font-bold text-[#1C1A17] flex items-center gap-2">
                <AccessibilityIcon className="w-4 h-4 text-[#9E8255]" />
                תפריט נגישות
              </span>
              <button onClick={() => setIsAccessibilityOpen(false)} className="text-[#8C8275] hover:text-[#1C1A17] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFontSizeOffset(prev => Math.min(prev + 1, 3))}
                className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC] hover:bg-[#EFE9DF] flex flex-col items-center gap-1 font-semibold text-[#1C1A17] cursor-pointer"
              >
                <ZoomIn className="w-4 h-4 text-[#9E8255]" />
                <span>הגדל טקסט</span>
              </button>
              <button
                onClick={() => setFontSizeOffset(prev => Math.max(prev - 1, -1))}
                className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC] hover:bg-[#EFE9DF] flex flex-col items-center gap-1 font-semibold text-[#1C1A17] cursor-pointer"
              >
                <ZoomOut className="w-4 h-4 text-[#9E8255]" />
                <span>הקטן טקסט</span>
              </button>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold cursor-pointer ${highContrast ? 'bg-[#1C1A17] text-white' : 'bg-[#FAF8F5] border-[#EDE6DC] text-[#1C1A17]'}`}
              >
                <Contrast className="w-4 h-4" />
                <span>ניגודיות גבוהה</span>
              </button>
              <button
                onClick={() => setGrayscaleMode(!grayscaleMode)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold cursor-pointer ${grayscaleMode ? 'bg-[#1C1A17] text-white' : 'bg-[#FAF8F5] border-[#EDE6DC] text-[#1C1A17]'}`}
              >
                <Eye className="w-4 h-4" />
                <span>מונוכרום</span>
              </button>
              <button
                onClick={() => setHighlightLinks(!highlightLinks)}
                className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 font-semibold col-span-2 cursor-pointer ${highlightLinks ? 'bg-[#1C1A17] text-white' : 'bg-[#FAF8F5] border-[#EDE6DC] text-[#1C1A17]'}`}
              >
                <Type className="w-4 h-4" />
                <span>הדגשת קישורים</span>
              </button>
            </div>

            <div className="pt-2 border-t border-[#EDE6DC] flex flex-col gap-2">
              <button
                onClick={() => { setIsAccessibilityStatementOpen(true); setIsAccessibilityOpen(false); }}
                className="text-[11px] text-[#9E8255] font-semibold underline text-center hover:text-[#1C1A17] cursor-pointer"
              >
                הצהרת נגישות רשמית
              </button>
              <button
                onClick={resetAccessibility}
                className="text-[10px] text-[#8C8275] flex items-center justify-center gap-1 hover:text-[#1C1A17] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                איפוס הגדרות נגישות
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-[#EDE6DC] bg-[#F4EFE6]/95 py-10 px-6 text-center text-xs text-[#8C8275] relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© 2026 Arik Yakobov Diamonds. כל הזכויות שמורות • בורסת היהלומים, בניין שמשון, רמת גן • {DISPLAY_PHONE}</p>
          
          <div className="flex items-center gap-6 text-[11px] font-semibold">

            <button onClick={() => setIsTermsOpen(true)} className="hover:text-[#1C1A17] underline cursor-pointer">
              תקנון האתר ומדיניות
            </button>
            <button onClick={() => setIsAccessibilityStatementOpen(true)} className="hover:text-[#1C1A17] underline cursor-pointer">
              הצהרת נגישות
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}