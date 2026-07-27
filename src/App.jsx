import './App.css';
import { useState, useMemo, useEffect, useRef } from 'react';
import {
	Film,
	Search,
	Heart,
	Star,
	X,
	Play,
	Ticket,
	Mail,
	ArrowRight,
	Clock,
	Check,
	Clapperboard,
	Lock,
	LogOut,
	Trash2,
	Plus,
	ShieldCheck,
	Sparkles,
	Loader2,
	KeyRound,
	MessageCircle,
	Send,
	Bot,
} from 'lucide-react';

/* ---------------------------------------------------------
   Data

   Real poster images: add a `poster: "https://..."` field to
   any movie below (use a URL you have the rights to — e.g.
   your own TMDB API key, or licensed assets). Movies without
   a `poster` field automatically show the illustrated ticket
   design instead, so nothing breaks if a link is missing or
   fails to load.
--------------------------------------------------------- */

const GENRE_THEME = {
	Fantastika: { a: '#241C4A', b: '#4B3B95', accent: '#9C8CFF' },
	Jinoiy: { a: '#3A141F', b: '#6E2230', accent: '#F0716B' },
	Drama: { a: '#132A32', b: '#2C5766', accent: '#7FD4EE' },
	Animatsiya: { a: '#3A2A0E', b: '#7C5B1E', accent: '#F6C158' },
	Triller: { a: '#22132A', b: '#4C2352', accent: '#D06AD9' },
	Tarixiy: { a: '#28230F', b: '#5E5029', accent: '#E2CC7F' },
};

// Agar biror filmning "genre" maydoni GENRE_THEME ro'yxatidagi janrlardan
// birortasiga aniq mos kelmasa (masalan, imlo xatosi tufayli), shu standart
// rangdan foydalaniladi — shunda sayt "Cannot read properties of undefined"
// xatosi bilan qulab tushmaydi.
const DEFAULT_THEME = { a: '#241C1C', b: '#4A3B3B', accent: '#C9A227' };

function getGenreTheme(genre) {
	return GENRE_THEME[genre] || DEFAULT_THEME;
}

const MOVIES = [
	{
		id: 1,
		title: 'Interstellar',
		year: 2014,
		genre: 'Fantastika',
		duration: 169,
		rating: 8.6,
		blurb: "Yer inqirozga yuz tutganda, bir guruh olimlar odamzotga yangi vatan izlab koinot bo'ylab sayohatga chiqadi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=2LqzF5WauAw',
		trailerOnly: true,
	},
	{
		id: 2,
		title: 'Inception',
		year: 2010,
		genre: 'Fantastika',
		duration: 148,
		rating: 8.8,
		blurb: "Odamlar tushiga kirib, ongidan g'oya o'g'irlaydigan mutaxassis oxirgi, eng xavfli topshiriqni qabul qiladi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
		trailerOnly: true,
	},
	{
		id: 3,
		title: 'The Dark Knight',
		year: 2008,
		genre: 'Jinoiy',
		duration: 152,
		rating: 9.0,
		blurb: "Gotham shahri tartibsizlik girdobiga tushganda, niqobli qahramon o'z tamoyillari bilan imtihon bo'ladi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=UXmBT9JtuLo',
		trailerOnly: true,
	},
	{
		id: 4,
		title: 'Parasite',
		year: 2019,
		genre: 'Triller',
		duration: 132,
		rating: 8.6,
		blurb: "Kambag'al oila boy oilaning hayotiga asta-sekin kirib boradi — va bu ikki dunyo kutilmagan tarzda to'qnashadi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=QRkBjCGJ3Uc',
		trailerOnly: true,
	},
	{
		id: 5,
		title: 'La La Land',
		year: 2016,
		genre: 'Drama',
		duration: 128,
		rating: 8.0,
		blurb: "Los-Anjelesda orzu quvgan yosh musiqachi va aktrisaning sevgisi shuhrat yo'lida sinovdan o'tadi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=0pdqf4P9MB8',
		trailerOnly: true,
	},
	{
		id: 6,
		title: 'Coco',
		year: 2017,
		genre: 'Animatsiya',
		duration: 105,
		rating: 8.4,
		blurb: "Musiqaga oshiq bo'lgan bolakay ajdodlar dunyosiga tushib qolib, oilasining sirini kashf etadi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=KjDYG59qB_8',
		trailerOnly: true,
	},
	{
		id: 7,
		title: 'The Matrix',
		year: 1999,
		genre: 'Fantastika',
		duration: 136,
		rating: 8.7,
		blurb: "Oddiy dasturchi haqiqat aslida raqamli illyuziya ekanini bilib, tizimga qarshi kurashga qo'shiladi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=nUEQNVV3Gfs',
		trailerOnly: true,
	},
	{
		id: 8,
		title: 'Whiplash',
		year: 2014,
		genre: 'Drama',
		duration: 106,
		rating: 8.5,
		blurb: "Iste'dodli baraban chaluvchi mukammallikka intilgan shafqatsiz ustozi bilan irodasini sinaydi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=Df1xkYYbYrY',
		trailerOnly: true,
	},
	{
		id: 9,
		title: 'Spirited Away',
		year: 2001,
		genre: 'Animatsiya',
		duration: 125,
		rating: 8.6,
		blurb: 'Sirli ruhlar dunyosiga adashib kirib qolgan qiz oilasini qutqarish uchun jasoratini namoyon etadi.',
		youtubeUrl: 'https://www.youtube.com/watch?v=fDUFP7EeXLE',
		trailerOnly: true,
	},
	{
		id: 10,
		title: 'Joker',
		year: 2019,
		genre: 'Jinoiy',
		duration: 122,
		rating: 8.4,
		blurb: "Jamiyat tomonidan chetlab o'tilgan komediyachi asta-sekin Gotamning eng xavfli siymosiga aylanadi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=xRjvmVaFHkk',
		trailerOnly: true,
	},
	{
		id: 11,
		title: 'Dune',
		year: 2021,
		genre: 'Fantastika',
		duration: 155,
		rating: 8.0,
		blurb: "Cho'l sayyorasidagi qimmatbaho resurs uchun kurash yosh merosxo'rning taqdirini butunlay o'zgartiradi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=kcQx41TM6MY',
		trailerOnly: true,
	},
	{
		id: 12,
		title: 'Oppenheimer',
		year: 2023,
		genre: 'Tarixiy',
		duration: 180,
		rating: 8.4,
		blurb: "Atom bombasini yaratgan fizikning ilmiy yutuqlari va og'ir vijdon azobi haqidagi hayot tarixi.",
		youtubeUrl: 'https://www.youtube.com/watch?v=jxL87QbZ9Pc',
		trailerOnly: true,
	},
	{
		id: 13,
		title: '7 Inson Changalda',
		year: 2000,
		genre: 'Fantastika',
		duration: 95,
		rating: 7.0,
		blurb: "Tavsif tez orada to'ldiriladi.",
		youtubeUrl: 'https://youtu.be/oatcw4p6Wuw',
	},

	{
		id: 14,
		title: 'Sahro Jangchisi',
		year: 2025,
		genre: 'Tarixiy',
		duration: 127,
		rating: 7.4,
		blurb: "Tavsif tez orada to'ldiriladi.",
		youtubeUrl: 'https://youtu.be/GHgJleDjV68?si=0Gsal05r3tfwIDsN',
	},

	{
		id: 15,
		title: 'Sniper',
		year: 2016,
		genre: 'Fantastika',
		duration: 99,
		rating: 8.3,
		blurb: "Tavsif tez orada to'ldiriladi.",
		youtubeUrl: 'https://youtu.be/wwKNxOG9R5s?si=BazzWbt2sPCnKyid',
	},
];

