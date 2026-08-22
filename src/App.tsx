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
  RefreshCw,
  ChevronDown,
  Sparkles,
  Award,
  Layers,
  DollarSign,
  Package,
  MessageCircle,
  Clock,
  Send
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

export type DiamondType = 'all' | 'Natural' | 'Lab';

export interface DiamondProduct {
  id: string;
  sku: string;
  title: string;
  category: string;
  shape: DiamondShape;
  diamond_type?: 'Natural' | 'Lab';
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

const PHONE_NUMBER = '0544847078';
const DISPLAY_PHONE = '054-4847078';
const WHATSAPP_LINK = `https://wa.me/972544847078?text=${encodeURIComponent('שלום אריק, הגעתי דרך האתר ואשמח לייעוץ בנוגע ליהלומים ותכשיטים.')}`;

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
  { value: 'all', labelHe: 'כל הקטלוג' },
  { value: 'engagement', labelHe: 'טבעות אירוסין' },
  { value: 'loose', labelHe: 'יהלומים משוחררים' },
  { value: 'tennis', labelHe: 'צמידי טניס' },
  { value: 'earrings', labelHe: 'עגילי יהלומים' },
  { value: 'high_jewelry', labelHe: 'תכשיטי יוקרה בעיצוב אישי' },
];

const INITIAL_PRODUCTS: DiamondProduct[] = [
  {
    id: '1',
    sku: 'AY-10492',
    title: 'טבעת סוליטר קלאסית בשיבוץ יהלום טבעי עגול 1.50 קראט',
    category: 'engagement',
    diamond_type: 'Natural',
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
    diamond_type: 'Lab',
    shape: 'Oval',
    carat: 2.05,
    color: 'E',
    clarity: 'VS1',
    cut: 'Excellent',
    price: 18500,
    status: 'available',
    certificate: 'IGI',
    image: 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1000&q=85'
  },
  {
    id: '3',
    sku: 'AY-30911',
    title: 'יהלום מרקיזה נדיר בחיתוך מושלם 1.80 קראט Natural',
    category: 'loose',
    diamond_type: 'Natural',
    shape: 'Marquise',
    carat: 1.80,
    color: 'D',
    clarity: 'VVS2',
    cut: 'Excellent',
    price: 46800,
    status: 'available',
    certificate: 'GIA',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1000&q=85'
  }
];

