<script>
	import { base } from '$app/paths';
	import { fade, scale } from 'svelte/transition';

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

	const artistInfo = {
		name: 'RennieFabric',
		tagline: 'Illustrator & Character Artist',
		discordTag: 'RennieFabric (ID: 623393220633559050)',
		socials: [
			{ name: 'Twitter / X', url: 'https://x.com/Renniefabric', handle: '@Renniefabric', color: '#BC8DF7' },
			{ name: 'Instagram', url: 'https://www.instagram.com/renniefication/', handle: '@renniefication', color: '#BC8DF7' },
			{ name: 'Reddit', url: 'https://www.reddit.com/user/Rennieficationn/', handle: 'u/Rennieficationn', color: '#BC8DF7' },
			{ name: 'PayPal', url: 'https://www.paypal.com/paypalme/SharlynPantajo', handle: 'Support Me', color: '#BC8DF7' }
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
		{ src: `${base}/assets/gallery01_38b512b6.png`, title: 'Gallery Illustration 1' },
		{ src: `${base}/assets/gallery01_cf19dd77.png`, title: 'Gallery Illustration 2' },
		{ src: `${base}/assets/gallery01_e797ed15.png`, title: 'Gallery Illustration 3' },
		{ src: `${base}/assets/gallery02_4bfa3f0b.png`, title: 'Icon Example 1' },
		{ src: `${base}/assets/gallery02_b1aa6620.png`, title: 'Icon Example 2' },
		{ src: `${base}/assets/gallery02_8c008a2c.png`, title: 'Icon Example 3' },
		{ src: `${base}/assets/image03.png`, title: 'Emotes Grid' },
		{ src: `${base}/assets/image04.jpg`, title: 'Half Body Design' },
		{ src: `${base}/assets/image06.jpg`, title: 'Half Body Showcase' },
		{ src: `${base}/assets/image05.png`, title: 'Full Body Art' },
		{ src: `${base}/assets/image07.jpg`, title: 'Character Sheet' }
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
	<div class="lg:col-span-4 glass-panel rounded-3xl p-6 flex flex-col items-center text-center floating">
		<!-- Wide Banner / Banner Frame -->
		<div class="w-full h-36 rounded-2xl overflow-hidden mb-4 relative group">
			<img 
				src="{base}/assets/image01.png" 
				alt="RennieFabric Banner" 
				class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-[#08060f] to-transparent opacity-40"></div>
		</div>

		<!-- Profile Info -->
		<h1 class="text-3xl font-bold font-hachi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 tracking-wider">
			{artistInfo.name}
		</h1>
		<p class="text-sm text-gray-400 font-medium tracking-wide mt-1">{artistInfo.tagline}</p>
		
		<!-- Custom divider -->
		<div class="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full my-4"></div>

		<!-- Tabs Menu -->
		<nav class="flex flex-col gap-2.5 w-full">
			<button 
				onclick={() => activeTab = 'home'}
				class="art-button w-full py-3 px-4 rounded-xl text-lg font-semibold tracking-wider transition-all duration-200 {activeTab === 'home' ? 'bg-[#24D8E3] text-gray-950 shadow-lg shadow-cyan-400/20' : 'bg-white/5 hover:bg-white/10 text-white'}"
			>
				🏠 Home Hub
			</button>
			<button 
				onclick={() => activeTab = 'gallery'}
				class="art-button w-full py-3 px-4 rounded-xl text-lg font-semibold tracking-wider transition-all duration-200 {activeTab === 'gallery' ? 'bg-[#BC8DF7] text-gray-950 shadow-lg shadow-purple-400/20' : 'bg-white/5 hover:bg-white/10 text-white'}"
			>
				🎨 Art & Pricing
			</button>
			<button 
				onclick={() => activeTab = 'calculator'}
				class="art-button w-full py-3 px-4 rounded-xl text-lg font-semibold tracking-wider transition-all duration-200 {activeTab === 'calculator' ? 'bg-[#E87848] text-gray-950 shadow-lg shadow-orange-400/20' : 'bg-white/5 hover:bg-white/10 text-white'}"
			>
				🧮 Price Calculator
			</button>
			<button 
				onclick={() => activeTab = 'terms'}
				class="art-button w-full py-3 px-4 rounded-xl text-lg font-semibold tracking-wider transition-all duration-200 {activeTab === 'terms' ? 'bg-[#E34049] text-gray-950 shadow-lg shadow-red-400/20' : 'bg-white/5 hover:bg-white/10 text-white'}"
			>
				📜 Terms & Rules
			</button>
		</nav>

		<!-- Social Media Badges -->
		<div class="flex flex-wrap gap-2.5 justify-center mt-6 w-full border-t border-white/5 pt-5">
			{#each artistInfo.socials as social}
				<a 
					href={social.url} 
					target="_blank" 
					rel="noreferrer"
					class="p-2.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 transition-colors border border-white/5 hover:border-white/10 flex items-center justify-center"
					title={social.name}
				>
					{#if social.name.includes('Twitter')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
					{:else if social.name.includes('Instagram')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
					{:else if social.name.includes('Reddit')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.85-1.68-6.28-1.78l1.41-4.51 3.89.83c.04.83.73 1.5 1.57 1.5 1.1 0 2-.9 2-2s-.9-2-2-2c-.77 0-1.44.44-1.77 1.11l-4.27-.92c-.19-.04-.38.05-.44.24l-1.64 5.23c-2.48.07-4.72.74-6.38 1.76C4.85 8.98 3.95 8.5 3 8.5c-1.65 0-3 1.35-3 3 0 1.12.6 2.1 1.48 2.63-.05.29-.08.59-.08.89 0 4.41 4.93 8 11 8s11-3.59 11-8c0-.3-.03-.6-.08-.89.88-.53 1.48-1.51 1.48-2.63zm-18 1c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm11 5.66c-1.63 1.63-4.73 1.63-6.36 0-.19-.19-.19-.51 0-.7.19-.19.51-.19.7 0 1.25 1.25 3.71 1.25 4.96 0 .19-.19.51-.19.7 0 .19.19.19.51 0 .7zm-.5-4.16c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
					{:else if social.name.includes('PayPal')}
						<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.02 6.55c-.24 1.35-.91 2.8-2.01 4.35-1.3 1.83-3 2.75-5.1 2.75h-2.1c-.5 0-.85.3-.95.8l-1.4 8.75c-.05.25-.25.45-.5.45H3.67c-.35 0-.6-.35-.5-.7l3-18.75c.1-.5.5-.8 1-.8h7.2c1.7 0 3 .4 3.9 1.25.9.8 1.15 1.95.75 3.3z"/></svg>
					{/if}
				</a>
			{/each}
		</div>
	</div>

	<!-- Right Side: Content Area (Dynamic Tabs) -->
	<div class="lg:col-span-8 w-full">
		{#if activeTab === 'home'}
			<!-- HOME TAB -->
			<div class="tab-content glass-panel rounded-3xl p-8 flex flex-col gap-6">
				<div class="flex flex-col gap-2">
					<h2 class="text-4xl font-extrabold font-gochi text-[#24D8E3] tracking-wide brush-underline">
						Welcome to My Sketchbook!
					</h2>
					<p class="text-gray-300 text-lg leading-relaxed mt-3">
						Hey there! I'm an artist who loves bringing original characters, custom designs, and emote packs to life. 
						This site is my creative portfolio and pricing builder. Feel free to explore my gallery categories, 
						calculate commission costs using my custom builder, and review my terms before ordering.
					</p>
				</div>

				<!-- Visual Highlights Grid -->
				<div class="grid grid-cols-3 gap-3 my-2">
					{#each allGalleryImages.slice(0, 3) as highlight}
						<div 
							onclick={() => openLightbox(highlight.src)}
							onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(highlight.src); }}
							role="button"
							tabindex="0"
							class="aspect-square rounded-2xl overflow-hidden cursor-zoom-in relative group border border-white/5"
						>
							<img 
								src={highlight.src} 
								alt={highlight.title} 
								class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							/>
							<div class="absolute inset-0 bg-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
								<span class="text-white font-semibold text-sm drop-shadow bg-black/40 px-3 py-1 rounded-full">Zoom 🔍</span>
							</div>
						</div>
					{/each}
				</div>

				<!-- Quick Commission Alert / Discord Card -->
				<div class="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-[#BC8DF7]/20 rounded-2xl p-5 flex flex-col md:flex-row items-center gap-4 justify-between">
					<div class="flex items-center gap-4">
						<div class="p-3 bg-purple-500/20 text-[#BC8DF7] rounded-xl">
							<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/></svg>
						</div>
						<div class="text-left">
							<h3 class="font-bold text-white text-lg">Interested in ordering?</h3>
							<p class="text-sm text-gray-400">Reach out to me directly on Discord: <span class="text-purple-300 font-semibold">{artistInfo.discordTag}</span></p>
						</div>
					</div>
					<a 
						href="https://discord.com/users/623393220633559050" 
						target="_blank" 
						rel="noreferrer"
						class="art-button bg-[#BC8DF7] hover:bg-[#a672e5] text-gray-950 px-6 py-2.5 rounded-xl font-bold tracking-wider"
					>
						Contact Me
					</a>
				</div>
			</div>
		{:else if activeTab === 'gallery'}
			<!-- GALLERY & PRICING TAB -->
			<div class="tab-content flex flex-col gap-8">
				{#each artistInfo.pricingCategories as category}
					<div class="glass-panel rounded-3xl p-6 md:p-8 flex flex-col gap-5">
						<!-- Header -->
						<div class="flex justify-between items-baseline border-b border-white/5 pb-3">
							<h3 class="text-2xl font-bold font-hachi text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-[#BC8DF7]">
								{category.name}
							</h3>
							<span class="text-xl font-bold font-gochi text-cyan-300 bg-cyan-950/40 border border-cyan-800/30 px-3 py-1 rounded-full">
								{category.priceText}
							</span>
						</div>
						
						<!-- Description -->
						<p class="text-gray-300 leading-relaxed text-base">{category.description}</p>
						
						<!-- Examples -->
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
							{#each category.examples as image}
								<div 
									onclick={() => openLightbox(image.src)}
									onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(image.src); }}
									role="button"
									tabindex="0"
									class="aspect-square rounded-2xl overflow-hidden cursor-zoom-in relative group border border-white/5 bg-gray-900/50"
								>
									<img 
										src={image.src} 
										alt={image.title} 
										class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
										<span class="text-white text-xs bg-purple-950/80 border border-purple-500/20 px-2.5 py-1 rounded-full font-medium">View Art 🔍</span>
									</div>
								</div>
							{/each}
						</div>
					</div>
				{/each}
			</div>
		{:else if activeTab === 'calculator'}
			<!-- CALCULATOR TAB -->
			<div class="tab-content glass-panel rounded-3xl p-8 flex flex-col gap-6">
				<div class="flex flex-col gap-1 border-b border-white/5 pb-4">
					<h2 class="text-3xl font-bold font-gochi text-[#E87848] brush-underline">Commission Price Calculator</h2>
					<p class="text-sm text-gray-400 mt-1">Estimate your commission rate in real-time according to my standard rates.</p>
				</div>

				<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
					<!-- Inputs Column -->
					<div class="flex flex-col gap-5">
						<!-- Category Selector -->
						<div class="flex flex-col gap-2">
							<span class="text-sm font-semibold text-gray-300 tracking-wider">Commission Format</span>
							<div class="grid grid-cols-3 gap-2">
								<button 
									onclick={() => calcCategory = 'illustration'}
									class="py-2.5 px-2 rounded-xl text-sm font-bold border transition-all {calcCategory === 'illustration' ? 'bg-[#E87848]/20 border-[#E87848] text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
								>
									Illustration
								</button>
								<button 
									onclick={() => calcCategory = 'stickers'}
									class="py-2.5 px-2 rounded-xl text-sm font-bold border transition-all {calcCategory === 'stickers' ? 'bg-[#E87848]/20 border-[#E87848] text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
								>
									Stickers
								</button>
								<button 
									onclick={() => calcCategory = 'emotes'}
									class="py-2.5 px-2 rounded-xl text-sm font-bold border transition-all {calcCategory === 'emotes' ? 'bg-[#E87848]/20 border-[#E87848] text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
								>
									Emotes
								</button>
							</div>
						</div>

						{#if calcCategory === 'illustration'}
							<!-- Illustration settings -->
							<div class="flex flex-col gap-2" in:fade>
								<span class="text-sm font-semibold text-gray-300 tracking-wider">Type / Scale</span>
								<div class="grid grid-cols-3 gap-2">
									<button 
										onclick={() => calcType = 'head-shot'}
										class="py-2 px-1 rounded-xl text-xs font-bold border transition-all {calcType === 'head-shot' ? 'bg-[#E87848]/15 border-[#E87848]/50 text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Head Shot ($20)
									</button>
									<button 
										onclick={() => calcType = 'half-body'}
										class="py-2 px-1 rounded-xl text-xs font-bold border transition-all {calcType === 'half-body' ? 'bg-[#E87848]/15 border-[#E87848]/50 text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Half Body ($30)
									</button>
									<button 
										onclick={() => calcType = 'full-body'}
										class="py-2 px-1 rounded-xl text-xs font-bold border transition-all {calcType === 'full-body' ? 'bg-[#E87848]/15 border-[#E87848]/50 text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Full Body ($60)
									</button>
								</div>
							</div>

							<div class="flex flex-col gap-2" in:fade>
								<span class="text-sm font-semibold text-gray-300 tracking-wider">Character Complexity</span>
								<div class="grid grid-cols-3 gap-2">
									<button 
										onclick={() => calcComplexity = 'simple'}
										class="py-2 px-1 rounded-xl text-xs font-bold border transition-all {calcComplexity === 'simple' ? 'bg-[#E87848]/15 border-[#E87848]/50 text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Simple (+$0)
									</button>
									<button 
										onclick={() => calcComplexity = 'medium'}
										class="py-2 px-1 rounded-xl text-xs font-bold border transition-all {calcComplexity === 'medium' ? 'bg-[#E87848]/15 border-[#E87848]/50 text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Medium (+$10)
									</button>
									<button 
										onclick={() => calcComplexity = 'complex'}
										class="py-2 px-1 rounded-xl text-xs font-bold border transition-all {calcComplexity === 'complex' ? 'bg-[#E87848]/15 border-[#E87848]/50 text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Complex (+$20)
									</button>
								</div>
							</div>

							<div class="flex flex-col gap-2" in:fade>
								<span class="text-sm font-semibold text-gray-300 tracking-wider">Background Style</span>
								<div class="grid grid-cols-3 gap-2">
									<button 
										onclick={() => calcBackground = 'flat'}
										class="py-2 px-1 rounded-xl text-xs font-bold border transition-all {calcBackground === 'flat' ? 'bg-[#E87848]/15 border-[#E87848]/50 text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
									>
										None / Flat (+$0)
									</button>
									<button 
										onclick={() => calcBackground = 'simple'}
										class="py-2 px-1 rounded-xl text-xs font-bold border transition-all {calcBackground === 'simple' ? 'bg-[#E87848]/15 border-[#E87848]/50 text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Simple (+$10)
									</button>
									<button 
										onclick={() => calcBackground = 'detailed'}
										class="py-2 px-1 rounded-xl text-xs font-bold border transition-all {calcBackground === 'detailed' ? 'bg-[#E87848]/15 border-[#E87848]/50 text-[#E87848]' : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'}"
									>
										Detailed (+$25)
									</button>
								</div>
							</div>

							<div class="flex flex-col gap-2" in:fade>
								<div class="flex justify-between items-center">
									<span class="text-sm font-semibold text-gray-300 tracking-wider">Number of Characters</span>
									<span class="text-sm font-bold text-[#E87848] bg-[#E87848]/10 px-2.5 py-0.5 rounded-full">{calcCharacters}</span>
								</div>
								<input 
									type="range" 
									min="1" 
									max="5" 
									bind:value={calcCharacters}
									class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E87848]"
								/>
								<span class="text-[10px] text-gray-400 italic">Each additional character is 50% of the single character price (plus complexity).</span>
							</div>
						{:else if calcCategory === 'stickers'}
							<!-- Stickers Settings -->
							<div class="flex flex-col gap-2" in:fade>
								<div class="flex justify-between items-center">
									<span class="text-sm font-semibold text-gray-300 tracking-wider">Quantity of Stickers</span>
									<span class="text-sm font-bold text-[#E87848] bg-[#E87848]/10 px-2.5 py-0.5 rounded-full">{calcStickerQty}</span>
								</div>
								<input 
									type="range" 
									min="1" 
									max="10" 
									bind:value={calcStickerQty}
									class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E87848]"
								/>
								<span class="text-[10px] text-gray-400 italic">First sticker is $20. Subsequent stickers are $10 each.</span>
							</div>
						{:else if calcCategory === 'emotes'}
							<!-- Emotes Settings -->
							<div class="flex flex-col gap-2" in:fade>
								<div class="flex justify-between items-center">
									<span class="text-sm font-semibold text-gray-300 tracking-wider">Quantity of Emotes</span>
									<span class="text-sm font-bold text-[#E87848] bg-[#E87848]/10 px-2.5 py-0.5 rounded-full">{calcEmoteQty}</span>
								</div>
								<input 
									type="range" 
									min="1" 
									max="15" 
									bind:value={calcEmoteQty}
									class="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#E87848]"
								/>
								<span class="text-[10px] text-gray-400 italic">First emote is $10. Subsequent emotes are $5 each.</span>
							</div>
						{/if}
					</div>

					<!-- Pricing Calculation Breakdown Column -->
					<div class="glass-panel border-[#E87848]/10 bg-black/20 rounded-2xl p-6 flex flex-col justify-between">
						<div class="flex flex-col gap-4">
							<h3 class="text-lg font-bold text-white tracking-wider border-b border-white/5 pb-2">Calculation Breakdown</h3>
							
							<div class="flex flex-col gap-2 text-sm">
								{#if calcCategory === 'illustration'}
									<div class="flex justify-between">
										<span class="text-gray-400">Base Price ({calcType.replace('-', ' ')})</span>
										<span class="text-gray-200">${calcType === 'head-shot' ? 20 : calcType === 'half-body' ? 30 : 60}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-400">Complexity ({calcComplexity})</span>
										<span class="text-gray-200">+${calcComplexity === 'simple' ? 0 : calcComplexity === 'medium' ? 10 : 20}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-gray-400">Background ({calcBackground})</span>
										<span class="text-gray-200">+${calcBackground === 'flat' ? 0 : calcBackground === 'simple' ? 10 : 25}</span>
									</div>
									{#if calcCharacters > 1}
										<div class="flex justify-between text-[#E87848]/90">
											<span>Extra Characters (x{calcCharacters - 1})</span>
											<span>+${((calcType === 'head-shot' ? 20 : calcType === 'half-body' ? 30 : 60) + (calcComplexity === 'simple' ? 0 : calcComplexity === 'medium' ? 10 : 20)) * 0.5 * (calcCharacters - 1)}</span>
										</div>
									{/if}
								{:else if calcCategory === 'stickers'}
									<div class="flex justify-between">
										<span class="text-gray-400">Base Sticker (x1)</span>
										<span class="text-gray-200">$20</span>
									</div>
									{#if calcStickerQty > 1}
										<div class="flex justify-between text-[#E87848]/90">
											<span>Additional Stickers (x{calcStickerQty - 1})</span>
											<span>+${(calcStickerQty - 1) * 10}</span>
										</div>
									{/if}
								{:else if calcCategory === 'emotes'}
									<div class="flex justify-between">
										<span class="text-gray-400">Base Emote (x1)</span>
										<span class="text-gray-200">$10</span>
									</div>
									{#if calcEmoteQty > 1}
										<div class="flex justify-between text-[#E87848]/90">
											<span>Additional Emotes (x{calcEmoteQty - 1})</span>
											<span>+${(calcEmoteQty - 1) * 5}</span>
										</div>
									{/if}
								{/if}
							</div>
						</div>

						<div class="border-t border-white/5 pt-4 mt-6">
							<div class="flex justify-between items-baseline">
								<span class="text-base font-bold text-gray-300">Estimated Total:</span>
								<span class="text-4xl font-extrabold font-hachi text-[#E87848] drop-shadow-md">
									${calculatedPrice}
								</span>
							</div>
							<span class="text-[10px] text-gray-500 block text-right mt-1">*Final price may vary depending on complex detail inquiries.</span>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'terms'}
			<!-- TERMS TAB -->
			<div class="tab-content flex flex-col gap-6">
				<!-- Spoiler Alert Header Section -->
				<div class="glass-panel rounded-3xl p-6 border-red-500/10 flex flex-col gap-4">
					<h2 class="text-2xl font-bold font-gochi text-[#E34049]">
						📜 Commission Rules & Guidelines
					</h2>
					<div class="p-4 bg-red-950/20 border border-red-900/30 rounded-2xl text-left leading-relaxed">
						<span class="text-gray-200 font-semibold text-lg">
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
					{#each artistInfo.terms as term}
						<div class="glass-panel rounded-2xl p-5 flex flex-col gap-2 border-l-4 {term.type === 'error' ? 'border-l-red-500 bg-red-950/5' : term.type === 'success' ? 'border-l-emerald-500 bg-emerald-950/5' : 'border-l-cyan-500 bg-cyan-950/5'}">
							<h3 class="text-lg font-bold tracking-wide flex items-center gap-2 {term.type === 'error' ? 'text-red-300' : term.type === 'success' ? 'text-emerald-300' : 'text-cyan-300'}">
								{#if term.type === 'error'}
									❌ {term.title}
								{:else if term.type === 'success'}
									💖 {term.title}
								{:else}
									✨ {term.title}
								{/if}
							</h3>
							<p class="text-gray-300 leading-relaxed text-sm md:text-base pl-6">{term.content}</p>
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
			class="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all border border-white/5 cursor-pointer z-50"
			title="Previous Image"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
		</button>

		<button 
			onclick={nextLightboxImage}
			class="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all border border-white/5 cursor-pointer z-50"
			title="Next Image"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
		</button>

		<button 
			onclick={closeLightbox}
			class="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full bg-white/5 hover:bg-white/15 text-white transition-all border border-white/5 cursor-pointer z-50"
			title="Close Lightbox"
		>
			<svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
		</button>

		<!-- Lightbox Image Wrapper -->
		<div 
			class="relative max-w-full max-h-[85vh] md:max-h-[80vh] flex flex-col items-center select-none cursor-default"
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
				class="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
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