const GENRES = ['Barchasi', 'Fantastika', 'Jinoiy', 'Drama', 'Animatsiya', 'Triller', 'Tarixiy'];
const ADMIN_GENRES = GENRES.filter(g => g !== 'Barchasi');

const ADMIN_EMAIL = 'xurboyeva.01@gmail.com';
const ADMIN_USERNAME = 'xurboyeva.01@gmail.com';
const ADMIN_PASSWORD = 'xurboyeva_.010';

const EMAIL_STORAGE_KEY = 'kinobot_email';
const AI_KEY_STORAGE_KEY = 'kinobot_gemini_key';
// Google Gemini modellarni tez-tez o'zgartirib/eskirtirib turadi. Agar birinchi
// model ishlamay qolsa (masalan, "no longer available" xatosi), quyidagi
// ro'yxatdagi keyingi modellar avtomatik sinab ko'riladi — shunda kod har
// safar qo'lda tuzatilmasdan ham ishlashda davom etadi.
const AI_MODEL_FALLBACKS = ['gemini-3.5-flash', 'gemini-flash-latest', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'];

// ===========================================================
// SIZNING BEPUL GEMINI API KALITINGIZ
// ===========================================================
// Agar shu qatorga o'z kalitingizni yozib qo'ysangiz, saytga kiruvchi
// hech kimdan kalit so'ralmaydi — AI funksiyalari (chat, tavsif yozish,
// qidiruvda qo'shish) darhol, hech qanday sozlashsiz ishlaydi.
//
// Kalitni https://aistudio.google.com/apikey dan bepul olasiz.
//
// DIQQAT: bu kalit sayt kodida OCHIQ turadi — har qanday tashrifchi
// brauzer orqali (masalan, "Ko'rish manbasi" yoki DevTools) uni ko'ra
// oladi va sizning bepul limitingizdan foydalanishi mumkin. Bu —
// shaxsiy/portfolio loyihalar uchun odatiy, lekin xavfsiz emas.
// Agar buni xohlamasangiz, shu qatorni bo'sh ('') qoldiring — u holda
// har bir tashrifchi (yoki admin) o'z kalitini bir marta kiritadi.
const HARDCODED_GEMINI_KEY = ''; // <-- shu yerga o'z kalitingizni qo'shtirnoq ichiga yozing

function getInitialApiKey() {
	if (HARDCODED_GEMINI_KEY) return HARDCODED_GEMINI_KEY;
	try {
		return localStorage.getItem(AI_KEY_STORAGE_KEY) || '';
	} catch {
		return '';
	}
}

const EMPTY_FORM = {
	title: '',
	genre: ADMIN_GENRES[0],
	year: '',
	duration: '',
	rating: '',
	blurb: '',
	poster: '',
	youtubeUrl: '',
};

/* ---------------------------------------------------------
   Small helpers
--------------------------------------------------------- */

function isValidEmail(value) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function formatDuration(min) {
	const h = Math.floor(min / 60);
	const m = min % 60;
	return `${h}s ${m}d`;
}

function getYouTubeId(url) {
	if (!url) return null;
	try {
		const u = new URL(url.trim());
		if (u.hostname.includes('youtu.be')) {
			return u.pathname.replace('/', '') || null;
		}
		if (u.hostname.includes('youtube.com')) {
			if (u.pathname === '/watch') return u.searchParams.get('v');
			if (u.pathname.startsWith('/embed/')) return u.pathname.split('/embed/')[1];
			if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/shorts/')[1];
		}
	} catch {
		return null;
	}
	return null;
}

// YouTube har bir video uchun standart, doim mavjud bo'lgan thumbnail
// (kichik surat) manzilini beradi — xuddi YouTube'da videoni bosishdan
// oldin ko'rinadigan surat kabi. Bu tasodifiy internet-rasm emas, balki
// aynan shu videoning YouTube'dagi rasmiy surati.
function getYouTubeThumbnail(youtubeId) {
	if (!youtubeId) return null;
	return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

/* ---------------------------------------------------------
   AI: film tavsifini avtomatik yozib berish

   Bu funksiya to'g'ridan-to'g'ri brauzerdan Google Gemini API'ga
   so'rov yuboradi. Bu — Google Gemini'ning BEPUL tarifi (kredit karta
   shart emas). Kalitni https://aistudio.google.com/apikey dan olish
   mumkin — u faqat shu qurilmaning localStorage'ida saqlanadi, hech
   qayerga yuborilmaydi.

   DIQQAT: bu — soddalashtirilgan demo yondashuv. Haqiqiy production
   loyihada API kalitini brauzerda saqlash xavfsiz emas — bunday
   so'rovlar odatda o'z backendingiz orqali yuborilishi kerak.
--------------------------------------------------------- */
/* ---------------------------------------------------------
   Gemini API bilan umumiy aloqa funksiyasi

   Google Gemini'ning BEPUL tarifidan foydalanamiz (kredit karta
   shart emas). API kalitni https://aistudio.google.com/apikey
   sahifasidan olish mumkin. So'rov to'g'ridan-to'g'ri brauzerdan
   Google serveriga yuboriladi.
--------------------------------------------------------- */
async function callGemini({ systemPrompt, contents, apiKey, maxOutputTokens = 300 }) {
	let lastError;

	for (const model of AI_MODEL_FALLBACKS) {
		const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
			apiKey,
		)}`;

		let response;
		try {
			response = await fetch(url, {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({
					systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
					contents,
					generationConfig: {
						maxOutputTokens,
						temperature: 0.8,
						// Gemini 2.5/3.5 Flash modellari javob yozishdan oldin "ichki
						// fikrlash" (thinking) qiladi, va bu fikrlash tokenlari ham
						// maxOutputTokens limitidan hisoblanadi. Shu sabab javoblar
						// past limitlarda (masalan 300-400) yarim so'zda kesilib
						// qolardi — fikrlash butun byudjetni yeb qo'yardi. Buni
						// nolga tushirib, butun byudjetni ko'rinadigan javobga
						// ajratamiz.
						thinkingConfig: { thinkingBudget: 0 },
					},
				}),
			});
		} catch (networkErr) {
			throw new Error("Internetga ulanishda muammo bo'ldi, qayta urinib ko'ring", { cause: networkErr });
		}

		if (!response.ok) {
			// Google xato bo'lganda JSON tanasida aniq sababni ham qaytaradi —
			// shuni ko'rsatsak, foydalanuvchi muammoni tezroq tushunadi
			// (masalan: "API key not valid" yoki "model is not found").
			let detail = '';
			try {
				const errData = await response.json();
				detail = errData?.error?.message || '';
			} catch {
				/* javob JSON bo'lmasa, e'tiborsiz qoldiramiz */
			}

			if (response.status === 400 || response.status === 401 || response.status === 403) {
				// Ba'zi eski/lite modellar thinkingConfig maydonini tushunmasligi
				// mumkin va shu sababli 400 xato qaytarishi mumkin — bunday holda
				// darhol to'xtamasdan, ro'yxatdagi keyingi modelni sinab ko'ramiz.
				const isThinkingConfigIssue = /thinking/i.test(detail);
				if (isThinkingConfigIssue) {
					lastError = new Error(detail || "Model thinkingConfig'ni qo'llab-quvvatlamaydi");
					continue;
				}
				throw new Error(detail ? `API kalit muammosi: ${detail}` : "API kalit noto'g'ri yoki yaroqsiz");
			}
			if (response.status === 404) {
				// Bu model mavjud emas/eskirgan — ro'yxatdagi keyingi modelni sinaymiz
				lastError = new Error(
					detail ? `Model topilmadi: ${detail}` : "Model topilmadi — API kalitingiz turi mos kelmayotgan bo'lishi mumkin",
				);
				continue;
			}
			if (response.status === 429) {
				throw new Error("Bepul limitga yetdingiz, biroz kuting va qayta urinib ko'ring");
			}
			throw new Error(detail || `So'rov muvaffaqiyatsiz tugadi (${response.status})`);
		}

		const data = await response.json();
		const text = data.candidates?.[0]?.content?.parts
			?.map(p => p.text || '')
			.join('')
			?.trim();
		if (!text) throw new Error('AI javob qaytarmadi');
		return text;
	}

	// Ro'yxatdagi barcha modellar "topilmadi" xatosini qaytardi
	throw lastError || new Error('Hech qanday model topilmadi');
}

