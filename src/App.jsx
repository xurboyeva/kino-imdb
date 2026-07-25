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
	ExternalLink,
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
];

const GENRES = ['Barchasi', 'Fantastika', 'Jinoiy', 'Drama', 'Animatsiya', 'Triller', 'Tarixiy'];
const ADMIN_GENRES = GENRES.filter(g => g !== 'Barchasi');

const ADMIN_EMAIL = 'xurboyeva.01@gmail.com';
const ADMIN_USERNAME = 'xurboyeva.01@gmail.com';
const ADMIN_PASSWORD = 'xurboyeva_.010';

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
	const theme = GENRE_THEME[movie.genre];
	const [imgError, setImgError] = useState(false);
	const hasPoster = Boolean(movie.poster) && !imgError;
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
						src={movie.poster}
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
					<span className='kb-ticket-play'>
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
	const theme = GENRE_THEME[movie.genre];
	const [imgError, setImgError] = useState(false);
	const [playing, setPlaying] = useState(false);
	const hasPoster = Boolean(movie.poster) && !imgError;
	const youtubeId = getYouTubeId(movie.youtubeUrl);

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
							src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
							title={movie.title}
							allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
							allowFullScreen
						/>
					) : hasPoster ? (
						<img
							src={movie.poster}
							alt={`${movie.title} plakati`}
							className='kb-ticket-poster-img'
							onError={() => setImgError(true)}
						/>
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
						{youtubeId && (
							<a
								href={`https://www.youtube.com/watch?v=${youtubeId}`}
								target='_blank'
								rel='noopener noreferrer'
								className='kb-btn-secondary'>
								<ExternalLink size={18} />
								YouTube'da ochish
							</a>
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
					<label className='kb-label'>Qisqacha tavsif</label>
					<textarea
						className='kb-input kb-admin-input kb-admin-textarea'
						placeholder='Film haqida bir-ikki gap'
						value={form.blurb}
						onChange={e => updateField('blurb', e.target.value)}
					/>
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
						const theme = GENRE_THEME[m.genre];
						return (
							<div key={m.id} className='kb-admin-row'>
								<span
									className='kb-admin-row-swatch'
									style={{ background: `linear-gradient(150deg, ${theme.a}, ${theme.b})`, color: theme.accent }}>
									{m.poster ? (
										<img
											src={m.poster}
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
	const [email, setEmail] = useState('');
	const [entered, setEntered] = useState(false);
	const [movies, setMovies] = useState(MOVIES);
	const [query, setQuery] = useState('');
	const [activeGenre, setActiveGenre] = useState('Barchasi');
	const [favorites, setFavorites] = useState(() => new Set());
	const [showFavOnly, setShowFavOnly] = useState(false);
	const [selected, setSelected] = useState(null);
	const [toast, setToast] = useState('');
	const [showAdminLogin, setShowAdminLogin] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

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

	function addMovie(newMovie) {
		setMovies(prev => {
			const nextId = prev.length ? Math.max(...prev.map(m => m.id)) + 1 : 1;
			return [...prev, { id: nextId, ...newMovie }];
		});
		setToast(`"${newMovie.title}" qo'shildi`);
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
		</div>
	);
}