export default function App() {
  // Routing State: 'home' | 'shop' | 'about' | 'contactus' | 'admin'
  const [currentRoute, setCurrentRoute] = useState<'home' | 'shop' | 'about' | 'contactus' | 'admin'>('home');
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);

  // Products & Filter States
  const [products, setProducts] = useState<DiamondProduct[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedDiamondType, setSelectedDiamondType] = useState<DiamondType>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedClarity, setSelectedClarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [minCarat, setMinCarat] = useState<number>(0.3);

  // Responsive Drawer States
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Admin Auth States
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [authStep, setAuthStep] = useState<'credentials' | 'enroll_qr' | 'verify_code'>('credentials');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loginError, setLoginError] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  // Admin Product Management
  const [editingProduct, setEditingProduct] = useState<DiamondProduct | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
    sku: '',
    title: '',
    category: 'engagement',
    diamond_type: 'Natural' as 'Natural' | 'Lab',
    shape: 'Round' as DiamondShape,
    carat: '',
    color: 'D',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: '',
    certificate: 'GIA',
    status: 'available' as const
  });

  // Client Routing sync with pathname / hash
  const navigateTo = (route: 'home' | 'shop' | 'about' | 'contactus' | 'admin', category?: ProductCategory) => {
    setCurrentRoute(route);
    if (category) setSelectedCategory(category);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMobileNavOpen(false);
    setIsShopDropdownOpen(false);
    
    if (route === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${route}`);
    }
  };

  useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname.replace('/', '').toLowerCase();
      const hash = window.location.hash.replace('#', '').replace('/', '').toLowerCase();
      const target = path || hash;

      if (target.includes('admin')) setCurrentRoute('admin');
      else if (target.includes('shop')) setCurrentRoute('shop');
      else if (target.includes('about')) setCurrentRoute('about');
      else if (target.includes('contact')) setCurrentRoute('contactus');
      else setCurrentRoute('home');
    };

    handlePop();
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  // Fetch products from Supabase
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

  // Auth Session
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

  // Add Product
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
        diamond_type: newProduct.diamond_type,
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
        diamond_type: 'Natural',
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

  // Update Product
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
          diamond_type: editingProduct.diamond_type || 'Natural',
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

  // Filtered Products
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesShape = selectedShape === 'all' || product.shape === selectedShape;
    const matchesType = selectedDiamondType === 'all' || product.diamond_type === selectedDiamondType;
    const matchesColor = selectedColor === 'all' || product.color.toUpperCase() === selectedColor.toUpperCase();
    const matchesClarity = selectedClarity === 'all' || product.clarity.toUpperCase() === selectedClarity.toUpperCase();
    const matchesCarat = product.carat >= minCarat;
    const matchesPrice = product.price <= priceRange;
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.shape.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesShape && matchesType && matchesColor && matchesClarity && matchesCarat && matchesPrice && matchesSearch;
  });

  // Admin Stats
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price || 0), 0);
  const activeCount = products.filter(p => p.status === 'available').length;
  const reservedCount = products.filter(p => p.status === 'reserved').length;
  const soldCount = products.filter(p => p.status === 'sold').length;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1A17] font-sans flex flex-col antialiased" dir="rtl">
      
      {/* 1. RUNNING TICKER MARQUEE TOP BAR */}
      <div className="bg-[#11100E] text-[#D5C7B2] py-2 overflow-hidden border-b border-[#2B2722] relative select-none">
        <div className="whitespace-nowrap flex animate-marquee">
          <div className="flex items-center gap-10 text-[11px] font-medium tracking-wide">
            <span className="flex items-center gap-1.5"><Diamond className="w-3.5 h-3.5 text-[#C5A880]" /> Arik Yakobov Diamonds</span>
            <span>✦ חדר עסקאות בלעדי בבורסת היהלומים, בניין שמשון רמת גן</span>
            <span>✦ ייצור תכשיטים בעיצוב אישי | Lab & Natural Diamonds</span>
            <span>✦ תעודות גמולוגיות בינלאומיות GIA / IGI מקוריות</span>
            <span>✦ שירות VIP ואחריות לכל החיים</span>
            <span>✦ טלפון ישיר: {DISPLAY_PHONE}</span>
          </div>
          <div className="flex items-center gap-10 text-[11px] font-medium tracking-wide mr-10">
            <span className="flex items-center gap-1.5"><Diamond className="w-3.5 h-3.5 text-[#C5A880]" /> Arik Yakobov Diamonds</span>
            <span>✦ חדר עסקאות בלעדי בבורסת היהלומים, בניין שמשון רמת גן</span>
            <span>✦ ייצור תכשיטים בעיצוב אישי | Lab & Natural Diamonds</span>
            <span>✦ תעודות גמולוגיות בינלאומיות GIA / IGI מקוריות</span>
            <span>✦ שירות VIP ואחריות לכל החיים</span>
            <span>✦ טלפון ישיר: {DISPLAY_PHONE}</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER WITH LOGO ON RIGHT & ROUTES */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE6DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* RIGHT: CLICKABLE BRAND LOGO TO HOME */}
          <div 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#1C1A17] flex items-center justify-center text-[#C5A880] shadow-sm transition-transform duration-300 group-hover:scale-105">
              <Diamond className="w-5 h-5" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-lg sm:text-xl font-serif font-bold tracking-tight text-[#1C1A17] leading-none">
                ARIK YAKOBOV
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#8C8275] uppercase font-bold mt-1">
                DIAMONDS & JEWELRY
              </span>
            </div>
          </div>

          {/* CENTER: DESKTOP ROUTE NAVIGATION LINKS */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-wider text-[#575047]">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-[#9E8255] transition-colors py-1 relative ${
                currentRoute === 'home' ? 'text-[#9E8255] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E8255]' : ''
              }`}
            >
              דף הבית
            </button>

            {/* SHOP WITH DROPDOWN CATEGORIES */}
            <div className="relative group">
              <button
                onClick={() => navigateTo('shop')}
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                className={`flex items-center gap-1 hover:text-[#9E8255] transition-colors py-1 relative ${
                  currentRoute === 'shop' ? 'text-[#9E8255] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E8255]' : ''
                }`}
              >
                <span>קנייה וקטלוג</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>

              {/* DROPDOWN MENU */}
              {isShopDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsShopDropdownOpen(false)}
                  className="absolute top-full right-0 w-60 bg-white border border-[#EDE6DC] rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-right"
                >
                  <div className="text-[10px] font-bold text-[#8C8275] uppercase px-3 py-1.5 border-b border-[#FAF8F5]">
                    קטגוריות ראשיות
                  </div>
                  {CATEGORIES_DATA.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => navigateTo('shop', cat.value)}
                      className={`w-full text-right px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === cat.value && currentRoute === 'shop'
                          ? 'bg-[#F4EFE6] text-[#9E8255] font-bold'
                          : 'hover:bg-[#FAF8F5] text-[#1C1A17]'
                      }`}
                    >
                      <span>{cat.labelHe}</span>
                      {selectedCategory === cat.value && currentRoute === 'shop' && <Check className="w-3.5 h-3.5 text-[#9E8255]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('about')}
              className={`hover:text-[#9E8255] transition-colors py-1 relative ${
                currentRoute === 'about' ? 'text-[#9E8255] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E8255]' : ''
              }`}
            >
              אודות
            </button>

            <button
              onClick={() => navigateTo('contactus')}
              className={`hover:text-[#9E8255] transition-colors py-1 relative ${
                currentRoute === 'contactus' ? 'text-[#9E8255] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#9E8255]' : ''
              }`}
            >
              יצירת קשר
            </button>
          </nav>

          {/* LEFT: ACTION BUTTONS & MOBILE BURGER TRIGGER */}
          <div className="flex items-center gap-3">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 bg-[#1C1A17] text-white px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wider hover:bg-[#332F2A] transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>{DISPLAY_PHONE}</span>
            </a>

            <button
              onClick={() => navigateTo('admin')}
              className={`p-2.5 rounded-xl border border-[#EDE6DC] text-[#8C8275] hover:text-[#1C1A17] hover:bg-[#FAF8F5] transition-colors cursor-pointer ${
                currentRoute === 'admin' ? 'bg-[#1C1A17] text-white border-[#1C1A17]' : 'bg-white'
              }`}
              title="כניסת מנהל"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EDE6DC] text-[#1C1A17]"
              aria-label="תפריט"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER (BURGER) */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
            onClick={() => setIsMobileNavOpen(false)}
          />
          <div className="relative z-50 w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-4">
                <div className="flex items-center gap-2">
                  <Diamond className="w-5 h-5 text-[#9E8255]" />
                  <span className="font-serif font-bold text-sm text-[#1C1A17]">תפריט ניווט</span>
                </div>
                <button onClick={() => setIsMobileNavOpen(false)} className="p-1 rounded-full hover:bg-[#FAF8F5]">
                  <X className="w-5 h-5 text-[#8C8275]" />
                </button>
              </div>

              {/* Main Links */}
              <div className="space-y-1 text-sm font-semibold">
                <button 
                  onClick={() => navigateTo('home')} 
                  className={`w-full text-right py-2.5 px-3 rounded-xl ${currentRoute === 'home' ? 'bg-[#F4EFE6] text-[#9E8255]' : 'hover:bg-[#FAF8F5]'}`}
                >
                  דף הבית
                </button>
                <button 
                  onClick={() => navigateTo('shop')} 
                  className={`w-full text-right py-2.5 px-3 rounded-xl ${currentRoute === 'shop' ? 'bg-[#F4EFE6] text-[#9E8255]' : 'hover:bg-[#FAF8F5]'}`}
                >
                  כל הקטלוג והקנייה
                </button>
                <button 
                  onClick={() => navigateTo('about')} 
                  className={`w-full text-right py-2.5 px-3 rounded-xl ${currentRoute === 'about' ? 'bg-[#F4EFE6] text-[#9E8255]' : 'hover:bg-[#FAF8F5]'}`}
                >
                  אודות אריק יעקובוב
                </button>
                <button 
                  onClick={() => navigateTo('contactus')} 
                  className={`w-full text-right py-2.5 px-3 rounded-xl ${currentRoute === 'contactus' ? 'bg-[#F4EFE6] text-[#9E8255]' : 'hover:bg-[#FAF8F5]'}`}
                >
                  יצירת קשר ותיאום פגישה
                </button>
              </div>

              {/* Sub Categories */}
              <div className="pt-3 border-t border-[#EDE6DC] space-y-1">
                <p className="text-[11px] font-bold text-[#8C8275] uppercase px-3 mb-1">קטגוריות תכשיטים</p>
                {CATEGORIES_DATA.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => navigateTo('shop', cat.value)}
                    className="w-full text-right py-2 px-3 rounded-lg text-xs text-[#575047] hover:bg-[#FAF8F5] flex items-center justify-between"
                  >
                    <span>{cat.labelHe}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D5C7B2] rotate-180" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#EDE6DC] pt-4 space-y-2">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#1C1A17] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <span>וואטסאפ: {DISPLAY_PHONE}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC ROUTE CONTENT */}
      {currentRoute === 'home' && (
        <main className="flex-1">
          {/* Hero Section */}
          <div className="relative bg-[#11100E] text-white py-20 sm:py-28 px-4 border-b border-[#2B2722] overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 text-right z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2A2622] border border-[#3E3832] text-[#C5A880] text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ייצור תכשיטים בעיצוב אישי | Lab & Natural Diamonds</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                  יהלומים נדירים בבורסת היהלומים
                </h1>
                <p className="text-sm sm:text-base text-[#D5C7B2] max-w-lg leading-relaxed">
                  הצטרפו לפגישה אישית בחדר העסקאות בבניין שמשון. רכישת יהלומים טבעיים ויהלומי מעבדה ללא פערי תיווך, בדירוג המחמיר בעולם (GIA / IGI).
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <button
                    onClick={() => navigateTo('shop')}
                    className="px-8 py-3.5 bg-[#C5A880] text-[#11100E] font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-[#b0936b] transition-colors"
                  >
                    צפייה בקטלוג המוצרים
                  </button>
                  <button
                    onClick={() => navigateTo('contactus')}
                    className="px-6 py-3.5 bg-[#221F1B] border border-[#3E3832] text-white font-semibold rounded-xl text-xs hover:bg-[#2B2722] transition-colors"
                  >
                    תיאום פגישה בבורסה
                  </button>
                </div>
              </div>

              <div className="relative z-10 flex justify-center">
                <div className="w-full max-w-md aspect-square rounded-3xl overflow-hidden border border-[#3E3832] shadow-2xl relative">
                  <img 
                    src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1000&q=85" 
                    alt="Arik Yakobov Diamond" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                    <span className="text-[#C5A880] text-xs font-mono">ARIK YAKOBOV</span>
                    <h3 className="font-serif font-bold text-white text-lg">בניין שמשון, בורסת היהלומים רמת גן</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Categories Bar */}
          <div className="max-w-7xl mx-auto px-4 py-12">
            <h2 className="text-center font-serif text-2xl font-bold mb-8 text-[#1C1A17]">קטגוריות נבחרות</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES_DATA.filter(c => c.value !== 'all').map(cat => (
                <div
                  key={cat.value}
                  onClick={() => navigateTo('shop', cat.value)}
                  className="bg-white p-5 rounded-2xl border border-[#EDE6DC] text-center hover:border-[#9E8255] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 mx-auto rounded-full bg-[#FAF8F5] flex items-center justify-center text-[#9E8255] mb-3 group-hover:bg-[#1C1A17] group-hover:text-[#C5A880] transition-colors">
                    <Diamond className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-[#1C1A17]">{cat.labelHe}</h4>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* SHOP ROUTE (CATALOG + RIGHT ADVANCED FILTERS) */}
      {currentRoute === 'shop' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1A17]">קטלוג יהלומים ותכשיטי יוקרה</h1>
              <p className="text-xs text-[#8C8275] mt-1">בורסת היהלומים רמת גן, בניין שמשון</p>
            </div>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-4 py-2 bg-[#1C1A17] text-white rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#C5A880]" />
              <span>מסננים ({filteredProducts.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* RIGHT SIDEBAR: ADVANCED RICH FILTERS */}
            <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-[#EDE6DC] shadow-xs space-y-6 sticky top-28 text-xs">
              <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-4">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#1C1A17]">
                  <Filter className="w-4 h-4 text-[#9E8255]" />
                  <span>סינון מתקדם ומדויק</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSelectedShape('all');
                    setSelectedDiamondType('all');
                    setSelectedColor('all');
                    setSelectedClarity('all');
                    setSearchQuery('');
                    setPriceRange(100000);
                    setMinCarat(0.3);
                  }}
                  className="text-[11px] text-[#9E8255] hover:underline"
                >
                  איפוס
                </button>
              </div>

              {/* Free Search */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#575047]">חיפוש מק"ט או כותרת</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="AY-10492, מרקיזה, סוליטר..."
                    className="w-full pr-8 pl-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2] text-xs focus:outline-none focus:border-[#9E8255]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#8C8275] absolute right-2.5 top-2.5" />
                </div>
              </div>

              {/* Diamond Type Filter: Lab vs Natural */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#575047]">סוג היהלום</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setSelectedDiamondType('all')}
                    className={`py-1.5 rounded-lg font-medium text-[11px] ${selectedDiamondType === 'all' ? 'bg-[#1C1A17] text-white' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                  >
                    הכל
                  </button>
                  <button
                    onClick={() => setSelectedDiamondType('Natural')}
                    className={`py-1.5 rounded-lg font-medium text-[11px] ${selectedDiamondType === 'Natural' ? 'bg-[#9E8255] text-white font-bold' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                  >
                    טבעי (Natural)
                  </button>
                  <button
                    onClick={() => setSelectedDiamondType('Lab')}
                    className={`py-1.5 rounded-lg font-medium text-[11px] ${selectedDiamondType === 'Lab' ? 'bg-[#9E8255] text-white font-bold' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                  >
                    מעבדה (Lab)
                  </button>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#575047]">קטגוריה</label>
                <div className="space-y-1">
                  {CATEGORIES_DATA.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-right px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between ${
                        selectedCategory === cat.value ? 'bg-[#F4EFE6] text-[#9E8255] font-bold' : 'hover:bg-[#FAF8F5] text-[#575047]'
                      }`}
                    >
                      <span>{cat.labelHe}</span>
                      {selectedCategory === cat.value && <Check className="w-3 h-3 text-[#9E8255]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shape (Hebrew + Marquise) */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#575047]">צורת חיתוך (בעברית)</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setSelectedShape('all')}
                    className={`col-span-3 py-1 rounded-lg text-[11px] font-semibold ${selectedShape === 'all' ? 'bg-[#1C1A17] text-white' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                  >
                    כל הצורות
                  </button>
                  {SHAPES_DATA.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedShape(s.value)}
                      className={`py-1.5 px-1 rounded-lg text-center flex flex-col items-center justify-center ${
                        selectedShape === s.value ? 'bg-[#9E8255] text-white font-bold' : 'bg-[#FAF8F5] border border-[#D5C7B2] text-[#575047]'
                      }`}
                    >
                      <span className="font-bold text-[11px]">{s.labelHe}</span>
                      <span className="text-[9px] opacity-75">{s.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#575047]">צבע יהלום (Color)</label>
                <div className="flex flex-wrap gap-1">
                  {['all', 'D', 'E', 'F', 'G', 'H'].map(col => (
                    <button
                      key={col}
                      onClick={() => setSelectedColor(col)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${selectedColor === col ? 'bg-[#1C1A17] text-white' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                    >
                      {col === 'all' ? 'הכל' : col}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clarity Filter */}
              <div className="space-y-1.5">
                <label className="font-semibold text-[#575047]">ניקיון (Clarity)</label>
                <div className="flex flex-wrap gap-1">
                  {['all', 'FL', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1'].map(cla => (
                    <button
                      key={cla}
                      onClick={() => setSelectedClarity(cla)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-semibold ${selectedClarity === cla ? 'bg-[#1C1A17] text-white' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                    >
                      {cla === 'all' ? 'הכל' : cla}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
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

            {/* PRODUCT CARDS GRID */}
            <div className="lg:col-span-3 space-y-6">
              
              <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-[#EDE6DC] text-xs">
                <div>
                  <span className="font-bold text-[#1C1A17]">{filteredProducts.length}</span> מוצרים זמינים לצפייה
                </div>
                <div className="text-[#8C8275]">
                  מחירים כוללים מע"מ ואחריות מלאה
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#EDE6DC] p-12 text-center space-y-4">
                  <Diamond className="w-12 h-12 text-[#D5C7B2] mx-auto" />
                  <h3 className="font-serif font-bold text-lg text-[#1C1A17]">לא נמצאו פריטים במסננים אלו</h3>
                  <p className="text-xs text-[#8C8275]">ניתן לאפס את המסננים או ליצור קשר ישיר לייצור תכשיט מותאם אישית.</p>
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
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[11px] font-bold text-[#1C1A17] shadow-xs">
                                {shapeObj ? shapeObj.labelHe : product.shape}
                              </span>
                              {product.diamond_type && (
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold text-white ${product.diamond_type === 'Natural' ? 'bg-[#1C1A17]' : 'bg-[#9E8255]'}`}>
                                  {product.diamond_type === 'Natural' ? 'טבעי' : 'מעבדה'}
                                </span>
                              )}
                            </div>

                            {product.status !== 'available' && (
                              <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center">
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
                                <span className="text-[#8C8275] block">תעודה</span>
                                <span className="font-bold text-[#1C1A17]">{product.certificate}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-5 pt-0 flex items-center justify-between border-t border-[#FAF8F5] mt-2">
                          <div>
                            <span className="text-[10px] text-[#8C8275] block">מחיר ישיר</span>
                            <span className="text-base font-bold text-[#1C1A17]">
                              ₪{product.price.toLocaleString()}
                            </span>
                          </div>

                          <a
                            href={`https://wa.me/972544847078?text=${encodeURIComponent(`שלום אריק, אני מתעניין בפריט ${product.title} (מק"ט: ${product.sku})`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-2 bg-[#1C1A17] text-white rounded-xl text-xs font-semibold hover:bg-[#332F2A] transition-colors flex items-center gap-1.5"
                          >
                            <span>בוואטסאפ</span>
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

      {/* ABOUT ROUTE */}
      {currentRoute === 'about' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-right space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#9E8255] tracking-widest uppercase">אודות המותג</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1A17]">Arik Yakobov Diamonds</h1>
            <p className="text-sm text-[#8C8275]">בורסת היהלומים רמת גן, בניין שמשון</p>
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EDE6DC] shadow-xs space-y-6 text-sm text-[#575047] leading-relaxed">
            <p className="font-semibold text-base text-[#1C1A17]">
              שלום וברוכים הבאים לעולם היהלומים ותכשיטי היוקרה של אריק יעקובוב.
            </p>
            <p>
              אנו מתמחים בייצור תכשיטים בעיצוב אישי וברכישת יהלומים טבעיים ויהלומי מעבדה (Lab & Natural Diamonds) ישירות מחברי בורסת היהלומים ברמת גן, ללא פערי תיווך וללא עמלות מיותרות.
            </p>
            <p>
              חדר העסקאות שלנו ממוקם בבניין שמשון בבורסת היהלומים ברמת גן, ומציע חוויית קנייה וליווי אישי מקצועי לכל אורך הדרך – מבחירת האבן הגולמית או המלוטשת בדירוג הבינלאומי המחמיר ביותר (GIA, IGI) ועד לעיצוב והרכבת טבעת האירוסין או התכשיט המושלם.
            </p>
            <div className="pt-4 border-t border-[#EDE6DC] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-[#1C1A17] block">פגישות אישיות ותיאום מראש:</span>
                <span className="text-xs text-[#8C8275]">טלפון / וואטסאפ: {DISPLAY_PHONE}</span>
              </div>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 bg-[#1C1A17] text-white rounded-xl text-xs font-semibold hover:bg-[#332F2A]"
              >
                תיאום פגישה אישית
              </a>
            </div>
          </div>
        </main>
      )}

      {/* CONTACT US ROUTE */}
      {currentRoute === 'contactus' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#9E8255] tracking-widest uppercase">יצירת קשר ופגישות</span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1C1A17]">בואו ניפגש בבורסת היהלומים</h1>
            <p className="text-xs sm:text-sm text-[#8C8275]">בניין שמשון, בורסת היהלומים רמת גן</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-[#EDE6DC] shadow-xs space-y-6 text-right">
              <h3 className="font-serif font-bold text-lg text-[#1C1A17]">פרטי הגעה והתקשרות</h3>
              
              <div className="space-y-4 text-xs text-[#575047]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#9E8255] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1C1A17] block">כתובת:</span>
                    <span>בורסת היהלומים רמת גן, בניין שמשון</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#9E8255] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1C1A17] block">טלפון ישיר:</span>
                    <a href={`tel:${PHONE_NUMBER}`} className="hover:underline">{DISPLAY_PHONE}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#9E8255] shrink-0" />
                  <div>
                    <span className="font-bold text-[#1C1A17] block">שעות פעילות:</span>
                    <span>ימים א׳ - ה׳ בתיאום מראש בלבד</span>
                  </div>
                </div>
              </div>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 bg-[#1C1A17] text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#332F2A]"
              >
                <MessageCircle className="w-4 h-4 text-[#C5A880]" />
                <span>פתיחת שיחה בוואטסאפ</span>
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#EDE6DC] shadow-xs text-right space-y-4">
              <h3 className="font-serif font-bold text-lg text-[#1C1A17]">השארת פנייה מהירה</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('פנייתך התקבלה בהצלחה, ניצור קשר בהקדם!');
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-semibold text-[#575047]">שם מלא</label>
                  <input required type="text" placeholder="ישראל ישראלי" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-[#575047]">מספר טלפון</label>
                  <input required type="tel" dir="ltr" placeholder="050-0000000" className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-[#575047]">תוכן ההודעה</label>
                  <textarea rows={3} placeholder="אשמח לפרטים על טבעת אירוסין..." className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]" />
                </div>
                <button type="submit" className="w-full py-3 bg-[#9E8255] text-white font-bold rounded-xl text-xs hover:bg-[#887046] flex items-center justify-center gap-2">
                  <Send className="w-3.5 h-3.5" />
                  <span>שליחת הודעה</span>
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* 4. UPGRADED LUXURY ADMIN PANEL ROUTE */}
      {currentRoute === 'admin' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
          {!isAdminAuthenticated ? (
            <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#11100E] border border-[#2B2722] text-white shadow-2xl text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#1C1A17] border border-[#3E3832] flex items-center justify-center text-[#C5A880]">
                <Lock className="w-6 h-6" />
              </div>

              {authStep === 'credentials' && (
                <>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#FAF8F5]">כניסת מנהל מערכת</h2>
                    <p className="text-xs text-[#8C8275] mt-1">אימות מאובטח בחיבור Supabase</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 text-right">
                    <div>
                      <label className="block text-xs font-semibold text-[#D5C7B2] mb-1">אימייל מנהל</label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@arikdiamonds.com"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#1C1A17] border border-[#3E3832] text-sm text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#D5C7B2] mb-1">סיסמה</label>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#1C1A17] border border-[#3E3832] text-sm text-white focus:outline-none focus:border-[#C5A880]"
                      />
                    </div>

                    {loginError && <p className="text-xs text-rose-400 font-semibold text-center">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3 rounded-xl bg-[#C5A880] text-[#11100E] font-bold text-xs tracking-wider uppercase hover:bg-[#b0936b] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isLoadingAuth ? 'בודק...' : 'המשך לאימות'}
                    </button>
                  </form>
                </>
              )}

              {authStep === 'enroll_qr' && (
                <>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white">הגדרת אימות דו-שלבי (2FA)</h2>
                    <p className="text-xs text-[#8C8275] mt-1 leading-relaxed">
                      סרוק את ה-QR באפליקציית Authenticator (Google או Microsoft) והזן את 6 הספרות.
                    </p>
                  </div>

                  {qrCodeUrl && (
                    <div className="flex justify-center p-3 bg-white border border-[#EDE6DC] rounded-2xl max-w-[190px] mx-auto">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1C1A17] border border-[#3E3832] text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-[#C5A880]"
                    />

                    {loginError && <p className="text-xs text-rose-400 font-semibold">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3 rounded-xl bg-[#C5A880] text-[#11100E] font-bold text-xs tracking-wider uppercase hover:bg-[#b0936b]"
                    >
                      {isLoadingAuth ? 'מאמת...' : 'הפעל 2FA והיכנס'}
                    </button>
                  </form>
                </>
              )}

              {authStep === 'verify_code' && (
                <>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white">אימות דו-שלבי (2FA)</h2>
                    <p className="text-xs text-[#8C8275] mt-1">הזן את 6 הספרות מהאפליקציה</p>
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1C1A17] border border-[#3E3832] text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-[#C5A880]"
                    />

                    {loginError && <p className="text-xs text-rose-400 font-semibold">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3 rounded-xl bg-[#C5A880] text-[#11100E] font-bold text-xs tracking-wider uppercase hover:bg-[#b0936b]"
                    >
                      {isLoadingAuth ? 'מאמת...' : 'כניסה למערכת'}
                    </button>
                  </form>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* ADMIN STATS BAR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#11100E] text-white p-5 rounded-2xl border border-[#2B2722] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8C8275] block font-semibold">סה"כ שווי מלאי</span>
                    <span className="text-xl font-bold font-mono text-[#C5A880]">₪{totalInventoryValue.toLocaleString()}</span>
                  </div>
                  <DollarSign className="w-8 h-8 text-[#3E3832]" />
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EDE6DC] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8C8275] block font-semibold">פריטים זמינים</span>
                    <span className="text-xl font-bold text-emerald-600">{activeCount} פריטים</span>
                  </div>
                  <Package className="w-8 h-8 text-emerald-100" />
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EDE6DC] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8C8275] block font-semibold">שמורים ללקוחות</span>
                    <span className="text-xl font-bold text-amber-600">{reservedCount} פריטים</span>
                  </div>
                  <Clock className="w-8 h-8 text-amber-100" />
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#EDE6DC] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#8C8275] block font-semibold">פריטים שנמכרו</span>
                    <span className="text-xl font-bold text-rose-600">{soldCount} פריטים</span>
                  </div>
                  <Award className="w-8 h-8 text-rose-100" />
                </div>
              </div>

              {/* ACTION BAR */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#EDE6DC] shadow-xs">
                <div>
                  <h1 className="text-2xl font-serif font-bold text-[#1C1A17]">פאנל ניהול מלאי - Arik Diamonds</h1>
                  <p className="text-xs text-[#8C8275] mt-0.5">סנכרון מלא ואוטומטי מול מסד הנתונים Supabase</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchProducts}
                    className="p-2.5 rounded-xl border border-[#EDE6DC] bg-[#FAF8F5] hover:bg-[#EDE6DC] transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-[#9E8255]" />
                    <span>רענן נתונים</span>
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

              {/* ADD PRODUCT FORM */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EDE6DC] shadow-xs space-y-6">
                <div className="flex items-center gap-2 border-b border-[#EDE6DC] pb-4">
                  <Plus className="w-5 h-5 text-[#9E8255]" />
                  <h2 className="font-serif font-bold text-lg text-[#1C1A17]">הוספת פריט חדש למאגר</h2>
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">סוג יהלום</label>
                    <select
                      value={newProduct.diamond_type}
                      onChange={e => setNewProduct({ ...newProduct, diamond_type: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      <option value="Natural">טבעי (Natural)</option>
                      <option value="Lab">מעבדה (Lab)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">צורת חיתוך (בעברית)</label>
                    <select
                      value={newProduct.shape}
                      onChange={e => setNewProduct({ ...newProduct, shape: e.target.value as DiamondShape })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">צבע (Color)</label>
                    <input
                      type="text"
                      placeholder="D / E / F"
                      value={newProduct.color}
                      onChange={e => setNewProduct({ ...newProduct, color: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">ניקיון (Clarity)</label>
                    <input
                      type="text"
                      placeholder="VVS1 / VS1"
                      value={newProduct.clarity}
                      onChange={e => setNewProduct({ ...newProduct, clarity: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">רמת חיתוך (Cut)</label>
                    <input
                      type="text"
                      placeholder="Excellent"
                      value={newProduct.cut}
                      onChange={e => setNewProduct({ ...newProduct, cut: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">תעודה גמולוגית</label>
                    <input
                      type="text"
                      placeholder="GIA / IGI"
                      value={newProduct.certificate}
                      onChange={e => setNewProduct({ ...newProduct, certificate: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#575047]">סטטוס פריט</label>
                    <select
                      value={newProduct.status}
                      onChange={e => setNewProduct({ ...newProduct, status: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
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
                        className="px-4 py-2 bg-[#1C1A17] text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#332F2A]"
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
                      className="w-full sm:w-auto px-8 py-3 bg-[#1C1A17] text-white rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-[#332F2A] shadow-xs cursor-pointer"
                    >
                      שמור פריט ב-Supabase
                    </button>
                  </div>
                </form>
              </div>

              {/* PRODUCTS LIST TABLE */}
              <div className="bg-white rounded-3xl border border-[#EDE6DC] shadow-xs overflow-hidden">
                <div className="p-6 border-b border-[#EDE6DC] flex justify-between items-center">
                  <h3 className="font-serif font-bold text-base text-[#1C1A17]">
                    רשימת פריטים פעילים ({products.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-[#FAF8F5] text-[#8C8275] border-b border-[#EDE6DC]">
                      <tr>
                        <th className="py-3.5 px-4 font-semibold">תמונה</th>
                        <th className="py-3.5 px-4 font-semibold">מק"ט</th>
                        <th className="py-3.5 px-4 font-semibold">כותרת</th>
                        <th className="py-3.5 px-4 font-semibold">סוג</th>
                        <th className="py-3.5 px-4 font-semibold">צורת חיתוך</th>
                        <th className="py-3.5 px-4 font-semibold">קראט</th>
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
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.diamond_type === 'Lab' ? 'bg-amber-50 text-amber-700' : 'bg-neutral-100 text-neutral-800'}`}>
                                {p.diamond_type === 'Lab' ? 'מעבדה' : 'טבעי'}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-medium text-[#9E8255]">
                              {shapeObj ? shapeObj.labelHe : p.shape}
                            </td>
                            <td className="py-3 px-4">{p.carat} ct</td>
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
              </div>
            </div>
          )}

          {/* EDIT MODAL */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white border border-[#EDE6DC] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-4">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[#9E8255]" />
                    <h3 className="font-serif font-bold text-lg text-[#1C1A17]">עריכת פריט: {editingProduct.sku}</h3>
                  </div>
                  <button onClick={() => setEditingProduct(null)} className="p-1.5 rounded-full hover:bg-[#FAF8F5]">
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
                    <label className="block mb-1 font-semibold text-[#575047]">סוג יהלום</label>
                    <select
                      value={editingProduct.diamond_type || 'Natural'}
                      onChange={e => setEditingProduct({ ...editingProduct, diamond_type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#D5C7B2]"
                    >
                      <option value="Natural">טבעי (Natural)</option>
                      <option value="Lab">מעבדה (Lab)</option>
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
                      <img src={uploadedImagePreview || editingProduct.image} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-[#D5C7B2]" />
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
                      <label htmlFor="edit-modal-image-upload" className="px-3.5 py-2 bg-[#1C1A17] text-white rounded-xl cursor-pointer text-[11px] font-semibold">
                        החלף תמונה
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-3 border-t border-[#EDE6DC]">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 bg-[#EFE9DF] text-[#1C1A17] rounded-xl font-semibold"
                    >
                      ביטול
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#1C1A17] text-white rounded-xl font-semibold"
                    >
                      שמור שינויים
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      )}

      {/* MOBILE FILTERS DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMobileFilterOpen(false)} />
          <div className="relative z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-xs">
            <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-3">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#1C1A17]">
                <Filter className="w-4 h-4 text-[#9E8255]" />
                <span>סינון יהלומים ותכשיטים</span>
              </div>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-full hover:bg-[#FAF8F5]">
                <X className="w-5 h-5 text-[#8C8275]" />
              </button>
            </div>

            {/* Shape Mobile */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#575047]">צורת חיתוך</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setSelectedShape('all')}
                  className={`col-span-3 py-2 rounded-xl text-xs font-semibold ${selectedShape === 'all' ? 'bg-[#1C1A17] text-white' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                >
                  כל הצורות
                </button>
                {SHAPES_DATA.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedShape(s.value)}
                    className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center ${selectedShape === s.value ? 'bg-[#9E8255] text-white font-bold' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                  >
                    <span className="font-bold text-xs">{s.labelHe}</span>
                    <span className="text-[9px] opacity-75">{s.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Diamond Type Mobile */}
            <div className="space-y-1.5">
              <label className="font-bold text-[#575047]">סוג יהלום</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setSelectedDiamondType('all')}
                  className={`py-2 rounded-xl text-xs font-semibold ${selectedDiamondType === 'all' ? 'bg-[#1C1A17] text-white' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                >
                  הכל
                </button>
                <button
                  onClick={() => setSelectedDiamondType('Natural')}
                  className={`py-2 rounded-xl text-xs font-semibold ${selectedDiamondType === 'Natural' ? 'bg-[#9E8255] text-white font-bold' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                >
                  טבעי
                </button>
                <button
                  onClick={() => setSelectedDiamondType('Lab')}
                  className={`py-2 rounded-xl text-xs font-semibold ${selectedDiamondType === 'Lab' ? 'bg-[#9E8255] text-white font-bold' : 'bg-[#FAF8F5] border border-[#D5C7B2]'}`}
                >
                  מעבדה
                </button>
              </div>
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

      {/* 5. FOOTER */}
      <footer className="bg-[#11100E] text-[#EDE6DC] border-t border-[#2B2722] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-[#C5A880]" />
                <span className="font-serif font-bold text-lg text-white">ARIK YAKOBOV DIAMONDS</span>
              </div>
              <p className="text-xs text-[#D5C7B2]/80 leading-relaxed">
                ייצור תכשיטים בעיצוב אישית | Lab & Natural Diamonds.
                <br />
                חדר עסקאות ישיר בבורסת היהלומים רמת גן, בניין שמשון.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm">פגישות ושירות אישי</h4>
              <div className="flex items-center gap-2 text-[#D5C7B2]/90">
                <MapPin className="w-4 h-4 text-[#C5A880]" />
                <span>בורסת היהלומים רמת גן, בניין שמשון</span>
              </div>
              <div className="flex items-center gap-2 text-[#D5C7B2]/90">
                <Phone className="w-4 h-4 text-[#C5A880]" />
                <a href={`tel:${PHONE_NUMBER}`} className="hover:underline">{DISPLAY_PHONE}</a>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white text-sm">ביטחון ואחריות</h4>
              <p className="text-[#D5C7B2]/80">
                כל היהלומים מלווים בתעודה גמולוגית מקורית (GIA / IGI) ואחריות מקיפה לכל החיים.
              </p>
            </div>
          </div>

          <div className="border-t border-[#2B2722] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8C8275] gap-4">
            <span>© 2026 אריק יעקובוב - Arik Yakobov Diamonds. כל הזכויות שמורות.</span>
            <button 
              onClick={() => navigateTo('admin')} 
              className="hover:text-[#C5A880] transition-colors"
            >
              כניסת ניהול
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