async function generateBlurbWithAI({ title, genre, year, apiKey }) {
	const prompt = `Sen professional o'zbek tilida kino-tavsif yozuvchisisan. Quyidagi film uchun bitta, tabiiy, jozibali va 1-2 gapdan iborat qisqacha tavsif (blurb) yoz.

Film nomi: ${title}
Janr: ${genre}
Yili: ${year || "noma'lum"}

Qoidalar:
- Faqat o'zbek tilida yoz.
- Faqat tavsif matnini qaytar, boshqa hech narsa yozma (izoh, sarlavha, tirnoq belgisi shart emas).
- Filmning syujetini his-tuyg'u bilan, lekin oshirib yubormasdan tasvirla.
- Taxminan 15-30 so'zdan iborat bo'lsin.`;

	return callGemini({
		contents: [{ role: 'user', parts: [{ text: prompt }] }],
		apiKey,
		maxOutputTokens: 300,
	});
}

/* ---------------------------------------------------------
   AI: qidiruvda topilmagan filmni to'liq ma'lumot bilan yaratish

   Foydalanuvchi qidiruv qatoriga film nomini yozadi, lekin ro'yxatda
   topilmasa, AI o'sha nomga qarab janr, yil, davomiylik, reyting va
   qisqacha tavsifni o'zi taxmin qilib, JSON ko'rinishida qaytaradi.
   Bu ma'lumotlar tekshirilib (validatsiya), keyin filmlar ro'yxatiga
   qo'shiladi.
--------------------------------------------------------- */
async function generateMovieWithAI({ title, apiKey }) {
	const genreList = ADMIN_GENRES.join(', ');
	const prompt = `Sen kinolar bo'yicha bilimdon yordamchisan. Foydalanuvchi "${title}" nomli filmni qidirmoqda, lekin katalogda topilmadi. Shu film haqida ma'lumot ber (agar bu haqiqiy, tanish film bo'lsa — haqiqiy ma'lumotlarni ishlat; agar tanimasang yoki noaniq bo'lsa — mantiqiy, ishonchli taxmin qil).

Faqat quyidagi JSON formatida javob qaytar, boshqa hech qanday matn, izoh yoki markdown belgisi qo'shma:

{
  "genre": "<faqat shu ro'yxatdan bittasi: ${genreList}>",
  "year": <son, chiqarilgan yili>,
  "duration": <son, daqiqada davomiyligi>,
  "rating": <son, 0 dan 10 gacha, bitta kasr xonasi bilan>,
  "blurb": "<o'zbek tilida, 15-30 so'zdan iborat qisqacha tavsif>"
}`;

	const raw = await callGemini({
		contents: [{ role: 'user', parts: [{ text: prompt }] }],
		apiKey,
		maxOutputTokens: 400,
	});

	// AI ba'zan JSON'ni ```json ... ``` bilan o'rab yuborishi mumkin — tozalaymiz
	const cleaned = raw
		.replace(/^```(json)?/i, '')
		.replace(/```$/, '')
		.trim();

	let parsed;
	try {
		parsed = JSON.parse(cleaned);
	} catch {
		throw new Error("AI javobini o'qib bo'lmadi, qayta urinib ko'ring");
	}

	const genre = ADMIN_GENRES.includes(parsed.genre) ? parsed.genre : ADMIN_GENRES[0];
	const year = Number(parsed.year) || new Date().getFullYear();
	const duration = Number(parsed.duration) > 0 ? Number(parsed.duration) : 100;
	const rating = Math.min(10, Math.max(0, Number(parsed.rating) || 7));
	const blurb = typeof parsed.blurb === 'string' && parsed.blurb.trim() ? parsed.blurb.trim() : "Tavsif tez orada to'ldiriladi.";

	return { title, genre, year, duration, rating, blurb };
}

/* ---------------------------------------------------------
   AI: chatbot — filmlar haqida savol-javob va tavsiya

   Chatbot joriy katalogdagi filmlar ro'yxatini (nom, janr, yil, reyting)
   kontekst sifatida oladi, shuning uchun faqat mavjud filmlar haqida
   aniq javob bera oladi va real tavsiyalar beradi.
--------------------------------------------------------- */
async function sendChatMessage({ history, movies, apiKey }) {
	const catalogText = movies.map(m => `- ${m.title} (${m.genre}, ${m.year}, reyting ${m.rating})`).join('\n');

	const systemPrompt = `Sen "KinoBot" nomli onlayn kinoteatr saytining sun'iy intellekt yordamchisisan. Foydalanuvchilarga filmlar haqida savollarga javob berasan va janr/kayfiyatga qarab tavsiyalar berasan.

Qat'iy qoidalar:
- Faqat o'zbek tilida javob ber.
- Javoblaring qisqa va tabiiy bo'lsin (odatda 1-4 gap), keraksiz uzun matn yozma.
- Tavsiya berayotganda FAQAT quyidagi katalogdagi filmlardan tanla — bu ro'yxatdan tashqari film tavsiya qilma, chunki saytda ular yo'q:

${catalogText}

- Agar so'ralgan narsa katalogda yo'q bo'lsa, buni ochiq ayt va eng yaqin mos keladigan variantni taklif qil.
- Sen sotib olish, chipta band qilish kabi amallarni bajara olmaysan — faqat maslahat va ma'lumot berasan.`;

	const response = await callGemini({
		systemPrompt,
		contents: history.map(m => ({
			role: m.role === 'assistant' ? 'model' : 'user',
			parts: [{ text: m.content }],
		})),
		apiKey,
		maxOutputTokens: 600,
	});

	return response;
}

