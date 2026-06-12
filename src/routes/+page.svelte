<script>
	import { base } from '$app/paths';
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';

	// State management using Svelte 5 runes
	let activeTab = $state('home');
	let activeLightboxImage = $state(null);
	let lightboxIndex = $state(0);
	let showSpoiler = $state(false);

	// Calculator state
	let calcCategory = $state('illustration'); // 'illustration', 'stickers', 'emotes'
	let calcType = $state('head-shot'); // 'head-shot', 'half-body', 'full-body'
	let calcComplexity = $state('simple'); // 'simple', 'medium', 'complex'
	let calcBackground = $state('flat'); // 'flat', 'simple', 'detailed'
	let calcCharacters = $state(1);
	let calcStickerQty = $state(1);
	let calcEmoteQty = $state(1);
	let copied = $state(false);

	// Doodle canvas state
	let doodleCanvas = $state();
	let isDrawing = false;
	let lastX = 0;
	let lastY = 0;
	let brushColor = $state('#24D8E3'); // Default is Cyan
	let brushSize = $state(4);

	function startDrawing(e) {
		if (!doodleCanvas) return;
		isDrawing = true;
		const rect = doodleCanvas.getBoundingClientRect();
		const clientX = e.clientX || (e.touches && e.touches[0].clientX);
		const clientY = e.clientY || (e.touches && e.touches[0].clientY);
		
		const scaleX = doodleCanvas.width / rect.width;
		const scaleY = doodleCanvas.height / rect.height;
		lastX = (clientX - rect.left) * scaleX;
		lastY = (clientY - rect.top) * scaleY;
	}

	function draw(e) {
		if (!isDrawing || !doodleCanvas) return;
		e.preventDefault();
		const ctx = doodleCanvas.getContext('2d');
		const rect = doodleCanvas.getBoundingClientRect();
		const clientX = e.clientX || (e.touches && e.touches[0].clientX);
		const clientY = e.clientY || (e.touches && e.touches[0].clientY);
		
		const scaleX = doodleCanvas.width / rect.width;
		const scaleY = doodleCanvas.height / rect.height;
		const x = (clientX - rect.left) * scaleX;
		const y = (clientY - rect.top) * scaleY;

		ctx.beginPath();
		ctx.moveTo(lastX, lastY);
		ctx.lineTo(x, y);
		ctx.strokeStyle = brushColor;
		ctx.lineWidth = brushSize;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
		ctx.stroke();

		lastX = x;
		lastY = y;
	}

	function stopDrawing() {
		isDrawing = false;
	}

	function clearCanvas() {
		if (!doodleCanvas) return;
		const ctx = doodleCanvas.getContext('2d');
		ctx.clearRect(0, 0, doodleCanvas.width, doodleCanvas.height);
	}

	function resizeCanvas() {
		if (!doodleCanvas) return;
		const ctx = doodleCanvas.getContext('2d');
		// Save current content temporarily
		const tempCanvas = document.createElement('canvas');
		tempCanvas.width = doodleCanvas.width;
		tempCanvas.height = doodleCanvas.height;
		const tempCtx = tempCanvas.getContext('2d');
		tempCtx.drawImage(doodleCanvas, 0, 0);

		const rect = doodleCanvas.parentElement.getBoundingClientRect();
		const targetWidth = rect.width;
		const targetHeight = rect.height || 240;

		doodleCanvas.width = targetWidth;
		doodleCanvas.height = targetHeight;

		// Restore content after resize, scaling to fit the new dimensions
		ctx.drawImage(tempCanvas, 0, 0, tempCanvas.width, tempCanvas.height, 0, 0, targetWidth, targetHeight);
	}

	function downloadDoodle() {
		if (!doodleCanvas) return;
		const link = document.createElement('a');
		link.download = 'ren-patterns-doodle.png';
		link.href = doodleCanvas.toDataURL('image/png');
		link.click();
	}

	$effect(() => {
		if (doodleCanvas) {
			resizeCanvas();
		}
	});

	onMount(() => {
		resizeCanvas();
		window.addEventListener('resize', resizeCanvas);
		return () => {
			window.removeEventListener('resize', resizeCanvas);
		};
	});

	const artistInfo = {
		name: 'Ren Patterns',
		tagline: 'Sine waves 🌊 | Crafting unique patterns & vibes 🎨✨',
		discordTag: 'RennieFabric (ID: 623393220633559050)',
		socials: [
			{ name: 'Twitter / X', url: 'https://x.com/Renniefabric', handle: '@Renniefabric', color: '#BC8DF7' },
			{ name: 'Instagram', url: 'https://www.instagram.com/renniefabric', handle: '@renniefabric', color: '#BC8DF7' },
			{ name: 'Reddit', url: 'https://www.reddit.com/user/Rennieficationn/', handle: 'u/Rennieficationn', color: '#BC8DF7' },
			{ name: 'PayPal', url: 'https://www.paypal.com/paypalme/SharlynPantajo', handle: 'Support Me', color: '#BC8DF7' },
			{ name: 'BlueSky', url: 'https://bsky.app/profile/renniefication.bsky.social', handle: '@renniefication', color: '#BC8DF7' },
			{ name: 'TikTok', url: 'https://www.tiktok.com/@renniefabric', handle: '@renniefabric', color: '#BC8DF7' },
			{ name: 'YouTube', url: 'https://www.youtube.com/@RenPatterns', handle: '@RenPatterns', color: '#BC8DF7' },
			{ name: 'Webtoon', url: 'https://www.webtoons.com/en/canvas/call-back/list?title_no=921001', handle: 'Call Back', color: '#BC8DF7' }
		],
		pricingCategories: [
			{
				id: 'head-shot',
				name: 'Head Shot / Icon',
				priceText: '$20 - $40',
				description: 'Icons typically range from $20 to $40 depending on the complexity of your character! This option is perfect for profile pictures or emote-focused assets.',
				examples: [
					{ src: `${base}/assets/gallery02_4bfa3f0b.png`, title: 'Icon Example 1' },
					{ src: `${base}/assets/gallery02_b1aa6620.png`, title: 'Icon Example 2' },
					{ src: `${base}/assets/gallery02_8c008a2c.png`, title: 'Icon Example 3' },
					{ src: `${base}/assets/image03.png`, title: 'Emotes Grid' }
				]
			},
			{
				id: 'half-body',
				name: 'Half Body',
				priceText: '$30 - $60',
				description: 'Half body commissions range from $30 to $60, showing characters from waist-up. Perfect for showcasing character outfits and medium-scale portraits.',
				examples: [
					{ src: `${base}/assets/image04.jpg`, title: 'Half Body Design' },
					{ src: `${base}/assets/image06.jpg`, title: 'Half Body Showcase' }
				]
			},
			{
				id: 'full-body',
				name: 'Full Body & References',
				priceText: '$60 - $90',
				description: 'Full body illustrations range from $60 to $90 depending on details. Character reference sheets start at $60 and are ideal for establishing design details.',
				examples: [
					{ src: `${base}/assets/image05.png`, title: 'Full Body Art' },
					{ src: `${base}/assets/image07.jpg`, title: 'Character Sheet' }
				]
			}
		],
		terms: [
			{
				title: 'Will NOT Draw',
				content: 'PEDOFILE content / CERTAIN FETISHES (Inquire for more info). I hold the right to refuse any commission if I find it too complex or if there is disrespectful behavior.',
				type: 'error'
			},
			{
				title: 'Age Requirements',
				content: 'You MUST specify your age for certain commissions (especially mature-themed or sensitive character designs).',
				type: 'info'
			},
			{
				title: 'Refund Policy',
				content: 'Refunds will be partially or somewhat full depending on progress. However, please keep in mind that PayPal has processing taxes, so even if progress is minimal, it would be a 93% return at best.',
				type: 'info'
			},
			{
				title: 'Timeline & Delivery',
				content: 'Commissions typically get finished relatively fast, usually 2-3 weeks at most. However, I might take longer if complications arise or if cooperation is delayed.',
				type: 'info'
			},
			{
				title: 'Be Nice & Respectful :3',
				content: 'Lastly, please be nice, clear, and cooperate! Disrespectful or rude clients will have their commissions cancelled immediately.',
				type: 'success'
			}
		]
	};

	// All gallery images compiled for easy lightbox navigation
	const allGalleryImages = [
		{ src: `${base}/assets/gallery01_38b512b6.png`, title: 'Chibi Mascot Outline' },
		{ src: `${base}/assets/gallery01_cf19dd77.png`, title: 'Mascot Line-art 1' },
		{ src: `${base}/assets/gallery01_e797ed15.png`, title: 'Mascot Line-art 2' },
		{ src: `${base}/assets/gallery02_4bfa3f0b.png`, title: 'Chibi Blue Furry Icon' },
		{ src: `${base}/assets/gallery02_b1aa6620.png`, title: 'Smile Icon Showcase' },
		{ src: `${base}/assets/gallery02_8c008a2c.png`, title: 'Character Icon Portrait' },
		{ src: `${base}/assets/image03.png`, title: 'Sticker Emotes Grid' },
		{ src: `${base}/assets/image04.jpg`, title: 'Half Body Portrait' },
		{ src: `${base}/assets/image06.jpg`, title: 'Lying Down Character' },
		{ src: `${base}/assets/image05.png`, title: '"Take A Hike" Forest Hike Illustration' },
		{ src: `${base}/assets/image07.jpg`, title: 'Ref Sheet Commission Showcase' }
	];

	// Price calculator logic
	const calculatedPrice = $derived.by(() => {
		if (calcCategory === 'stickers') {
			return 20 + Math.max(0, calcStickerQty - 1) * 10;
		}
		if (calcCategory === 'emotes') {
			return 10 + Math.max(0, calcEmoteQty - 1) * 5;
		}
		
		// Illustration calculation
		let basePrice = 20;
		if (calcType === 'half-body') basePrice = 30;
		if (calcType === 'full-body') basePrice = 60;

		let complexityPrice = 0;
		if (calcComplexity === 'medium') complexityPrice = 10;
		if (calcComplexity === 'complex') complexityPrice = 20;

		let backgroundPrice = 0;
		if (calcBackground === 'simple') backgroundPrice = 10;
		if (calcBackground === 'detailed') backgroundPrice = 25;

		const singleCharacterPrice = basePrice + complexityPrice;
		const extraCharactersPrice = (calcCharacters - 1) * (singleCharacterPrice * 0.5);

		return singleCharacterPrice + extraCharactersPrice + backgroundPrice;
	});

	function copyOrderDetails() {
		let summaryText = '';
		if (calcCategory === 'illustration') {
			summaryText = `Commission Order Details (Illustration):\n` +
				`- Type/Scale: ${calcType.replace('-', ' ')}\n` +
				`- Complexity: ${calcComplexity}\n` +
				`- Background: ${calcBackground}\n` +
				`- Characters: ${calcCharacters}\n` +
				`- Estimated Total: $${calculatedPrice}\n\n` +
				`Contact: @Renniefabric`;
		} else if (calcCategory === 'stickers') {
			summaryText = `Commission Order Details (Stickers):\n` +
				`- Quantity: ${calcStickerQty}\n` +
				`- Estimated Total: $${calculatedPrice}\n\n` +
				`Contact: @Renniefabric`;
		} else if (calcCategory === 'emotes') {
			summaryText = `Commission Order Details (Emotes):\n` +
				`- Quantity: ${calcEmoteQty}\n` +
				`- Estimated Total: $${calculatedPrice}\n\n` +
				`Contact: @Renniefabric`;
		}

		navigator.clipboard.writeText(summaryText).then(() => {
			copied = true;
			setTimeout(() => { copied = false; }, 2000);
		});
	}

	function openLightbox(imageSrc) {
		const index = allGalleryImages.findIndex(img => img.src === imageSrc);
		if (index !== -1) {
			lightboxIndex = index;
			activeLightboxImage = allGalleryImages[index];
		}
	}

	function closeLightbox() {
		activeLightboxImage = null;
	}

	function nextLightboxImage(e) {
		e.stopPropagation();
		lightboxIndex = (lightboxIndex + 1) % allGalleryImages.length;
		activeLightboxImage = allGalleryImages[lightboxIndex];
	}

	function prevLightboxImage(e) {
		e.stopPropagation();
		lightboxIndex = (lightboxIndex - 1 + allGalleryImages.length) % allGalleryImages.length;
		activeLightboxImage = allGalleryImages[lightboxIndex];
	}
