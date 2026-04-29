import React, { useState, useEffect, useRef } from 'react';
import {
  Search, Globe, Menu, X, ChevronRight, MapPin,
  Calendar, Clock, MessageCircle, ArrowUp, Info,
  Map, Camera, Facebook, Instagram, Youtube,
  Send, Bot, Sparkles, Loader2,
} from 'lucide-react';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const callGeminiAPI = async (contents, systemInstruction) => {
  if (!apiKey) {
    return '目前尚未設定 Gemini API Key，因此 AI 功能暫時以靜態網站模式展示。若要啟用，請在 .env 設定 VITE_GEMINI_API_KEY 後重新建置。';
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
  const payload = { contents };
  if (systemInstruction) {
    payload.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  let retries = 5;
  let delay = 1000;
  while (retries > 0) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '抱歉，我現在無法回答。';
    } catch {
      retries -= 1;
      if (retries === 0) return '系統發生錯誤，請稍後再試。';
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  return '系統發生錯誤，請稍後再試。';
};

const newsData = [
  {
    id: 7427,
    title: '2026高雄冬日遊樂園突破731萬人次',
    date: '2026-03-02',
    category: '活動消息',
    thumbnail: 'https://picsum.photos/seed/khh-news1/800/600',
    summary: '今年冬季最大盛事「高雄冬日遊樂園」圓滿落幕，結合光雕秀與多元遊樂設施，創下歷年新高參與人次...',
    link_url: '/zh-tw/event/news/7427/',
  },
  {
    id: 7428,
    title: '駁二藝術特區週末手作市集熱鬧開跑',
    date: '2026-04-15',
    category: '藝文展演',
    thumbnail: 'https://picsum.photos/seed/khh-news2/800/600',
    summary: '匯集超過100家在地手作職人，邀請您週末來駁二感受文創魅力與海港風情。',
    link_url: '/zh-tw/event/news/7428/',
  },
  {
    id: 7429,
    title: '輕軌成圓，全線通車優惠實施中',
    date: '2026-04-20',
    category: '交通資訊',
    thumbnail: 'https://picsum.photos/seed/khh-news3/800/600',
    summary: '高雄輕軌正式成圓！即日起至下月底，全線搭乘享半價優惠，帶您輕鬆環遊高雄市區。',
    link_url: '/zh-tw/event/news/7429/',
  },
];

const attractionsData = [
  {
    id: 348,
    name: '高雄車站',
    region: '三民區',
    thumbnail: 'https://picsum.photos/seed/khh-attr1/800/600',
    short_description: '結合生態、藝術與文化的新地標，壯觀的雲朵天棚是打卡必拍熱點。',
    tags: ['親子', '建築', '文化'],
    link_url: '/zh-tw/attractions/detail/348/',
  },
  {
    id: 112,
    name: '駁二藝術特區',
    region: '鹽埕區',
    thumbnail: 'https://picsum.photos/seed/khh-attr2/800/600',
    short_description: '舊倉庫群改造而成的創意聚落，充滿各式公共藝術與文創商店。',
    tags: ['文創', '打卡', '展覽'],
    link_url: '/zh-tw/attractions/detail/112/',
  },
  {
    id: 256,
    name: '蓮池潭風景區',
    region: '左營區',
    thumbnail: 'https://picsum.photos/seed/khh-attr3/800/600',
    short_description: '以龍虎塔聞名的傳統風景區，傍晚時分湖面倒影美不勝收。',
    tags: ['宗教', '夕陽', '歷史'],
    link_url: '/zh-tw/attractions/detail/256/',
  },
  {
    id: 405,
    name: '愛河',
    region: '前金區',
    thumbnail: 'https://picsum.photos/seed/khh-attr4/800/600',
    short_description: '貫穿高雄市區的浪漫之河，適合搭乘愛之船或漫步河畔。',
    tags: ['夜景', '約會', '遊船'],
    link_url: '/zh-tw/attractions/detail/405/',
  },
];

const toursData = [
  {
    id: 2,
    title: '藝文高雄漫漫遊',
    days: 2,
    highlights: ['駁二藝術特區', '美麗島', '愛河'],
    thumbnail: 'https://picsum.photos/seed/khh-tour1/800/600',
    tags: ['藝文', '歷史', '低碳'],
  },
  {
    id: 5,
    title: '山海戀輕旅行',
    days: 3,
    highlights: ['旗津海岸', '柴山', '西子灣夕陽'],
    thumbnail: 'https://picsum.photos/seed/khh-tour2/800/600',
    tags: ['自然', '海景', '戶外'],
  },
];

const Card = ({ thumbnail, tag, title, summary, link_url, date, extraTags = [] }) => (
  <a href={link_url} className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
      <img
        src={thumbnail}
        alt={title}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {tag && (
        <span className="absolute left-3 top-3 rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white shadow-sm">
          {tag}
        </span>
      )}
    </div>
    <div className="flex flex-grow flex-col p-5">
      {date && <span className="mb-1 flex items-center text-sm text-gray-500"><Calendar size={14} className="mr-1" /> {date}</span>}
      <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">{title}</h3>
      <p className="mb-4 line-clamp-2 flex-grow text-sm text-gray-600">{summary}</p>

      {extraTags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1">
          {extraTags.map((t) => (
            <span key={t} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">#{t}</span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center text-sm font-medium text-blue-600 transition-transform group-hover:translate-x-1">
        了解更多 <ChevronRight size={16} className="ml-1" />
      </div>
    </div>
  </a>
);

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{ role: 'model', text: '你好！我是高雄旅遊網的專屬 AI 導遊「高雄熊」，很高興為您服務。想去哪裡玩呢？' }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const chatEndRef = useRef(null);
  const [showAiPlanner, setShowAiPlanner] = useState(false);
  const [planDays, setPlanDays] = useState('2');
  const [planStyle, setPlanStyle] = useState('綜合探索');
  const [aiItineraryResult, setAiItineraryResult] = useState('');
  const [isPlanning, setIsPlanning] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput('');
    setIsChatTyping(true);

    const apiContents = newMessages.map((m) => ({
      role: m.role,
      parts: [{ text: m.text }],
    }));

    const systemPrompt = '你是高雄旅遊網的官方 AI 客服「高雄熊」。你熱情、友善，對高雄的景點、美食、交通非常了解。請用繁體中文回答使用者的問題，並且可以適時加上表情符號。請保持回答簡潔扼要，適合在聊天視窗中閱讀。';
    const responseText = await callGeminiAPI(apiContents, systemPrompt);
    setChatMessages([...newMessages, { role: 'model', text: responseText }]);
    setIsChatTyping(false);
  };

  const handleGenerateItinerary = async () => {
    setIsPlanning(true);
    setAiItineraryResult('');
    const prompt = `請為我規劃 ${planDays} 天的高雄旅遊行程。旅遊風格偏好：${planStyle}。請提供詳細的每日行程安排，包含推薦景點、美食以及建議的交通方式。使用繁體中文，格式請用排版清晰的純文字或 Markdown。`;
    const responseText = await callGeminiAPI([{ role: 'user', parts: [{ text: prompt }] }], '你是一位專業且熱情的高雄在地導遊。');
    setAiItineraryResult(responseText);
    setIsPlanning(false);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 font-sans text-gray-800 selection:bg-blue-100">
      <a
        href="#main-content"
        className="absolute left-0 top-0 z-50 -translate-y-full bg-blue-600 p-3 text-white transition-transform focus:translate-y-0"
      >
        跳至主要內容
      </a>

      <header className="sticky top-0 z-40 w-full bg-white/95 shadow-sm backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <div className="flex flex-shrink-0 cursor-pointer items-center">
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight text-blue-800">高雄旅遊網</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-blue-500">khh.travel</span>
              </div>
            </div>

            <nav className="hidden space-x-8 lg:flex">
              {['最新話題', '探索高雄', '旅遊資訊', '行程規劃', '旅遊服務'].map((item) => (
                <a key={item} href="#" className="font-medium text-gray-700 transition-colors hover:text-blue-600">{item}</a>
              ))}
            </nav>

            <div className="hidden items-center space-x-4 border-l border-gray-200 pl-4 lg:flex">
              <button className="p-2 text-gray-600 hover:text-blue-600" aria-label="搜尋"><Search size={20} /></button>
              <button className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600">
                <Globe size={18} className="mr-1" /> 繁中
              </button>
            </div>

            <div className="flex items-center space-x-4 lg:hidden">
              <button className="p-2 text-gray-600" aria-label="搜尋"><Search size={20} /></button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 focus:outline-none"
                aria-label="開啟導覽選單"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="absolute w-full border-t border-gray-100 bg-white shadow-lg lg:hidden">
            <div className="space-y-1 px-4 pb-4 pt-2">
              {['最新話題', '探索高雄', '旅遊資訊', '行程規劃', '旅遊服務'].map((item) => (
                <a key={item} href="#" className="block rounded-md px-3 py-3 text-base font-medium text-gray-800 hover:bg-gray-50">{item}</a>
              ))}
              <div className="mt-2 border-t border-gray-200 px-3 pt-2">
                <button className="flex py-3 text-base font-medium text-gray-600">
                  <Globe size={20} className="mr-2" /> 語言：繁體中文
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <div className="border-b border-yellow-200 bg-yellow-50 py-2.5">
        <div className="mx-auto flex max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <Info size={16} className="mr-2 flex-shrink-0 text-yellow-600" />
          <div className="relative w-full overflow-hidden whitespace-nowrap text-sm font-medium text-yellow-800">
            <span className="marquee inline-block">
              [交通公告] 配合2026高雄燈會，輕軌特定區間將於週末實施交通管制，請旅客提前規劃路線。
            </span>
          </div>
        </div>
      </div>

      <main id="main-content">
        <section className="relative h-[60vh] overflow-hidden bg-gray-900 md:h-[70vh]">
          <img
            src="https://picsum.photos/seed/khh-hero/2000/1000"
            alt="高雄港都夜景 - 魅力高雄"
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="px-4 text-center">
              <h1 className="mb-4 text-4xl font-black tracking-wide text-white drop-shadow-lg md:text-6xl">
                探索・大港魅力
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-100 drop-shadow-md md:text-xl">
                四季皆宜的海港城市，從歷史古蹟到現代文創，高雄等你來體驗。
              </p>
              <button
                onClick={() => setShowAiPlanner(true)}
                className="mx-auto flex items-center justify-center space-x-2 rounded-full bg-blue-600 px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700"
              >
                <Sparkles size={20} />
                <span>AI 幫我排行程</span>
              </button>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-full border-t border-white/20 bg-white/10 backdrop-blur-md">
            <div className="mx-auto max-w-7xl px-4">
              <div className="no-scrollbar flex justify-center space-x-6 overflow-x-auto py-4 md:justify-around md:space-x-0">
                {[
                  { icon: Map, label: '旅遊地圖' },
                  { icon: Camera, label: '景點快搜' },
                  { icon: Clock, label: '交通指南' },
                  { icon: MapPin, label: '借問站' },
                ].map((item) => (
                  <a key={item.label} href="#" className="group flex min-w-[80px] flex-shrink-0 flex-col items-center text-white transition-colors hover:text-blue-300">
                    <div className="mb-2 rounded-full bg-white/20 p-3 transition-colors group-hover:bg-blue-600/50">
                      <item.icon size={24} />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="relative inline-block text-3xl font-black text-gray-900">
              最新話題
              <span className="absolute -bottom-2 left-0 h-1.5 w-1/2 rounded-full bg-blue-600" />
            </h2>
            <a href="/zh-tw/event/newslist/" className="flex items-center font-medium text-blue-600 transition-colors hover:text-blue-800">
              看更多 <ChevronRight size={18} />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {newsData.map((news) => (
              <Card
                key={news.id}
                thumbnail={news.thumbnail}
                tag={news.category}
                title={news.title}
                summary={news.summary}
                date={news.date}
                link_url={news.link_url}
              />
            ))}
          </div>
        </section>

        <section className="bg-gray-100 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex items-end justify-between">
              <h2 className="relative inline-block text-3xl font-black text-gray-900">
                高雄夯景點
                <span className="absolute -bottom-2 left-0 h-1.5 w-1/2 rounded-full bg-blue-600" />
              </h2>
              <a href="/zh-tw/attractions/list/" className="flex items-center font-medium text-blue-600 transition-colors hover:text-blue-800">
                探索全部 <ChevronRight size={18} />
              </a>
            </div>

            <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory space-x-6 overflow-x-auto px-4 pb-8 sm:mx-0 sm:px-0">
              {attractionsData.map((attr) => (
                <div key={attr.id} className="max-w-[320px] flex-shrink-0 snap-start md:min-w-[320px]">
                  <Card
                    thumbnail={attr.thumbnail}
                    tag={attr.region}
                    title={attr.name}
                    summary={attr.short_description}
                    extraTags={attr.tags}
                    link_url={attr.link_url}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="relative inline-block text-3xl font-black text-gray-900">
              精選遊程推薦
              <span className="absolute -bottom-2 left-1/4 h-1.5 w-1/2 rounded-full bg-blue-600" />
            </h2>
            <p className="mt-4 text-lg text-gray-600">不知道怎麼玩？跟著我們的推薦路線準沒錯！</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {toursData.map((tour) => (
              <a key={tour.id} href={`/zh-tw/travel/tourlist/detail/${tour.id}`} className="group relative flex h-80 items-end overflow-hidden rounded-2xl shadow-lg">
                <img src={tour.thumbnail} alt={tour.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />

                <div className="relative w-full p-8">
                  <div className="mb-3 flex items-center space-x-3">
                    <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                      {tour.days} 日遊
                    </span>
                    <div className="flex space-x-1">
                      {tour.tags.map((tag) => (
                        <span key={tag} className="rounded bg-blue-600 px-2 py-1 text-xs text-white">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <h3 className="mb-2 text-2xl font-bold text-white">{tour.title}</h3>
                  <p className="mb-4 line-clamp-1 text-sm text-gray-300">
                    必去亮點：{tour.highlights.join('、')}
                  </p>

                  <div className="flex items-center font-medium text-white transition-colors group-hover:text-blue-300">
                    查看路線 <ChevronRight size={18} className="ml-1 transition-transform group-hover:translate-x-2" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button className="rounded-full border-2 border-gray-900 px-8 py-3 font-bold text-gray-900 transition-colors hover:bg-gray-900 hover:text-white">
              查看所有遊程
            </button>
          </div>
        </section>
      </main>

      <footer className="border-t-4 border-blue-600 bg-gray-900 pb-8 pt-16 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 grid grid-cols-1 gap-10 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <h2 className="mb-4 text-2xl font-black tracking-tight text-white">高雄旅遊網</h2>
              <p className="mb-6 max-w-sm">
                高雄，一座融合海港風情與現代都會的魅力城市。在這裡尋找你的專屬旅程，體驗南台灣的熱情與活力。
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/khh.travel/" target="_blank" rel="noreferrer" className="rounded-full bg-gray-800 p-2.5 transition-colors hover:bg-blue-600 hover:text-white" aria-label="Facebook">
                  <Facebook size={20} />
                </a>
                <a href="#" className="rounded-full bg-gray-800 p-2.5 transition-colors hover:bg-pink-600 hover:text-white" aria-label="Instagram">
                  <Instagram size={20} />
                </a>
                <a href="#" className="rounded-full bg-gray-800 p-2.5 transition-colors hover:bg-red-600 hover:text-white" aria-label="Youtube">
                  <Youtube size={20} />
                </a>
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-white">快速連結</h3>
              <ul className="space-y-2">
                <li><a href="/zh-tw/faqs/" className="transition-colors hover:text-white">常見問題</a></li>
                <li><a href="/zh-tw/map/" className="transition-colors hover:text-white">旅遊地圖</a></li>
                <li><a href="/zh-tw/publication/" className="transition-colors hover:text-white">指南與摺頁</a></li>
                <li><a href="/zh-tw/links/" className="transition-colors hover:text-white">好站連結</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-bold text-white">聯絡我們</h3>
              <ul className="space-y-2 text-sm">
                <li>主辦單位：高雄市政府觀光局</li>
                <li className="mt-2 flex items-start">
                  <MapPin size={16} className="mr-2 mt-0.5 flex-shrink-0" />
                  <span>鳳山行政中心 830201<br />高雄市鳳山區光復路二段 132 號</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between border-t border-gray-800 pt-8 text-sm md:flex-row">
            <p>Copyright © Kaohsiung City Government. All Rights Reserved.</p>
            <div className="mt-4 flex space-x-4 md:mt-0">
              <a href="#" className="hover:text-white">隱私權政策</a>
              <a href="#" className="hover:text-white">資訊安全政策</a>
            </div>
          </div>
        </div>
      </footer>

      {isChatOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex w-[350px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl md:right-8">
          <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
            <div className="flex items-center space-x-2">
              <Bot size={24} />
              <span className="font-bold">高雄熊 AI 客服</span>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white transition-colors hover:text-blue-200" aria-label="關閉聊天視窗">
              <X size={20} />
            </button>
          </div>
          <div className="flex h-[350px] flex-col space-y-4 overflow-y-auto bg-gray-50 p-4">
            {chatMessages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'rounded-tr-sm bg-blue-600 text-white' : 'rounded-tl-sm border border-gray-200 bg-white text-gray-800 shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isChatTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-1 rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-2 text-gray-500 shadow-sm">
                  <span className="animate-bounce">•</span><span className="animate-bounce delay-100">•</span><span className="animate-bounce delay-200">•</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="flex items-center space-x-2 border-t border-gray-100 bg-white p-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="輸入問題，例如：推薦鹽埕區美食..."
              className="flex-1 rounded-full bg-gray-100 px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isChatTyping || !chatInput.trim()}
              className="rounded-full bg-blue-600 p-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="送出訊息"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`group fixed bottom-4 right-4 z-50 flex items-center justify-center rounded-full bg-blue-600 p-4 text-white shadow-[0_8px_30px_rgb(0,0,0,0.2)] transition-transform hover:scale-110 hover:bg-blue-700 md:bottom-8 md:right-8 ${isChatOpen ? 'pointer-events-none scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="開啟高雄熊 AI 智慧旅遊互動客服"
      >
        <MessageCircle size={28} />
        <span className="pointer-events-none absolute right-full mr-4 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-sm text-white opacity-0 transition-opacity before:absolute before:-right-1.5 before:top-1/2 before:-translate-y-1/2 before:border-4 before:border-transparent before:border-l-gray-900 before:content-[''] group-hover:opacity-100">
          高雄熊 AI 幫您解答！
        </span>
      </button>

      {showAiPlanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-blue-800 p-5 text-white">
              <div className="flex items-center space-x-2">
                <Sparkles size={24} className="text-yellow-300" />
                <h3 className="text-xl font-bold">AI 專屬行程規劃</h3>
              </div>
              <button onClick={() => setShowAiPlanner(false)} className="text-white transition-colors hover:text-blue-200" aria-label="關閉行程規劃">
                <X size={24} />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto p-6">
              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="plan-days">天數</label>
                  <select
                    id="plan-days"
                    value={planDays}
                    onChange={(e) => setPlanDays(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="1">一日遊</option>
                    <option value="2">二日遊</option>
                    <option value="3">三日遊</option>
                    <option value="4">四日遊</option>
                    <option value="5">五日遊</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="plan-style">偏好風格</label>
                  <select
                    id="plan-style"
                    value={planStyle}
                    onChange={(e) => setPlanStyle(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="綜合探索">綜合探索 (包含各式景點)</option>
                    <option value="深度藝文">深度藝文 (文創、歷史、展覽)</option>
                    <option value="自然生態">自然生態 (山海、風景區)</option>
                    <option value="在地美食">在地美食 (夜市、小吃、商圈)</option>
                    <option value="親子同樂">親子同樂 (適合兒童的設施)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleGenerateItinerary}
                disabled={isPlanning}
                className="mb-6 flex w-full items-center justify-center space-x-2 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPlanning ? (
                  <><Loader2 className="animate-spin" size={20} /><span>AI 正在為您客製化行程...</span></>
                ) : (
                  <><Sparkles size={20} /><span>立即生成行程</span></>
                )}
              </button>

              {aiItineraryResult && (
                <div className="min-h-[200px] flex-1 overflow-y-auto rounded-xl border border-gray-100 bg-gray-50 p-5">
                  <div className="max-w-none whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {aiItineraryResult}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        id="TOP"
        onClick={scrollToTop}
        className={`fixed bottom-20 right-4 z-40 rounded-full bg-gray-800/80 p-3 text-white shadow-lg transition-all hover:bg-gray-900 md:bottom-24 md:right-8 ${showTopBtn ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-10 opacity-0'}`}
        aria-label="回頂部"
      >
        <ArrowUp size={20} />
      </button>
    </div>
  );
}