/* ---------------------------------------------------------
   Chatbot widget — pastki burchakdagi suzuvchi chat oynasi
--------------------------------------------------------- */

function ChatWidget({ movies, apiKey, onSaveApiKey, onOpenMovie }) {
	const [open, setOpen] = useState(false);
	const [messages, setMessages] = useState([]);
	const [input, setInput] = useState('');
	const [keyDraft, setKeyDraft] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const scrollRef = useRef(null);

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, loading, open]);

	function matchedMovies(text) {
		const lower = text.toLowerCase();
		return movies.filter(m => lower.includes(m.title.toLowerCase())).slice(0, 3);
	}

	async function handleSend() {
		const text = input.trim();
		if (!text || loading) return;
		if (!apiKey) {
			setError('Avval Gemini API kalitingizni kiriting');
			return;
		}
		setError('');
		const nextHistory = [...messages, { role: 'user', content: text }];
		setMessages(nextHistory);
		setInput('');
		setLoading(true);
		try {
			const reply = await sendChatMessage({ history: nextHistory, movies, apiKey });
			setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
		} catch (err) {
			setError(err.message || "Javob olib bo'lmadi");
			setMessages(prev => prev.slice(0, -1));
			setInput(text);
		} finally {
			setLoading(false);
		}
	}

	function handleSaveKey() {
		const trimmed = keyDraft.trim();
		if (!trimmed) return;
		onSaveApiKey(trimmed);
		setKeyDraft('');
		setError('');
	}

	return (
		<>
			<button
				type='button'
				className={`kb-chat-fab ${open ? 'kb-chat-fab--open' : ''}`}
				onClick={() => setOpen(v => !v)}
				aria-label={open ? 'Chatni yopish' : 'AI yordamchi bilan suhbat'}>
				{open ? <X size={22} /> : <MessageCircle size={22} />}
			</button>

			{open && (
				<div className='kb-chat-panel' role='dialog' aria-label='AI yordamchi'>
					<div className='kb-chat-head'>
						<span className='kb-chat-head-icon'>
							<Bot size={16} />
						</span>
						<div>
							<p className='kb-chat-head-title'>KinoBot AI</p>
							<p className='kb-chat-head-sub'>Film tanlashda yordam beraman</p>
						</div>
					</div>

					<div className='kb-chat-body' ref={scrollRef}>
						{messages.length === 0 && (
							<div className='kb-chat-intro'>
								<Sparkles size={18} />
								<p>Salom! Menga kayfiyatingiz yoki qiziqqan janringizni ayting — mos filmni katalogdan topib beraman.</p>
							</div>
						)}
						{messages.map((m, i) => (
							<div key={i} className={`kb-chat-msg kb-chat-msg--${m.role}`}>
								<p>{m.content}</p>
								{m.role === 'assistant' &&
									matchedMovies(m.content).map(mv => (
										<button
											key={mv.id}
											type='button'
											className='kb-chat-movie-chip'
											onClick={() => {
												onOpenMovie(mv);
												setOpen(false);
											}}>
											<Film size={12} />
											{mv.title}
										</button>
									))}
							</div>
						))}
						{loading && (
							<div className='kb-chat-msg kb-chat-msg--assistant kb-chat-typing'>
								<Loader2 size={14} className='kb-spin' />
								Yozmoqda...
							</div>
						)}
					</div>

					{!apiKey ? (
						<div className='kb-chat-key-wrap'>
							<div className='kb-chat-key-form'>
								<KeyRound size={14} />
								<input
									type='password'
									className='kb-input kb-ai-key-input'
									placeholder='Gemini API kalitingiz (AIzaSy...)'
									value={keyDraft}
									onChange={e => setKeyDraft(e.target.value)}
									onKeyDown={e => {
										if (e.key === 'Enter') handleSaveKey();
									}}
								/>
								<button type='button' className='kb-btn-secondary kb-ai-key-save' onClick={handleSaveKey}>
									Saqlash
								</button>
							</div>
							<p className='kb-ai-key-hint kb-chat-key-hint'>
								Bepul kalitni{' '}
								<a href='https://aistudio.google.com/apikey' target='_blank' rel='noreferrer'>
									aistudio.google.com/apikey
								</a>{' '}
								dan oling.
							</p>
						</div>
					) : (
						<div className='kb-chat-input-row'>
							<input
								type='text'
								className='kb-input kb-chat-input'
								placeholder='Savolingizni yozing...'
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') handleSend();
								}}
								disabled={loading}
							/>
							<button
								type='button'
								className='kb-chat-send'
								onClick={handleSend}
								disabled={loading || !input.trim()}
								aria-label='Yuborish'>
								<Send size={16} />
							</button>
						</div>
					)}
					{error && <p className='kb-error-text kb-chat-error'>{error}</p>}
				</div>
			)}
		</>
	);
}

function Sprockets({ count = 14 }) {
	return (
		<div className='kb-sprockets' aria-hidden='true'>
			{Array.from({ length: count }).map((_, i) => (
				<span key={i} className='kb-sprocket-hole' />
			))}
		</div>
	);
}

/* ---------------------------------------------------------
   Gate screen — asks for email before entry
--------------------------------------------------------- */

function GateScreen({ onEnter }) {
	const [value, setValue] = useState('');
	const [error, setError] = useState('');
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	function submit() {
		if (!isValidEmail(value)) {
			setError("To'g'ri email manzil kiriting, masalan: ism@pochta.uz");
			return;
		}
		setError('');
		onEnter(value.trim());
	}

	return (
		<div className='kb-gate'>
			<Sprockets count={10} />
			<div className='kb-gate-card'>
				<div className='kb-gate-badge'>
					<Film size={28} strokeWidth={1.75} />
				</div>
				<p className='kb-eyebrow'>Kinoteatr ochiq</p>
				<h1 className='kb-display kb-gate-title'>KinoBot</h1>
				<p className='kb-gate-sub'>Bugungi kechada nima ko'ramiz? Chiptangizni olish uchun email manzilingizni qoldiring.</p>

				<div className='kb-gate-form'>
					<label htmlFor='kb-email' className='kb-label'>
						Email manzil
					</label>
					<div className={`kb-input-wrap ${error ? 'kb-input-wrap--error' : ''}`}>
						<Mail size={18} className='kb-input-icon' />
						<input
							id='kb-email'
							ref={inputRef}
							type='email'
							inputMode='email'
							autoComplete='email'
							placeholder='ism@pochta.uz'
							value={value}
							onChange={e => {
								setValue(e.target.value);
								if (error) setError('');
							}}
							onKeyDown={e => {
								if (e.key === 'Enter') submit();
							}}
							className='kb-input'
						/>
					</div>
					{error && <p className='kb-error-text'>{error}</p>}

					<button type='button' className='kb-btn-primary kb-gate-submit' onClick={submit}>
						<Ticket size={18} />
						Chiptamni olish
						<ArrowRight size={16} />
					</button>
				</div>

				<p className='kb-gate-fine'>Email faqat shu seansga kirish uchun ishlatiladi, hech kimga yuborilmaydi.</p>
			</div>
			<Sprockets count={10} />
		</div>
	);
}

/* ---------------------------------------------------------
   Movie ticket card
--------------------------------------------------------- */

