<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	let { children } = $props();
	let canvasElement;

	class Particle {
		constructor(width, height) {
			this.reset(width, height);
			this.y = Math.random() * height; // initial random y
		}

		reset(width, height) {
			this.x = Math.random() * width;
			this.y = height + 10;
			this.size = Math.random() * 2 + 1;
			this.speedX = Math.random() * 0.4 - 0.2;
			this.speedY = -(Math.random() * 0.5 + 0.2); // float upwards
			this.opacity = Math.random() * 0.6 + 0.1;
			this.maxOpacity = this.opacity;
			this.hue = Math.random() * 60 + 260; // purple / blue spectrum
			this.pulseSpeed = Math.random() * 0.02 + 0.005;
			this.pulseDir = Math.random() > 0.5 ? 1 : -1;
		}

		update(width, height) {
			this.x += this.speedX;
			this.y += this.speedY;

			// Pulse opacity slightly
			this.opacity += this.pulseSpeed * this.pulseDir;
			if (this.opacity > this.maxOpacity || this.opacity < 0.1) {
				this.pulseDir *= -1;
			}

			if (this.y < -10 || this.x < -10 || this.x > width + 10) {
				this.reset(width, height);
			}
		}

		draw(ctx) {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
			ctx.fillStyle = `hsla(${this.hue}, 85%, 75%, ${this.opacity})`;
			ctx.shadowBlur = this.size * 3;
			ctx.shadowColor = `hsla(${this.hue}, 85%, 75%, 0.8)`;
			ctx.fill();
		}
	}

	onMount(() => {
		const canvas = canvasElement;
		const ctx = canvas.getContext('2d');
		let animationFrameId;

		let width = (canvas.width = window.innerWidth);
		let height = (canvas.height = window.innerHeight);

		const particles = [];
		const particleCount = 45;

		for (let i = 0; i < particleCount; i++) {
			particles.push(new Particle(width, height));
		}

		function handleResize() {
			if (!canvas) return;
			width = canvas.width = window.innerWidth;
			height = canvas.height = window.innerHeight;
		}

		window.addEventListener('resize', handleResize);

		function animate() {
			if (!ctx) return;
			ctx.clearRect(0, 0, width, height);
			ctx.shadowBlur = 0;

			// Dynamic responsive starry network lines (subtle)
			ctx.strokeStyle = 'rgba(188, 141, 247, 0.02)';
			ctx.lineWidth = 0.5;
			const gridSize = 120;
			for (let x = 0; x < width; x += gridSize) {
				ctx.beginPath();
				ctx.moveTo(x, 0);
				ctx.lineTo(x, height);
				ctx.stroke();
			}
			for (let y = 0; y < height; y += gridSize) {
				ctx.beginPath();
				ctx.moveTo(0, y);
				ctx.lineTo(width, y);
				ctx.stroke();
			}

			for (const p of particles) {
				p.update(width, height);
				p.draw(ctx);
			}
			animationFrameId = requestAnimationFrame(animate);
		}

		animate();

		return () => {
			window.removeEventListener('resize', handleResize);
			cancelAnimationFrame(animationFrameId);
		};
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>RennieFabric | Artist Portfolio & Commission Rates</title>
	<meta name="description" content="Official portfolio and commission details for RennieFabric. Get pricing rates for Headshots, Half Body, Full Body illustrations, emotes, and stickers." />
</svelte:head>

<!-- Animated Canvas Background -->
<canvas 
	bind:this={canvasElement} 
	class="fixed inset-0 w-full h-full -z-10 pointer-events-none opacity-60"
></canvas>

<!-- Original Background Image Texturing -->
<div 
	class="fixed inset-0 -z-20 pointer-events-none bg-cover bg-center bg-repeat opacity-25"
	style="background-image: linear-gradient(to top, rgba(8, 6, 15, 0.95), rgba(8, 6, 15, 0.85)), url('{base}/assets/bg.jpg');"
></div>

<main class="relative min-h-screen flex flex-col justify-between z-10 px-4 md:px-8 py-8 max-w-6xl mx-auto">
	<div class="w-full flex-grow flex flex-col justify-center">
		{@render children()}
	</div>
</main>
