import React, { useState, useEffect, useRef } from 'react';
import { 
  Diamond, 
  Phone, 
  MapPin, 
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
  Clock,
  Send,
  Save,
  ShieldCheck,
  Award,
  Calendar,
  Image as ImageIcon,
  FileText,
  Settings,
  Trash
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
  sku?: string;
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

export interface CarouselSlide {
  id: string;
  image: string;
  title: string;
  tag: string;
}

const DEFAULT_MARQUEE_TEXT = '✦ Arik Yakobov Diamonds 💎 | ייצור תכשיטי יוקרה בעיצוב אישי | Lab & Natural Diamonds | 📍 בורסת היהלומים רמת גן, בניין שמשון | 📞 054-4847078 | תעודות גמולוגיות בינלאומיות GIA / IGI ✦';

const DEFAULT_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: '1',
    image: '/images/ring-marquise.webp',
    title: 'טבעת סוליטר מרקיזה 1.80 קראט',
    tag: 'יהלום טבעי Natural'
  },
  {
    id: '2',
    image: '/images/ring-round-solitaire.webp',
    title: 'טבעת סוליטר קלאסית 6 שיניים',
    tag: 'חיתוך עגול מושלם'
  },
  {
    id: '3',
    image: '/images/ring-cushion-pave.webp',
    title: 'טבעת קושיון בשיבוץ Pavé',
    tag: 'Lab Diamond יוקרתי'
  },
  {
    id: '4',
    image: '/images/ring-oval-gold.webp',
    title: 'טבעת אובל בזהב צהוב 18K',
    tag: 'הילה נסתרת Hidden Halo'
  },
  {
    id: '5',
    image: '/images/ring-round-split.webp',
    title: 'טבעת סוליטר חישוק כפול משובץ',
    tag: 'ייצור אישי בבורסה'
  }
];

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
  { value: 'earrings', labelHe: 'עגילי יהלומים' },
  { value: 'high_jewelry', labelHe: 'תכשיטי יוקרה בהתאמה אישית' },
];