function MovieCard({ movie, isFav, onToggleFav, onOpen, index }) {
	const theme = getGenreTheme(movie.genre);
	const [imgError, setImgError] = useState(false);
	const youtubeId = getYouTubeId(movie.youtubeUrl);
	const posterSrc = movie.poster || getYouTubeThumbnail(youtubeId);
	const hasPoster = Boolean(posterSrc) && !imgError;
	return (
		<article
			className='kb-ticket'
			style={{
				'--fadeDelay': `${Math.min(index, 10) * 60}ms`,
				'--gA': theme.a,
				'--gB': theme.b,
				'--gAccent': theme.accent,
			}}>
			<button
				type='button'
				className='kb-ticket-poster'
				onClick={() => onOpen(movie)}
				aria-label={`${movie.title} haqida batafsil`}>
				{hasPoster ? (
					<img
						src={posterSrc}
						alt={`${movie.title} plakati`}
						className='kb-ticket-poster-img'
						onError={() => setImgError(true)}
					/>
				) : (
					<Film size={34} strokeWidth={1.4} className='kb-ticket-poster-icon' />
				)}
				<span className='kb-ticket-genre-tag'>{movie.genre}</span>
				{movie.rating >= 8.6 && <span className='kb-ticket-stamp'>TOP</span>}
				{movie.youtubeUrl && (
					<span className='kb-ticket-play' style={{ background: theme.accent, color: theme.a }}>
						<Play size={16} fill='currentColor' />
					</span>
				)}
			</button>

			<div className='kb-ticket-perf' aria-hidden='true'>
				<span className='kb-notch kb-notch-left' />
				<span className='kb-notch kb-notch-right' />
			</div>

			<div className='kb-ticket-info'>
				<div className='kb-ticket-row'>
					<h3 className='kb-ticket-title'>{movie.title}</h3>
					<button
						type='button'
						className={`kb-fav-btn ${isFav ? 'kb-fav-btn--active' : ''}`}
						onClick={() => onToggleFav(movie.id)}
						aria-pressed={isFav}
						aria-label={isFav ? 'Sevimlilardan olib tashlash' : "Sevimlilarga qo'shish"}>
						<Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
					</button>
				</div>
				<div className='kb-ticket-meta'>
					<span>{movie.year}</span>
					<span className='kb-dot' />
					<span className='kb-meta-icon'>
						<Clock size={13} />
						{formatDuration(movie.duration)}
					</span>
					<span className='kb-dot' />
					<span className='kb-meta-icon kb-rating'>
						<Star size={13} fill='currentColor' />
						{movie.rating}
					</span>
				</div>
				<button type='button' className='kb-btn-ghost' onClick={() => onOpen(movie)}>
					Batafsil
				</button>
			</div>
		</article>
	);
}

/* ---------------------------------------------------------
   Modal
--------------------------------------------------------- */

