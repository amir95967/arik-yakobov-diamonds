import React, { useState, useEffect, useRef } from 'react';
import { 
  Diamond, 
  Phone, 
  MapPin, 
  Lock, 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Menu, 
  Search, 
  Filter, 
  Check, 
  SlidersHorizontal,
  ArrowRight,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { supabase } from './supabase';

export type DiamondShape = 
  | 'Round' 
  | 'Oval' 
  | 'Emerald' 
  | 'Radiant' 
  | 'Cushion' 
  | 'Pear' 
  | 'Princess' 
  | 'Marquise'
  | 'Heart';

export type ProductCategory = 
  | 'all'
  | 'engagement' 
  | 'loose' 
  | 'tennis' 
  | 'earrings' 
  | 'high_jewelry';

export interface DiamondProduct {
  id: string;
  sku: string;
  title: string;
  category: string;
  shape: DiamondShape;
  carat: number;
  color: string;
  clarity: string;
  cut: string;
  price: number;
  status: 'available' | 'reserved' | 'sold';
  certificate: string;
  image: string;
  created_at?: string;
}

const SHAPES_DATA: { value: DiamondShape; labelHe: string; labelEn: string }[] = [
  { value: 'Round', labelHe: 'עגול', labelEn: 'Round' },
  { value: 'Oval', labelHe: 'אובל', labelEn: 'Oval' },
  { value: 'Marquise', labelHe: 'מרקיזה', labelEn: 'Marquise' },
  { value: 'Emerald', labelHe: 'אמרלד', labelEn: 'Emerald' },
  { value: 'Radiant', labelHe: 'רדיאנט', labelEn: 'Radiant' },
  { value: 'Cushion', labelHe: 'קושיון', labelEn: 'Cushion' },
  { value: 'Pear', labelHe: 'טיפה', labelEn: 'Pear' },
  { value: 'Princess', labelHe: 'פרינסס', labelEn: 'Princess' },
  { value: 'Heart', labelHe: 'לב', labelEn: 'Heart' },
];

const CATEGORIES_DATA: { value: ProductCategory; labelHe: string }[] = [
  { value: 'all', labelHe: 'כל הקולקציה' },
  { value: 'engagement', labelHe: 'טבעות אירוסין' },
  { value: 'loose', labelHe: 'יהלומים משוחררים' },
  { value: 'tennis', labelHe: 'צמידי טניס' },
  { value: 'earrings', labelHe: 'עגילים' },
  { value: 'high_jewelry', labelHe: 'תכשיטי יוקרה' },
];

const INITIAL_PRODUCTS: DiamondProduct[] = [
  {
    id: '1',
    sku: 'AY-10492',
    title: 'טבעת סוליטר קלאסית בשיבוץ יהלום עגול 1.50 קראט',
    category: 'engagement',
    shape: 'Round',
    carat: 1.50,
    color: 'D',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: 34500,
    status: 'available',
    certificate: 'GIA',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: '2',
    sku: 'AY-20184',
    title: 'טבעת אובל יוקרתית בשיבוץ יהלום 2.05 קראט',
    category: 'engagement',
    shape: 'Oval',
    carat: 2.05,
    color: 'E',
    clarity: 'VS1',
    cut: 'Excellent',
    price: 52000,
    status: 'available',
    certificate: 'GIA',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: '3',
    sku: 'AY-30911',
    title: 'יהלום מרקיזה נדיר בחיתוך מושלם 1.80 קראט',
    category: 'loose',
    shape: 'Marquise',
    carat: 1.80,
    color: 'D',
    clarity: 'VVS2',
    cut: 'Excellent',
    price: 46800,
    status: 'available',
    certificate: 'GIA',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: '4',
    sku: 'AY-40512',
    title: 'טבעת אמרלד קאט מלכותית 1.70 קראט',
    category: 'engagement',
    shape: 'Emerald',
    carat: 1.70,
    color: 'F',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: 39000,
    status: 'available',
    certificate: 'GIA',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=85'
  }
];

export default function App() {
  const [products, setProducts] = useState<DiamondProduct[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(100000);

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const [isAdminView, setIsAdminView] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'credentials' | 'enroll_qr' | 'verify_code'>('credentials');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  const [editingProduct, setEditingProduct] = useState<DiamondProduct | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    sku: '',
    title: '',
    category: 'engagement',
    shape: 'Round' as DiamondShape,
    carat: '',
    color: 'D',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: '',
    certificate: 'GIA',
    status: 'available' as const
  });

  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path.includes('/admin') || hash.includes('admin')) {
        setIsAdminView(true);
      } else {
        setIsAdminView(false);
      }
    };
    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

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
      } else if (mfaData && mfaData.nextLevel === 'aal2') {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        const verifiedTotp = factors?.totp.find(f => f.status === 'verified');
        if (verifiedTotp) {
          setMfaFactorId(verifiedTotp.id);
          setAuthStep('verify_code');
        }
      } else {
        setIsAdminAuthenticated(true);
      }
    };
    checkSession();
  }, []);

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
      const verifiedTotp = factorsData?.totp.find(f => f.status === 'verified');

      if (verifiedTotp) {
        setMfaFactorId(verifiedTotp.id);
        setAuthStep('verify_code');
      } else {
        if (factorsData?.totp) {
          for (const factor of factorsData.totp) {
            if ((factor.status as string) === 'unverified') {
              await supabase.auth.mfa.unenroll({ factorId: factor.id });
            }
          }
        }

        const { data: enrollData, error: enrollError } = await supabase.auth.mfa.enroll({
          factorType: 'totp',
          issuer: 'Arik Yakobov Diamonds',
        });

        if (enrollError || !enrollData) {
          setLoginError('שגיאה ביצירת מפתח אימות 2FA');
        } else {
          setMfaFactorId(enrollData.id);
          setQrCodeUrl(enrollData.totp.qr_code);
          setAuthStep('enroll_qr');
        }
      }
    } catch (err) {
      setLoginError('אירעה שגיאה בהתחברות');
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
      alert('הפריט נוסף ונשמר בהצלחה!');
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      let imageUrl = editingProduct.image;

      if (editFileInputRef.current?.files?.[0]) {
        const file = editFileInputRef.current.files[0];
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
        console.error('Update error:', error);
        alert(`שגיאה בעדכון הפריט: ${error.message}`);
      } else {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...editingProduct, image: imageUrl } : p));
        setEditingProduct(null);
        setUploadedImagePreview(null);
        if (editFileInputRef.current) editFileInputRef.current.value = '';
        alert('הפריט עודכן בהצלחה!');
      }
    } catch (err: any) {
      console.error(err);
      alert('שגיאה בעדכון הפריט');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('האם למחוק פריט זה מהאתר?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error(error);
      alert('שגיאה במחיקת הפריט');
    } else {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleStatusChange = async (id: string, status: 'available' | 'reserved' | 'sold') => {
    const { error } = await supabase.from('products').update({ status }).eq('id', id);
    if (!error) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesShape = selectedShape === 'all' || product.shape === selectedShape;
    const matchesPrice = product.price <= priceRange;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.shape.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesShape && matchesPrice && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1A17] font-sans flex flex-col antialiased" dir="rtl">
      
      {/* Top Notification Strip */}
      <div className="bg-[#1C1A17] text-[#EDE6DC] py-2 px-4 text-center text-xs tracking-wider border-b border-[#332F2A] flex justify-between items-center">
        <div className="hidden md:flex items-center gap-6 mx-auto text-[11px]">
          <span>✦ חדר עסקאות בלעדי בבורסת היהלומים הישראלית, מגדל מכבי</span>
          <span>✦ תעודות גמולוגיות בינלאומיות GIA</span>
          <span>✦ אחריות מלאה לכל החיים ושירות VIP</span>
        </div>
        <div className="flex md:hidden items-center justify-center w-full text-[11px] font-medium text-[#C5A880]">
          ✦ אריק יעקובוב | בורסת היהלומים רמת גן
        </div>
        {isAdminView && (
          <button 
            onClick={() => {
              window.location.hash = '';
              setIsAdminView(false);
            }} 
            className="text-[11px] text-[#C5A880] underline hover:text-white shrink-0 cursor-pointer"
          >
            חזרה לחנות
          </button>
        )}
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE6DC] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC] text-[#1C1A17] active:bg-[#EDE6DC]"
              aria-label="פתח תפריט קטגוריות"
            >
              <Menu className="w-5 h-5" />
            </button>
            {!isAdminView && (
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC] text-[#9E8255] active:bg-[#EDE6DC] flex items-center gap-1 text-xs font-semibold"
                aria-label="סינון"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>סינון</span>
              </button>
            )}
          </div>

          <div 
            onClick={() => {
              setIsAdminView(false);
              window.location.hash = '';
            }} 
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="flex items-center gap-2">
              <Diamond className="w-6 h-6 text-[#9E8255] transition-transform group-hover:rotate-12 duration-300" />
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-[#1C1A17]">
                ARIK YAKOBOV
              </span>
            </div>
            <span className="text-[9px] tracking-[0.25em] text-[#8C8275] uppercase font-semibold">
              DIAMONDS & HIGH JEWELRY
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-wider uppercase text-[#575047]">
            {CATEGORIES_DATA.map(cat => (
              <button
                key={cat.value}
                onClick={() => {
                  setSelectedCategory(cat.value);
                  setIsAdminView(false);
                }}
                className={`transition-colors hover:text-[#9E8255] cursor-pointer py-1 relative ${
                  selectedCategory === cat.value && !isAdminView ? 'text-[#9E8255] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E8255]' : ''
                }`}
              >
                {cat.labelHe}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/972500000000?text=שלום%20אריק,%20אשמח%20לייעוץ%20בנוגע%20ליהלומים"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#1C1A17] text-white px-4 py-2 rounded-xl text-xs font-semibold tracking-wider hover:bg-[#332F2A] transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>תיאום פגישה בבורסה</span>
            </a>

            {!isAdminView && (
              <button
                onClick={() => {
                  window.location.hash = 'admin';
                  setIsAdminView(true);
                }}
                className="p-2.5 rounded-xl border border-[#EDE6DC] bg-[#FAF8F5] text-[#8C8275] hover:text-[#1C1A17] hover:bg-white transition-colors cursor-pointer"
                title="כניסת מנהל"
              >
                <Lock className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative z-50 w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-4">
                <div className="flex items-center gap-2">
                  <Diamond className="w-5 h-5 text-[#9E8255]" />
                  <span className="font-serif font-bold text-sm text-[#1C1A17]">תפריט קטגוריות</span>
                </div>
                <button 
                  onClick={() => setIsMobileNavOpen(false)}
                  className="p-1 rounded-full hover:bg-[#FAF8F5]"
                >
                  <X className="w-5 h-5 text-[#8C8275]" />
                </button>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] font-bold text-[#8C8275] uppercase tracking-wider">קטגוריות ראשיות</p>
                {CATEGORIES_DATA.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => {
                      setSelectedCategory(cat.value);
                      setIsMobileNavOpen(false);
                      setIsAdminView(false);
                    }}
                    className={`w-full text-right px-3.5 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between ${
                      selectedCategory === cat.value && !isAdminView
                        ? 'bg-[#F4EFE6] text-[#9E8255] font-bold'
                        : 'hover:bg-[#FAF8F5] text-[#1C1A17]'
                    }`}
                  >
                    <span>{cat.labelHe}</span>
                    {selectedCategory === cat.value && <Check className="w-4 h-4 text-[#9E8255]" />}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#EDE6DC] pt-4 space-y-3">
              <a
                href="https://wa.me/972500000000"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#1C1A17] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs"
              >
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <span>וואטסאפ לתיאום פגישה</span>
              </a>
              <button
                onClick={() => {
                  setIsMobileNavOpen(false);
                  setIsAdminView(true);
                  window.location.hash = 'admin';
                }}
                className="w-full py-2 text-center text-xs text-[#8C8275] hover:text-[#1C1A17]"
              >
                כניסת מנהל מערכת
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdminView ? (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {!isAdminAuthenticated ? (
            <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white border border-[#EDE6DC] shadow-xl text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#9E8255]">
                <Lock className="w-6 h-6" />
              </div>

              {authStep === 'credentials' && (
                <>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#1C1A17]">כניסת מנהל מערכת</h2>
                    <p className="text-xs text-[#8C8275] mt-1">אימות מאובטח בחיבור Supabase</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 text-right">
                    <div>
                      <label className="block text-xs font-semibold text-[#575047] mb-1">אימייל מנהל</label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@arikdiamonds.com"
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
                      className="w-full py-3 rounded-xl bg-[#1C1A17] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#332F2A] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isLoadingAuth ? 'בודק נתונים...' : 'המשך לאימות'}
                    </button>
                  </form>
                </>
              )}

              {authStep === 'enroll_qr' && (
                <>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#1C1A17]">הגדרת אימות דו-שלבי (2FA)</h2>
                    <p className="text-xs text-[#8C8275] mt-1 leading-relaxed">
                      סרוק את ה-QR באפליקציית Authenticator (Google או Microsoft) והזן את 6 הספרות.
                    </p>
                  </div>

                  {qrCodeUrl && (
                    <div className="flex justify-center p-3 bg-white border border-[#EDE6DC] rounded-2xl max-w-[190px] mx-auto shadow-xs">
                      <img src={qrCodeUrl} alt="2FA QR Code" className="w-full h-auto" />
                    </div>
                  )}

                  <form onSubmit={handleVerifyEnroll} className="space-y-4">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="123456"
                      dir="ltr"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] text-center text-xl font-mono tracking-widest focus:outline-none focus:border-[#9E8255]"
                    />

                    {loginError && <p className="text-xs text-red-600 font-semibold">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3 rounded-xl bg-[#1C1A17] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#332F2A] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isLoadingAuth ? 'מאמת...' : 'הפעל 2FA והיכנס'}
                    </button>
                  </form>
                </>
              )}

              {authStep === 'verify_code' && (
                <>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#1C1A17]">אימות דו-שלבי</h2>
                    <p className="text-xs text-[#8C8275] mt-1">הזן את 6 הספרות מאפליקציית האימות שלך</p>
                  </div>

                  <form onSubmit={handleVerifyLogin} className="space-y-4">
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={verifyCode}
                      onChange={(e) => setVerifyCode(e.target.value)}
                      placeholder="123456"
                      dir="ltr"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] text-center text-xl font-mono tracking-widest focus:outline-none focus:border-[#9E8255]"
                    />

                    {loginError && <p className="text-xs text-red-600 font-semibold">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3 rounded-xl bg-[#1C1A17] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#332F2A] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isLoadingAuth ? 'מאמת...' : 'כניסה למערכת'}
                    </button>
                  </form>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EDE6DC] shadow-xs">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#1C1A17]">פאנל ניהול מלאי ויהלומים</h1>
                  <p className="text-xs text-[#8C8275] mt-0.5">סנכרון מלא ואוטומטי מול מסד הנתונים Supabase</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchProducts}
                    className="p-2.5 rounded-xl border border-[#EDE6DC] bg-[#FAF8F5] hover:bg-[#EDE6DC] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    title="רענן נתונים"
                  >
                    <RefreshCw className="w-4 h-4 text-[#9E8255]" />
                    <span>רענן</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 px-4 rounded-xl bg-[#1C1A17] text-white hover:bg-[#332F2A] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-[#C5A880]" />
                    <span>התנתק</span>
                  </button>
                </div>
              </div>

              {/* Add New Product Form */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE6DC] shadow-xs space-y-6">
                <div className="flex items-center gap-2 border-b border-[#EDE6DC] pb-4">
                  <Plus className="w-5 h-5 text-[#9E8255]" />
                  <h2 className="font-serif font-bold text-lg text-[#1C1A17]">הוספת פריט / יהלום חדש לקטלוג</h2>
                </div>

                <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">מק"ט (SKU) *</label>
                    <input
                      type="text"
                      required
                      placeholder="AY-9901"
                      value={newProduct.sku}
                      onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">מחיר (₪) *</label>
                    <input
                      type="number"
                      required
                      placeholder="35000"
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block mb-1 font-semibold text-[#575047]">כותרת ושם הפריט *</label>
                    <input
                      type="text"
                      required
                      placeholder="טבעת סוליטר בשיבוץ יהלום מרקיזה 1.80 קראט"
                      value={newProduct.title}
                      onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">קטגוריה</label>
                    <select
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    >
                      <option value="engagement">טבעות אירוסין</option>
                      <option value="loose">יהלומים משוחררים</option>
                      <option value="tennis">צמידי טניס</option>
                      <option value="earrings">עגילים</option>
                      <option value="high_jewelry">תכשיטי יוקרה</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">צורת חיתוך (בעברית)</label>
                    <select
                      value={newProduct.shape}
                      onChange={e => setNewProduct({ ...newProduct, shape: e.target.value as DiamondShape })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    >
                      {SHAPES_DATA.map(s => (
                        <option key={s.value} value={s.value}>
                          {s.labelHe} ({s.labelEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">משקל קראט</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="1.50"
                      value={newProduct.carat}
                      onChange={e => setNewProduct({ ...newProduct, carat: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">צבע (Color)</label>
                    <input
                      type="text"
                      placeholder="D / E / F"
                      value={newProduct.color}
                      onChange={e => setNewProduct({ ...newProduct, color: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">ניקיון (Clarity)</label>
                    <input
                      type="text"
                      placeholder="VVS1 / VS1"
                      value={newProduct.clarity}
                      onChange={e => setNewProduct({ ...newProduct, clarity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">רמת חיתוך (Cut)</label>
                    <input
                      type="text"
                      placeholder="Excellent"
                      value={newProduct.cut}
                      onChange={e => setNewProduct({ ...newProduct, cut: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">תעודה גמולוגית</label>
                    <input
                      type="text"
                      placeholder="GIA / IGI"
                      value={newProduct.certificate}
                      onChange={e => setNewProduct({ ...newProduct, certificate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">סטטוס פריט</label>
                    <select
                      value={newProduct.status}
                      onChange={e => setNewProduct({ ...newProduct, status: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] focus:outline-none focus:border-[#9E8255]"
                    >
                      <option value="available">זמין במלאי</option>
                      <option value="reserved">שמור ללקוח</option>
                      <option value="sold">נמכר</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 p-4 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#D5C7B2] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setUploadedImagePreview(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                        className="hidden"
                        id="new-product-image-upload"
                      />
                      <label
                        htmlFor="new-product-image-upload"
                        className="px-4 py-2 bg-[#1C1A17] text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#332F2A] transition-colors"
                      >
                        בחר קובץ תמונה מהמכשיר
                      </label>
                      <span className="text-[11px] text-[#8C8275]">פורמטים נתמכים: JPG, PNG, WEBP</span>
                    </div>

                    {uploadedImagePreview && (
                      <div className="flex items-center gap-2">
                        <img src={uploadedImagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[#D5C7B2]" />
                        <span className="text-[11px] text-[#9E8255] font-semibold">תמונה מוכנה להעלאה</span>
                      </div>
                    )}
                  </div>

                  <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3 bg-[#1C1A17] text-white rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-[#332F2A] transition-colors shadow-xs cursor-pointer"
                    >
                      שמור פריט ב-Supabase
                    </button>
                  </div>
                </form>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-[#EDE6DC] shadow-xs overflow-hidden">
                <div className="p-6 border-b border-[#EDE6DC] flex justify-between items-center">
                  <h3 className="font-serif font-bold text-base text-[#1C1A17]">
                    רשימת פריטים קיימת במאגר ({products.length})
                  </h3>
                </div>

                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#FAF8F5] text-[#8C8275] border-b border-[#EDE6DC]">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">תמונה</th>
                        <th className="py-3.5 px-4 font-semibold">מק"ט</th>
                        <th className="py-3.5 px-4 font-semibold">כותרת</th>
                        <th className="py-3.5 px-4 font-semibold">צורת חיתוך</th>
                        <th className="py-3.5 px-4 font-semibold">קראט</th>
                        <th className="py-3.5 px-4 font-semibold">צבע/ניקיון</th>
                        <th className="py-3.5 px-4 font-semibold">מחיר</th>
                        <th className="py-3.5 px-4 font-semibold">סטטוס</th>
                        <th className="py-3.5 px-4 font-semibold text-center">פעולות</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE6DC]">
                      {products.map(p => {
                        const shapeObj = SHAPES_DATA.find(s => s.value === p.shape);
                        return (
                          <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                            <td className="py-3 px-4">
                              <img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded-lg border border-[#EDE6DC]" />
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-[#1C1A17]">{p.sku}</td>
                            <td className="py-3 px-4 font-medium max-w-xs truncate">{p.title}</td>
                            <td className="py-3 px-4 font-medium text-[#9E8255]">
                              {shapeObj ? shapeObj.labelHe : p.shape}
                            </td>
                            <td className="py-3 px-4">{p.carat} ct</td>
                            <td className="py-3 px-4">{p.color} / {p.clarity}</td>
                            <td className="py-3 px-4 font-bold text-[#1C1A17]">₪{p.price.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <select
                                value={p.status}
                                onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                                  p.status === 'available'
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                    : p.status === 'reserved'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                }`}
                              >
                                <option value="available">זמין</option>
                                <option value="reserved">שמור</option>
                                <option value="sold">נמכר</option>
                              </select>
                            </td>
                            <td className="py-3 px-4 text-center">
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
                                <button
                                  onClick={() => handleDelete(p.id)}
                                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  title="מחק פריט"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="block lg:hidden divide-y divide-[#EDE6DC]">
                  {products.map(p => {
                    const shapeObj = SHAPES_DATA.find(s => s.value === p.shape);
                    return (
                      <div key={p.id} className="p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded-xl border border-[#EDE6DC]" />
                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-mono text-[#8C8275]">{p.sku}</span>
                            <h4 className="text-xs font-bold text-[#1C1A17] truncate">{p.title}</h4>
                            <p className="text-[11px] text-[#9E8255] font-semibold mt-0.5">
                              חיתוך {shapeObj ? shapeObj.labelHe : p.shape} | {p.carat} קראט | ₪{p.price.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#FAF8F5]">
                          <select
                            value={p.status}
                            onChange={(e) => handleStatusChange(p.id, e.target.value as any)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg border bg-[#FAF8F5]"
                          >
                            <option value="available">זמין במלאי</option>
                            <option value="reserved">שמור</option>
                            <option value="sold">נמכר</option>
                          </select>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setUploadedImagePreview(p.image);
                              }}
                              className="px-3 py-1.5 bg-[#F4EFE6] text-[#9E8255] rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>ערוך</span>
                            </button>
                            <button
                              onClick={() => handleDelete(p.id)}
                              className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>מחק</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white border border-[#EDE6DC] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-4">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[#9E8255]" />
                    <h3 className="font-serif font-bold text-lg text-[#1C1A17]">
                      עריכת פריט: {editingProduct.sku}
                    </h3>
                  </div>
                  <button 
                    onClick={() => {
                      setEditingProduct(null);
                      setUploadedImagePreview(null);
                    }} 
                    className="p-1.5 rounded-full hover:bg-[#FAF8F5]"
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
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">מחיר (₪)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block mb-1 font-semibold text-[#575047]">כותרת ושם הפריט</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.title}
                      onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">קטגוריה</label>
                    <select
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      <option value="engagement">טבעות אירוסין</option>
                      <option value="loose">יהלומים משוחררים</option>
                      <option value="tennis">צמידי טניס</option>
                      <option value="earrings">עגילים</option>
                      <option value="high_jewelry">תכשיטי יוקרה</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">צורת חיתוך</label>
                    <select
                      value={editingProduct.shape}
                      onChange={e => setEditingProduct({ ...editingProduct, shape: e.target.value as DiamondShape })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      {SHAPES_DATA.map(s => (
                        <option key={s.value} value={s.value}>
                          {s.labelHe} ({s.labelEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">משקל קראט</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.carat}
                      onChange={e => setEditingProduct({ ...editingProduct, carat: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">צבע</label>
                    <input
                      type="text"
                      value={editingProduct.color}
                      onChange={e => setEditingProduct({ ...editingProduct, color: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">ניקיון</label>
                    <input
                      type="text"
                      value={editingProduct.clarity}
                      onChange={e => setEditingProduct({ ...editingProduct, clarity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">סטטוס</label>
                    <select
                      value={editingProduct.status}
                      onChange={e => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      <option value="available">זמין במלאי</option>
                      <option value="reserved">שמור ללקוח</option>
                      <option value="sold">נמכר</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 p-3 bg-[#FAF8F5] border border-[#EDE6DC] rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={uploadedImagePreview || editingProduct.image} 
                        alt="Preview" 
                        className="w-14 h-14 object-cover rounded-xl border border-[#D5C7B2]" 
                      />
                      <span className="text-[11px] text-[#575047]">תמונה נוכחית</span>
                    </div>

                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        ref={editFileInputRef}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setUploadedImagePreview(URL.createObjectURL(e.target.files[0]));
                          }
                        }}
                        className="hidden"
                        id="edit-modal-image-upload"
                      />
                      <label 
                        htmlFor="edit-modal-image-upload" 
                        className="px-3.5 py-2 bg-[#1C1A17] text-white rounded-xl cursor-pointer text-[11px] font-semibold hover:bg-[#332F2A]"
                      >
                        החלף תמונה
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-3 border-t border-[#EDE6DC]">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setUploadedImagePreview(null);
                      }}
                      className="px-4 py-2 bg-[#EFE9DF] text-[#1C1A17] rounded-xl font-semibold hover:bg-[#E5DDCF]"
                    >
                      ביטול
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#1C1A17] text-white rounded-xl font-semibold hover:bg-[#332F2A]"
                    >
                      שמור שינויים ב-Supabase
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      ) : (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#1C1A17] via-[#2A2622] to-[#1C1A17] text-white p-8 sm:p-12 mb-10 border border-[#332F2A] shadow-xl">
            <div className="relative z-10 max-w-2xl space-y-4">
              <span className="text-[#C5A880] text-xs font-semibold tracking-[0.2em] uppercase">
                ישירות מיד ראשונה בבורסת היהלומים
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight">
                יהלומים נדירים ותכשיטי יוקרה בהתאמה אישית
              </h1>
              <p className="text-sm text-[#EDE6DC]/80 max-w-lg leading-relaxed">
                מבחר יהלומים טבעיים ומלוטשים בדירוג GIA העולמי, ללא פערי תיווך, בליווי אישי מקצועי בחדר העסקאות.
              </p>
            </div>
            <div className="absolute left-0 bottom-0 top-0 w-1/2 opacity-20 pointer-events-none hidden md:block">
              <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#C5A880] to-transparent" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* RIGHT SIDEBAR: Filters */}
            <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-[#EDE6DC] shadow-xs space-y-6 sticky top-28">
              <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#9E8255]" />
                  <h3 className="font-serif font-bold text-sm text-[#1C1A17]">סינון מתקדם</h3>
                </div>
                {(selectedCategory !== 'all' || selectedShape !== 'all' || searchQuery !== '' || priceRange < 100000) && (
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedShape('all');
                      setSearchQuery('');
                      setPriceRange(100000);
                    }}
                    className="text-[11px] text-[#9E8255] hover:underline"
                  >
                    איפוס
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#575047]">חיפוש חופשי / מק"ט</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="חיפוש לפי שם, מק״ט..."
                    className="w-full pr-9 pl-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] text-xs focus:outline-none focus:border-[#9E8255]"
                  />
                  <Search className="w-4 h-4 text-[#8C8275] absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#575047]">קטגוריה</label>
                <div className="space-y-1">
                  {CATEGORIES_DATA.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat.value
                          ? 'bg-[#F4EFE6] text-[#9E8255] font-bold'
                          : 'hover:bg-[#FAF8F5] text-[#575047]'
                      }`}
                    >
                      <span>{cat.labelHe}</span>
                      {selectedCategory === cat.value && <Check className="w-3.5 h-3.5 text-[#9E8255]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#575047]">צורת חיתוך היהלום</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setSelectedShape('all')}
                    className={`col-span-2 py-1.5 px-3 rounded-xl text-xs font-medium text-center transition-all ${
                      selectedShape === 'all'
                        ? 'bg-[#1C1A17] text-white font-bold'
                        : 'bg-[#FAF8F5] text-[#575047] hover:bg-[#EDE6DC] border border-[#D5C7B2]'
                    }`}
                  >
                    כל צורות החיתוך
                  </button>
                  {SHAPES_DATA.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedShape(selectedShape === s.value ? 'all' : s.value)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-medium text-center transition-all flex flex-col items-center justify-center ${
                        selectedShape === s.value
                          ? 'bg-[#9E8255] text-white font-bold shadow-xs'
                          : 'bg-[#FAF8F5] text-[#575047] hover:bg-[#EDE6DC] border border-[#D5C7B2]'
                      }`}
                    >
                      <span className="font-bold">{s.labelHe}</span>
                      <span className={`text-[10px] ${selectedShape === s.value ? 'text-white/80' : 'text-[#8C8275]'}`}>
                        {s.labelEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#575047]">עד תקציב:</span>
                  <span className="font-bold text-[#9E8255]">₪{priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#9E8255] cursor-pointer"
                />
              </div>
            </aside>

            {/* LEFT / CENTER: Products Grid */}
            <div className="lg:col-span-3 space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EDE6DC]">
                <div className="flex items-center gap-2 text-xs text-[#575047]">
                  <span className="font-bold text-[#1C1A17]">{filteredProducts.length}</span>
                  <span>פריטים נמצאו</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {selectedShape !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F4EFE6] text-[#9E8255] text-xs font-semibold">
                      חיתוך: {SHAPES_DATA.find(s => s.value === selectedShape)?.labelHe || selectedShape}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedShape('all')} />
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F4EFE6] text-[#9E8255] text-xs font-semibold">
                      קטגוריה: {CATEGORIES_DATA.find(c => c.value === selectedCategory)?.labelHe}
                      <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                    </span>
                  )}
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#EDE6DC] p-12 text-center space-y-4">
                  <Diamond className="w-12 h-12 text-[#D5C7B2] mx-auto" />
                  <h3 className="font-serif font-bold text-lg text-[#1C1A17]">לא נמצאו פריטים תואמים</h3>
                  <p className="text-xs text-[#8C8275] max-w-sm mx-auto">
                    נסה לשנות את מסנני הצורה, התקציב או החיפוש החופשי כדי לראות אפשרויות נוספות.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedShape('all');
                      setSearchQuery('');
                      setPriceRange(100000);
                    }}
                    className="px-4 py-2 bg-[#1C1A17] text-white rounded-xl text-xs font-semibold hover:bg-[#332F2A]"
                  >
                    איפוס כל המסננים
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map(product => {
                    const shapeObj = SHAPES_DATA.find(s => s.value === product.shape);
                    return (
                      <div 
                        key={product.id}
                        className="bg-white rounded-3xl border border-[#EDE6DC] overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
                      >
                        <div>
                          <div className="relative aspect-square overflow-hidden bg-[#F4EFE6]">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[#1C1A17] shadow-xs">
                                {shapeObj ? shapeObj.labelHe : product.shape}
                              </span>
                              {product.certificate && (
                                <span className="px-2 py-1 rounded-full bg-[#1C1A17]/90 text-[10px] font-mono text-[#C5A880]">
                                  {product.certificate}
                                </span>
                              )}
                            </div>

                            {product.status !== 'available' && (
                              <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center">
                                <span className="px-4 py-1.5 rounded-full bg-white text-[#1C1A17] text-xs font-bold uppercase tracking-wider">
                                  {product.status === 'reserved' ? 'שמור ללקוח' : 'נמכר'}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-5 space-y-3">
                            <div className="flex items-center justify-between text-[11px] text-[#8C8275]">
                              <span className="font-mono">{product.sku}</span>
                              <span>{product.carat} קראט</span>
                            </div>

                            <h3 className="font-serif font-bold text-sm text-[#1C1A17] leading-snug line-clamp-2">
                              {product.title}
                            </h3>

                            <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[10px]">
                              <div className="bg-[#FAF8F5] border border-[#EDE6DC] rounded-lg py-1">
                                <span className="text-[#8C8275] block">צבע</span>
                                <span className="font-bold text-[#1C1A17]">{product.color}</span>
                              </div>
                              <div className="bg-[#FAF8F5] border border-[#EDE6DC] rounded-lg py-1">
                                <span className="text-[#8C8275] block">ניקיון</span>
                                <span className="font-bold text-[#1C1A17]">{product.clarity}</span>
                              </div>
                              <div className="bg-[#FAF8F5] border border-[#EDE6DC] rounded-lg py-1">
                                <span className="text-[#8C8275] block">חיתוך</span>
                                <span className="font-bold text-[#1C1A17]">{product.cut}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0 flex items-center justify-between border-t border-[#FAF8F5] mt-2">
                          <div>
                            <span className="text-[10px] text-[#8C8275] block">מחיר מיוחד</span>
                            <span className="text-base font-bold text-[#1C1A17]">
                              ₪{product.price.toLocaleString()}
                            </span>
                          </div>

                          <a
                            href={`https://wa.me/972500000000?text=שלום%20אריק,%20אני%20מתעניין%20בפריט%20${encodeURIComponent(product.title)}%20(מק"ט:%20${product.sku})`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-[#1C1A17] text-white rounded-xl text-xs font-semibold hover:bg-[#332F2A] transition-colors flex items-center gap-1.5"
                          >
                            <span>לפרטים</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#C5A880] rotate-180" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#9E8255]" />
                <h3 className="font-serif font-bold text-base text-[#1C1A17]">סינון והתאמת יהלומים</h3>
              </div>
              <button 
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-full hover:bg-[#FAF8F5]"
              >
                <X className="w-5 h-5 text-[#8C8275]" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#575047]">צורת חיתוך היהלום</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setSelectedShape('all')}
                  className={`col-span-3 py-2 rounded-xl text-xs font-semibold ${
                    selectedShape === 'all'
                      ? 'bg-[#1C1A17] text-white'
                      : 'bg-[#FAF8F5] text-[#575047] border border-[#D5C7B2]'
                  }`}
                >
                  כל הצורות
                </button>
                {SHAPES_DATA.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedShape(s.value)}
                    className={`py-2 px-1 rounded-xl text-xs text-center flex flex-col items-center justify-center ${
                      selectedShape === s.value
                        ? 'bg-[#9E8255] text-white font-bold'
                        : 'bg-[#FAF8F5] text-[#575047] border border-[#D5C7B2]'
                    }`}
                  >
                    <span className="font-bold">{s.labelHe}</span>
                    <span className="text-[10px] opacity-80">{s.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>עד תקציב:</span>
                <span className="text-[#9E8255] font-bold">₪{priceRange.toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="5000"
                max="100000"
                step="2500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#9E8255]"
              />
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3.5 bg-[#1C1A17] text-white rounded-xl font-bold text-xs uppercase tracking-wider"
            >
              הצג תוצאות ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#1C1A17] text-[#EDE6DC] border-t border-[#332F2A] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-[#C5A880]" />
                <span className="font-serif font-bold text-lg text-white">ARIK YAKOBOV</span>
              </div>
              <p className="text-xs text-[#EDE6DC]/70 leading-relaxed">
                יהלומים טבעיים, אבני חן ותכשיטי יוקרה בהתאמה אישית ישירות מחבר בורסת היהלומים הישראלית.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm">פגישות ושירות VIP</h4>
              <div className="flex items-center gap-2 text-[#EDE6DC]/80">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>מגדל מכבי, בורסת היהלומים, רמת גן</span>
              </div>
              <div className="flex items-center gap-2 text-[#EDE6DC]/80">
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <span>תיאום פגישה אישית מראש</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm">אחריות וביטחון</h4>
              <p className="text-[#EDE6DC]/70">
                כל היהלומים נבדקים בקפידה ומלווים בתעודה גמולוגית בינלאומית מקורית ואחריות מלאה.
              </p>
            </div>
          </div>

          <div className="border-t border-[#332F2A] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#EDE6DC]/50 gap-4">
            <span>© 2026 אריק יעקובוב - כל הזכויות שמורות.</span>
            <button 
              onClick={() => {
                setIsAdminView(true);
                window.location.hash = 'admin';
              }} 
              className="hover:text-[#C5A880] transition-colors"
            >
              ניהול מערכת
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
