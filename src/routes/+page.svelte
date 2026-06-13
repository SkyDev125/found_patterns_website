<script>
	import { base } from '$app/paths';
	import { fade, scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { siX, siInstagram, siReddit, siPaypal, siBluesky, siTiktok, siYoutube, siWebtoon } from 'simple-icons';

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
		tagline: 'sine waves 🌊 | patterns & vibes 🎨✨',
		discordTag: 'RennieFabric (ID: 623393220633559050)',
		socials: [
			{ name: 'Twitter / X', url: 'https://x.com/Renniefabric', handle: '@Renniefabric', color: '#BC8DF7', icon: siX },
			{ name: 'Instagram', url: 'https://www.instagram.com/renniefabric', handle: '@renniefabric', color: '#BC8DF7', icon: siInstagram },
			{ name: 'Reddit', url: 'https://www.reddit.com/user/Rennieficationn/', handle: 'u/Rennieficationn', color: '#BC8DF7', icon: siReddit },
			{ name: 'PayPal', url: 'https://www.paypal.com/paypalme/SharlynPantajo', handle: 'Support Me', color: '#BC8DF7', icon: siPaypal },
			{ name: 'BlueSky', url: 'https://bsky.app/profile/renniefication.bsky.social', handle: '@renniefication', color: '#BC8DF7', icon: siBluesky },
			{ name: 'TikTok', url: 'https://www.tiktok.com/@renniefabric', handle: '@renniefabric', color: '#BC8DF7', icon: siTiktok },
			{ name: 'YouTube', url: 'https://www.youtube.com/@RenPatterns', handle: '@RenPatterns', color: '#BC8DF7', icon: siYoutube }
			// { name: 'Webtoon', url: 'https://www.webtoons.com/en/canvas/call-back/list?title_no=921001', handle: 'Call Back', color: '#BC8DF7', icon: siWebtoon }
		],
		pricingCategories: [
			{
				id: 'head-shot',
				name: 'Head Shot / Icon',
				priceText: '$20 - $40',
				description: 'cute lil icons for your pfp or emotes~ price depends on how fancy your character is! 🌟',
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
				description: 'waist-up art~ perfect for showing off outfits and cool poses! great for character showcases hehe 💜',
				examples: [
					{ src: `${base}/assets/image04.jpg`, title: 'Half Body Design' },
					{ src: `${base}/assets/image06.jpg`, title: 'Half Body Showcase' }
				]
			},
			{
				id: 'full-body',
				name: 'Full Body & References',
				priceText: '$60 - $90',
				description: 'the whole character from head to toe! ref sheets start at $60 too~ perfect for nailing down your OC\'s look ✨',
				examples: [
					{ src: `${base}/assets/image05.png`, title: 'Full Body Art' },
					{ src: `${base}/assets/image07.jpg`, title: 'Character Sheet' }
				]
			}
		],
		terms: [
			{
				title: 'Will NOT Draw',
				content: 'no pedo stuff / certain fetishes (ask me if unsure). i can also say no to a comm if it\'s way too complex or if you\'re being rude~ sorry not sorry!',
				type: 'error'
			},
			{
				title: 'Age Check!',
				content: 'you gotta tell me your age for certain comms (especially mature or sensitive character stuff). it\'s important ok!',
				type: 'info'
			},
			{
				title: 'Refund Stuff',
				content: 'refunds depend on how far along i am~ also heads up, PayPal takes fees so even with barely any progress done, best i can give back is about 93%.',
				type: 'info'
			},
			{
				title: 'How Long Does It Take?',
				content: 'usually done in 2-3 weeks! but it could take longer if things get complicated or if we need more back-and-forth~ patience is appreciated! 💕',
				type: 'info'
			},
			{
				title: 'Be Nice & Respectful :3',
				content: 'just be chill, be clear, and let\'s vibe together! rude peeps get their comms cancelled on the spot. let\'s keep it fun~ 🌊',
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
		<!-- Logo Header -->
		<div class="flex flex-col items-center gap-3 mb-6 w-full bg-black/20 p-4 rounded-2xl border border-white/5 relative">
			<!-- Large centered REN comms logo -->
			<img src="{base}/assets/image01.png" alt="Ren Comms Logo" class="h-16 object-contain filter drop-shadow-[2px_2px_0_#000]" />
			
			<!-- Badges row -->
			<div class="flex items-center gap-2 flex-wrap justify-center">
				<span class="text-[9px] font-bold font-sans tracking-widest text-[#24D8E3] bg-[#24D8E3]/15 border border-[#24D8E3]/30 px-2.5 py-0.5 rounded-full inline-flex items-center">
					PATTERNS & VIBES 🌊
				</span>
				<span class="text-[9px] font-bold font-sans tracking-widest text-[#7EEDB8] bg-[#7EEDB8]/15 border border-[#7EEDB8]/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
					<span class="w-2 h-2 bg-[#7EEDB8] rounded-full inline-block animate-pulse"></span>
					OPEN FOR COMMS
				</span>
			</div>
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
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d={social.icon.path} />
					</svg>
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
							Hewoo~ Welcome In! ✨
						</h2>
						<p class="text-gray-200 text-lg leading-relaxed mt-4">
							hii! i draw OCs, custom designs, emotes & all sorts of fun stuff~ 
							this is where you can check out my art, see my prices, 
							and use the cost calculator to figure out your comm before reaching out! have fun looking around~ 💜
						</p>
					</div>

					<!-- Webtoon Project Showcase
					<div class="bg-gradient-to-r from-cyan-500/15 to-blue-500/15 border-2 border-black rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-4 justify-between mt-2 shadow-[3px_3px_0_#000] relative z-10">
						<div class="text-left">
							<span class="text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950/50 border border-cyan-800/30 px-2.5 py-0.5 rounded-full inline-block">my webtoon comic~</span>
							<h3 class="font-bold text-white text-xl mt-2">📖 read "Call Back" on Webtoon!</h3>
							<p class="text-sm text-gray-400 mt-1">check out my webcomic!! updates and story vibes right on Webtoon Canvas~ 🌊</p>
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
					-->
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
						<h3 class="text-2xl font-bold font-gochi text-[#BC8DF7]">🎨 doodle board~</h3>
						<p class="text-sm text-gray-400">draw something silly!! pick a color and go wild hehe~</p>
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
					<h2 class="text-3xl font-bold font-hachi text-[#E87848] brush-underline">cost calculator~</h2>
					<p class="text-sm text-gray-400 mt-1">figure out how much your comm will cost before you DM me! 🧮✨</p>
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
										Half Body <span class="whitespace-nowrap">($40)</span>
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
										Medium <span class="whitespace-nowrap">(+$15)</span>
									</button>
									<button 
										onclick={() => calcComplexity = 'complex'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcComplexity === 'complex' ? 'comic-btn-purple' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Complex <span class="whitespace-nowrap">(+$30)</span>
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
										Simple <span class="whitespace-nowrap">(+$20)</span>
									</button>
									<button 
										onclick={() => calcBackground = 'detailed'}
										class="comic-btn py-3 px-2 rounded-xl text-sm font-bold border-2 transition-all {calcBackground === 'detailed' ? 'comic-btn-orange' : 'bg-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Detailed <span class="whitespace-nowrap">(+$40)</span>
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
								<span class="text-xs text-gray-300 italic">extra characters are 50% of the base+complexity price each~</span>
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
								<span class="text-xs text-gray-300 italic">first sticker is $20, then $10 each after that~</span>
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
								<span class="text-xs text-gray-300 italic">first emote is $10, then $5 each after that~</span>
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
							<span class="text-xs text-gray-600 font-medium block text-right mt-1">*actual price might change a lil depending on the details~</span>
							
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
							hewoo here are my rules~ if you don't like em... well 
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