function MovieModal({ movie, isFav, onToggleFav, onClose, onWatch }) {
	const theme = getGenreTheme(movie.genre);
	const [imgError, setImgError] = useState(false);
	const [playing, setPlaying] = useState(false);
	const youtubeId = getYouTubeId(movie.youtubeUrl);
	// Agar mahsulotda o'z posteri bo'lmasa, YouTube'ning shu video uchun
	// avtomatik beradigan asl thumbnail'idan foydalanamiz.
	const posterSrc = movie.poster || getYouTubeThumbnail(youtubeId);
	const hasPoster = Boolean(posterSrc) && !imgError;

	useEffect(() => {
		function onKey(e) {
			if (e.key === 'Escape') onClose();
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [onClose]);

	function handleWatchClick() {
		if (youtubeId) {
			setPlaying(true);
		} else {
			onWatch(movie);
		}
	}

	return (
		<div
			className='kb-modal-backdrop'
			onClick={e => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<div className='kb-modal' role='dialog' aria-modal='true' aria-label={movie.title}>
				<button type='button' className='kb-modal-close' onClick={onClose} aria-label='Yopish'>
					<X size={20} />
				</button>
				<div className='kb-modal-hero' style={{ '--gA': theme.a, '--gB': theme.b, '--gAccent': theme.accent }}>
					{playing && youtubeId ? (
						<iframe
							className='kb-modal-video'
							src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&fs=1&color=white&showinfo=0`}
							title={movie.title}
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
							allowFullScreen
						/>
					) : hasPoster ? (
						<button
							type='button'
							className='kb-modal-thumb-btn'
							onClick={handleWatchClick}
							aria-label={`${movie.title} treylerini ko'rish`}>
							<img
								src={posterSrc}
								alt={`${movie.title} plakati`}
								className='kb-ticket-poster-img'
								onError={() => setImgError(true)}
							/>
							{youtubeId && (
								<span
									className='kb-modal-play-overlay'
									style={{
										background: theme.accent,
										color: theme.a,
										boxShadow: `0 0 0 6px ${theme.a}66`,
									}}>
									<Play size={26} fill='currentColor' />
								</span>
							)}
						</button>
					) : (
						<Film size={56} strokeWidth={1.2} />
					)}
					{!playing && <span className='kb-ticket-genre-tag kb-modal-genre-tag'>{movie.genre}</span>}
				</div>
				<div className='kb-modal-body'>
					<h2 className='kb-display kb-modal-title'>{movie.title}</h2>
					<div className='kb-ticket-meta kb-modal-meta'>
						<span>{movie.year}</span>
						<span className='kb-dot' />
						<span className='kb-meta-icon'>
							<Clock size={13} />
							{formatDuration(movie.duration)}
						</span>
						<span className='kb-dot' />
						<span className='kb-meta-icon kb-rating'>
							<Star size={13} fill='currentColor' />
							{movie.rating} / 10
						</span>
					</div>
					<p className='kb-modal-blurb'>{movie.blurb}</p>
					{movie.trailerOnly && <p className='kb-trailer-note'>Faqat rasmiy treyler mavjud — to'liq film emas.</p>}
					<div className='kb-modal-actions'>
						{!playing && (
							<button type='button' className='kb-btn-primary' onClick={handleWatchClick}>
								<Play size={18} fill='currentColor' />
								{movie.trailerOnly ? "Treylerni ko'rish" : 'Tomosha qilish'}
							</button>
						)}
						<button
							type='button'
							className={`kb-btn-secondary ${isFav ? 'kb-btn-secondary--active' : ''}`}
							onClick={() => onToggleFav(movie.id)}>
							<Heart size={18} fill={isFav ? 'currentColor' : 'none'} />
							{isFav ? 'Sevimlida' : 'Sevimlilarga'}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

/* ---------------------------------------------------------
   Admin login
--------------------------------------------------------- */

function AdminLogin({ onClose, onSuccess }) {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const inputRef = useRef(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		function onKey(e) {
			if (e.key === 'Escape') onClose();
		}
		document.addEventListener('keydown', onKey);
		return () => document.removeEventListener('keydown', onKey);
	}, [onClose]);

	function submit() {
		if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
			setError('');
			onSuccess();
		} else {
			setError("Login yoki parol noto'g'ri");
		}
	}

	return (
		<div
			className='kb-modal-backdrop'
			onClick={e => {
				if (e.target === e.currentTarget) onClose();
			}}>
			<div className='kb-modal kb-admin-login' role='dialog' aria-modal='true' aria-label='Admin kirish'>
				<button type='button' className='kb-modal-close' onClick={onClose} aria-label='Yopish'>
					<X size={20} />
				</button>
				<div className='kb-modal-body kb-admin-login-body'>
					<div className='kb-gate-badge kb-admin-badge'>
						<Lock size={24} strokeWidth={1.75} />
					</div>
					<h2 className='kb-display kb-modal-title kb-admin-login-title'>Admin kirish</h2>
					<p className='kb-gate-sub kb-admin-login-sub'>Filmlarni boshqarish uchun tizimga kiring.</p>

					<label htmlFor='kb-admin-user' className='kb-label'>
						Login
					</label>
					<div className={`kb-input-wrap ${error ? 'kb-input-wrap--error' : ''}`}>
						<ShieldCheck size={18} className='kb-input-icon' />
						<input
							id='kb-admin-user'
							ref={inputRef}
							type='text'
							autoComplete='username'
							placeholder='xurboyeva.01@gmail.com'
							value={username}
							onChange={e => {
								setUsername(e.target.value);
								if (error) setError('');
							}}
							onKeyDown={e => {
								if (e.key === 'Enter') submit();
							}}
							className='kb-input'
						/>
					</div>

					<label htmlFor='kb-admin-pass' className='kb-label kb-admin-pass-label'>
						Parol
					</label>
					<div className={`kb-input-wrap ${error ? 'kb-input-wrap--error' : ''}`}>
						<Lock size={18} className='kb-input-icon' />
						<input
							id='kb-admin-pass'
							type='password'
							autoComplete='current-password'
							placeholder='••••••••'
							value={password}
							onChange={e => {
								setPassword(e.target.value);
								if (error) setError('');
							}}
							onKeyDown={e => {
								if (e.key === 'Enter') submit();
							}}
							className='kb-input'
						/>
					</div>
					{error && <p className='kb-error-text'>{error}</p>}

					<button type='button' className='kb-btn-primary kb-gate-submit' onClick={submit}>
						<Lock size={18} />
						Kirish
					</button>
				</div>
			</div>
		</div>
	);
}

/* ---------------------------------------------------------
   Admin panel
--------------------------------------------------------- */

function AdminPanel({ movies, onAdd, onDelete, onLogout }) {
	const [form, setForm] = useState(EMPTY_FORM);
	const [formError, setFormError] = useState('');

	const [apiKey, setApiKey] = useState(getInitialApiKey);
	const [apiKeyDraft, setApiKeyDraft] = useState('');
	const [showKeyField, setShowKeyField] = useState(false);
	const [aiLoading, setAiLoading] = useState(false);
	const [aiError, setAiError] = useState('');

	function saveApiKey() {
		const trimmed = apiKeyDraft.trim();
		if (!trimmed) return;
		try {
			localStorage.setItem(AI_KEY_STORAGE_KEY, trimmed);
		} catch {
			/* ignore */
		}
		setApiKey(trimmed);
		setApiKeyDraft('');
		setShowKeyField(false);
		setAiError('');
	}

	function clearApiKey() {
		try {
			localStorage.removeItem(AI_KEY_STORAGE_KEY);
		} catch {
			/* ignore */
		}
		setApiKey('');
	}

	async function handleGenerateBlurb() {
		if (!form.title.trim()) {
			setAiError('Avval film nomini kiriting');
			return;
		}
		if (!apiKey) {
			setShowKeyField(true);
			setAiError('Avval Gemini API kalitingizni kiriting');
			return;
		}
		setAiError('');
		setAiLoading(true);
		try {
			const blurb = await generateBlurbWithAI({
				title: form.title.trim(),
				genre: form.genre,
				year: form.year,
				apiKey,
			});
			updateField('blurb', blurb);
		} catch (err) {
			setAiError(err.message || "AI tavsif yaratib bo'lmadi");
		} finally {
			setAiLoading(false);
		}
	}

	function updateField(key, val) {
		setForm(f => ({ ...f, [key]: val }));
	}

	function submitForm() {
		if (!form.title.trim() || !form.blurb.trim()) {
			setFormError("Sarlavha va tavsifni to'ldiring");
			return;
		}
		const year = Number(form.year);
		const duration = Number(form.duration);
		const rating = Number(form.rating);
		if (!year || year < 1900 || year > 2100) {
			setFormError("Yilni to'g'ri kiriting");
			return;
		}
		if (!duration || duration <= 0) {
			setFormError('Davomiylikni daqiqada kiriting');
			return;
		}
		if (!rating || rating < 0 || rating > 10) {
			setFormError("Reyting 0 dan 10 gacha bo'lishi kerak");
			return;
		}
		setFormError('');
		onAdd({
			title: form.title.trim(),
			genre: form.genre,
			year,
			duration,
			rating,
			blurb: form.blurb.trim(),
			poster: form.poster.trim(),
			youtubeUrl: form.youtubeUrl.trim(),
		});
		setForm(EMPTY_FORM);
	}

	return (
		<div className='kb-admin'>
			<div className='kb-admin-head'>
				<div>
					<p className='kb-eyebrow'>Boshqaruv paneli</p>
					<h2 className='kb-display kb-admin-title'>Filmlarni boshqarish</h2>
				</div>
				<button type='button' className='kb-btn-secondary' onClick={onLogout}>
					<LogOut size={16} />
					Chiqish
				</button>
			</div>

			<div className='kb-admin-form'>
				<h3 className='kb-admin-form-title'>Yangi film qo'shish</h3>

				<div className='kb-ai-settings'>
					{apiKey && !showKeyField ? (
						<div className='kb-ai-key-status'>
							<KeyRound size={14} />
							{HARDCODED_GEMINI_KEY ? (
								'Gemini API kaliti kodda sozlangan'
							) : (
								<>
									Gemini API kaliti ulangan
									<button type='button' className='kb-ai-key-change' onClick={() => setShowKeyField(true)}>
										o'zgartirish
									</button>
									<button type='button' className='kb-ai-key-change' onClick={clearApiKey}>
										o'chirish
									</button>
								</>
							)}
						</div>
					) : (
						<div className='kb-ai-key-form'>
							<KeyRound size={14} />
							<input
								type='password'
								className='kb-input kb-ai-key-input'
								placeholder='Gemini API kalitingiz (AIzaSy...)'
								value={apiKeyDraft}
								onChange={e => setApiKeyDraft(e.target.value)}
								onKeyDown={e => {
									if (e.key === 'Enter') saveApiKey();
								}}
							/>
							<button type='button' className='kb-btn-secondary kb-ai-key-save' onClick={saveApiKey}>
								Saqlash
							</button>
						</div>
					)}
					<p className='kb-ai-key-hint'>
						AI tavsif yozish uchun kerak — bu <strong>bepul</strong> (kredit karta shart emas). Kalitni{' '}
						<a href='https://aistudio.google.com/apikey' target='_blank' rel='noreferrer'>
							aistudio.google.com/apikey
						</a>{' '}
						dan oling. Faqat shu brauzerda saqlanadi, hech qayerga yuborilmaydi.
					</p>
				</div>

				<div className='kb-admin-form-grid'>
					<div className='kb-admin-field'>
						<label className='kb-label'>Sarlavha</label>
						<input
							type='text'
							className='kb-input kb-admin-input'
							placeholder='Film nomi'
							value={form.title}
							onChange={e => updateField('title', e.target.value)}
						/>
					</div>
					<div className='kb-admin-field'>
						<label className='kb-label'>Janr</label>
						<select
							className='kb-input kb-admin-input kb-admin-select'
							value={form.genre}
							onChange={e => updateField('genre', e.target.value)}>
							{ADMIN_GENRES.map(g => (
								<option key={g} value={g}>
									{g}
								</option>
							))}
						</select>
					</div>
					<div className='kb-admin-field'>
						<label className='kb-label'>Yili</label>
						<input
							type='number'
							className='kb-input kb-admin-input'
							placeholder='2026'
							value={form.year}
							onChange={e => updateField('year', e.target.value)}
						/>
					</div>
					<div className='kb-admin-field'>
						<label className='kb-label'>Davomiyligi (daqiqa)</label>
						<input
							type='number'
							className='kb-input kb-admin-input'
							placeholder='120'
							value={form.duration}
							onChange={e => updateField('duration', e.target.value)}
						/>
					</div>
					<div className='kb-admin-field'>
						<label className='kb-label'>Reyting (0-10)</label>
						<input
							type='number'
							step='0.1'
							className='kb-input kb-admin-input'
							placeholder='8.5'
							value={form.rating}
							onChange={e => updateField('rating', e.target.value)}
						/>
					</div>
				</div>
				<div className='kb-admin-field'>
					<div className='kb-admin-field-head'>
						<label className='kb-label'>Qisqacha tavsif</label>
						<button type='button' className='kb-ai-generate-btn' onClick={handleGenerateBlurb} disabled={aiLoading}>
							{aiLoading ? <Loader2 size={14} className='kb-spin' /> : <Sparkles size={14} />}
							{aiLoading ? 'Yozilmoqda...' : 'AI bilan yozish'}
						</button>
					</div>
					<textarea
						className='kb-input kb-admin-input kb-admin-textarea'
						placeholder='Film haqida bir-ikki gap — yoki yuqoridagi AI tugmasini bosing'
						value={form.blurb}
						onChange={e => updateField('blurb', e.target.value)}
					/>
					{aiError && <p className='kb-error-text'>{aiError}</p>}
				</div>
				<div className='kb-admin-field'>
					<label className='kb-label'>Plakat rasm havolasi (ixtiyoriy)</label>
					<input
						type='text'
						className='kb-input kb-admin-input'
						placeholder="https://... (bo'sh qoldirsangiz, dizayn avtomatik chiqadi)"
						value={form.poster}
						onChange={e => updateField('poster', e.target.value)}
					/>
				</div>
				<div className='kb-admin-field'>
					<label className='kb-label'>YouTube video linki (ixtiyoriy — tomosha qilish uchun)</label>
					<input
						type='text'
						className='kb-input kb-admin-input'
						placeholder='https://youtu.be/... yoki https://youtube.com/watch?v=...'
						value={form.youtubeUrl}
						onChange={e => updateField('youtubeUrl', e.target.value)}
					/>
				</div>
				{formError && <p className='kb-error-text'>{formError}</p>}
				<button type='button' className='kb-btn-primary' onClick={submitForm}>
					<Plus size={18} />
					Qo'shish
				</button>
			</div>

			<div className='kb-admin-list'>
				<h3 className='kb-admin-form-title'>Filmlar ro'yxati ({movies.length})</h3>
				{movies.length === 0 ? (
					<p className='kb-empty-sub'>Hozircha filmlar yo'q.</p>
				) : (
					movies.map(m => {
						const theme = getGenreTheme(m.genre);
						const rowPoster = m.poster || getYouTubeThumbnail(getYouTubeId(m.youtubeUrl));
						return (
							<div key={m.id} className='kb-admin-row'>
								<span
									className='kb-admin-row-swatch'
									style={{ background: `linear-gradient(150deg, ${theme.a}, ${theme.b})`, color: theme.accent }}>
									{rowPoster ? (
										<img
											src={rowPoster}
											alt=''
											className='kb-admin-row-thumb'
											onError={e => {
												e.currentTarget.style.display = 'none';
											}}
										/>
									) : (
										<Film size={16} />
									)}
								</span>
								<div className='kb-admin-row-info'>
									<span className='kb-admin-row-title'>{m.title}</span>
									<span className='kb-admin-row-meta'>
										{m.genre} · {m.year} · {formatDuration(m.duration)} · {m.rating}
									</span>
								</div>
								<button
									type='button'
									className='kb-admin-delete'
									onClick={() => onDelete(m.id)}
									aria-label={`${m.title} ni o'chirish`}>
									<Trash2 size={16} />
								</button>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

/* ---------------------------------------------------------
   Main app
--------------------------------------------------------- */

export default function KinoBot() {
	const [email, setEmail] = useState(() => {
		try {
			return localStorage.getItem(EMAIL_STORAGE_KEY) || '';
		} catch {
			return '';
		}
	});
	const [entered, setEntered] = useState(() => {
		try {
			return Boolean(localStorage.getItem(EMAIL_STORAGE_KEY));
		} catch {
			return false;
		}
	});
	const [movies, setMovies] = useState(MOVIES);
	const [query, setQuery] = useState('');
	const [activeGenre, setActiveGenre] = useState('Barchasi');
	const [favorites, setFavorites] = useState(() => new Set());
	const [showFavOnly, setShowFavOnly] = useState(false);
	const [selected, setSelected] = useState(null);
	const [toast, setToast] = useState('');
	const [showAdminLogin, setShowAdminLogin] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	// AI orqali qidiruvda topilmagan filmni qo'shish uchun holat.
	// Admin panelda saqlangan API kalit shu yerda ham qayta ishlatiladi.
	const [apiKey, setApiKey] = useState(getInitialApiKey);
	const [apiKeyDraft, setApiKeyDraft] = useState('');
	const [aiSearchLoading, setAiSearchLoading] = useState(false);
	const [aiSearchError, setAiSearchError] = useState('');

	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(''), 2200);
		return () => clearTimeout(t);
	}, [toast]);

	function toggleFavorite(id) {
		setFavorites(prev => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
				setToast("Sevimlilarga qo'shildi");
			}
			return next;
		});
	}

	function handleWatch(movie) {
		setToast(`"${movie.title}" tez orada platformada!`);
	}

	function handleSwitchEmail() {
		try {
			localStorage.removeItem(EMAIL_STORAGE_KEY);
		} catch {
			/* ignore */
		}
		setEmail('');
		setEntered(false);
		setIsAdmin(false);
	}

	function addMovie(newMovie) {
		setMovies(prev => {
			const nextId = prev.length ? Math.max(...prev.map(m => m.id)) + 1 : 1;
			return [...prev, { id: nextId, ...newMovie }];
		});
		setToast(`"${newMovie.title}" qo'shildi`);
	}

	function persistApiKey(trimmed) {
		if (!trimmed) return;
		try {
			localStorage.setItem(AI_KEY_STORAGE_KEY, trimmed);
		} catch {
			/* ignore */
		}
		setApiKey(trimmed);
	}

	function saveSearchApiKey() {
		const trimmed = apiKeyDraft.trim();
		if (!trimmed) return;
		persistApiKey(trimmed);
		setApiKeyDraft('');
		setAiSearchError('');
	}

	async function handleAiSearchAdd() {
		const title = query.trim();
		if (!title) return;
		if (!apiKey) {
			setAiSearchError('Avval Gemini API kalitingizni kiriting');
			return;
		}
		setAiSearchError('');
		setAiSearchLoading(true);
		try {
			const movie = await generateMovieWithAI({ title, apiKey });
			addMovie(movie);
			setActiveGenre('Barchasi');
			setShowFavOnly(false);
		} catch (err) {
			setAiSearchError(err.message || "Film yaratib bo'lmadi");
		} finally {
			setAiSearchLoading(false);
		}
	}

	function deleteMovie(id) {
		setMovies(prev => prev.filter(m => m.id !== id));
		setFavorites(prev => {
			const next = new Set(prev);
			next.delete(id);
			return next;
		});
		if (selected?.id === id) setSelected(null);
		setToast("Film o'chirildi");
	}

	const filtered = useMemo(() => {
		return movies.filter(m => {
			const matchesQuery = m.title.toLowerCase().includes(query.trim().toLowerCase());
			const matchesGenre = activeGenre === 'Barchasi' || m.genre === activeGenre;
			const matchesFav = !showFavOnly || favorites.has(m.id);
			return matchesQuery && matchesGenre && matchesFav;
		});
	}, [movies, query, activeGenre, showFavOnly, favorites]);

	const displayName = email.split('@')[0];
	const isAdminEmail = email.trim().toLowerCase() === ADMIN_EMAIL;

	if (!entered) {
		return (
			<div className='kb-app'>
				<GateScreen
					onEnter={value => {
						setEmail(value);
						setEntered(true);
						try {
							localStorage.setItem(EMAIL_STORAGE_KEY, value);
						} catch {
							/* ignore */
						}
					}}
				/>
			</div>
		);
	}

	return (
		<div className='kb-app'>
			<Sprockets count={20} />

			<header className='kb-header'>
				<div className='kb-header-brand'>
					<span className='kb-header-icon'>
						<Film size={20} strokeWidth={1.8} />
					</span>
					<span className='kb-display kb-header-title'>KinoBot</span>
				</div>

				<div className='kb-search-wrap'>
					<Search size={16} className='kb-input-icon' />
					<input
						type='text'
						className='kb-search-input'
						placeholder='Film qidirish...'
						value={query}
						onChange={e => setQuery(e.target.value)}
						aria-label='Film qidirish'
					/>
				</div>

				{!isAdmin && (
					<button
						type='button'
						className={`kb-fav-toggle ${showFavOnly ? 'kb-fav-toggle--active' : ''}`}
						onClick={() => setShowFavOnly(v => !v)}>
						<Heart size={16} fill={showFavOnly ? 'currentColor' : 'none'} />
						Sevimlilar
						{favorites.size > 0 && <span className='kb-fav-count'>{favorites.size}</span>}
					</button>
				)}

				{(isAdminEmail || isAdmin) && (
					<button
						type='button'
						className={`kb-fav-toggle kb-admin-toggle ${isAdmin ? 'kb-admin-toggle--active' : ''}`}
						onClick={() => (isAdmin ? setIsAdmin(false) : setShowAdminLogin(true))}>
						{isAdmin ? <LogOut size={16} /> : <Lock size={16} />}
						{isAdmin ? 'Admin' : 'Kirish'}
					</button>
				)}
			</header>

			{isAdmin ? (
				<AdminPanel movies={movies} onAdd={addMovie} onDelete={deleteMovie} onLogout={() => setIsAdmin(false)} />
			) : (
				<>
					<p className='kb-greeting'>
						Xush kelibsiz, <span className='kb-greeting-name'>{displayName}</span> — o'rningizni band qilib bo'ldingiz.
						<button type='button' className='kb-switch-email' onClick={handleSwitchEmail}>
							boshqa email bilan kirish
						</button>
					</p>

					<nav className='kb-genre-row' aria-label='Janrlar'>
						{GENRES.map(g => (
							<button
								key={g}
								type='button'
								className={`kb-chip ${activeGenre === g ? 'kb-chip--active' : ''}`}
								onClick={() => setActiveGenre(g)}>
								{g}
							</button>
						))}
					</nav>

					<main className='kb-grid'>
						{filtered.length === 0 ? (
							<div className='kb-empty'>
								<Clapperboard size={40} strokeWidth={1.3} />
								<p className='kb-display kb-empty-title'>Zal bo'sh qoldi</p>
								<p className='kb-empty-sub'>Qidiruv yoki janrni o'zgartirib ko'ring.</p>

								{query.trim() && (
									<div className='kb-ai-search-add'>
										<p className='kb-ai-search-lead'>
											<Sparkles size={14} />"{query.trim()}" nomli film topilmadi — AI yordamida qo'shib ko'ramizmi?
										</p>

										{apiKey ? (
											<button
												type='button'
												className='kb-btn-primary kb-ai-search-btn'
												onClick={handleAiSearchAdd}
												disabled={aiSearchLoading}>
												{aiSearchLoading ? <Loader2 size={16} className='kb-spin' /> : <Sparkles size={16} />}
												{aiSearchLoading ? 'Yaratilmoqda...' : "AI bilan qo'shish"}
											</button>
										) : (
											<div className='kb-ai-key-form kb-ai-search-key-form'>
												<KeyRound size={14} />
												<input
													type='password'
													className='kb-input kb-ai-key-input'
													placeholder='Gemini API kalitingiz (AIzaSy...)'
													value={apiKeyDraft}
													onChange={e => setApiKeyDraft(e.target.value)}
													onKeyDown={e => {
														if (e.key === 'Enter') saveSearchApiKey();
													}}
												/>
												<button type='button' className='kb-btn-secondary kb-ai-key-save' onClick={saveSearchApiKey}>
													Saqlash
												</button>
											</div>
										)}
										{aiSearchError && <p className='kb-error-text'>{aiSearchError}</p>}
									</div>
								)}
							</div>
						) : (
							filtered.map((m, i) => (
								<MovieCard
									key={m.id}
									movie={m}
									index={i}
									isFav={favorites.has(m.id)}
									onToggleFav={toggleFavorite}
									onOpen={setSelected}
								/>
							))
						)}
					</main>
				</>
			)}

			<Sprockets count={20} />

			{selected && (
				<MovieModal
					movie={selected}
					isFav={favorites.has(selected.id)}
					onToggleFav={toggleFavorite}
					onClose={() => setSelected(null)}
					onWatch={handleWatch}
				/>
			)}

			{showAdminLogin && isAdminEmail && (
				<AdminLogin
					onClose={() => setShowAdminLogin(false)}
					onSuccess={() => {
						setShowAdminLogin(false);
						setIsAdmin(true);
						setToast('Admin sifatida kirdingiz');
					}}
				/>
			)}

			{toast && (
				<div className='kb-toast' role='status'>
					<Check size={16} />
					{toast}
				</div>
			)}

			{!isAdmin && <ChatWidget movies={movies} apiKey={apiKey} onSaveApiKey={persistApiKey} onOpenMovie={setSelected} />}
		</div>
	);
}