</script>

<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full my-4">
	<!-- Left Side: Profile Dashboard (Persistent Navigation) -->
	<div class="lg:col-span-4 comic-panel p-6 flex flex-col items-center text-center tilt-l relative">
		<!-- Paintbrush Signature Mascot Badge -->
		<div class="flex items-center gap-4 mb-6 justify-center w-full bg-black/20 p-3 rounded-2xl border border-white/5 relative">
			<!-- Mascot Custom Avatar with double ring border -->
			<div class="relative shrink-0 transition-transform duration-200 hover:scale-105">
				<div class="w-18 h-18 rounded-full border-3 border-black overflow-hidden bg-white flex items-center justify-center shadow-[3px_3px_0_#000]">
					<img src="{base}/assets/gallery02_4bfa3f0b.png" alt="Ren Mascot" class="w-16 h-16 object-contain" />
				</div>
				<!-- Status Dot -->
				<div class="absolute bottom-0 right-0 w-5 h-5 bg-[#7EEDB8] border-3 border-black rounded-full shadow-[1px_1px_0_#000]" title="Open for Comms!"></div>
			</div>
			
			<div class="text-left flex-grow">
				<!-- Custom drawn logo -->
				<img src="{base}/assets/image01.png" alt="Ren Comms Logo" class="h-10 object-contain filter drop-shadow-[1.5px_1.5px_0_#000]" />
				<span class="text-[9px] font-bold font-sans tracking-widest text-[#24D8E3] bg-[#24D8E3]/15 border border-[#24D8E3]/30 px-2.5 py-0.5 rounded-full inline-block mt-1">
					PATTERNS & VIBES 🌊
				</span>
			</div>
		</div>

		<!-- Tagline as Speech Bubble -->
		<div class="speech-bubble bubble-t p-4 mb-6 text-sm text-gray-200 font-gochi italic text-left w-full">
			{artistInfo.tagline}
		</div>

		<!-- Tabs Menu (Comic Style Buttons) -->
		<nav class="flex flex-col gap-3.5 w-full border-t border-white/5 pt-5">
			<button 
				onclick={() => activeTab = 'home'}
				class="comic-btn w-full py-3.5 px-4 rounded-xl text-lg tracking-wider transition-all duration-100 {activeTab === 'home' ? 'comic-btn-blue' : 'comic-btn-dark'}"
			>
				🏠 Home Hub
			</button>
			<button 
				onclick={() => activeTab = 'gallery'}
				class="comic-btn w-full py-3.5 px-4 rounded-xl text-lg tracking-wider transition-all duration-100 {activeTab === 'gallery' ? 'comic-btn-purple' : 'comic-btn-dark'}"
			>
				🎨 Art & Pricing
			</button>
			<button 
				onclick={() => activeTab = 'calculator'}
				class="comic-btn w-full py-3.5 px-4 rounded-xl text-lg tracking-wider transition-all duration-100 {activeTab === 'calculator' ? 'comic-btn-orange' : 'comic-btn-dark'}"
			>
				🧮 Cost Calculator
			</button>
			<button 
				onclick={() => activeTab = 'terms'}
				class="comic-btn w-full py-3.5 px-4 rounded-xl text-lg tracking-wider transition-all duration-100 {activeTab === 'terms' ? 'comic-btn-red' : 'comic-btn-dark'}"
			>
				📜 Terms & Rules
			</button>
		</nav>

		<!-- Social Media Badges -->
		<div class="flex flex-wrap gap-2 justify-center mt-6 w-full border-t border-white/5 pt-5">
			{#each artistInfo.socials as social}
				<a 
					href={social.url} 
					target="_blank" 
					rel="noreferrer"
					class="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 transition-all border-2 border-white/5 hover:border-black hover:bg-[#BC8DF7] hover:text-black flex items-center justify-center filter hover:drop-shadow-[2px_2px_0_#000]"
					title={social.name}
				>
					{#if social.name.includes('Twitter')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
					{:else if social.name.includes('Instagram')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
					{:else if social.name.includes('Reddit')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.68-6.28-1.78l1.41-4.51 3.89.83c.04.83.73 1.5 1.57 1.5 1.1 0 2-.9 2-2s-.9-2-2-2c-.77 0-1.44.44-1.77 1.11l-4.27-.92c-.19-.04-.38.05-.44.24l-1.64 5.23c-2.48.07-4.72.74-6.38 1.76C4.85 8.98 3.95 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.12.6 2.1 1.48 2.63-.05.29-.08.59-.08.89 0 4.41 4.93 8 11 8s11-3.59 11-8c0-.3-.03-.6-.08-.89.88-.53 1.48-1.51 1.48-2.63zm-18 1c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm11 5.66c-1.63 1.63-4.73 1.63-6.36 0-.19-.19-.19-.51 0-.7.19-.19.51-.19.7 0 1.25 1.25 3.71 1.25 4.96 0 .19-.19.51-.19.7 0 .19.19.19.51 0 .7zm-.5-4.16c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
					{:else if social.name.includes('PayPal')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.35.35 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91q.57-.403.993-1.005a4.94 4.94 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.7 2.7 0 0 0-.76-.59l-.094-.061ZM6.543 8.82a.7.7 0 0 1 .321-.079H8.3c2.82 0 5.027-1.144 5.672-4.456l.003-.016q.326.186.548.438c.546.623.679 1.535.45 2.71-.272 1.397-.866 2.307-1.663 2.874-.802.57-1.842.815-3.043.815h-.38a.87.87 0 0 0-.863.734l-.03.164-.48 3.043-.024.13-.001.004a.35.35 0 0 1-.348.296H5.595a.106.106 0 0 1-.105-.123l.208-1.32z"/></svg>
					{:else if social.name.includes('BlueSky')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M3.468 1.948C5.303 3.325 7.276 6.118 8 7.616c.725-1.498 2.698-4.29 4.532-5.668C13.855.955 16 .186 16 2.632c0 .489-.28 4.105-.444 4.692-.572 2.04-2.653 2.561-4.504 2.246 3.236.551 4.06 2.375 2.281 4.2-3.376 3.464-4.852-.87-5.23-1.98-.07-.204-.103-.3-.103-.218 0-.081-.033.014-.102.218-.379 1.11-1.855 5.444-5.231 1.98-1.778-1.825-.955-3.65 2.28-4.2-1.85.315-3.932-.205-4.503-2.246C.28 6.737 0 3.12 0 2.632 0 .186 2.145.955 3.468 1.948"/></svg>
					{:else if social.name.includes('TikTok')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 16 16"><path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0Z"/></svg>
					{:else if social.name.includes('YouTube')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.163a3.003 3.003 0 00-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.003 3.003 0 00-2.11 2.107C0 8.048 0 12 0 12s0 3.952.502 5.837a3.003 3.003 0 002.11 2.107c1.883.511 9.388.511 9.388.511s7.505 0 9.388-.511a3.003 3.003 0 002.11-2.107c.502-1.885.502-5.837.502-5.837s0-3.952-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
					{:else if social.name.includes('Webtoon')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M15.023 15.26c.695 0 1.014-.404 1.014-1.051 0-.551-.308-1.01-.984-1.01-.58 0-.912.404-.912 1.016 0 .543.32 1.045.882 1.045zM10.135 15.447c.764 0 1.113-.443 1.113-1.154 0-.604-.338-1.109-1.082-1.109-.637 0-1.002.445-1.002 1.115 0 .597.352 1.148.971 1.148zM24 10.201l-3.15.029.83-9.686L1.958 3.605l1.686 6.248H0l3.734 11.488 8.713-1.283v3.396l10.113-4.641L24 10.201zm-9.104-3.594c0-.049.039-.092.088-.094l1.879-.125.446-.029c.524-.035 1.634.063 1.634 1.236 0 .83-.619 1.184-.619 1.184s.75.189.707 1.092c0 1.602-1.943 1.389-1.943 1.389l-.225-.006-1.908-.053a.089.089 0 0 1-.086-.09l.027-4.504zm-3.675.243c0-.047.039-.09.088-.092l3.064-.203a.08.08 0 0 1 .087.08v.943c0 .049-.039.09-.087.092l-1.9.08a.094.094 0 0 0-.088.09l-.005.394a.083.083 0 0 0 .086.084l1.646-.066a.082.082 0 0 1 .086.084l-.02 1.012a.089.089 0 0 1-.089.086h-1.63a.089.089 0 0 0-.088.088v.416c0 .047.039.088.088.088l1.87.033a.09.09 0 0 1 .087.09v.951a.084.084 0 0 1-.087.084l-3.063-.123a.09.09 0 0 1-.087-.09l.042-4.121zm-6.01.312l.975-.064a.101.101 0 0 1 .105.08l.458 2.205c.01.047.027.047.039 0l.576-2.281a.132.132 0 0 1 .108-.09l.921-.061a.108.108 0 0 1 .109.078l.564 2.342c.012.047.029.047.041 0l.6-2.424a.131.131 0 0 1 .108-.092l.996-.064c.048-.004.077.031.065.078l-1.09 4.104a.113.113 0 0 1-.109.082l-1.121-.031a.12.12 0 0 1-.109-.086l-.535-1.965c-.012-.047-.033-.047-.045 0l-.522 1.934a.12.12 0 0 1-.11.082l-1.109-.031a.123.123 0 0 1-.108-.088l-.873-3.618c-.011-.047.019-.088.066-.09zm-.288 9.623v-3.561a.089.089 0 0 0-.087-.088l-1.252-.029a.095.095 0 0 1-.091-.09l-.046-1.125a.082.082 0 0 1 .083-.086l4.047.096c.048 0 .087.041.085.088l-.022 1.088a.093.093 0 0 1-.089.088l-1.139.004a.09.09 0 0 0-.087.088v3.447c0 .049-.039.09-.087.092l-1.227.07a.08.08 0 0 1-.088-.082zm2.834-2.379c0-1.918 1.321-2.482 2.416-2.482s2.339.73 2.339 2.316c0 1.9-1.383 2.482-2.416 2.482-1.033.001-2.339-.724-2.339-2.316zm5.139-.115c0-1.746 1.166-2.238 2.162-2.238s2.129.664 2.129 2.107c0 1.729-1.259 2.26-2.198 2.26s-2.093-.68-2.093-2.129zm7.259 1.711a.175.175 0 0 1-.139-.064l-1.187-1.631c-.029-.039-.053-.031-.053.018v1.67c0 .047-.039.09-.086.092l-1.052.061a.082.082 0 0 1-.087-.082l.039-3.842c0-.047.039-.086.088-.084l.881.02a.2.2 0 0 1 .137.074l1.293 1.902c.027.041.051.033.051-.014l.032-1.846a.087.087 0 0 1 .089-.086l.963.029c.047 0 .085.041.083.09l-.138 3.555a.097.097 0 0 1-.091.092l-.823.046zM16.258 8.23l.724-.014s.47.018.47-.434c0-.357-.411-.33-.411-.33l-.782.008a.09.09 0 0 0-.088.088v.598a.083.083 0 0 0 .087.084zM16.229 10.191h.99c.024 0 .35-.051.35-.404 0-.293-.229-.402-.441-.398l-.898.029a.089.089 0 0 0-.087.09v.596a.086.086 0 0 0 .086.087z"/></svg>
					{/if}
				</a>
			{/each}
		</div>
	</div>

	<!-- Right Side: Content Area (Dynamic Tabs) -->
	<div class="lg:col-span-8 w-full">
		{#if activeTab === 'home'}
			<!-- HOME TAB -->
			<div class="tab-content flex flex-col gap-6" in:fade>
				<!-- Profile Card -->
				<div class="comic-panel p-8 flex flex-col gap-6 tilt-r relative overflow-hidden">
					<!-- Floating Decorative outline silhouettes in the corners! -->
					<img src="{base}/assets/gallery01_38b512b6.png" alt="Silhouette Left" class="absolute -bottom-6 -left-4 w-20 h-24 pointer-events-none floating-silhouette rotate-12" />
					<img src="{base}/assets/gallery01_e797ed15.png" alt="Silhouette Right" class="absolute -top-6 -right-4 w-20 h-24 pointer-events-none floating-silhouette -rotate-12" />

					<div class="flex flex-col gap-2 relative z-10 text-left">
						<h2 class="text-4xl font-extrabold font-hachi text-[#24D8E3] tracking-wide brush-underline">
							Welcome to My Sketchbook!
						</h2>
						<p class="text-gray-200 text-lg leading-relaxed mt-4">
							Hey there! I'm an artist who loves bringing original characters, custom designs, and emote packs to life. 
							This site is my creative portfolio and pricing builder. Feel free to explore my gallery categories, 
							calculate commission costs using my custom builder, and review my terms before ordering.
						</p>
					</div>

					<!-- Webtoon Project Showcase -->
					<div class="bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border-2 border-black rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between mt-2 shadow-[3px_3px_0_#000] relative z-10">
						<div class="text-left">
							<span class="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/50 border border-cyan-800/30 px-2.5 py-0.5 rounded-full inline-block">My Webtoon Comic</span>
							<h3 class="font-bold text-white text-xl mt-2">📖 Read "Call Back" on Webtoon!</h3>
							<p class="text-sm text-gray-400 mt-1">Follow my official webcomic updates and story patterns directly on Webtoon Canvas.</p>
						</div>
						<a 
							href="https://www.webtoons.com/en/canvas/call-back/list?title_no=921001" 
							target="_blank" 
							rel="noreferrer"
							class="comic-btn comic-btn-blue px-6 py-2.5 rounded-xl font-bold tracking-wider shrink-0"
						>
							Read Comic
						</a>
					</div>
				</div>

				<!-- Visual Highlights Grid with Washi Tape -->
				<div class="grid grid-cols-3 gap-4 my-2">
					{#each allGalleryImages.slice(3, 6) as highlight, idx}
						<div class="washi-tape-container">
							<div class="washi-tape {idx === 0 ? 'washi-tape-pink' : idx === 1 ? 'washi-tape-cyan' : 'washi-tape-purple'}"></div>
							<div 
								onclick={() => openLightbox(highlight.src)}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(highlight.src); }}
								role="button"
								tabindex="0"
								class="aspect-square rounded-2xl overflow-hidden cursor-zoom-in relative group border-3 border-black shadow-[4px_4px_0_#000] hover:translate-y-[-2px] transition-all"
							>
								<img 
									src={highlight.src} 
									alt={highlight.title} 
									class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
								/>
								<div class="absolute inset-0 bg-[#BC8DF7]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
									<span class="text-black font-extrabold text-sm drop-shadow bg-[#24D8E3] border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0_#000]">Zoom 🔍</span>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Interactive Doodle Board Card -->
				<div class="comic-panel p-6 tilt-l">
					<div class="flex flex-col gap-2 border-b border-black/10 pb-4 mb-4 text-left">
						<h3 class="text-2xl font-bold font-gochi text-[#BC8DF7]">🎨 Interactive Doodle Board</h3>
						<p class="text-sm text-gray-400">Doodle something creative directly on my page! Pick a brush color and draw below.</p>
					</div>

					<div class="flex flex-col md:flex-row gap-4 items-stretch">
						<!-- Board Tools -->
						<div class="flex md:flex-col justify-between md:justify-start gap-4 w-full md:w-36 shrink-0 bg-black/25 p-3.5 rounded-2xl border border-white/5">
							<!-- Colors -->
							<div class="flex flex-col gap-1.5 w-full text-left">
								<span class="text-xs font-bold uppercase tracking-wider text-gray-300 block">Color</span>
								<div class="grid grid-cols-4 md:grid-cols-2 gap-2">
									{#each ['#24D8E3', '#E87848', '#BC8DF7', '#E34049', '#7EEDB8', '#F3E15F', '#FFFFFF', '#000000'] as color}
										<button 
											onclick={() => brushColor = color}
											class="w-8 h-8 rounded-lg border-2 transition-all {brushColor === color ? 'border-white scale-110 shadow-md' : 'border-black hover:scale-105'}"
											style="background-color: {color}"
											title="Brush Color: {color}"
										></button>
									{/each}
								</div>
							</div>

							<!-- Sizes -->
							<div class="flex flex-col gap-1.5 w-full text-left mt-2">
								<span class="text-xs font-bold uppercase tracking-wider text-gray-300 block">Brush Size</span>
								<div class="flex items-center gap-2">
									<input 
										type="range" 
										min="2" 
										max="16" 
										bind:value={brushSize}
										class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#BC8DF7]"
									/>
									<span class="text-sm font-bold text-gray-200 w-4">{brushSize}</span>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex flex-row md:flex-col gap-2 mt-auto w-full">
								<button 
									onclick={clearCanvas}
									class="comic-btn comic-btn-red py-2.5 px-3 rounded-xl text-sm font-bold w-full"
								>
									Clear 🧹
								</button>
								<button 
									onclick={downloadDoodle}
									class="comic-btn comic-btn-blue py-2.5 px-3 rounded-xl text-sm font-bold w-full"
								>
									Save 💾
								</button>
							</div>
						</div>

						<!-- Canvas element -->
						<div class="flex-grow min-h-[240px] doodle-container rounded-2xl relative overflow-hidden flex">
							<canvas 
								bind:this={doodleCanvas}
								onmousedown={startDrawing}
								onmousemove={draw}
								onmouseup={stopDrawing}
								onmouseleave={stopDrawing}
								ontouchstart={startDrawing}
								ontouchmove={draw}
								ontouchend={stopDrawing}
								class="w-full h-full block touch-none"
							></canvas>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'gallery'}
			<!-- GALLERY & PRICING TAB -->
			<div class="tab-content flex flex-col gap-8" in:fade>
				<!-- Gallery Custom Drawn Header Logo -->
				<div class="flex justify-center mb-4">
					<img src="{base}/assets/gallery01_cf19dd77.png" alt="Choose Your Poison" class="h-16 object-contain filter drop-shadow-[2.5px_2.5px_0_#000] rotate-[-1deg]" />
				</div>

				{#each artistInfo.pricingCategories as category, idx}
					<div class="washi-tape-container">
						<div class="washi-tape {idx === 0 ? 'washi-tape-pink' : idx === 1 ? 'washi-tape-cyan' : 'washi-tape-purple'}"></div>
						<div class="comic-panel p-6 md:p-8 flex flex-col gap-5 {idx % 2 === 0 ? 'tilt-r' : 'tilt-l'}">
							<!-- Header -->
							<div class="flex justify-between items-baseline border-b-2 border-black/10 pb-3 text-left">
								<h3 class="text-2xl font-bold font-hachi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#BC8DF7]">
									{category.name}
								</h3>
								<span class="text-xl font-bold font-gochi text-cyan-300 bg-cyan-950/40 border border-cyan-800/30 px-3 py-1 rounded-full">
									{category.priceText}
								</span>
							</div>
							
							<!-- Description -->
							<p class="text-gray-300 leading-relaxed text-base text-left">{category.description}</p>
							
							<!-- Examples with Washi Tape -->
							<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
								{#each category.examples as image, imgIdx}
									<div class="washi-tape-container">
										<div class="washi-tape {imgIdx % 3 === 0 ? 'washi-tape-pink' : imgIdx % 3 === 1 ? 'washi-tape-cyan' : 'washi-tape-purple'}"></div>
										<div 
											onclick={() => openLightbox(image.src)}
											onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(image.src); }}
											role="button"
											tabindex="0"
											class="aspect-square rounded-2xl overflow-hidden cursor-zoom-in relative group border-3 border-black shadow-[4px_4px_0_#000] hover:translate-y-[-2px] transition-all bg-gray-900/50"
										>
											<img 
												src={image.src} 
												alt={image.title} 
												class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
											/>
											<div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
												<span class="text-black text-xs bg-[#BC8DF7] border-2 border-black px-2.5 py-1 rounded-full font-bold shadow-[2px_2px_0_#000]">View Art 🔍</span>
											</div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else if activeTab === 'calculator'}
			<!-- CALCULATOR TAB -->
			<div class="tab-content comic-panel p-8 flex flex-col gap-6 tilt-r" in:fade>
				<div class="flex flex-col gap-1 border-b-2 border-black/10 pb-4 mb-2 text-left">
					<h2 class="text-3xl font-bold font-hachi text-[#E87848] brush-underline">Cost Calculator</h2>
					<p class="text-sm text-gray-400 mt-1">Estimate your commission rate in real-time according to my standard rates.</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
					<!-- Inputs Column -->
					<div class="flex flex-col gap-5 text-left">
						<!-- Category Selector -->
						<div class="flex flex-col gap-2">
							<span class="text-base font-bold text-white tracking-wider">Commission Format</span>
							<div class="grid grid-cols-3 gap-2.5">
								<button 
									onclick={() => calcCategory = 'illustration'}
									class="comic-btn py-3 px-3 rounded-xl text-base font-bold border-2 transition-all {calcCategory === 'illustration' ? 'comic-btn-orange' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
								>
									Illustration
								</button>
								<button 
									onclick={() => calcCategory = 'stickers'}
									class="comic-btn py-3 px-3 rounded-xl text-base font-bold border-2 transition-all {calcCategory === 'stickers' ? 'comic-btn-orange' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
								>
									Stickers
								</button>
								<button 
									onclick={() => calcCategory = 'emotes'}
									class="comic-btn py-3 px-3 rounded-xl text-base font-bold border-2 transition-all {calcCategory === 'emotes' ? 'comic-btn-orange' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
								>
									Emotes
								</button>
							</div>
						</div>

						{#if calcCategory === 'illustration'}
							<!-- Illustration settings -->
							<div class="flex flex-col gap-2" in:fade>
								<span class="text-base font-bold text-white tracking-wider">Type / Scale</span>
								<div class="grid grid-cols-3 gap-2">
									<button 
										onclick={() => calcType = 'head-shot'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcType === 'head-shot' ? 'comic-btn-blue' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Head Shot <span class="whitespace-nowrap">($20)</span>
									</button>
									<button 
										onclick={() => calcType = 'half-body'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcType === 'half-body' ? 'comic-btn-blue' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Half Body <span class="whitespace-nowrap">($30)</span>
									</button>
									<button 
										onclick={() => calcType = 'full-body'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcType === 'full-body' ? 'comic-btn-blue' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Full Body <span class="whitespace-nowrap">($60)</span>
									</button>
								</div>
							</div>

							<div class="flex flex-col gap-2" in:fade>
								<span class="text-base font-bold text-white tracking-wider">Character Complexity</span>
								<div class="grid grid-cols-3 gap-2">
									<button 
										onclick={() => calcComplexity = 'simple'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcComplexity === 'simple' ? 'comic-btn-purple' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Simple <span class="whitespace-nowrap">(+$0)</span>
									</button>
									<button 
										onclick={() => calcComplexity = 'medium'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcComplexity === 'medium' ? 'comic-btn-purple' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Medium <span class="whitespace-nowrap">(+$10)</span>
									</button>
									<button 
										onclick={() => calcComplexity = 'complex'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcComplexity === 'complex' ? 'comic-btn-purple' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Complex <span class="whitespace-nowrap">(+$20)</span>
									</button>
								</div>
							</div>

							<div class="flex flex-col gap-2" in:fade>
								<span class="text-base font-bold text-white tracking-wider">Background Style</span>
								<div class="grid grid-cols-3 gap-2">
									<button 
										onclick={() => calcBackground = 'flat'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcBackground === 'flat' ? 'comic-btn-orange' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										None / Flat <span class="whitespace-nowrap">(+$0)</span>
									</button>
									<button 
										onclick={() => calcBackground = 'simple'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcBackground === 'simple' ? 'comic-btn-orange' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Simple <span class="whitespace-nowrap">(+$10)</span>
									</button>
									<button 
										onclick={() => calcBackground = 'detailed'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcBackground === 'detailed' ? 'comic-btn-orange' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Detailed <span class="whitespace-nowrap">(+$25)</span>
									</button>
								</div>
							</div>

							<div class="flex flex-col gap-2" in:fade>
								<div class="flex justify-between items-center">
									<span class="text-base font-bold text-white tracking-wider">Number of Characters</span>
									<span class="text-base font-bold text-[#E87848] bg-[#E87848]/10 px-2.5 py-0.5 rounded-full">{calcCharacters}</span>
								</div>
								<input 
									type="range" 
									min="1" 
									max="5" 
									bind:value={calcCharacters}
									class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E87848]"
								/>
								<span class="text-xs text-gray-300 italic">Each additional character is 50% of the single character price (plus complexity).</span>
							</div>
						{:else if calcCategory === 'stickers'}
							<!-- Stickers Settings -->
							<div class="flex flex-col gap-2" in:fade>
								<div class="flex justify-between items-center">
									<span class="text-base font-bold text-white tracking-wider">Quantity of Stickers</span>
									<span class="text-base font-bold text-[#E87848] bg-[#E87848]/10 px-2.5 py-0.5 rounded-full">{calcStickerQty}</span>
								</div>
								<input 
									type="range" 
									min="1" 
									max="10" 
									bind:value={calcStickerQty}
									class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E87848]"
								/>
								<span class="text-xs text-gray-300 italic">First sticker is $20. Subsequent stickers are $10 each.</span>
							</div>
						{:else if calcCategory === 'emotes'}
							<!-- Emotes Settings -->
							<div class="flex flex-col gap-2" in:fade>
								<div class="flex justify-between items-center">
									<span class="text-base font-bold text-white tracking-wider">Quantity of Emotes</span>
									<span class="text-base font-bold text-[#E87848] bg-[#E87848]/10 px-2.5 py-0.5 rounded-full">{calcEmoteQty}</span>
								</div>
								<input 
									type="range" 
									min="1" 
									max="15" 
									bind:value={calcEmoteQty}
									class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E87848]"
								/>
								<span class="text-xs text-gray-300 italic">First emote is $10. Subsequent emotes are $5 each.</span>
							</div>
						{/if}
					</div>

					<!-- Pricing Calculation Breakdown Column (Receipt Slip Style) -->
					<div class="receipt-slip p-6 flex flex-col justify-between text-left border-3 border-black">
						<div class="flex flex-col gap-4">
							<h3 class="text-xl font-bold font-hachi text-black tracking-wider border-b-2 border-black/20 pb-2">Commission Receipt</h3>
							
							<div class="flex flex-col gap-3 text-base text-gray-900 font-bold font-gochi">
								{#if calcCategory === 'illustration'}
									<div class="flex justify-between">
										<span>Base Price ({calcType.replace('-', ' ')})</span>
										<span>${calcType === 'head-shot' ? 20 : calcType === 'half-body' ? 30 : 60}</span>
									</div>
									<div class="flex justify-between">
										<span>Complexity ({calcComplexity})</span>
										<span>+${calcComplexity === 'simple' ? 0 : calcComplexity === 'medium' ? 10 : 20}</span>
									</div>
									<div class="flex justify-between">
										<span>Background ({calcBackground})</span>
										<span>+${calcBackground === 'flat' ? 0 : calcBackground === 'simple' ? 10 : 25}</span>
									</div>
									{#if calcCharacters > 1}
										<div class="flex justify-between text-[#d73d48]">
											<span>Extra Characters (x{calcCharacters - 1})</span>
											<span>+${((calcType === 'head-shot' ? 20 : calcType === 'half-body' ? 30 : 60) + (calcComplexity === 'simple' ? 0 : calcComplexity === 'medium' ? 10 : 20)) * 0.5 * (calcCharacters - 1)}</span>
										</div>
									{/if}
								{:else if calcCategory === 'stickers'}
									<div class="flex justify-between">
										<span>Base Sticker (x1)</span>
										<span>$20</span>
									</div>
									{#if calcStickerQty > 1}
										<div class="flex justify-between text-[#d73d48]">
											<span>Additional Stickers (x{calcStickerQty - 1})</span>
											<span>+${(calcStickerQty - 1) * 10}</span>
										</div>
									{/if}
								{:else if calcCategory === 'emotes'}
									<div class="flex justify-between">
										<span>Base Emote (x1)</span>
										<span>$10</span>
									</div>
									{#if calcEmoteQty > 1}
										<div class="flex justify-between text-[#d73d48]">
											<span>Additional Emotes (x{calcEmoteQty - 1})</span>
											<span>+${(calcEmoteQty - 1) * 5}</span>
										</div>
									{/if}
								{/if}
							</div>
						</div>

						<div class="border-t-2 border-dashed border-black/30 pt-4 mt-6">
							<div class="flex justify-between items-baseline">
								<span class="text-lg font-extrabold text-gray-800">Estimated Total:</span>
								<span class="text-4xl font-extrabold font-hachi text-[#E87848] drop-shadow-sm">
									${calculatedPrice}
								</span>
							</div>
							<span class="text-xs text-gray-600 font-medium block text-right mt-1">*Final price may vary depending on complex details.</span>
							
							<button 
								onclick={copyOrderDetails}
								class="comic-btn {copied ? 'bg-emerald-400 text-black' : 'comic-btn-orange'} py-3 px-4 rounded-xl text-base font-bold mt-4 w-full transition-all flex items-center justify-center gap-2"
							>
								{#if copied}
									Copied to Clipboard! 📋
								{:else}
									Copy Order Details 📋
								{/if}
							</button>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'terms'}
			<!-- TERMS TAB -->
			<div class="tab-content flex flex-col gap-6 text-left" in:fade>
				<!-- Commandments Header Logo -->
				<div class="flex justify-center mb-4">
					<img src="{base}/assets/commandments.png" alt="Commandments" class="h-16 object-contain filter drop-shadow-[2.5px_2.5px_0_#000] rotate-[1.5deg]" />
				</div>

				<!-- Spoiler Alert Header Section -->
				<div class="comic-panel p-6 border-[#E34049]/20 tilt-l">
					<div class="p-4 bg-red-950/20 border-2 border-black rounded-2xl text-left leading-relaxed shadow-[3px_3px_0_#000]">
						<span class="text-gray-200 font-semibold text-base md:text-lg">
							Hewoo here are my rules! If you don't like em... well 
							<span 
								onclick={() => showSpoiler = !showSpoiler}
								onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') showSpoiler = !showSpoiler; }}
								role="button"
								tabindex="0"
								class="inline-block px-2 py-0.5 rounded font-bold transition-all duration-300 select-none cursor-pointer {showSpoiler ? 'bg-red-500 text-white' : 'bg-gray-800 text-transparent hover:bg-gray-700'}"
								title="Click to reveal spoiler"
							>
								fuck you!
							</span>
						</span>
					</div>
				</div>

				<!-- Terms Accordion Cards -->
				<div class="flex flex-col gap-4">
					{#each artistInfo.terms as term, i}
						<div class="speech-bubble bubble-l pl-7 p-5 flex flex-col gap-2 border-l-8 {term.type === 'error' ? 'border-l-red-500' : term.type === 'success' ? 'border-l-emerald-500' : 'border-l-cyan-500'}">
							<h3 class="text-lg font-bold tracking-wide flex items-center gap-2 {term.type === 'error' ? 'text-red-300' : term.type === 'success' ? 'text-emerald-300' : 'text-cyan-300'}">
								{#if term.type === 'error'}
									❌ {term.title}
								{:else if term.type === 'success'}
									💖 {term.title}
								{:else}
									✨ {term.title}
								{/if}
							</h3>
							<p class="text-gray-300 leading-relaxed text-sm md:text-base">{term.content}</p>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Dynamic Full-Screen Lightbox Modal -->
{#if activeLightboxImage}
	<div 
		onclick={closeLightbox}
		onkeydown={(e) => { if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') closeLightbox(); }}
		role="button"
		tabindex="0"
		class="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-zoom-out"
		transition:fade={{ duration: 200 }}
	>
		<!-- Control Buttons -->
		<button 
			onclick={prevLightboxImage}
			class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3.5 rounded-xl bg-black border-3 border-black text-white hover:bg-[#BC8DF7] hover:text-black transition-all cursor-pointer z-50 shadow-[3px_3px_0_rgba(255,255,255,0.1)] hover:translate-y-[calc(-50%-2px)]"
			title="Previous Image"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
		</button>

		<button 
			onclick={nextLightboxImage}
			class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3.5 rounded-xl bg-black border-3 border-black text-white hover:bg-[#BC8DF7] hover:text-black transition-all cursor-pointer z-50 shadow-[3px_3px_0_rgba(255,255,255,0.1)] hover:translate-y-[calc(-50%-2px)]"
			title="Next Image"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
		</button>

		<button 
			onclick={closeLightbox}
			class="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-xl bg-black border-3 border-black text-white hover:bg-red-500 hover:text-white transition-all cursor-pointer z-50 shadow-[3px_3px_0_rgba(255,255,255,0.1)] hover:translate-y-[-2px]"
			title="Close Lightbox"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
		</button>

		<!-- Lightbox Image Wrapper (Tilted Board Frame) -->
		<div 
			class="relative max-w-full max-h-[85vh] md:max-h-[80vh] flex flex-col items-center select-none cursor-default bg-[#0b2130] border-3 border-black p-4 rounded-3xl shadow-[8px_8px_0_#000]"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			tabindex="-1"
			transition:scale={{ duration: 250, start: 0.95 }}
		>
			<img 
				src={activeLightboxImage.src} 
				alt={activeLightboxImage.title} 
				class="max-w-full max-h-[65vh] object-contain rounded-2xl border-2 border-black"
			/>
			<div class="mt-4 text-center">
				<h4 class="text-xl font-bold font-hachi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#BC8DF7]">
					{activeLightboxImage.title}
				</h4>
				<span class="text-xs text-gray-500 mt-1 block">Image {lightboxIndex + 1} of {allGalleryImages.length}</span>
			</div>
		</div>
	</div>
{/if}