const INITIAL_PRODUCTS: DiamondProduct[] = [
  {
    id: '1',
    title: 'טבעת סוליטר מרקיזה יוקרתית בשיבוץ יהלום 1.80 קראט',
    category: 'engagement',
    diamond_type: 'Natural',
    shape: 'Marquise',
    carat: 1.80,
    color: 'D',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: 46800,
    status: 'available',
    certificate: 'GIA',
    image: '/images/ring-marquise.webp'
  },
  {
    id: '2',
    title: 'טבעת סוליטר מלכותית 6 שיניים בשיבוץ יהלום עגול 2.10 קראט',
    category: 'engagement',
    diamond_type: 'Natural',
    shape: 'Round',
    carat: 2.10,
    color: 'E',
    clarity: 'VVS2',
    cut: 'Excellent',
    price: 54000,
    status: 'available',
    certificate: 'GIA',
    image: '/images/ring-round-solitaire.webp'
  },
  {
    id: '3',
    title: 'טבעת קושיון בשיבוץ שורת יהלומים Pavé עדינה 1.70 קראט',
    category: 'engagement',
    diamond_type: 'Lab',
    shape: 'Cushion',
    carat: 1.70,
    color: 'D',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: 19800,
    status: 'available',
    certificate: 'IGI',
    image: '/images/ring-cushion-pave.webp'
  },
  {
    id: '4',
    title: 'טבעת אובל יוקרתית בזהב צהוב 18K עם הילה נסתרת 2.05 קראט',
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
    image: '/images/ring-oval-gold.webp'
  },
  {
    id: '5',
    title: 'טבעת סוליטר עגולה בשיבוץ חישוק כפול משובץ יהלומים 1.65 קראט',
    category: 'engagement',
    diamond_type: 'Natural',
    shape: 'Round',
    carat: 1.65,
    color: 'F',
    clarity: 'VVS1',
    cut: 'Excellent',
    price: 38900,
    status: 'available',
    certificate: 'GIA',
    image: '/images/ring-round-split.webp'
  }
];

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<'home' | 'shop' | 'about' | 'contactus' | 'admin'>('home');
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [selectedProductView, setSelectedProductView] = useState<DiamondProduct | null>(null);

  // Dynamic Site Settings (Saved in localStorage / state)
  const [phoneText, setPhoneText] = useState(() => localStorage.getItem('ay_phone') || '054-4847078');
  const [heroTitle, setHeroTitle] = useState(() => localStorage.getItem('ay_hero_title') || 'היהלומים הנדירים של בורסת היהלומים');
  const [heroSubTitle, setHeroSubTitle] = useState(() => localStorage.getItem('ay_hero_subtitle') || 'חוויית בוטיק יוקרתית בחדר העסקאות בבניין שמשון. רכישת יהלומים מלוטשים ותכשיטים בעיצוב אישי, ללא פערי תיווך, בדירוג הבינלאומי המוביל GIA / IGI.');
  const [aboutText, setAboutText] = useState(() => localStorage.getItem('ay_about_text') || 'אנו מתמחים בייצור תכשיטי עילית בעיצוב אישי וברכישת יהלומים טבעיים ויהלומי מעבדה ישירות מחברי בורסת היהלומים ברמת גן, ללא פערי תיווך וללא עמלות מיותרות.');
  const [marqueeText, setMarqueeText] = useState(() => localStorage.getItem('ay_marquee_text') || DEFAULT_MARQUEE_TEXT);

  // Dynamic Carousel Slides
  const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>(() => {
    const saved = localStorage.getItem('ay_carousel_slides');
    return saved ? JSON.parse(saved) : DEFAULT_CAROUSEL_SLIDES;
  });
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Carousel Auto Switcher
  useEffect(() => {
    if (carouselSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % carouselSlides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [carouselSlides]);

  // Products State
  const [products, setProducts] = useState<DiamondProduct[]>(INITIAL_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [selectedDiamondType, setSelectedDiamondType] = useState<DiamondType>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedClarity, setSelectedClarity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(100000);
  const [minCarat, setMinCarat] = useState<number>(0.3);

  // Responsive Drawers
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Admin Dashboard Tabs: 'products' | 'carousel' | 'content' | 'settings'
  const [adminTab, setAdminTab] = useState<'products' | 'carousel' | 'content' | 'settings'>('products');

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

  // Product Editing/Adding States
  const [editingProduct, setEditingProduct] = useState<DiamondProduct | null>(null);
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  const [newProduct, setNewProduct] = useState({
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

  // Carousel Slide Add/Edit State
  const [newSlide, setNewSlide] = useState({
    title: '',
    tag: '',
    image: ''
  });
  const [newSlideImagePreview, setNewSlideImagePreview] = useState<string | null>(null);
  const slideFileInputRef = useRef<HTMLInputElement>(null);

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

  // Carousel Handlers
  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.title || !newSlide.tag) {
      alert('נא למלא כותרת ותגית לשקופית');
      return;
    }

    let slideImageUrl = '/images/ring-round-solitaire.webp';

    if (slideFileInputRef.current?.files?.[0]) {
      const file = slideFileInputRef.current.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `slide_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (!uploadError) {
        const { data } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        slideImageUrl = data.publicUrl;
      }
    } else if (newSlide.image) {
      slideImageUrl = newSlide.image;
    }

    const updatedSlides: CarouselSlide[] = [
      ...carouselSlides,
      {
        id: Date.now().toString(),
        title: newSlide.title,
        tag: newSlide.tag,
        image: slideImageUrl
      }
    ];

    setCarouselSlides(updatedSlides);
    localStorage.setItem('ay_carousel_slides', JSON.stringify(updatedSlides));
    setNewSlide({ title: '', tag: '', image: '' });
    setNewSlideImagePreview(null);
    if (slideFileInputRef.current) slideFileInputRef.current.value = '';
    alert('שקופית חדשה נוספה בהצלחה לקרוסלה!');
  };

  const handleDeleteSlide = (id: string) => {
    if (carouselSlides.length <= 1) {
      alert('חייבת להישאר לפחות שקופית אחת בקרוסלה.');
      return;
    }
    if (!window.confirm('האם להסיר שקופית זו מהקרוסלה?')) return;
    const updated = carouselSlides.filter(s => s.id !== id);
    setCarouselSlides(updated);
    localStorage.setItem('ay_carousel_slides', JSON.stringify(updated));
  };

  // Product Add / Update Handlers
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) {
      alert('נא למלא את כל שדות החובה');
      return;
    }

    let imageUrl = '/images/ring-round-solitaire.webp';

    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `product_${Date.now()}.${fileExt}`;

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
        sku: `AY-${Date.now().toString().slice(-6)}`,
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
      alert('התכשיט נוסף בהצלחה לקולקציה!');
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
    if (!window.confirm('האם למחוק פריט זה מהגלריה?')) return;
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
                          product.shape.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesShape && matchesType && matchesColor && matchesClarity && matchesCarat && matchesPrice && matchesSearch;
  });

  const cleanPhone = phoneText.replace(/[^0-9]/g, '');
  const dynamicWhatsappLink = `https://wa.me/972${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent('שלום אריק, הגעתי דרך האתר ואשמח לייעוץ בנוגע לטבעות ויהלומים בעיצוב אישי.')}`;

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1C18] font-sans flex flex-col antialiased overflow-x-hidden selection:bg-[#B39359] selection:text-white" dir="rtl">
      
      {/* 1. RUNNING TICKER MARQUEE */}
      <style>{`
        @keyframes customMarquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: customMarquee 32s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="bg-[#141210] text-[#D8C7B0] py-2.5 overflow-hidden border-b border-[#282420] relative select-none">
        <div className="marquee-track">
          <div className="flex items-center gap-12 text-[11px] sm:text-xs font-medium tracking-wider whitespace-nowrap pl-6">
            <span>{marqueeText}</span>
          </div>
          <div className="flex items-center gap-12 text-[11px] sm:text-xs font-medium tracking-wider whitespace-nowrap pl-6">
            <span>{marqueeText}</span>
          </div>
        </div>
      </div>

      {/* 2. LUXURY BOUTIQUE HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EAE3D6] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 sm:h-24 flex items-center justify-between">
          
          {/* LOGO */}
          <div 
            onClick={() => navigateTo('home')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#1A1815] flex items-center justify-center text-[#B39359] border border-[#B39359]/30 transition-transform duration-300 group-hover:scale-105 shadow-xs">
              <Diamond className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-lg sm:text-2xl font-serif font-bold tracking-wider text-[#141210] leading-none">
                ARIK YAKOBOV
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.3em] text-[#8F8171] uppercase font-semibold mt-1">
                HAUTE JOAILLERIE & DIAMONDS
              </span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-[#544B41]">
            <button
              onClick={() => navigateTo('home')}
              className={`hover:text-[#B39359] transition-colors py-2 relative ${
                currentRoute === 'home' ? 'text-[#B39359] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#B39359]' : ''
              }`}
            >
              דף הבית
            </button>

            <div className="relative group">
              <button
                onClick={() => navigateTo('shop')}
                onMouseEnter={() => setIsShopDropdownOpen(true)}
                className={`flex items-center gap-1 hover:text-[#B39359] transition-colors py-2 relative ${
                  currentRoute === 'shop' ? 'text-[#B39359] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#B39359]' : ''
                }`}
              >
                <span>הקולקציה</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
              </button>

              {isShopDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsShopDropdownOpen(false)}
                  className="absolute top-full right-0 w-64 bg-white border border-[#EAE3D6] rounded-2xl shadow-xl p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-right"
                >
                  <div className="text-[10px] font-bold text-[#8F8171] uppercase tracking-wider px-3 py-1.5 border-b border-[#FAF8F5]">
                    קטגוריות נבחרות
                  </div>
                  {CATEGORIES_DATA.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => navigateTo('shop', cat.value)}
                      className={`w-full text-right px-3.5 py-2.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                        selectedCategory === cat.value && currentRoute === 'shop'
                          ? 'bg-[#F5F0E6] text-[#B39359] font-bold'
                          : 'hover:bg-[#FAF8F5] text-[#1F1C18]'
                      }`}
                    >
                      <span>{cat.labelHe}</span>
                      {selectedCategory === cat.value && currentRoute === 'shop' && <Check className="w-3.5 h-3.5 text-[#B39359]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateTo('about')}
              className={`hover:text-[#B39359] transition-colors py-2 relative ${
                currentRoute === 'about' ? 'text-[#B39359] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#B39359]' : ''
              }`}
            >
              אודות הבוטיק
            </button>

            <button
              onClick={() => navigateTo('contactus')}
              className={`hover:text-[#B39359] transition-colors py-2 relative ${
                currentRoute === 'contactus' ? 'text-[#B39359] font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#B39359]' : ''
              }`}
            >
              תיאום פגישה בבורסה
            </button>
          </nav>

          {/* VIP BOOKING BUTTON & MOBILE MENU */}
          <div className="flex items-center gap-3">
            <a
              href={`tel:${cleanPhone}`}
              className="hidden sm:flex items-center gap-2.5 bg-[#141210] text-[#D8C7B0] border border-[#B39359]/40 px-5 py-2.5 rounded-full text-xs font-semibold tracking-wider hover:bg-[#201D19] transition-all shadow-xs"
            >
              <Phone className="w-3.5 h-3.5 text-[#B39359]" />
              <span>{phoneText}</span>
            </a>

            <button
              onClick={() => setIsMobileNavOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-[#141210]"
              aria-label="תפריט"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileNavOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsMobileNavOpen(false)} />
          <div className="relative z-50 w-4/5 max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto text-right">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-4">
                <div className="flex items-center gap-2">
                  <Diamond className="w-5 h-5 text-[#B39359]" />
                  <span className="font-serif font-bold text-sm text-[#141210]">ARIK YAKOBOV</span>
                </div>
                <button onClick={() => setIsMobileNavOpen(false)} className="p-1 rounded-full hover:bg-[#FAF8F5]">
                  <X className="w-5 h-5 text-[#8F8171]" />
                </button>
              </div>

              <div className="space-y-1.5 text-sm font-semibold">
                <button 
                  onClick={() => navigateTo('home')} 
                  className={`w-full text-right py-2.5 px-3 rounded-xl ${currentRoute === 'home' ? 'bg-[#F5F0E6] text-[#B39359]' : 'hover:bg-[#FAF8F5]'}`}
                >
                  דף הבית
                </button>
                <button 
                  onClick={() => navigateTo('shop')} 
                  className={`w-full text-right py-2.5 px-3 rounded-xl ${currentRoute === 'shop' ? 'bg-[#F5F0E6] text-[#B39359]' : 'hover:bg-[#FAF8F5]'}`}
                >
                  הקולקציה המלאה
                </button>
                <button 
                  onClick={() => navigateTo('about')} 
                  className={`w-full text-right py-2.5 px-3 rounded-xl ${currentRoute === 'about' ? 'bg-[#F5F0E6] text-[#B39359]' : 'hover:bg-[#FAF8F5]'}`}
                >
                  אודות הבוטיק
                </button>
                <button 
                  onClick={() => navigateTo('contactus')} 
                  className={`w-full text-right py-2.5 px-3 rounded-xl ${currentRoute === 'contactus' ? 'bg-[#F5F0E6] text-[#B39359]' : 'hover:bg-[#FAF8F5]'}`}
                >
                  תיאום פגישה בבורסה
                </button>
              </div>

              <div className="pt-3 border-t border-[#EAE3D6] space-y-1">
                <p className="text-[11px] font-bold text-[#8F8171] uppercase tracking-wider px-3 mb-1">קטגוריות</p>
                {CATEGORIES_DATA.map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => navigateTo('shop', cat.value)}
                    className="w-full text-right py-2 px-3 rounded-lg text-xs text-[#544B41] hover:bg-[#FAF8F5] flex items-center justify-between"
                  >
                    <span>{cat.labelHe}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D8C7B0] rotate-180" />
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#EAE3D6] pt-4">
              <a
                href={dynamicWhatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#141210] text-[#D8C7B0] border border-[#B39359]/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#B39359]" />
                <span>וואטסאפ: {phoneText}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 3. DYNAMIC CONTENT VIEWS */}
      
      {/* HOME PAGE */}
      {currentRoute === 'home' && (
        <main className="flex-1">
          
          {/* HERO SECTION */}
          <section className="relative bg-[#141210] text-white py-20 sm:py-32 px-4 sm:px-8 border-b border-[#282420] overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6 text-right z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#201D19] border border-[#B39359]/30 text-[#D8C7B0] text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#B39359]" />
                  <span>ייצור תכשיטים בעיצוב אישי | Lab & Natural Diamonds</span>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-wide text-[#FAF8F5]">
                  {heroTitle}
                </h1>
                <p className="text-xs sm:text-base text-[#D8C7B0]/90 max-w-xl leading-relaxed font-light">
                  {heroSubTitle}
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={() => navigateTo('shop')}
                    className="px-8 py-4 bg-[#B39359] text-[#141210] font-bold rounded-full text-xs uppercase tracking-widest hover:bg-[#a18349] transition-all shadow-lg hover:shadow-[#B39359]/20"
                  >
                    לצפייה בקולקציה
                  </button>
                  <button
                    onClick={() => navigateTo('contactus')}
                    className="px-7 py-4 bg-transparent border border-[#B39359]/50 text-[#D8C7B0] font-medium rounded-full text-xs uppercase tracking-wider hover:bg-[#201D19] transition-all"
                  >
                    תיאום פגישה אישית בבורסה
                  </button>
                </div>
              </div>

              {/* HERO AUTOMATIC SLIDING GALLERY */}
              <div className="lg:col-span-5 relative z-10 flex justify-center">
                <div className="w-full max-w-md aspect-4/5 rounded-3xl overflow-hidden border border-[#B39359]/30 shadow-2xl relative group bg-[#1A1815]">
                  
                  {carouselSlides.map((slide, idx) => (
                    <div 
                      key={slide.id}
                      className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                        idx === currentHeroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                      }`}
                    >
                      <img 
                        src={slide.image} 
                        alt={slide.title} 
                        className="w-full h-full object-cover scale-105"
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-8 text-right">
                        <span className="text-[#B39359] text-[11px] font-mono tracking-widest uppercase">{slide.tag}</span>
                        <h3 className="font-serif font-bold text-white text-lg sm:text-xl mt-1">{slide.title}</h3>
                        <p className="text-[11px] text-[#D8C7B0]/80 mt-0.5">בורסת היהלומים רמת גן, בניין שמשון</p>
                      </div>
                    </div>
                  ))}

                  {/* Slide Indicator Dots */}
                  <div className="absolute bottom-4 left-6 z-20 flex gap-1.5">
                    {carouselSlides.map((_, dotIdx) => (
                      <span 
                        key={dotIdx}
                        className={`h-1.5 rounded-full transition-all duration-500 ${
                          dotIdx === currentHeroIndex ? 'w-5 bg-[#B39359]' : 'w-1.5 bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* SHOWROOM CATEGORIES */}
          <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
            <div className="text-center space-y-3 mb-12">
              <span className="text-xs font-mono text-[#B39359] tracking-widest uppercase">קטלוג נבחר</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#141210]">קולקציות הבוטיק</h2>
              <div className="w-12 h-0.5 bg-[#B39359] mx-auto mt-2" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
              {CATEGORIES_DATA.filter(c => c.value !== 'all').map(cat => (
                <div
                  key={cat.value}
                  onClick={() => navigateTo('shop', cat.value)}
                  className="bg-white p-6 rounded-2xl border border-[#EAE3D6] text-center hover:border-[#B39359] hover:shadow-lg transition-all duration-300 cursor-pointer group flex flex-col justify-between"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF8F5] border border-[#EAE3D6] flex items-center justify-center text-[#B39359] mb-4 group-hover:bg-[#141210] group-hover:border-[#B39359] transition-colors">
                    <Diamond className="w-5 h-5 stroke-[1.5]" />
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#141210] leading-snug">{cat.labelHe}</h4>
                  <span className="text-[10px] text-[#B39359] font-medium mt-2 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    צפייה בפריטים <ArrowRight className="w-3 h-3 rotate-180" />
                  </span>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* SHOWROOM / CATALOG PAGE */}
      {currentRoute === 'shop' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full">
          
          <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#EAE3D6] pb-6 text-right">
            <div>
              <span className="text-xs font-mono text-[#B39359] tracking-widest uppercase">גלריית יוקרה</span>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-[#141210] mt-1">הקולקציה המלאה</h1>
              <p className="text-xs text-[#8F8171] mt-1">בורסת היהלומים רמת גן, בניין שמשון</p>
            </div>
            
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden self-start px-5 py-2.5 bg-[#141210] text-[#D8C7B0] rounded-full text-xs font-semibold flex items-center gap-2 border border-[#B39359]/30"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#B39359]" />
              <span>סינון והתאמת פריטים ({filteredProducts.length})</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
            
            {/* RIGHT SIDEBAR FILTERS (DESKTOP) */}
            <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-3xl border border-[#EAE3D6] shadow-xs space-y-6 sticky top-28 text-xs text-right">
              <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-4">
                <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#141210]">
                  <Filter className="w-4 h-4 text-[#B39359]" />
                  <span>סינון והתאמת תכשיט</span>
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
                  className="text-[11px] text-[#B39359] hover:underline"
                >
                  איפוס
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#544B41]">חיפוש חופשי</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="סוליטר, מרקיזה, אובל..."
                    className="w-full pr-8 pl-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6] text-xs focus:outline-none focus:border-[#B39359]"
                  />
                  <Search className="w-3.5 h-3.5 text-[#8F8171] absolute right-2.5 top-2.5" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#544B41]">סוג היהלום</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setSelectedDiamondType('all')}
                    className={`py-2 rounded-xl font-medium text-[11px] transition-all ${selectedDiamondType === 'all' ? 'bg-[#141210] text-white' : 'bg-[#FAF8F5] border border-[#EAE3D6]'}`}
                  >
                    הכל
                  </button>
                  <button
                    onClick={() => setSelectedDiamondType('Natural')}
                    className={`py-2 rounded-xl font-medium text-[11px] transition-all ${selectedDiamondType === 'Natural' ? 'bg-[#B39359] text-white font-bold' : 'bg-[#FAF8F5] border border-[#EAE3D6]'}`}
                  >
                    טבעי
                  </button>
                  <button
                    onClick={() => setSelectedDiamondType('Lab')}
                    className={`py-2 rounded-xl font-medium text-[11px] transition-all ${selectedDiamondType === 'Lab' ? 'bg-[#B39359] text-white font-bold' : 'bg-[#FAF8F5] border border-[#EAE3D6]'}`}
                  >
                    מעבדה
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#544B41]">קטגוריית תכשיט</label>
                <div className="space-y-1">
                  {CATEGORIES_DATA.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full text-right px-3.5 py-2 rounded-xl transition-colors flex items-center justify-between ${
                        selectedCategory === cat.value ? 'bg-[#F5F0E6] text-[#B39359] font-bold' : 'hover:bg-[#FAF8F5] text-[#544B41]'
                      }`}
                    >
                      <span>{cat.labelHe}</span>
                      {selectedCategory === cat.value && <Check className="w-3.5 h-3.5 text-[#B39359]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-[#544B41]">צורת חיתוך היהלום</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setSelectedShape('all')}
                    className={`col-span-3 py-1.5 rounded-xl text-[11px] font-semibold ${selectedShape === 'all' ? 'bg-[#141210] text-white' : 'bg-[#FAF8F5] border border-[#EAE3D6]'}`}
                  >
                    כל הצורות
                  </button>
                  {SHAPES_DATA.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setSelectedShape(s.value)}
                      className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition-all ${
                        selectedShape === s.value ? 'bg-[#B39359] text-white font-bold' : 'bg-[#FAF8F5] border border-[#EAE3D6] text-[#544B41]'
                      }`}
                    >
                      <span className="font-bold text-[11px]">{s.labelHe}</span>
                      <span className="text-[9px] opacity-75">{s.labelEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-[#544B41]">עד תקציב:</span>
                  <span className="font-bold text-[#B39359]">₪{priceRange.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="2500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#B39359] cursor-pointer"
                />
              </div>
            </aside>

            {/* PRODUCT GRID SHOWROOM */}
            <div className="lg:col-span-3 space-y-6">
              
              <div className="flex items-center justify-between text-xs text-[#8F8171] border-b border-[#EAE3D6] pb-3">
                <div>
                  מוצגים <span className="font-bold text-[#141210]">{filteredProducts.length}</span> פריטים ייחודיים
                </div>
                <div>
                  כל התכשיטים מיוצרים ומלוטשים בבורסת היהלומים
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-3xl border border-[#EAE3D6] p-12 text-center space-y-4">
                  <Diamond className="w-12 h-12 text-[#EAE3D6] mx-auto" />
                  <h3 className="font-serif font-bold text-lg text-[#141210]">לא נמצאו פריטים תואמים</h3>
                  <p className="text-xs text-[#8F8171]">ניתן לאפס את המסננים או לפנות אלינו לייצור תכשיט מותאם אישית מאפס.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                  {filteredProducts.map(product => {
                    const shapeObj = SHAPES_DATA.find(s => s.value === product.shape);
                    return (
                      <div 
                        key={product.id}
                        onClick={() => setSelectedProductView(product)}
                        className="bg-white rounded-3xl border border-[#EAE3D6] overflow-hidden shadow-xs hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          <div className="relative aspect-4/5 overflow-hidden bg-[#FAF8F5]">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            
                            <div className="absolute top-4 right-4 flex items-center gap-1.5">
                              <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[11px] font-bold text-[#141210] shadow-xs">
                                {shapeObj ? shapeObj.labelHe : product.shape}
                              </span>
                              {product.diamond_type && (
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white tracking-wider ${product.diamond_type === 'Natural' ? 'bg-[#141210]' : 'bg-[#B39359]'}`}>
                                  {product.diamond_type === 'Natural' ? 'טבעי' : 'מעבדה'}
                                </span>
                              )}
                            </div>

                            {product.status !== 'available' && (
                              <div className="absolute inset-0 bg-black/50 backdrop-blur-2xs flex items-center justify-center">
                                <span className="px-5 py-2 rounded-full bg-white text-[#141210] text-xs font-bold uppercase tracking-wider">
                                  {product.status === 'reserved' ? 'שמור ללקוח' : 'נמכר'}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="p-6 space-y-3 text-right">
                            <div className="flex items-center justify-between text-[11px] text-[#8F8171] font-medium">
                              <span>{product.carat} קראט</span>
                              <span className="font-mono">{product.certificate} Certificate</span>
                            </div>

                            <h3 className="font-serif font-bold text-base text-[#141210] leading-snug group-hover:text-[#B39359] transition-colors line-clamp-2">
                              {product.title}
                            </h3>

                            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px]">
                              <div className="bg-[#FAF8F5] border border-[#EAE3D6] rounded-xl py-1.5">
                                <span className="text-[#8F8171] block font-light">צבע</span>
                                <span className="font-bold text-[#141210]">{product.color}</span>
                              </div>
                              <div className="bg-[#FAF8F5] border border-[#EAE3D6] rounded-xl py-1.5">
                                <span className="text-[#8F8171] block font-light">ניקיון</span>
                                <span className="font-bold text-[#141210]">{product.clarity}</span>
                              </div>
                              <div className="bg-[#FAF8F5] border border-[#EAE3D6] rounded-xl py-1.5">
                                <span className="text-[#8F8171] block font-light">חיתוך</span>
                                <span className="font-bold text-[#141210]">{product.cut}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="p-6 pt-0 flex items-center justify-between border-t border-[#FAF8F5] mt-3">
                          <div className="text-right">
                            <span className="text-[10px] text-[#8F8171] block font-light">מחיר בורסה ישיר</span>
                            <span className="text-lg font-serif font-bold text-[#141210]">
                              ₪{product.price.toLocaleString()}
                            </span>
                          </div>

                          <div className="px-4 py-2 rounded-full bg-[#FAF8F5] border border-[#EAE3D6] text-[#B39359] group-hover:bg-[#141210] group-hover:border-[#141210] group-hover:text-white transition-all text-xs font-semibold flex items-center gap-1">
                            <span>פרטים ומדידה</span>
                            <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                          </div>
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

      {/* 4. PRODUCT DETAIL MODAL */}
      {selectedProductView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[#EAE3D6] rounded-3xl max-w-4xl w-full p-6 sm:p-10 relative shadow-2xl max-h-[92vh] overflow-y-auto text-right">
            
            <button 
              onClick={() => setSelectedProductView(null)}
              className="absolute top-6 left-6 p-2 rounded-full bg-[#FAF8F5] border border-[#EAE3D6] text-[#8F8171] hover:text-[#141210] hover:bg-[#F5F0E6] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              <div className="aspect-square rounded-2xl overflow-hidden border border-[#EAE3D6] bg-[#FAF8F5] relative">
                <img 
                  src={selectedProductView.image} 
                  alt={selectedProductView.title}
                  className="w-full h-full object-cover" 
                />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/95 text-xs font-bold text-[#141210] shadow-sm">
                    חיתוך {SHAPES_DATA.find(s => s.value === selectedProductView.shape)?.labelHe || selectedProductView.shape}
                  </span>
                  {selectedProductView.diamond_type && (
                    <span className="px-3 py-1 rounded-full bg-[#B39359] text-xs font-bold text-white">
                      {selectedProductView.diamond_type === 'Natural' ? 'יהלום טבעי' : 'יהלום מעבדה'}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs font-mono text-[#B39359] uppercase tracking-widest">ARIK YAKOBOV SHOWROOM</span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#141210] mt-1 leading-snug">
                    {selectedProductView.title}
                  </h2>
                  <div className="text-2xl font-serif font-bold text-[#141210] mt-3">
                    ₪{selectedProductView.price.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE3D6]">
                    <span className="text-[10px] text-[#8F8171] block">משקל קראט</span>
                    <span className="font-bold text-[#141210]">{selectedProductView.carat} ct</span>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE3D6]">
                    <span className="text-[10px] text-[#8F8171] block">צבע (Color)</span>
                    <span className="font-bold text-[#141210]">{selectedProductView.color}</span>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE3D6]">
                    <span className="text-[10px] text-[#8F8171] block">ניקיון (Clarity)</span>
                    <span className="font-bold text-[#141210]">{selectedProductView.clarity}</span>
                  </div>
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EAE3D6]">
                    <span className="text-[10px] text-[#8F8171] block">תעודה</span>
                    <span className="font-bold text-[#141210]">{selectedProductView.certificate}</span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-[#544B41] pt-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#B39359]" />
                    <span>אחריות מקיפה לכל החיים ושירות ניקוי וחידוש חינם</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#B39359]" />
                    <span>תעודה גמולוגית בינלאומית מקורית (GIA / IGI)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#B39359]" />
                    <span>מפגש מדידה אישי בחדר העסקאות בבורסת היהלומים (בניין שמשון)</span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/972${cleanPhone.startsWith('0') ? cleanPhone.slice(1) : cleanPhone}?text=${encodeURIComponent(`שלום אריק, אני מעוניין לתאם פגישה ומדידה בבורסה עבור: ${selectedProductView.title}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 bg-[#141210] text-[#D8C7B0] border border-[#B39359]/40 rounded-full font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-[#201D19] transition-all shadow-md"
                  >
                    <Calendar className="w-4 h-4 text-[#B39359]" />
                    <span>תיאום פגישה ומדידה בבורסה בוואטסאפ</span>
                  </a>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="w-full py-3 bg-[#FAF8F5] border border-[#EAE3D6] text-[#141210] rounded-full font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#F5F0E6] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#B39359]" />
                    <span>שיחה ישירה עם אריק: {phoneText}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABOUT PAGE */}
      {currentRoute === 'about' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-right space-y-8">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#B39359] tracking-widest uppercase">אודות הבוטיק</span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#141210]">Arik Yakobov Diamonds</h1>
            <p className="text-xs sm:text-sm text-[#8F8171]">בורסת היהלומים רמת גן, בניין שמשון</p>
            <div className="w-12 h-0.5 bg-[#B39359] mx-auto mt-2" />
          </div>

          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#EAE3D6] shadow-xs space-y-6 text-sm text-[#544B41] leading-relaxed">
            <p className="font-serif font-bold text-lg text-[#141210]">
              ברוכים הבאים לעולם היהלומים ותכשיטי היוקרה של אריק יעקובוב.
            </p>
            <p>
              {aboutText}
            </p>
            <p>
              חדר העסקאות הפרטי שלנו ממוקם בבניין שמשון בבורסת היהלומים ברמת גן, ומציע חוויית קנייה בוטיקית וליווי אישי מקצועי לכל אורך הדרך – מבחירת האבן הגולמית בדירוג הבינלאומי המחמיר (GIA, IGI) ועד לעיצוב והרכבת טבעת האירוסין או תכשיט החלומות שלך.
            </p>
            <div className="pt-6 border-t border-[#EAE3D6] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="font-bold text-[#141210] block">פגישות אישיות ותיאום מראש:</span>
                <span className="text-xs text-[#8F8171]">טלפון / וואטסאפ: {phoneText}</span>
              </div>
              <a
                href={dynamicWhatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#141210] text-[#D8C7B0] border border-[#B39359]/40 rounded-full text-xs font-semibold hover:bg-[#201D19]"
              >
                תיאום פגישה אישית בבורסה
              </a>
            </div>
          </div>
        </main>
      )}

      {/* CONTACT US PAGE */}
      {currentRoute === 'contactus' && (
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 space-y-8 text-right">
          <div className="text-center space-y-3">
            <span className="text-xs font-mono text-[#B39359] tracking-widest uppercase">פגישות וייעוץ אישי</span>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#141210]">חדר העסקאות בבורסת היהלומים</h1>
            <p className="text-xs sm:text-sm text-[#8F8171]">בניין שמשון, בבורסת היהלומים רמת גן</p>
            <div className="w-12 h-0.5 bg-[#B39359] mx-auto mt-2" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-[#EAE3D6] shadow-xs space-y-6">
              <h3 className="font-serif font-bold text-xl text-[#141210]">פרטי הגעה והתקשרות</h3>
              
              <div className="space-y-4 text-xs text-[#544B41]">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#B39359] shrink-0" />
                  <div>
                    <span className="font-bold text-[#141210] block">כתובת:</span>
                    <span>בורסת היהלומים רמת גן, בניין שמשון</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#B39359] shrink-0" />
                  <div>
                    <span className="font-bold text-[#141210] block">טלפון ישיר:</span>
                    <a href={`tel:${cleanPhone}`} className="hover:underline font-semibold">{phoneText}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#B39359] shrink-0" />
                  <div>
                    <span className="font-bold text-[#141210] block">שעות פעילות:</span>
                    <span>ימים א׳ - ה׳ בתיאום מראש בלבד</span>
                  </div>
                </div>
              </div>

              <a
                href={dynamicWhatsappLink}
                target="_blank"
                rel="noreferrer"
                className="w-full py-4 bg-[#141210] text-[#D8C7B0] border border-[#B39359]/40 rounded-full font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#201D19]"
              >
                <Phone className="w-4 h-4 text-[#B39359]" />
                <span>פתיחת שיחה ישירה בוואטסאפ</span>
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-[#EAE3D6] shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-xl text-[#141210]">השארת פנייה מהירה</h3>
              <form onSubmit={(e) => {
                e.preventDefault();
                alert('פנייתך התקבלה בהצלחה, ניצור קשר בהקדם!');
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block mb-1 font-semibold text-[#544B41]">שם מלא</label>
                  <input required type="text" placeholder="ישראל ישראלי" className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-[#544B41]">מספר טלפון</label>
                  <input required type="tel" dir="ltr" placeholder="050-0000000" className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]" />
                </div>
                <div>
                  <label className="block mb-1 font-semibold text-[#544B41]">תוכן הפנייה</label>
                  <textarea rows={3} placeholder="מעוניין בפרטים על טבעת אירוסין..." className="w-full px-4 py-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]" />
                </div>
                <button type="submit" className="w-full py-3.5 bg-[#B39359] text-white font-bold rounded-full text-xs hover:bg-[#a18349] flex items-center justify-center gap-2 transition-colors">
                  <Send className="w-3.5 h-3.5" />
                  <span>שליחת פנייה</span>
                </button>
              </form>
            </div>
          </div>
        </main>
      )}

      {/* 5. ULTIMATE ADMIN DASHBOARD (ORGANIZED CATEGORY TABS) */}
      {currentRoute === 'admin' && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full text-right">
          {!isAdminAuthenticated ? (
            <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#141210] border border-[#282420] text-white shadow-2xl text-center space-y-6">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#201D19] border border-[#B39359]/30 flex items-center justify-center text-[#B39359]">
                <Diamond className="w-6 h-6" />
              </div>

              {authStep === 'credentials' && (
                <>
                  <div>
                    <h2 className="text-xl font-serif font-bold text-[#FAF8F5]">כניסת מנהל מערכת</h2>
                    <p className="text-xs text-[#8F8171] mt-1">אימות מאובטח מול Supabase</p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4 text-right">
                    <div>
                      <label className="block text-xs font-semibold text-[#D8C7B0] mb-1">אימייל מנהל</label>
                      <input
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@arikdiamonds.com"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#201D19] border border-[#3A342D] text-sm text-white focus:outline-none focus:border-[#B39359]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#D8C7B0] mb-1">סיסמה</label>
                      <input
                        type="password"
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="••••••••"
                        dir="ltr"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#201D19] border border-[#3A342D] text-sm text-white focus:outline-none focus:border-[#B39359]"
                      />
                    </div>

                    {loginError && <p className="text-xs text-rose-400 font-semibold text-center">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3.5 rounded-xl bg-[#B39359] text-[#141210] font-bold text-xs tracking-wider uppercase hover:bg-[#a18349] transition-colors disabled:opacity-50 cursor-pointer"
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
                    <p className="text-xs text-[#8F8171] mt-1 leading-relaxed">
                      סרוק את ה-QR באפליקציית Authenticator והזן את 6 הספרות.
                    </p>
                  </div>

                  {qrCodeUrl && (
                    <div className="flex justify-center p-3 bg-white border border-[#EAE3D6] rounded-2xl max-w-[190px] mx-auto">
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#201D19] border border-[#3A342D] text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-[#B39359]"
                    />

                    {loginError && <p className="text-xs text-rose-400 font-semibold">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3.5 rounded-xl bg-[#B39359] text-[#141210] font-bold text-xs tracking-wider uppercase hover:bg-[#a18349]"
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
                    <p className="text-xs text-[#8F8171] mt-1">הזן את 6 הספרות מהאפליקציה</p>
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
                      className="w-full px-4 py-2.5 rounded-xl bg-[#201D19] border border-[#3A342D] text-center text-xl font-mono tracking-widest text-white focus:outline-none focus:border-[#B39359]"
                    />

                    {loginError && <p className="text-xs text-rose-400 font-semibold">{loginError}</p>}

                    <button
                      type="submit"
                      disabled={isLoadingAuth}
                      className="w-full py-3.5 rounded-xl bg-[#B39359] text-[#141210] font-bold text-xs tracking-wider uppercase hover:bg-[#a18349]"
                    >
                      {isLoadingAuth ? 'מאמת...' : 'כניסה למערכת'}
                    </button>
                  </form>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-8">

              {/* ADMIN TOP CONTROL BAR */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141210] p-6 rounded-3xl border border-[#282420] text-white shadow-xl">
                <div>
                  <span className="text-[11px] font-mono text-[#B39359] tracking-widest uppercase">CONTROL CENTER</span>
                  <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">דשבורד ניהול תוכן - Arik Yakobov</h1>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={fetchProducts}
                    className="p-2.5 px-4 rounded-full border border-[#B39359]/30 bg-[#201D19] hover:bg-[#2A2621] text-[#D8C7B0] transition-colors flex items-center gap-2 text-xs font-semibold"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#B39359]" />
                    <span>רענן נתונים</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2.5 px-5 rounded-full bg-[#B39359] text-[#141210] hover:bg-[#a18349] transition-colors flex items-center gap-2 text-xs font-bold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>התנתק</span>
                  </button>
                </div>
              </div>

              {/* DASHBOARD TABS NAVIGATION */}
              <div className="flex flex-wrap gap-2 border-b border-[#EAE3D6] pb-4">
                <button
                  onClick={() => setAdminTab('products')}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                    adminTab === 'products'
                      ? 'bg-[#141210] text-[#B39359] shadow-md'
                      : 'bg-white text-[#544B41] border border-[#EAE3D6] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Diamond className="w-4 h-4" />
                  <span>ניהול מלאי ומוצרים ({products.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('carousel')}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                    adminTab === 'carousel'
                      ? 'bg-[#141210] text-[#B39359] shadow-md'
                      : 'bg-white text-[#544B41] border border-[#EAE3D6] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>סליידר דף הבית ({carouselSlides.length})</span>
                </button>

                <button
                  onClick={() => setAdminTab('content')}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                    adminTab === 'content'
                      ? 'bg-[#141210] text-[#B39359] shadow-md'
                      : 'bg-white text-[#544B41] border border-[#EAE3D6] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>תוכן, טקסטים ו-Ticker</span>
                </button>

                <button
                  onClick={() => setAdminTab('settings')}
                  className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                    adminTab === 'settings'
                      ? 'bg-[#141210] text-[#B39359] shadow-md'
                      : 'bg-white text-[#544B41] border border-[#EAE3D6] hover:bg-[#FAF8F5]'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>טלפון ופרטי קשר</span>
                </button>
              </div>

              {/* TAB 1: PRODUCTS MANAGER */}
              {adminTab === 'products' && (
                <div className="space-y-8 animate-in fade-in duration-150">
                  
                  {/* ADD PRODUCT */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D6] shadow-xs space-y-6">
                    <div className="flex items-center gap-2 border-b border-[#EAE3D6] pb-4">
                      <Plus className="w-5 h-5 text-[#B39359]" />
                      <h2 className="font-serif font-bold text-lg text-[#141210]">הוספת פריט חדש לקולקציה</h2>
                    </div>

                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block mb-1 font-semibold text-[#544B41]">כותרת ושם הפריט *</label>
                        <input
                          type="text"
                          required
                          placeholder="טבעת סוליטר בשיבוץ יהלום מרקיזה 1.80 קראט"
                          value={newProduct.title}
                          onChange={e => setNewProduct({ ...newProduct, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">מחיר (₪) *</label>
                        <input
                          type="number"
                          required
                          placeholder="35000"
                          value={newProduct.price}
                          onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">קטגוריה</label>
                        <select
                          value={newProduct.category}
                          onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        >
                          <option value="engagement">טבעות אירוסין</option>
                          <option value="loose">יהלומים משוחררים</option>
                          <option value="tennis">צמידי טניס</option>
                          <option value="earrings">עגילי יהלומים</option>
                          <option value="high_jewelry">תכשיטי יוקרה בעיצוב אישי</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">סוג יהלום</label>
                        <select
                          value={newProduct.diamond_type}
                          onChange={e => setNewProduct({ ...newProduct, diamond_type: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        >
                          <option value="Natural">טבעי (Natural)</option>
                          <option value="Lab">מעבדה (Lab)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">צורת חיתוך (בעברית)</label>
                        <select
                          value={newProduct.shape}
                          onChange={e => setNewProduct({ ...newProduct, shape: e.target.value as DiamondShape })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        >
                          {SHAPES_DATA.map(s => (
                            <option key={s.value} value={s.value}>
                              {s.labelHe} ({s.labelEn})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">משקל קראט</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="1.50"
                          value={newProduct.carat}
                          onChange={e => setNewProduct({ ...newProduct, carat: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">צבע (Color)</label>
                        <input
                          type="text"
                          placeholder="D / E / F"
                          value={newProduct.color}
                          onChange={e => setNewProduct({ ...newProduct, color: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">ניקיון (Clarity)</label>
                        <input
                          type="text"
                          placeholder="VVS1 / VS1"
                          value={newProduct.clarity}
                          onChange={e => setNewProduct({ ...newProduct, clarity: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">רמת חיתוך (Cut)</label>
                        <input
                          type="text"
                          placeholder="Excellent"
                          value={newProduct.cut}
                          onChange={e => setNewProduct({ ...newProduct, cut: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">תעודה גמולוגית</label>
                        <input
                          type="text"
                          placeholder="GIA / IGI"
                          value={newProduct.certificate}
                          onChange={e => setNewProduct({ ...newProduct, certificate: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">סטטוס פריט</label>
                        <select
                          value={newProduct.status}
                          onChange={e => setNewProduct({ ...newProduct, status: e.target.value as any })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        >
                          <option value="available">זמין בגלריה</option>
                          <option value="reserved">שמור ללקוח</option>
                          <option value="sold">נמכר</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3 p-4 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#EAE3D6] flex flex-col sm:flex-row items-center justify-between gap-4">
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
                            className="px-4 py-2 bg-[#141210] text-[#D8C7B0] rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#201D19]"
                          >
                            בחר קובץ תמונה מהמכשיר
                          </label>
                          <span className="text-[11px] text-[#8F8171]">JPG, PNG, WEBP באיכות גבוהה</span>
                        </div>

                        {uploadedImagePreview && (
                          <div className="flex items-center gap-2">
                            <img src={uploadedImagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[#EAE3D6]" />
                            <span className="text-[11px] text-[#B39359] font-semibold">תמונה נבחרה בהצלחה</span>
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-8 py-3 bg-[#141210] text-[#D8C7B0] rounded-xl font-semibold text-xs tracking-wider uppercase hover:bg-[#201D19] shadow-xs cursor-pointer"
                        >
                          שמור פריט ב-Supabase
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* PRODUCTS TABLE */}
                  <div className="bg-white rounded-3xl border border-[#EAE3D6] shadow-xs overflow-hidden">
                    <div className="p-6 border-b border-[#EAE3D6] flex justify-between items-center">
                      <h3 className="font-serif font-bold text-base text-[#141210]">
                        פריטים פעילים בקולקציה ({products.length})
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-[#FAF8F5] text-[#8F8171] border-b border-[#EAE3D6]">
                          <tr>
                            <th className="py-3.5 px-4 font-semibold">תמונה</th>
                            <th className="py-3.5 px-4 font-semibold">כותרת</th>
                            <th className="py-3.5 px-4 font-semibold">סוג</th>
                            <th className="py-3.5 px-4 font-semibold">חיתוך</th>
                            <th className="py-3.5 px-4 font-semibold">קראט</th>
                            <th className="py-3.5 px-4 font-semibold">צבע/ניקיון</th>
                            <th className="py-3.5 px-4 font-semibold">מחיר</th>
                            <th className="py-3.5 px-4 font-semibold">סטטוס</th>
                            <th className="py-3.5 px-4 font-semibold text-center">פעולות</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#EAE3D6]">
                          {products.map(p => {
                            const shapeObj = SHAPES_DATA.find(s => s.value === p.shape);
                            return (
                              <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                                <td className="py-3 px-4">
                                  <img src={p.image} alt={p.title} className="w-12 h-12 object-cover rounded-lg border border-[#EAE3D6]" />
                                </td>
                                <td className="py-3 px-4 font-medium max-w-xs truncate">{p.title}</td>
                                <td className="py-3 px-4">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.diamond_type === 'Lab' ? 'bg-amber-50 text-amber-700' : 'bg-neutral-100 text-neutral-800'}`}>
                                    {p.diamond_type === 'Lab' ? 'מעבדה' : 'טבעי'}
                                  </span>
                                </td>
                                <td className="py-3 px-4 font-medium text-[#B39359]">
                                  {shapeObj ? shapeObj.labelHe : p.shape}
                                </td>
                                <td className="py-3 px-4">{p.carat} ct</td>
                                <td className="py-3 px-4">{p.color} / {p.clarity}</td>
                                <td className="py-3 px-4 font-bold text-[#141210]">₪{p.price.toLocaleString()}</td>
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
                                      className="p-1.5 text-[#B39359] hover:bg-[#F5F0E6] rounded-lg transition-colors cursor-pointer"
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

              {/* TAB 2: HERO CAROUSEL MANAGER */}
              {adminTab === 'carousel' && (
                <div className="space-y-8 animate-in fade-in duration-150">
                  
                  {/* ADD NEW SLIDE */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D6] shadow-xs space-y-6">
                    <div className="flex items-center gap-2 border-b border-[#EAE3D6] pb-4">
                      <Plus className="w-5 h-5 text-[#B39359]" />
                      <h2 className="font-serif font-bold text-lg text-[#141210]">הוספת שקופית חדשה לקרוסלת דף הבית</h2>
                    </div>

                    <form onSubmit={handleAddSlide} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">כותרת השקופית *</label>
                        <input
                          type="text"
                          required
                          placeholder="טבעת סוליטר מרקיזה 2.00 קראט"
                          value={newSlide.title}
                          onChange={e => setNewSlide({ ...newSlide, title: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">תגית עליונה (Tag) *</label>
                        <input
                          type="text"
                          required
                          placeholder="Natural Diamond / עיצוב אישי"
                          value={newSlide.tag}
                          onChange={e => setNewSlide({ ...newSlide, tag: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div className="sm:col-span-2 p-4 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#EAE3D6] flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <input
                            type="file"
                            accept="image/*"
                            ref={slideFileInputRef}
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setNewSlideImagePreview(URL.createObjectURL(e.target.files[0]));
                              }
                            }}
                            className="hidden"
                            id="new-slide-image-upload"
                          />
                          <label
                            htmlFor="new-slide-image-upload"
                            className="px-4 py-2 bg-[#141210] text-[#D8C7B0] rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#201D19]"
                          >
                            בחר תמונה מהמכשיר
                          </label>
                          <span className="text-[11px] text-[#8F8171]">או הדבק קישור ישיר למטה</span>
                        </div>

                        {newSlideImagePreview && (
                          <div className="flex items-center gap-2">
                            <img src={newSlideImagePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[#EAE3D6]" />
                            <span className="text-[11px] text-[#B39359] font-semibold">תמונה מוכנה</span>
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block mb-1 font-semibold text-[#544B41]">קישור לתמונה (URL מתוך תיקיית images או ענן)</label>
                        <input
                          type="text"
                          placeholder="/images/ring-oval-gold.webp"
                          value={newSlide.image}
                          onChange={e => setNewSlide({ ...newSlide, image: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div className="sm:col-span-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-[#141210] text-[#D8C7B0] rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-[#201D19]"
                        >
                          הוסף שקופית לקרוסלה
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* CURRENT SLIDES LIST */}
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D6] shadow-xs space-y-6">
                    <h3 className="font-serif font-bold text-base text-[#141210]">שקופיות פעילות בקרוסלה ({carouselSlides.length})</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {carouselSlides.map((slide, idx) => (
                        <div key={slide.id} className="p-4 rounded-2xl border border-[#EAE3D6] bg-[#FAF8F5] space-y-3 flex flex-col justify-between">
                          <div className="space-y-2">
                            <div className="aspect-square rounded-xl overflow-hidden border border-[#EAE3D6] bg-black relative">
                              <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                              <span className="absolute top-2 right-2 px-2.5 py-1 bg-black/70 text-white rounded-full text-[10px] font-mono">
                                #{idx + 1}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#B39359] font-mono block">{slide.tag}</span>
                              <h4 className="font-bold text-xs text-[#141210]">{slide.title}</h4>
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteSlide(slide.id)}
                            className="w-full py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Trash className="w-3.5 h-3.5" />
                            <span>הסר שקופית זו</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CONTENT & TEXTS */}
              {adminTab === 'content' && (
                <div className="space-y-8 animate-in fade-in duration-150">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D6] shadow-xs space-y-6">
                    <h3 className="font-serif font-bold text-base text-[#141210]">עריכת טקסטים ותכנים באתר</h3>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      localStorage.setItem('ay_marquee_text', marqueeText);
                      localStorage.setItem('ay_hero_title', heroTitle);
                      localStorage.setItem('ay_hero_subtitle', heroSubTitle);
                      localStorage.setItem('ay_about_text', aboutText);
                      alert('כל הטקסטים נשמרו ועודכנו בהצלחה באתר!');
                    }} className="space-y-5 text-xs">
                      
                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">השורה הרצה למעלה (Ticker Marquee)</label>
                        <input
                          type="text"
                          required
                          value={marqueeText}
                          onChange={e => setMarqueeText(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">כותרת ראשית בדף הבית (Hero Title)</label>
                        <input
                          type="text"
                          required
                          value={heroTitle}
                          onChange={e => setHeroTitle(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">תת-כותרת בדף הבית (Hero Subtitle)</label>
                        <textarea
                          rows={3}
                          required
                          value={heroSubTitle}
                          onChange={e => setHeroSubTitle(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">תוכן עמוד "אודות" (About Us)</label>
                        <textarea
                          rows={4}
                          required
                          value={aboutText}
                          onChange={e => setAboutText(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-[#141210] text-[#D8C7B0] rounded-xl font-semibold text-xs flex items-center gap-2 hover:bg-[#201D19]"
                        >
                          <Save className="w-4 h-4 text-[#B39359]" />
                          <span>שמור ועדכן את כל הטקסטים באתר</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: SETTINGS & CONTACT */}
              {adminTab === 'settings' && (
                <div className="space-y-8 animate-in fade-in duration-150">
                  <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE3D6] shadow-xs space-y-6">
                    <h3 className="font-serif font-bold text-base text-[#141210]">הגדרות טלפון ופרטי קשר</h3>

                    <form onSubmit={(e) => {
                      e.preventDefault();
                      localStorage.setItem('ay_phone', phoneText);
                      alert('מספר הטלפון עודכן בהצלחה בכל האתר!');
                    }} className="space-y-4 text-xs">
                      <div>
                        <label className="block mb-1 font-semibold text-[#544B41]">מספר טלפון לתצוגה ושיחות</label>
                        <input
                          type="text"
                          required
                          value={phoneText}
                          onChange={e => setPhoneText(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                        />
                      </div>

                      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EAE3D6] text-[#8F8171] space-y-1">
                        <p>📍 <strong>כתובת הבוטיק:</strong> בורסת היהלומים רמת גן, בניין שמשון</p>
                        <p>💬 <strong>קישור וואטסאפ:</strong> נוצר אוטומטית לפי המספר שהזנת</p>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-[#141210] text-[#D8C7B0] rounded-xl font-semibold text-xs flex items-center gap-2 hover:bg-[#201D19]"
                        >
                          <Save className="w-4 h-4 text-[#B39359]" />
                          <span>שמור הגדרות</span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* EDIT PRODUCT MODAL */}
          {editingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="bg-white border border-[#EAE3D6] rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 relative shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-4">
                  <div className="flex items-center gap-2">
                    <Edit3 className="w-5 h-5 text-[#B39359]" />
                    <h3 className="font-serif font-bold text-lg text-[#141210]">עריכת פריט</h3>
                  </div>
                  <button onClick={() => setEditingProduct(null)} className="p-1.5 rounded-full hover:bg-[#FAF8F5]">
                    <X className="w-5 h-5 text-[#8F8171]" />
                  </button>
                </div>

                <form onSubmit={handleUpdateProduct} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2">
                    <label className="block mb-1 font-semibold text-[#544B41]">כותרת ושם הפריט</label>
                    <input
                      type="text"
                      required
                      value={editingProduct.title}
                      onChange={e => setEditingProduct({ ...editingProduct, title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#544B41]">מחיר (₪)</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.price}
                      onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#544B41]">קטגוריה</label>
                    <select
                      value={editingProduct.category}
                      onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                    >
                      <option value="engagement">טבעות אירוסין</option>
                      <option value="loose">יהלומים משוחררים</option>
                      <option value="tennis">צמידי טניס</option>
                      <option value="earrings">עגילי יהלומים</option>
                      <option value="high_jewelry">תכשיטי יוקרה בעיצוב אישי</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#544B41]">סוג יהלום</label>
                    <select
                      value={editingProduct.diamond_type || 'Natural'}
                      onChange={e => setEditingProduct({ ...editingProduct, diamond_type: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                    >
                      <option value="Natural">טבעי (Natural)</option>
                      <option value="Lab">מעבדה (Lab)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#544B41]">צורת חיתוך</label>
                    <select
                      value={editingProduct.shape}
                      onChange={e => setEditingProduct({ ...editingProduct, shape: e.target.value as DiamondShape })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                    >
                      {SHAPES_DATA.map(s => (
                        <option key={s.value} value={s.value}>
                          {s.labelHe} ({s.labelEn})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#544B41]">משקל קראט</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editingProduct.carat}
                      onChange={e => setEditingProduct({ ...editingProduct, carat: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#544B41]">צבע</label>
                    <input
                      type="text"
                      value={editingProduct.color}
                      onChange={e => setEditingProduct({ ...editingProduct, color: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#544B41]">ניקיון</label>
                    <input
                      type="text"
                      value={editingProduct.clarity}
                      onChange={e => setEditingProduct({ ...editingProduct, clarity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-[#544B41]">סטטוס</label>
                    <select
                      value={editingProduct.status}
                      onChange={e => setEditingProduct({ ...editingProduct, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-[#FAF8F5] border border-[#EAE3D6]"
                    >
                      <option value="available">זמין בגלריה</option>
                      <option value="reserved">שמור ללקוח</option>
                      <option value="sold">נמכר</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 p-3 bg-[#FAF8F5] border border-[#EAE3D6] rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={uploadedImagePreview || editingProduct.image} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-[#EAE3D6]" />
                      <span className="text-[11px] text-[#544B41]">תמונה נוכחית</span>
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
                      <label htmlFor="edit-modal-image-upload" className="px-3.5 py-2 bg-[#141210] text-[#D8C7B0] rounded-xl cursor-pointer text-[11px] font-semibold">
                        החלף תמונה
                      </label>
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-end gap-2 pt-3 border-t border-[#EAE3D6]">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(null)}
                      className="px-4 py-2 bg-[#EFE9DF] text-[#141210] rounded-xl font-semibold"
                    >
                      ביטול
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-[#141210] text-white rounded-xl font-semibold"
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
          <div className="relative z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-5 shadow-2xl text-xs text-right">
            <div className="flex items-center justify-between border-b border-[#EAE3D6] pb-3">
              <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#141210]">
                <Filter className="w-4 h-4 text-[#B39359]" />
                <span>סינון והתאמת תכשיט</span>
              </div>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 rounded-full hover:bg-[#FAF8F5]">
                <X className="w-5 h-5 text-[#8F8171]" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#544B41]">סוג יהלום</label>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => setSelectedDiamondType('all')}
                  className={`py-2 rounded-xl text-xs font-semibold ${selectedDiamondType === 'all' ? 'bg-[#141210] text-white' : 'bg-[#FAF8F5] border border-[#EAE3D6]'}`}
                >
                  הכל
                </button>
                <button
                  onClick={() => setSelectedDiamondType('Natural')}
                  className={`py-2 rounded-xl text-xs font-semibold ${selectedDiamondType === 'Natural' ? 'bg-[#B39359] text-white font-bold' : 'bg-[#FAF8F5] border border-[#EAE3D6]'}`}
                >
                  טבעי
                </button>
                <button
                  onClick={() => setSelectedDiamondType('Lab')}
                  className={`py-2 rounded-xl text-xs font-semibold ${selectedDiamondType === 'Lab' ? 'bg-[#B39359] text-white font-bold' : 'bg-[#FAF8F5] border border-[#EAE3D6]'}`}
                >
                  מעבדה
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[#544B41]">צורת חיתוך</label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setSelectedShape('all')}
                  className={`col-span-3 py-2 rounded-xl text-xs font-semibold ${selectedShape === 'all' ? 'bg-[#141210] text-white' : 'bg-[#FAF8F5] border border-[#EAE3D6]'}`}
                >
                  כל הצורות
                </button>
                {SHAPES_DATA.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setSelectedShape(s.value)}
                    className={`py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center ${selectedShape === s.value ? 'bg-[#B39359] text-white font-bold' : 'bg-[#FAF8F5] border border-[#EAE3D6]'}`}
                  >
                    <span className="font-bold text-xs">{s.labelHe}</span>
                    <span className="text-[9px] opacity-75">{s.labelEn}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full py-3.5 bg-[#141210] text-white rounded-full font-bold text-xs uppercase tracking-wider"
            >
              הצג תוצאות ({filteredProducts.length})
            </button>
          </div>
        </div>
      )}

      {/* 6. OFFICIAL WHATSAPP FLOATING BUTTON */}
      <a
        href={dynamicWhatsappLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 left-6 z-40 bg-[#25D366] text-white w-14 h-14 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer hover:bg-[#20ba59]"
        aria-label="וואטסאפ"
        title="וואטסאפ"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.51c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.98-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.11-.23-.17-.48-.3z"/>
        </svg>
      </a>

      {/* 7. FOOTER */}
      <footer className="bg-[#141210] text-[#D8C7B0] border-t border-[#282420] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-right">
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Diamond className="w-5 h-5 text-[#B39359]" />
                <span className="font-serif font-bold text-xl text-white">ARIK YAKOBOV DIAMONDS</span>
              </div>
              <p className="text-xs text-[#D8C7B0]/80 leading-relaxed font-light">
                ייצור תכשיטים בעיצוב אישי | Lab & Natural Diamonds.
                <br />
                חדר עסקאות ישיר בבורסת היהלומים רמת גן, בניין שמשון.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-serif font-bold text-white text-base">פגישות ושירות VIP</h4>
              <div className="flex items-center gap-2 text-[#D8C7B0]/90">
                <MapPin className="w-4 h-4 text-[#B39359]" />
                <span>בורסת היהלומים רמת גן, בניין שמשון</span>
              </div>
              <div className="flex items-center gap-2 text-[#D8C7B0]/90">
                <Phone className="w-4 h-4 text-[#B39359]" />
                <a href={`tel:${cleanPhone}`} className="hover:underline font-semibold">{phoneText}</a>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <h4 className="font-serif font-bold text-white text-base">ביטחון ואחריות</h4>
              <p className="text-[#D8C7B0]/80 font-light leading-relaxed">
                כל היהלומים מלווים בתעודה גמולוגית מקורית (GIA / IGI) ואחריות מקיפה לכל החיים.
              </p>
            </div>
          </div>

          <div className="border-t border-[#282420] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8F8171] gap-4">
            <span>© 2026 אריק יעקובוב - Arik Yakobov Diamonds. כל הזכויות שמורות.</span>
            <button 
              onClick={() => navigateTo('admin')} 
              className="hover:text-[#B39359] transition-colors cursor-pointer"
            >
              כניסת ניהול
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
