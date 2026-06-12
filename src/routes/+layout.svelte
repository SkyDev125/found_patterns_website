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
			this.y = height + 30;
			this.type = Math.random() > 0.45 ? 'star' : 'wave'; // 55% stars, 45% waves
			this.size = this.type === 'star' ? Math.random() * 8 + 4 : Math.random() * 20 + 15; // stars: radius, waves: width
			this.speedX = Math.random() * 0.3 - 0.15;
			this.speedY = -(Math.random() * 0.4 + 0.15); // float upwards slowly
			this.opacity = Math.random() * 0.4 + 0.1;
			this.maxOpacity = this.opacity;
			this.pulseSpeed = Math.random() * 0.005 + 0.002;
			this.pulseDir = Math.random() > 0.5 ? 1 : -1;
			
			// Accent colors: Cyan (#24D8E3), Orange (#E87848), Purple (#BC8DF7)
			const colors = ['#24D8E3', '#E87848', '#BC8DF7'];
			this.color = colors[Math.floor(Math.random() * colors.length)];
			this.rotation = Math.random() * Math.PI * 2;
			this.rotSpeed = Math.random() * 0.01 - 0.005;
			this.waveOffset = Math.random() * Math.PI * 2;
		}

		update(width, height) {
			this.x += this.speedX;
			this.y += this.speedY;
			this.rotation += this.rotSpeed;
			this.waveOffset += 0.03;

			// Add a slight horizontal sway to waves
			if (this.type === 'wave') {
				this.x += Math.sin(this.waveOffset) * 0.15;
			}

			// Pulse opacity
			this.opacity += this.pulseSpeed * this.pulseDir;
			if (this.opacity > this.maxOpacity || this.opacity < 0.05) {
				this.pulseDir *= -1;
			}

			if (this.y < -30 || this.x < -30 || this.x > width + 30) {
				this.reset(width, height);
			}
		}

		draw(ctx) {
			ctx.save();
			ctx.strokeStyle = this.color;
			ctx.fillStyle = this.color;
			ctx.globalAlpha = this.opacity;
			ctx.lineWidth = 1.5;

			if (this.type === 'star') {
				// Draw a cute hand-drawn style 4-point star
				ctx.translate(this.x, this.y);
				ctx.rotate(this.rotation);
				
				ctx.beginPath();
				ctx.moveTo(0, -this.size);
				ctx.quadraticCurveTo(0, 0, this.size, 0);
				ctx.quadraticCurveTo(0, 0, 0, this.size);
				ctx.quadraticCurveTo(0, 0, -this.size, 0);
				ctx.quadraticCurveTo(0, 0, 0, -this.size);
				ctx.closePath();
				
				// Outline style for hand-drawn look
				ctx.stroke();
				if (this.size > 7) {
					ctx.globalAlpha = this.opacity * 0.3;
					ctx.fill();
				}
			} else {
				// Draw a little sine-wave wiggle line segment
				ctx.beginPath();
				const segments = 20;
				const amp = 4;
				const freq = 0.3;
				
				for (let i = 0; i <= segments; i++) {
					const dx = this.x - this.size / 2 + (i / segments) * this.size;
					const dy = this.y + Math.sin((i * freq) + this.waveOffset) * amp;
					if (i === 0) {
						ctx.moveTo(dx, dy);
					} else {
						ctx.lineTo(dx, dy);
					}
				}
				ctx.stroke();
			}

			ctx.restore();
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
	class="fixed inset-0 -z-20 pointer-events-none bg-cover bg-center bg-no-repeat opacity-80"
	style="background-image: linear-gradient(to top, rgba(5, 16, 26, 0.85), rgba(5, 16, 26, 0.45)), url('{base}/assets/bg.jpg');"
></div>

<main class="relative min-h-screen flex flex-col justify-between z-10 px-4 md:px-8 py-8 max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px] w-full mx-auto">
	<div class="w-full flex-grow flex flex-col justify-start">
		{@render children()}
	</div>
</main>
