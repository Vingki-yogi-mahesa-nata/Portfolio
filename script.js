// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Smooth Scrolling for Navigation Links
    // Menangani tautan internal (#section) dan tautan antar-halaman yang memiliki hash (page.html#section)
    document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.href.startsWith('mailto:')) {
                return; // Biarkan mailto: berfungsi normal
            }

            const fullHref = this.href;
            const url = new URL(fullHref);
            const path = url.pathname.split('/').pop(); // Nama file (misal: index.html, editing-packs.html)
            const hash = url.hash; // #contact, #portfolio

            const currentFileName = window.location.pathname.split('/').pop();

            // Jika link adalah internal di halaman yang sama (hanya #hash)
            if (hash && !path) {
                e.preventDefault();
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                document.querySelector(hash).scrollIntoView({
                    behavior: 'smooth'
                });
            } 
            // Jika link mengarah ke halaman lain dengan hash (misal: index.html#contact)
            else if (hash && path) {
                e.preventDefault(); // Cegah navigasi default
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                // Jika sudah di halaman tujuan, langsung gulir
                if (currentFileName === path) {
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // Jika belum di halaman tujuan, navigasi ke halaman tersebut.
                    // Smooth scroll akan ditangani oleh DOMContentLoaded di halaman tujuan.
                    window.location.href = fullHref;
                }
            }
            // Jika link adalah ke halaman lain tanpa hash (misal: editing-packs.html)
            else if (!hash && path && path !== currentFileName) {
                // Biarkan browser melakukan navigasi default (tanpa e.preventDefault())
                // Karena kita tidak ingin mencegah navigasi ke halaman lain
            }
            // Jika tidak ada hash dan path sama (e.g., klik logo yang mengarah ke index.html dari index.html), biarkan default.
            // Atau kasus lain yang tidak perlu dicegah.
        });
    });

    // Ini adalah bagian penting untuk menangani smooth scroll setelah halaman dimuat
    // Misalnya, ketika Anda datang dari editing-packs.html ke index.html#contact
    if (window.location.hash) {
        // Beri sedikit delay untuk memastikan DOM sudah dirender sepenuhnya
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, 100); 
    }

    // Portfolio Tabs (Filter untuk halaman index.html)
    const portfolioTabs = document.querySelectorAll('.portfolio-tab');
    
    // Pastikan ada tab filter dan item portfolio di halaman saat ini
    if (portfolioTabs.length > 0 && document.querySelectorAll('.portfolio-item').length > 0) {
        portfolioTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                portfolioTabs.forEach(t => t.classList.remove('active-tab'));
                tab.classList.add('active-tab');
                const filterCategory = tab.getAttribute('data-category');
                document.querySelectorAll('.portfolio-item').forEach(item => {
                    if (filterCategory === 'all' || item.getAttribute('data-category') === filterCategory) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            const formspreeUrl = "https://formspree.io/f/xeokgqyw";

            const existingMessage = this.querySelector('.form-message');
            if (existingMessage) {
                existingMessage.remove();
            }

            try {
                const response = await fetch(formspreeUrl, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                const messageElement = document.createElement('p');
                messageElement.className = 'form-message font-semibold mt-4 text-center';

                if (response.ok) {
                    messageElement.classList.add('text-green-500');
                    messageElement.textContent = 'Pesan Anda telah terkirim! Terima kasih.';
                    this.reset();
                } else {
                    const errorData = await response.json();
                    messageElement.classList.add('text-red-500');
                    messageElement.textContent = 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.';
                    console.error('Formspree Error:', errorData);
                    if (errorData.errors && errorData.errors.length > 0) {
                        errorData.errors.forEach(error => {
                            console.error(`Formspree Field Error - ${error.field}: ${error.message}`);
                        });
                    }
                }
                this.appendChild(messageElement);
            } catch (error) {
                const messageElement = document.createElement('p');
                messageElement.className = 'form-message text-red-500 font-semibold mt-4 text-center';
                messageElement.textContent = 'Terjadi kesalahan jaringan. Pastikan Anda terhubung ke internet dan coba lagi.';
                this.appendChild(messageElement);
                console.error('Network Error:', error);
            }
        });
    }

    // Custom Cursor (deteksi mobile/desktop)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    function handleMouseMove(e) {
        if (!cursorDot || !cursorOutline) return;

        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
        cursorOutline.style.transform = `translate(-50%, -50%) scale(${1})`;

        if (e.target.closest('a, button, .portfolio-item, .product-card')) { 
            cursorOutline.style.transform = `translate(-50%, -50%) scale(${1.5})`;
            cursorOutline.style.borderColor = '#E78E2F'; // accent color
        } else {
            cursorOutline.style.borderColor = '#F01414'; // secondary color (default)
        }
    }

    function setupCustomCursor() {
        const isDesktop = window.innerWidth >= 768;

        if (cursorDot && cursorOutline) {
            if (isDesktop) {
                cursorDot.style.display = 'block';
                cursorOutline.style.display = 'block';
                document.body.style.cursor = 'none';
                window.removeEventListener('mousemove', handleMouseMove); 
                window.addEventListener('mousemove', handleMouseMove);
            } else {
                cursorDot.style.display = 'none';
                cursorOutline.style.display = 'none';
                document.body.style.cursor = 'default';
                window.removeEventListener('mousemove', handleMouseMove);
            }
        }
    }

    setupCustomCursor();
    window.addEventListener('resize', setupCustomCursor);


    // Active Section Highlight for Navigation
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a, #mobile-menu a');

    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let currentSection = '';

            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100; 
                const sectionHeight = section.clientHeight;

                if (pageYOffset >= sectionTop && pageYOffset < (sectionTop + sectionHeight)) {
                    currentSection = section.getAttribute('id');
                }
            });

            const currentFileName = window.location.pathname.split('/').pop();

            navLinks.forEach(link => {
                link.classList.remove('text-accent');
                link.classList.add('text-neutral'); 
                const href = link.getAttribute('href');
                const linkFileName = href.split('/').pop().split('#')[0]; // Get only file name without hash
                const linkHash = href.includes('#') ? href.split('#')[1] : null;

                // Mark current page's navigation link as active
                if (linkFileName === currentFileName) {
                    if (linkHash && linkHash === currentSection) { // If it's a hash link on the current page
                        link.classList.remove('text-neutral');
                        link.classList.add('text-accent');
                    } else if (!linkHash && currentFileName === 'index.html' && currentSection === 'home') { // Special case for main page's "Beranda" link
                        link.classList.remove('text-neutral');
                        link.classList.add('text-accent');
                    } else if (!linkHash && linkFileName === currentFileName && currentFileName !== 'index.html') { // If it's a direct link to another page (editing-packs.html, pack-detail.html, work-detail.html)
                         link.classList.remove('text-neutral');
                         link.classList.add('text-accent');
                    }
                }
            });
        });
    }

    // Data Portofolio untuk Halaman Detail (work-detail.html)
    const portfolioData = [
        {
            id: 'video-campaign',
            title: 'Video Campaign Brand',
            category: 'Video Editing',
            client: 'ABC Studio',
            mediaType: 'video-local',
            mediaSrc: 'assets/video-sample-1.mp4', // Adjusted path
            description: `Deskripsi mendalam tentang proyek Video Campaign Brand. 
                          Pada proyek ini, kami berfokus pada pembuatan kampanye video yang dinamis 
                          untuk meningkatkan visibilitas merek klien. Tantangan utamanya adalah 
                          menggabungkan pesan kompleks menjadi narasi visual yang mudah dicerna dan menarik. 
                          Proses kreatif melibatkan brainstorming konsep, penulisan skrip, syuting (jika ada), 
                          dan post-produksi yang intensif.

                          Kami menggunakan teknik color grading sinematik untuk memberikan nuansa visual 
                          yang kaya dan profesional. Editing yang cepat dan transisi yang halus 
                          digunakan untuk menjaga tempo video tetap energik. Sound design yang imersif 
                          juga ditambahkan untuk memperkuat emosi dan pesan.

                          Hasil akhirnya adalah serangkaian video kampanye yang berhasil menarik perhatian 
                          audiens target dan meningkatkan interaksi di berbagai platform digital. 
                          Klien melaporkan peningkatan engagement sebesar 25% setelah peluncuran kampanye ini.`,
            skills: ['Video Editing (Cut, Transisi, VFX)', 'Color Grading', 'Sound Design', 'Motion Graphics'],
            details: [
                { label: 'Tanggal Selesai', value: '12 Mei 2024' },
                { label: 'Durasi', value: '1:30 menit' },
                { label: 'Platform', value: 'YouTube, Instagram' }
            ]
        },
        {
            id: 'brand-identity',
            title: 'Brand Identity Design',
            category: 'Graphic Design',
            client: 'XYZ Solutions',
            mediaType: 'image',
            mediaSrc: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
            description: `Proyek ini melibatkan pengembangan identitas merek yang komprehensif untuk XYZ Solutions, sebuah startup teknologi. 
                          Tujuannya adalah menciptakan citra merek yang modern, inovatif, dan mudah dikenali. 
                          Prosesnya dimulai dengan riset pasar dan analisis kompetitor untuk memahami lanskap industri. 
                          Kami kemudian mengembangkan beberapa konsep logo, skema warna, dan tipografi yang berbeda.

                          Fokus utama adalah pada desain logo yang minimalis namun berkesan, serta panduan merek yang fleksibel 
                          untuk berbagai aplikasi (digital dan cetak). Kami juga membuat mock-up aplikasi digital 
                          dan stationery untuk memberikan gambaran visual yang jelas.

                          Hasilnya adalah identitas merek yang kuat dan kohesif, yang membantu XYZ Solutions menonjol di pasar 
                          dan menarik perhatian investor serta pelanggan awal. Desain ini dinilai berhasil 
                          merepresentasikan nilai-nilai inti perusahaan.`,
            skills: ['Desain Logo', 'Branding Guideline', 'Tipografi', 'Desain UI/UX (Dasar)'],
            details: [
                { label: 'Tanggal Selesai', value: '20 Maret 2024' },
                { label: 'Deliverables', value: 'Logo, Brand Guideline, Stationery' },
                { label: 'Tools', value: 'Adobe Illustrator, Photoshop' }
            ]
        },
        {
            id: 'landscape-photo',
            title: 'Landscape Photography Series',
            category: 'Photography',
            client: 'Personal Project',
            mediaType: 'image',
            mediaSrc: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1574&q=80',
            description: `Seri fotografi lanskap ini menangkap keindahan alam yang menakjubkan dari berbagai lokasi. 
                          Setiap gambar dipilih untuk menonjolkan komposisi, cahaya, dan suasana unik dari lanskap tersebut. 
                          Tujuan proyek ini adalah untuk mengeksplorasi teknik fotografi alam dan post-processing 
                          untuk menghasilkan gambar yang artistik dan inspiratif.

                          Prosesnya melibatkan perjalanan ke lokasi terpencil, pemilihan waktu yang tepat untuk pencahayaan 
                          (golden hour, blue hour), dan penggunaan filter kamera untuk efek tertentu. 
                          Post-processing dilakukan di Adobe Lightroom untuk penyempurnaan warna, kontras, dan detail.

                          Seri ini telah dipamerkan dalam beberapa galeri lokal dan mendapatkan apresiasi atas 
                          kemampuannya membangkitkan rasa kagum terhadap alam.`,
            skills: ['Fotografi Lanskap', 'Komposisi Fotografi', 'Post-Processing (Lightroom)', 'Color Grading Foto'],
            details: [
                { label: 'Tanggal Selesai', value: '10 Februari 2024' },
                { label: 'Jumlah Foto', value: '15 Foto Pilihan' },
                { label: 'Lokasi', value: 'Berbagai Destinasi Alam' }
            ]
        },
        {
            id: 'short-film',
            title: 'Short Film Production',
            category: 'Videography',
            client: 'Indie Filmmakers Collective',
            mediaType: 'youtube',
            youtubeId: 'VIDEO_ID_YOUTUBE_5', // Ganti dengan ID video YouTube yang sebenarnya
            description: `Produksi film pendek independen yang menceritakan kisah tentang [sebutkan tema atau genre]. 
                          Sebagai videographer utama, peran saya meliputi sinematografi, pengaturan pencahayaan, 
                          dan pengambilan gambar. Tujuan dari film ini adalah untuk mengeksplorasi narasi 
                          melalui visual yang kuat dan atmosfer yang mendalam.

                          Proses produksi melibatkan kolaborasi erat dengan sutradara dan tim produksi 
                          sejak tahap pra-produksi hingga pengambilan gambar. Kami bereksperimen dengan berbagai 
                          sudut kamera dan teknik pergerakan untuk menciptakan dampak emosional yang maksimal.

                          Film pendek ini telah diterima di beberapa festival film independen dan 
                          mendapatkan pujian atas kualitas visualnya yang sinematik.`,
            skills: ['Sinematografi', 'Pengambilan Gambar', 'Pencahayaan Video', 'Arahan Visual'],
            details: [
                { label: 'Tanggal Selesai', value: '01 Januari 2024' },
                { label: 'Durasi', value: '8:45 menit' },
                { label: 'Festival', value: 'Festival Film Indie 2024' }
            ]
        },
        {
            id: 'corporate-video',
            title: 'Corporate Profile Video',
            category: 'Video Editing',
            client: 'Global Corp',
            mediaType: 'video-local',
            mediaSrc: 'assets/video-sample-2.mp4',
            description: `Video profil perusahaan untuk Global Corp, menyoroti nilai-nilai dan pencapaian mereka.
                          Proyek ini melibatkan penggambaran esensi dan visi perusahaan melalui narasi visual yang kuat.
                          Kami bekerja sama dengan tim klien untuk memahami pesan inti dan audiens target,
                          kemudian menerjemahkannya ke dalam produksi video yang profesional dan menarik.`,
            skills: ['Video Editing', 'Narasi', 'Motion Graphics', 'Color Grading'],
            details: [
                {label: 'Durasi', value: '3:00 menit'},
                {label: 'Tujuan', value: 'Branding Perusahaan, Pemasaran B2B'},
                {label: 'Distribusi', value: 'Situs Web Perusahaan, Konferensi'}
            ]
        },
        {
            id: 'ui-design',
            title: 'Digital Product UI Design',
            category: 'Graphic Design',
            client: 'Startup Innovate',
            mediaType: 'image',
            mediaSrc: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            description: `Desain antarmuka pengguna (UI) untuk aplikasi mobile inovatif yang berfokus pada kemudahan penggunaan (UX) dan estetika modern.
                          Kami melakukan riset pengguna, membuat wireframe, dan mengembangkan prototipe interaktif.
                          Tujuan utamanya adalah menciptakan pengalaman yang intuitif dan menyenangkan bagi pengguna.
                          Desain ini juga memastikan konsistensi visual di seluruh platform.`,
            skills: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'User Testing'],
            details: [
                {label: 'Tools', value: 'Figma, Adobe XD'},
                {label: 'Platform', value: 'Mobile (iOS & Android)'},
                {label: 'Status', value: 'Prototype Selesai'}
            ]
        },
        {
            id: 'model-portrait',
            title: 'Potret Model Profesional',
            category: 'Photography',
            client: 'Agency Model Jakarta',
            mediaType: 'image',
            mediaSrc: 'https://images.unsplash.com/photo-1503435980610-a60293d28a55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            description: `Sesi pemotretan potret model profesional untuk keperluan portfolio agensi.
                          Kami berfokus pada penangkapan ekspresi dan pose yang kuat,
                          serta bermain dengan pencahayaan studio untuk menciptakan suasana yang dramatis.
                          Post-processing dilakukan untuk menyempurnakan warna kulit dan detail.`,
            skills: ['Fotografi Potret', 'Pencahayaan Studio', 'Komposisi', 'Retouching Foto'],
            details: [
                {label: 'Tanggal', value: '15 Maret 2024'},
                {label: 'Lokasi', value: 'Studio Jakarta'},
                {label: 'Tujuan', value: 'Portfolio Model'}
            ]
        },
        {
            id: 'indie-music-video',
            title: 'Video Musik Indie Pop',
            category: 'Videography',
            client: 'Band "Senja Akustik"',
            mediaType: 'youtube',
            youtubeId: 'ANOTHER_YOUTUBE_VIDEO_ID_HERE', // Ganti dengan ID video YouTube yang sebenarnya
            description: `Produksi video musik untuk band indie pop lokal.
                          Kami bertujuan untuk menciptakan visual yang sesuai dengan nuansa lagu yang melankolis dan ringan.
                          Pengambilan gambar dilakukan di berbagai lokasi outdoor dan indoor yang estetik.
                          Fokus pada sinematografi yang menangkap emosi lirik lagu.`,
            skills: ['Videografi', 'Pengambilan Gambar', 'Pencahayaan Alami', 'Editing Ritmik'],
            details: [
                {label: 'Durasi', value: '4:15 menit'},
                {label: 'Tanggal Rilis', value: '05 April 2024'},
                {label: 'Sutradara', value: '[Nama Sutradara Jika Ada]'}
            ]
        },
        {
            id: 'tutorial-video',
            title: 'Video Tutorial Interaktif',
            category: 'Video Editing',
            client: 'E-Learning Platform',
            mediaType: 'video-local',
            mediaSrc: 'assets/video-sample-3.mp4',
            description: `Pembuatan video tutorial interaktif untuk platform e-learning.
                          Video ini dirancang untuk menjelaskan konsep kompleks secara sederhana dan menarik.
                          Kami menggunakan kombinasi rekaman layar, animasi motion graphics, dan narasi yang jelas.
                          Tujuannya adalah memaksimalkan retensi informasi dan keterlibatan peserta didik.`,
            skills: ['Video Editing', 'Motion Graphics', 'Screen Recording', 'Educational Design'],
            details: [
                {label: 'Format', value: 'MP4 HD'},
                {label: 'Modul', value: 'Dasar-Dasar Coding'},
                {label: 'Target', value: 'Pemula'}
            ]
        },
        {
            id: 'app-mockup',
            title: 'Mockup Desain Aplikasi',
            category: 'Graphic Design',
            client: 'Innovate Solutions',
            mediaType: 'image',
            mediaSrc: 'assets/portfolio-item-10.jpg', // Pastikan gambar ini ada di folder assets
            description: `Desain mockup aplikasi mobile untuk platform manajemen proyek.
                          Fokus pada antarmuka yang bersih, intuitif, dan fungsional.
                          Kami menciptakan wireframe hingga prototipe visual yang siap dikembangkan.
                          Tujuan utamanya adalah meningkatkan produktivitas pengguna.`,
            skills: ['UI Design', 'Mockup', 'Prototyping', 'Graphic Design'],
            details: [
                {label: 'Status', value: 'Selesai'},
                {label: 'Tools', value: 'Figma'},
                {label: 'Tujuan', value: 'Presentasi Konsep'}
            ]
        },
    ];

    // --- Data untuk Pack Editing ---
    const editingPacksData = [
        {
            id: 'video-luts-pack-v1',
            title: 'Video LUTs Pack Vol. 1',
            category: 'Color Grading',
            price: 'Rp 50.000',
            mediaType: 'image',
            mediaSrc: 'brand identity Design/stationery2_01.jpg', // Path gambar thumbnail, langsung di folder image
            description: `Koleksi LUTs sinematik premium yang dirancang untuk memberikan tampilan profesional pada video Anda. Paket ini mencakup berbagai gaya, dari nuansa hangat dan dramatis hingga warna-warna cerah dan modern. Kompatibel dengan perangkat lunak editing video populer seperti Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, dan lainnya.
                          Tingkatkan kualitas visual proyek Anda dengan cepat dan mudah, baik untuk film pendek, vlog, atau video promosi.`,
            details: [
                { label: 'Format', value: '.cube, .3dl' },
                { label: 'Kompatibilitas', value: 'Premiere Pro, DaVinci Resolve, FCPX, Photoshop, dll.' },
                { label: 'Jumlah LUTs', value: '25' }
            ],
            contents: [ // Tambahkan detail konten pack
                '25 File LUTs (.cube, .3dl)',
                'Panduan Penggunaan (PDF)',
                'File Contoh (Opsional)'
            ],
            // Link pembayaran sebenarnya (ini hanya placeholder)
            paymentLink: 'https://payhip.com/b/your-luts-pack-link' // Ganti dengan link pembayaran aktual Anda
        },
        {
            id: 'sound-effects-library',
            title: 'Sound Effects Library',
            category: 'Audio',
            price: 'Rp 75.000',
            mediaType: 'image',
            mediaSrc: 'brand identity Design/stationery2_01.jpg', // Path gambar thumbnail, langsung di folder image
            description: `Ratusan efek suara berkualitas tinggi untuk film, video, game, dan produksi audio Anda. Perpustakaan ini mencakup berbagai kategori suara seperti foley (langkah kaki, pintu), transisi (swoosh, whoosh), atmosfer (alam, kota), dan elemen UI (klik, pop).
                          Dirancang untuk membantu Anda menciptakan lanskap suara yang imersif dan profesional. Semua file dalam format WAV atau MP3.`,
            details: [
                { label: 'Format', value: '.wav, .mp3' },
                { label: 'Jumlah SFX', value: '500+' },
                { label: 'Ukuran File', value: 'Sekitar 2 GB' }
            ],
            contents: [
                '500+ File Efek Suara (WAV/MP3)',
                'File Metadata (Opsional)'
            ],
            paymentLink: 'https://gumroad.com/l/your-sfx-pack-link' // Ganti dengan link pembayaran aktual Anda
        },
        {
            id: 'social-media-templates',
            title: 'Social Media Templates',
            category: 'Graphic Design',
            price: 'Rp 60.000',
            mediaType: 'image',
            mediaSrc: 'brand identity Design/stationery2_01.jpg',
            description: `Kumpulan template siap pakai untuk Instagram (Story & Feed), Facebook, dan platform media sosial lainnya. Tingkatkan estetika dan branding media sosial Anda dengan desain yang modern dan menarik. Mudah disesuaikan di Adobe Photoshop atau Canva (jika disediakan).
                          Sempurna untuk influencer, bisnis kecil, atau siapa saja yang ingin postingan media sosialnya terlihat profesional tanpa perlu keahlian desain mendalam.`,
            details: [
                { label: 'Format', value: '.psd, .ai, .jpeg' },
                { label: 'Jumlah Template', value: '30+' },
                { label: 'Kompatibilitas', value: 'Adobe Photoshop, Illustrator' }
            ],
            contents: [
                '30+ Template PSD/AI',
                'Font Link (Opsional)',
                'Panduan Penggunaan'
            ],
            paymentLink: 'https://gumroad.com/l/your-social-media-pack-link'
        },
        {
            id: 'video-transition-pack',
            title: 'Video Transition Pack',
            category: 'Video Editing',
            price: 'Rp 45.000',
            mediaType: 'image',
            mediaSrc: 'brand identity Design/stationery2_01.jpg',
            description: `Koleksi transisi video yang mulus dan dinamis untuk meningkatkan produksi Anda. Paket ini mencakup berbagai jenis transisi seperti glith, zoom, warp, dan rotasi. Mudah diterapkan di berbagai software editing.
                          Ciptakan alur video yang menarik dan profesional dengan cepat, menambahkan sentuhan sinematik pada setiap klip.`,
            details: [
                { label: 'Format', value: 'MOV, MP4' },
                { label: 'Kompatibilitas', value: 'Premiere Pro, DaVinci Resolve, FCPX' },
                { label: 'Jumlah Transisi', value: '50+' }
            ],
            contents: [
                '50+ File Transisi (MOV/MP4 dengan Alpha)',
                'Panduan Penggunaan'
            ],
            paymentLink: 'https://payhip.com/b/your-transition-pack-link'
        },
        {
            id: 'lightroom-presets-bundle',
            title: 'Lightroom Presets Bundle',
            category: 'Photography',
            price: 'Rp 80.000',
            mediaType: 'image',
            mediaSrc: 'brand identity Design/stationery2_01.jpg',
            description: `Kumpulan preset Lightroom profesional untuk fotografi. Berikan sentuhan akhir yang sempurna pada setiap foto Anda dengan preset yang dirancang secara artistik. Dari nuansa vintage hingga modern, dari potret hingga lanskap, paket ini mencakup semuanya.
                          Hemat waktu dalam proses editing Anda dan dapatkan tampilan yang konsisten untuk portofolio fotografi Anda.`,
            details: [
                { label: 'Format', value: '.lrtemplate, .xmp, .dng' },
                { label: 'Kompatibilitas', value: 'Lightroom Desktop & Mobile' },
                { label: 'Jumlah Presets', value: '40+' }
            ],
            contents: [
                '40+ Preset Lightroom (LRTEMPLATE, XMP, DNG)',
                'Instalasi & Panduan Penggunaan'
            ],
            paymentLink: 'https://gumroad.com/l/your-lightroom-pack-link'
        },
        {
            id: 'motion-graphics-elements',
            title: 'Motion Graphics Elements',
            category: 'Motion Graphics',
            price: 'Rp 95.000',
            mediaType: 'image',
            mediaSrc: 'brand identity Design/stationery2_01.jpg',
            description: `Paket elemen grafis bergerak siap pakai untuk proyek video Anda. Tambahkan sentuhan profesional dengan animasi teks, shape, overlay, dan latar belakang bergerak. Cocok untuk intro, outro, atau bagian tengah video Anda.
                          Desain yang dinamis dan mudah disesuaikan, menghemat waktu Anda dalam menciptakan animasi kompleks dari awal.`,
            details: [
                { label: 'Format', value: 'MOV (Alpha), AE Project' },
                { label: 'Jumlah Elemen', value: '80+' },
                { label: 'Kompatibilitas', value: 'After Effects, Premiere Pro' }
            ],
            contents: [
                '80+ Elemen Motion Graphics',
                'File Project After Effects (Opsional)',
                'Panduan Penggunaan'
            ],
            paymentLink: 'https://payhip.com/b/your-motion-gfx-pack-link'
        }
    ];

    // Logika untuk memuat detail pack editing di pack-detail.html
    function loadPackDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const packId = urlParams.get('id');

        const pack = editingPacksData.find(item => item.id === packId);

        const pageTitleElement = document.getElementById('page-title');
        const packTitleElement = document.getElementById('pack-title');
        const packCategoryPriceElement = document.getElementById('pack-category-price');
        const packMediaContainer = document.getElementById('pack-media-container');
        const packDescriptionElement = document.getElementById('pack-description');
        const packDetailsList = document.getElementById('pack-details-list');
        const packContentsList = document.getElementById('pack-contents-list');
        const buyPackButton = document.getElementById('buy-pack-button');


        if (!packId || !pack) {
            if (pageTitleElement) pageTitleElement.textContent = 'Pack Tidak Ditemukan';
            if (packTitleElement) packTitleElement.textContent = 'Pack Tidak Ditemukan';
            if (packCategoryPriceElement) packCategoryPriceElement.textContent = '';
            if (packMediaContainer) packMediaContainer.innerHTML = '<p class="text-red-500 text-center py-10">Maaf, detail pack ini tidak ditemukan. Silakan kembali ke <a href="editing-packs.html" class="text-accent hover:underline">daftar pack editing</a>.</p>';
            if (packDescriptionElement) packDescriptionElement.innerHTML = '';
            if (packDetailsList) packDetailsList.innerHTML = '';
            if (packContentsList) packContentsList.innerHTML = '';
            if (buyPackButton) buyPackButton.style.display = 'none';
            return;
        }

        // Isi konten berdasarkan data pack
        if (pageTitleElement) pageTitleElement.textContent = `Detail Pack - ${pack.title}`;
        if (packTitleElement) packTitleElement.textContent = pack.title;
        if (packCategoryPriceElement) packCategoryPriceElement.textContent = `${pack.category} | ${pack.price}`;

        if (packMediaContainer) {
            packMediaContainer.innerHTML = '';
            if (pack.mediaType === 'image') {
                const img = document.createElement('img');
                img.src = pack.mediaSrc;
                img.alt = pack.title;
                img.classList.add('w-full', 'h-auto', 'object-cover', 'rounded-lg');
                packMediaContainer.appendChild(img);
            }
            // Anda bisa tambahkan logika untuk 'video' atau 'youtube' di sini jika pack memiliki media tersebut
        }

        if (packDescriptionElement) {
            packDescriptionElement.innerHTML = pack.description.replace(/\n/g, '<br>');
        }

        if (packDetailsList) {
            packDetailsList.innerHTML = '';
            pack.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = `${detail.label}: ${detail.value}`;
                packDetailsList.appendChild(li);
            });
        }

        if (packContentsList && pack.contents) {
            packContentsList.innerHTML = '';
            pack.contents.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                packContentsList.appendChild(li);
            });
        }

        // Setel link pembayaran pada tombol "Beli Sekarang"
        if (buyPackButton && pack.paymentLink) {
            buyPackButton.href = pack.paymentLink;
            buyPackButton.target = '_blank'; // Buka di tab baru
        } else if (buyPackButton) {
            buyPackButton.style.display = 'none';
        }
    }

    // Panggil loadPackDetail() jika berada di halaman pack-detail.html
    if (window.location.pathname.includes('pack-detail.html')) {
        loadPackDetail();
    }

    // Logika untuk memuat detail karya di work-detail.html
    function loadWorkDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const workId = urlParams.get('id');

        const work = portfolioData.find(item => item.id === workId);

        const pageTitleElement = document.getElementById('page-title');
        const workTitleElement = document.getElementById('work-title');
        const workCategoryElement = document.getElementById('work-category');
        const workClientElement = document.getElementById('work-client');
        const workMediaContainer = document.getElementById('work-media-container');
        const workDescriptionElement = document.getElementById('work-description');
        const workSkillsList = document.getElementById('work-skills');
        const workDetailsList = document.getElementById('work-details');
        const backToPortfolioLink = document.getElementById('back-to-portfolio-link'); 

        if (!workId || !work) {
            if (pageTitleElement) pageTitleElement.textContent = 'Karya Tidak Ditemukan';
            if (workTitleElement) workTitleElement.textContent = 'Karya Tidak Ditemukan';
            if (workCategoryElement) workCategoryElement.textContent = '';
            if (workClientElement) workClientElement.textContent = '';
            if (workMediaContainer) workMediaContainer.innerHTML = '<p class="text-red-500 text-center py-10">Maaf, detail karya ini tidak ditemukan. Silakan kembali ke <a href="index.html#portfolio" class="text-accent hover:underline">portofolio utama</a>.</p>';
            if (workDescriptionElement) workDescriptionElement.innerHTML = '';
            if (workSkillsList) workSkillsList.innerHTML = '';
            if (workDetailsList) workDetailsList.innerHTML = '';
            if (backToPortfolioLink) backToPortfolioLink.href = 'index.html#portfolio';
            return;
        }

        if (pageTitleElement) pageTitleElement.textContent = `Detail Karya - ${work.title}`;
        if (workTitleElement) workTitleElement.textContent = work.title;
        if (workCategoryElement) workCategoryElement.textContent = work.category;
        if (workClientElement) workClientElement.textContent = work.client;

        if (workMediaContainer) {
            workMediaContainer.innerHTML = '';
            if (work.mediaType === 'image') {
                const img = document.createElement('img');
                img.src = work.mediaSrc;
                img.alt = work.title;
                img.classList.add('w-full', 'h-auto', 'object-cover');
                workMediaContainer.appendChild(img);
            } else if (work.mediaType === 'video-local') {
                const video = document.createElement('video');
                video.src = work.mediaSrc;
                video.controls = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.classList.add('w-full', 'h-auto', 'object-cover');
                workMediaContainer.appendChild(video);
            } else if (work.mediaType === 'youtube' && work.youtubeId) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${work.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${work.youtubeId}&controls=1`; // Perbaikan URL YouTube
                iframe.frameBorder = '0';
                iframe.allow = 'autoplay; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full');

                const iframeWrapper = document.createElement('div');
                iframeWrapper.classList.add('relative', 'pt-[56.25%]');
                iframeWrapper.appendChild(iframe);
                workMediaContainer.appendChild(iframeWrapper);
            }
        }

        if (workDescriptionElement) {
            workDescriptionElement.innerHTML = work.description.replace(/\n/g, '<br>');
        }

        if (workSkillsList) {
            workSkillsList.innerHTML = '';
            work.skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                workSkillsList.appendChild(li);
            });
        }

        if (workDetailsList) {
            workDetailsList.innerHTML = ''; // Pastikan ini workDetailsList, bukan detailsList
            work.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = `${detail.label}: ${detail.value}`;
                workDetailsList.appendChild(li); // Pastikan ini workDetailsList, bukan detailsList
            });
        }
        if (backToPortfolioLink) backToPortfolioLink.href = 'index.html#portfolio';
    }

    // Panggil loadWorkDetail() jika berada di halaman work-detail.html
    if (window.location.pathname.includes('work-detail.html')) {
        loadWorkDetail();
    }
});
//PEMBAYARAN BARU
// script.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (Kode Mobile Menu Toggle, Smooth Scrolling, Portfolio Tabs, Contact Form Submission, Custom Cursor yang sudah ada) ...

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"], a[href*=".html#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.href.startsWith('mailto:')) {
                return;
            }

            const fullHref = this.href;
            const url = new URL(fullHref);
            const path = url.pathname.split('/').pop();
            const hash = url.hash;

            const currentFileName = window.location.pathname.split('/').pop();

            if (hash && !path) {
                e.preventDefault();
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                document.querySelector(hash).scrollIntoView({
                    behavior: 'smooth'
                });
            } else if (hash && path) {
                e.preventDefault();
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
                if (currentFileName === path) {
                    const targetElement = document.querySelector(hash);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                } else {
                    window.location.href = fullHref;
                }
            } else if (!hash && path && path !== currentFileName) {
                // Biarkan browser melakukan navigasi default
            }
        });
    });

    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }, 100); 
    }

    // Portfolio Tabs (Filter for index.html)
    const portfolioTabs = document.querySelectorAll('.portfolio-tab');
    if (portfolioTabs.length > 0 && document.querySelectorAll('.portfolio-item').length > 0) {
        portfolioTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                portfolioTabs.forEach(t => t.classList.remove('active-tab'));
                tab.classList.add('active-tab');
                const filterCategory = tab.getAttribute('data-category');
                document.querySelectorAll('.portfolio-item').forEach(item => {
                    if (filterCategory === 'all' || item.getAttribute('data-category') === filterCategory) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => { data[key] = value; });
            const formspreeUrl = "https://formspree.io/f/xeokgqyw";
            const existingMessage = this.querySelector('.form-message');
            if (existingMessage) { existingMessage.remove(); }
            try {
                const response = await fetch(formspreeUrl, {
                    method: 'POST',
                    body: JSON.stringify(data),
                    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
                });
                const messageElement = document.createElement('p');
                messageElement.className = 'form-message font-semibold mt-4 text-center';
                if (response.ok) {
                    messageElement.classList.add('text-green-500');
                    messageElement.textContent = 'Pesan Anda telah terkirim! Terima kasih.';
                    this.reset();
                } else {
                    const errorData = await response.json();
                    messageElement.classList.add('text-red-500');
                    messageElement.textContent = 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.';
                    console.error('Formspree Error:', errorData);
                    if (errorData.errors && errorData.errors.length > 0) {
                        errorData.errors.forEach(error => { console.error(`Formspree Field Error - ${error.field}: ${error.message}`); });
                    }
                }
                this.appendChild(messageElement);
            } catch (error) {
                const messageElement = document.createElement('p');
                messageElement.className = 'form-message text-red-500 font-semibold mt-4 text-center';
                messageElement.textContent = 'Terjadi kesalahan jaringan. Pastikan Anda terhubung ke internet dan coba lagi.';
                this.appendChild(messageElement);
                console.error('Network Error:', error);
            }
        });
    }

    // Custom Cursor (desktop only)
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    function handleMouseMove(e) {
        if (!cursorDot || !cursorOutline) return;
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.style.left = `${posX}px`;
        cursorOutline.style.top = `${posY}px`;
        cursorOutline.style.transform = `translate(-50%, -50%) scale(${1})`;
        if (e.target.closest('a, button, .portfolio-item, .product-card, .payment-option')) {
            cursorOutline.style.transform = `translate(-50%, -50%) scale(${1.5})`;
            cursorOutline.style.borderColor = '#E78E2F'; // accent color
        } else {
            cursorOutline.style.borderColor = '#F01414'; // secondary color (default)
        }
    }
    function setupCustomCursor() {
        const isDesktop = window.innerWidth >= 768;
        if (cursorDot && cursorOutline) {
            if (isDesktop) {
                cursorDot.style.display = 'block';
                cursorOutline.style.display = 'block';
                document.body.style.cursor = 'none';
                window.removeEventListener('mousemove', handleMouseMove); 
                window.addEventListener('mousemove', handleMouseMove);
            } else {
                cursorDot.style.display = 'none';
                cursorOutline.style.display = 'none';
                document.body.style.cursor = 'default';
                window.removeEventListener('mousemove', handleMouseMove);
            }
        }
    }
    setupCustomCursor();
    window.addEventListener('resize', setupCustomCursor);

    // Active Section Highlight (for scroll navigation)
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a, #mobile-menu a');
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', function() {
            let currentSection = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100; 
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop && pageYOffset < (sectionTop + sectionHeight)) {
                    currentSection = section.getAttribute('id');
                }
            });
            const currentFileName = window.location.pathname.split('/').pop();
            navLinks.forEach(link => {
                link.classList.remove('text-accent');
                link.classList.add('text-neutral'); 
                const href = link.getAttribute('href');
                const linkFileName = href.split('/').pop().split('#')[0];
                const linkHash = href.includes('#') ? href.split('#')[1] : null;

                if (linkFileName === currentFileName) {
                    if (linkHash && linkHash === currentSection) {
                        link.classList.remove('text-neutral');
                        link.classList.add('text-accent');
                    } else if (!linkHash && currentFileName === 'index.html' && currentSection === 'home') {
                        link.classList.remove('text-neutral');
                        link.classList.add('text-accent');
                    } else if (!linkHash && linkFileName === currentFileName && currentFileName !== 'index.html') {
                         link.classList.remove('text-neutral');
                         link.classList.add('text-accent');
                    }
                }
            });
        });
    }

    // Data Portofolio for Work Detail Page (work-detail.html)
    const portfolioData = [
        // ... (data portfolio Anda yang sudah ada) ...
        {
            id: 'video-campaign',
            title: 'Video Campaign Brand',
            category: 'Video Editing',
            client: 'ABC Studio',
            mediaType: 'video-local',
            mediaSrc: 'assets/video-sample-1.mp4',
            description: `Deskripsi mendalam tentang proyek Video Campaign Brand. 
                          Pada proyek ini, kami berfokus pada pembuatan kampanye video yang dinamis 
                          untuk meningkatkan visibilitas merek klien. Tantangan utamanya adalah 
                          menggabungkan pesan kompleks menjadi narasi visual yang mudah dicerna dan menarik. 
                          Proses kreatif melibatkan brainstorming konsep, penulisan skrip, syuting (jika ada), 
                          dan post-produksi yang intensif.

                          Kami menggunakan teknik color grading sinematik untuk memberikan nuansa visual 
                          yang kaya dan profesional. Editing yang cepat dan transisi yang halus 
                          digunakan untuk menjaga tempo video tetap energik. Sound design yang imersif 
                          juga ditambahkan untuk memperkuat emosi dan pesan.

                          Hasil akhirnya adalah serangkaian video kampanye yang berhasil menarik perhatian 
                          audiens target dan meningkatkan interaksi di berbagai platform digital. 
                          Klien melaporkan peningkatan engagement sebesar 25% setelah peluncuran kampanye ini.`,
            skills: ['Video Editing (Cut, Transisi, VFX)', 'Color Grading', 'Sound Design', 'Motion Graphics'],
            details: [
                { label: 'Tanggal Selesai', value: '12 Mei 2024' },
                { label: 'Durasi', value: '1:30 menit' },
                { label: 'Platform', value: 'YouTube, Instagram' }
            ]
        },
        {
            id: 'brand-identity',
            title: 'Brand Identity Design',
            category: 'Graphic Design',
            client: 'XYZ Solutions',
            mediaType: 'image',
            mediaSrc: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
            description: `Proyek ini melibatkan pengembangan identitas merek yang komprehensif untuk XYZ Solutions, sebuah startup teknologi. 
                          Tujuannya adalah menciptakan citra merek yang modern, inovatif, dan mudah dikenali. 
                          Prosesnya dimulai dengan riset pasar dan analisis kompetitor untuk memahami lanskap industri. 
                          Kami kemudian mengembangkan beberapa konsep logo, skema warna, dan tipografi yang berbeda.

                          Fokus utama adalah pada desain logo yang minimalis namun berkesan, serta panduan merek yang fleksibel 
                          untuk berbagai aplikasi (digital dan cetak). Kami juga membuat mock-up aplikasi digital 
                          dan stationery untuk memberikan gambaran visual yang jelas.

                          Hasilnya adalah identitas merek yang kuat dan kohesif, yang membantu XYZ Solutions menonjol di pasar 
                          dan menarik perhatian investor serta pelanggan awal. Desain ini dinilai berhasil 
                          merepresentasikan nilai-nilai inti perusahaan.`,
            skills: ['Desain Logo', 'Branding Guideline', 'Tipografi', 'Desain UI/UX (Dasar)'],
            details: [
                { label: 'Tanggal Selesai', value: '20 Maret 2024' },
                { label: 'Deliverables', value: 'Logo, Brand Guideline, Stationery' },
                { label: 'Tools', value: 'Adobe Illustrator, Photoshop' }
            ]
        },
        {
            id: 'landscape-photo',
            title: 'Landscape Photography Series',
            category: 'Photography',
            client: 'Personal Project',
            mediaType: 'image',
            mediaSrc: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1574&q=80',
            description: `Seri fotografi lanskap ini menangkap keindahan alam yang menakjubkan dari berbagai lokasi. 
                          Setiap gambar dipilih untuk menonjolkan komposisi, cahaya, dan suasana unik dari lanskap tersebut. 
                          Tujuan proyek ini adalah untuk mengeksplorasi teknik fotografi alam dan post-processing 
                          untuk menghasilkan gambar yang artistik dan inspiratif.

                          Prosesnya melibatkan perjalanan ke lokasi terpencil, pemilihan waktu yang tepat untuk pencahayaan 
                          (golden hour, blue hour), dan penggunaan filter kamera untuk efek tertentu. 
                          Post-processing dilakukan di Adobe Lightroom untuk penyempurnaan warna, kontras, dan detail.

                          Seri ini telah dipamerkan dalam beberapa galeri lokal dan mendapatkan apresiasi atas 
                          kemampuannya membangkitkan rasa kagum terhadap alam.`,
            skills: ['Fotografi Lanskap', 'Komposisi Fotografi', 'Post-Processing (Lightroom)', 'Color Grading Foto'],
            details: [
                { label: 'Tanggal Selesai', value: '10 Februari 2024' },
                { label: 'Jumlah Foto', value: '15 Foto Pilihan' },
                { label: 'Lokasi', value: 'Berbagai Destinasi Alam' }
            ]
        },
        {
            id: 'short-film',
            title: 'Short Film Production',
            category: 'Videography',
            client: 'Indie Filmmakers Collective',
            mediaType: 'youtube',
            youtubeId: 'VIDEO_ID_YOUTUBE_5',
            description: `Produksi film pendek independen yang menceritakan kisah tentang [sebutkan tema atau genre]. 
                          Sebagai videographer utama, peran saya meliputi sinematografi, pengaturan pencahayaan, 
                          dan pengambilan gambar. Tujuan dari film ini adalah untuk mengeksplorasi narasi 
                          melalui visual yang kuat dan atmosfer yang mendalam.

                          Proses produksi melibatkan kolaborasi erat dengan sutradara dan tim produksi 
                          sejak tahap pra-produksi hingga pengambilan gambar. Kami bereksperimen dengan berbagai 
                          sudut kamera dan teknik pergerakan untuk menciptakan dampak emosional yang maksimal.

                          Film pendek ini telah diterima di beberapa festival film independen dan 
                          mendapatkan pujian atas kualitas visualnya yang sinematik.`,
            skills: ['Sinematografi', 'Pengambilan Gambar', 'Pencahayaan Video', 'Arahan Visual'],
            details: [
                { label: 'Tanggal Selesai', value: '01 Januari 2024' },
                { label: 'Durasi', value: '8:45 menit' },
                { label: 'Festival', value: 'Festival Film Indie 2024' }
            ]
        },
        {
            id: 'corporate-video',
            title: 'Corporate Profile Video',
            category: 'Video Editing',
            client: 'Global Corp',
            mediaType: 'video-local',
            mediaSrc: 'assets/video-sample-2.mp4',
            description: `Video profil perusahaan untuk Global Corp, menyoroti nilai-nilai dan pencapaian mereka.
                          Proyek ini melibatkan penggambaran esensi dan visi perusahaan melalui narasi visual yang kuat.
                          Kami bekerja sama dengan tim klien untuk memahami pesan inti dan audiens target,
                          kemudian menerjemahkannya ke dalam produksi video yang profesional dan menarik.`,
            skills: ['Video Editing', 'Narasi', 'Motion Graphics', 'Color Grading'],
            details: [
                {label: 'Durasi', value: '3:00 menit'},
                {label: 'Tujuan', value: 'Branding Perusahaan, Pemasaran B2B'},
                {label: 'Distribusi', value: 'Situs Web Perusahaan, Konferensi'}
            ]
        },
        {
            id: 'ui-design',
            title: 'Digital Product UI Design',
            category: 'Graphic Design',
            client: 'Startup Innovate',
            mediaType: 'image',
            mediaSrc: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            description: `Desain antarmuka pengguna (UI) untuk aplikasi mobile inovatif yang berfokus pada kemudahan penggunaan (UX) dan estetika modern.
                          Kami melakukan riset pengguna, membuat wireframe, dan mengembangkan prototipe interaktif.
                          Tujuan utamanya adalah menciptakan pengalaman yang intuitif dan menyenangkan bagi pengguna.
                          Desain ini juga memastikan konsistensi visual di seluruh platform.`,
            skills: ['UI Design', 'UX Research', 'Wireframing', 'Prototyping', 'User Testing'],
            details: [
                {label: 'Tools', value: 'Figma, Adobe XD'},
                {label: 'Platform', value: 'Mobile (iOS & Android)'},
                {label: 'Status', value: 'Prototype Selesai'}
            ]
        },
        {
            id: 'model-portrait',
            title: 'Potret Model Profesional',
            category: 'Photography',
            client: 'Agency Model Jakarta',
            mediaType: 'image',
            mediaSrc: 'https://images.unsplash.com/photo-1503435980610-a60293d28a55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
            description: `Sesi pemotretan potret model profesional untuk keperluan portfolio agensi.
                          Kami berfokus pada penangkapan ekspresi dan pose yang kuat,
                          serta bermain dengan pencahayaan studio untuk menciptakan suasana yang dramatis.
                          Post-processing dilakukan untuk menyempurnakan warna kulit dan detail.`,
            skills: ['Fotografi Potret', 'Pencahayaan Studio', 'Komposisi', 'Retouching Foto'],
            details: [
                {label: 'Tanggal', value: '15 Maret 2024'},
                {label: 'Lokasi', value: 'Studio Jakarta'},
                {label: 'Tujuan', value: 'Portfolio Model'}
            ]
        },
        {
            id: 'indie-music-video',
            title: 'Video Musik Indie Pop',
            category: 'Videography',
            client: 'Band "Senja Akustik"',
            mediaType: 'youtube',
            youtubeId: 'ANOTHER_YOUTUBE_VIDEO_ID_HERE',
            description: `Produksi video musik untuk band indie pop lokal.
                          Kami bertujuan untuk menciptakan visual yang sesuai dengan nuansa lagu yang melankolis dan ringan.
                          Pengambilan gambar dilakukan di berbagai lokasi outdoor dan indoor yang estetik.
                          Fokus pada sinematografi yang menangkap emosi lirik lagu.`,
            skills: ['Videografi', 'Pengambilan Gambar', 'Pencahayaan Alami', 'Editing Ritmik'],
            details: [
                {label: 'Durasi', value: '4:15 menit'},
                {label: 'Tanggal Rilis', value: '05 April 2024'},
                {label: 'Sutradara', value: '[Nama Sutradara Jika Ada]'}
            ]
        },
        {
            id: 'tutorial-video',
            title: 'Video Tutorial Interaktif',
            category: 'Video Editing',
            client: 'E-Learning Platform',
            mediaType: 'video-local',
            mediaSrc: 'assets/video-sample-3.mp4',
            description: `Pembuatan video tutorial interaktif untuk platform e-learning.
                          Video ini dirancang untuk menjelaskan konsep kompleks secara sederhana dan menarik.
                          Kami menggunakan kombinasi rekaman layar, animasi motion graphics, dan narasi yang jelas.
                          Tujuannya adalah memaksimalkan retensi informasi dan keterlibatan peserta didik.`,
            skills: ['Video Editing', 'Motion Graphics', 'Screen Recording', 'Educational Design'],
            details: [
                {label: 'Format', value: 'MP4 HD'},
                {label: 'Modul', value: 'Dasar-Dasar Coding'},
                {label: 'Target', value: 'Pemula'}
            ]
        },
        {
            id: 'app-mockup',
            title: 'Mockup Desain Aplikasi',
            category: 'Graphic Design',
            client: 'Innovate Solutions',
            mediaType: 'image',
            mediaSrc: 'assets/portfolio-item-10.jpg',
            description: `Desain mockup aplikasi mobile untuk platform manajemen proyek.
                          Fokus pada antarmuka yang bersih, intuitif, dan fungsional.
                          Kami menciptakan wireframe hingga prototipe visual yang siap dikembangkan.
                          Tujuan utamanya adalah meningkatkan produktivitas pengguna.`,
            skills: ['UI Design', 'Mockup', 'Prototyping', 'Graphic Design'],
            details: [
                {label: 'Status', value: 'Selesai'},
                {label: 'Tools', value: 'Figma'},
                {label: 'Tujuan', value: 'Presentasi Konsep'}
            ]
        },
    ];

    // Data untuk Pack Editing
    const editingPacksData = [
        {
            id: 'video-luts-pack-v1',
            title: 'Video LUTs Pack Vol. 1',
            category: 'Color Grading',
            price: 'Rp 50.000',
            mediaType: 'image',
            mediaSrc: 'image/luts-pack-thumbnail.jpg',
            description: `Koleksi LUTs sinematik premium yang dirancang untuk memberikan tampilan profesional pada video Anda. Paket ini mencakup berbagai gaya, dari nuansa hangat dan dramatis hingga warna-warna cerah dan modern. Kompatibel dengan perangkat lunak editing video populer seperti Adobe Premiere Pro, DaVinci Resolve, Final Cut Pro, dan lainnya.
                          Tingkatkan kualitas visual proyek Anda dengan cepat dan mudah, baik untuk film pendek, vlog, atau video promosi.`,
            details: [
                { label: 'Format', value: '.cube, .3dl' },
                { label: 'Kompatibilitas', value: 'Premiere Pro, DaVinci Resolve, FCPX, Photoshop, dll.' },
                { label: 'Jumlah LUTs', value: '25' }
            ],
            contents: [
                '25 File LUTs (.cube, .3dl)',
                'Panduan Penggunaan (PDF)',
                'File Contoh (Opsional)'
            ],
            paymentLink: 'https://payhip.com/b/your-luts-pack-link', // Ini bisa jadi link QRIS statis atau Payment Gateway QRIS
            qrisCode: 'image/qris-luts-pack-v1.png', // Ganti dengan gambar QRIS spesifik untuk produk ini
            accountDetails: { // Detail transfer bank spesifik untuk produk ini (jika tidak pakai payment gateway)
                bca: { number: '1234567890', name: 'Vingki Media - LUTs Pack', bank: 'BCA' },
                mandiri: { number: '0987654321', name: 'Vingki Media - LUTs Pack', bank: 'Mandiri' }
            }
        },
        {
            id: 'sound-effects-library',
            title: 'Sound Effects Library',
            category: 'Audio',
            price: 'Rp 75.000',
            mediaType: 'image',
            mediaSrc: 'image/sfx-pack-thumbnail.jpg',
            description: `Ratusan efek suara berkualitas tinggi untuk film, video, game, dan produksi audio Anda. Perpustakaan ini mencakup berbagai kategori suara seperti foley (langkah kaki, pintu), transisi (swoosh, whoosh), atmosfer (alam, kota), dan elemen UI (klik, pop).
                          Dirancang untuk membantu Anda menciptakan lanskap suara yang imersif dan profesional. Semua file dalam format WAV atau MP3.`,
            details: [
                { label: 'Format', value: '.wav, .mp3' },
                { label: 'Jumlah SFX', value: '500+' },
                { label: 'Ukuran File', value: 'Sekitar 2 GB' }
            ],
            contents: [
                '500+ File Efek Suara (WAV/MP3)',
                'File Metadata (Opsional)'
            ],
            paymentLink: 'https://gumroad.com/l/your-sfx-pack-link',
            qrisCode: 'image/qris-sfx-library.png', // Ganti dengan gambar QRIS spesifik untuk produk ini
            accountDetails: {
                bca: { number: '1234567890', name: 'Vingki Media - SFX Library', bank: 'BCA' },
                mandiri: { number: '0987654321', name: 'Vingki Media - SFX Library', bank: 'Mandiri' }
            }
        },
        {
            id: 'social-media-templates',
            title: 'Social Media Templates',
            category: 'Graphic Design',
            price: 'Rp 60.000',
            mediaType: 'image',
            mediaSrc: 'image/social-template-thumbnail.jpg',
            description: `Kumpulan template siap pakai untuk Instagram (Story & Feed), Facebook, dan platform media sosial lainnya. Tingkatkan estetika dan branding media sosial Anda dengan desain yang modern dan menarik. Mudah disesuaikan di Adobe Photoshop atau Canva (jika disediakan).
                          Sempurna untuk influencer, bisnis kecil, atau siapa saja yang ingin postingan media sosialnya terlihat profesional tanpa perlu keahlian desain mendalam.`,
            details: [
                { label: 'Format', value: '.psd, .ai, .jpeg' },
                { label: 'Jumlah Template', value: '30+' },
                { label: 'Kompatibilitas', value: 'Adobe Photoshop, Illustrator' }
            ],
            contents: [
                '30+ Template PSD/AI',
                'Font Link (Opsional)',
                'Panduan Penggunaan'
            ],
            paymentLink: 'https://gumroad.com/l/your-social-media-pack-link',
            qrisCode: 'image/qris-social-media-templates.png',
            accountDetails: {
                bca: { number: '1234567890', name: 'Vingki Media - Social Media', bank: 'BCA' },
                mandiri: { number: '0987654321', name: 'Vingki Media - Social Media', bank: 'Mandiri' }
            }
        },
        {
            id: 'video-transition-pack',
            title: 'Video Transition Pack',
            category: 'Video Editing',
            price: 'Rp 45.000',
            mediaType: 'image',
            mediaSrc: 'image/transition-pack-thumbnail.jpg',
            description: `Koleksi transisi video yang mulus dan dinamis untuk meningkatkan produksi Anda. Paket ini mencakup berbagai jenis transisi seperti glith, zoom, warp, dan rotasi. Mudah diterapkan di berbagai software editing.
                          Ciptakan alur video yang menarik dan profesional dengan cepat, menambahkan sentuhan sinematik pada setiap klip.`,
            details: [
                { label: 'Format', value: 'MOV, MP4' },
                { label: 'Kompatibilitas', value: 'Premiere Pro, DaVinci Resolve, FCPX' },
                { label: 'Jumlah Transisi', value: '50+' }
            ],
            contents: [
                '50+ File Transisi (MOV/MP4 dengan Alpha)',
                'Panduan Penggunaan'
            ],
            paymentLink: 'https://payhip.com/b/your-transition-pack-link',
            qrisCode: 'image/qris-video-transition-pack.png',
            accountDetails: {
                bca: { number: '1234567890', name: 'Vingki Media - Transition Pack', bank: 'BCA' },
                mandiri: { number: '0987654321', name: 'Vingki Media - Transition Pack', bank: 'Mandiri' }
            }
        },
        {
            id: 'lightroom-presets-bundle',
            title: 'Lightroom Presets Bundle',
            category: 'Photography',
            price: 'Rp 80.000',
            mediaType: 'image',
            mediaSrc: 'image/lightroom-thumbnail.jpg',
            description: `Kumpulan preset Lightroom profesional untuk fotografi. Berikan sentuhan akhir yang sempurna pada setiap foto Anda dengan preset yang dirancang secara artistik. Dari nuansa vintage hingga modern, dari potret hingga lanskap, paket ini mencakup semuanya.
                          Hemat waktu dalam proses editing Anda dan dapatkan tampilan yang konsisten untuk portofolio fotografi Anda.`,
            details: [
                { label: 'Format', value: '.lrtemplate, .xmp, .dng' },
                { label: 'Kompatibilitas', value: 'Lightroom Desktop & Mobile' },
                { label: 'Jumlah Presets', value: '40+' }
            ],
            contents: [
                '40+ Preset Lightroom (LRTEMPLATE, XMP, DNG)',
                'Instalasi & Panduan Penggunaan'
            ],
            paymentLink: 'https://gumroad.com/l/your-lightroom-pack-link',
            qrisCode: 'image/qris-lightroom-presets-bundle.png',
            accountDetails: {
                bca: { number: '1234567890', name: 'Vingki Media - Lightroom Presets', bank: 'BCA' },
                mandiri: { number: '0987654321', name: 'Vingki Media - Lightroom Presets', bank: 'Mandiri' }
            }
        },
        {
            id: 'motion-graphics-elements',
            title: 'Motion Graphics Elements',
            category: 'Motion Graphics',
            price: 'Rp 95.000',
            mediaType: 'image',
            mediaSrc: 'image/motion-gfx-thumbnail.jpg',
            description: `Paket elemen grafis bergerak siap pakai untuk proyek video Anda. Tambahkan sentuhan profesional dengan animasi teks, shape, overlay, dan latar belakang bergerak. Cocok untuk intro, outro, atau bagian tengah video Anda.
                          Desain yang dinamis dan mudah disesuaikan, menghemat waktu Anda dalam menciptakan animasi kompleks dari awal.`,
            details: [
                { label: 'Format', value: 'MOV (Alpha), AE Project' },
                { label: 'Jumlah Elemen', value: '80+' },
                { label: 'Kompatibilitas', value: 'After Effects, Premiere Pro' }
            ],
            contents: [
                '80+ Elemen Motion Graphics',
                'File Project After Effects (Opsional)',
                'Panduan Penggunaan'
            ],
            paymentLink: 'https://payhip.com/b/your-motion-gfx-pack-link',
            qrisCode: 'image/qris-motion-graphics-elements.png',
            accountDetails: {
                bca: { number: '1234567890', name: 'Vingki Media - Motion Graphics', bank: 'BCA' },
                mandiri: { number: '0987654321', name: 'Vingki Media - Motion Graphics', bank: 'Mandiri' }
            }
        }
    ];

    // Logika untuk memuat detail pack editing di pack-detail.html
    function loadPackDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const packId = urlParams.get('id');

        const pack = editingPacksData.find(item => item.id === packId);

        const pageTitleElement = document.getElementById('page-title');
        const packTitleElement = document.getElementById('pack-title');
        const packCategoryPriceElement = document.getElementById('pack-category-price');
        const packMediaContainer = document.getElementById('pack-media-container');
        const packDescriptionElement = document.getElementById('pack-description');
        const packDetailsList = document.getElementById('pack-details-list');
        const packContentsList = document.getElementById('pack-contents-list');
        const buyPackButton = document.getElementById('buy-pack-button');


        if (!packId || !pack) {
            if (pageTitleElement) pageTitleElement.textContent = 'Pack Tidak Ditemukan';
            if (packTitleElement) packTitleElement.textContent = 'Pack Tidak Ditemukan';
            if (packCategoryPriceElement) packCategoryPriceElement.textContent = '';
            if (packMediaContainer) packMediaContainer.innerHTML = '<p class="text-red-500 text-center py-10">Maaf, detail pack ini tidak ditemukan. Silakan kembali ke <a href="editing-packs.html" class="text-accent hover:underline">daftar pack editing</a>.</p>';
            if (packDescriptionElement) packDescriptionElement.innerHTML = '';
            if (packDetailsList) packDetailsList.innerHTML = '';
            if (packContentsList) packContentsList.innerHTML = '';
            if (buyPackButton) buyPackButton.style.display = 'none';
            return;
        }

        if (pageTitleElement) pageTitleElement.textContent = `Detail Pack - ${pack.title}`;
        if (packTitleElement) packTitleElement.textContent = pack.title;
        if (packCategoryPriceElement) packCategoryPriceElement.textContent = `${pack.category} | ${pack.price}`;

        if (packMediaContainer) {
            packMediaContainer.innerHTML = '';
            if (pack.mediaType === 'image') {
                const img = document.createElement('img');
                img.src = pack.mediaSrc;
                img.alt = pack.title;
                img.classList.add('w-full', 'h-auto', 'object-cover', 'rounded-lg');
                packMediaContainer.appendChild(img);
            }
        }

        if (packDescriptionElement) {
            packDescriptionElement.innerHTML = pack.description.replace(/\n/g, '<br>');
        }

        if (packDetailsList) {
            packDetailsList.innerHTML = '';
            pack.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = `${detail.label}: ${detail.value}`;
                packDetailsList.appendChild(li);
            });
        }

        if (packContentsList && pack.contents) {
            packContentsList.innerHTML = '';
            pack.contents.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                packContentsList.appendChild(li);
            });
        }

        // Modifikasi: Arahkan ke checkout.html dengan ID produk
        if (buyPackButton) {
            buyPackButton.href = `checkout.html?id=${pack.id}`; 
        } else {
            buyPackButton.style.display = 'none';
        }
    }

    // Panggil loadPackDetail() jika berada di halaman pack-detail.html
    if (window.location.pathname.includes('pack-detail.html')) {
        loadPackDetail();
    }

    // Logika untuk memuat detail produk di checkout.html
    function loadCheckoutPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const packId = urlParams.get('id');

        const pack = editingPacksData.find(item => item.id === packId);

        const pageTitleElement = document.getElementById('page-title');
        const productTitleElement = document.getElementById('product-title');
        const productPriceElement = document.getElementById('product-price');
        const productCategoryElement = document.getElementById('product-category');
        const totalPaymentElement = document.getElementById('total-payment');

        const paymentInstructionsDiv = document.getElementById('payment-instructions'); // BARU
        const instructionTitleElement = document.getElementById('instruction-title'); // BARU
        const instructionContentDiv = document.getElementById('instruction-content'); // BARU
        const closeInstructionsButton = document.getElementById('close-instructions'); // BARU

        if (!packId || !pack) {
            if (pageTitleElement) pageTitleElement.textContent = 'Pembayaran - Produk Tidak Ditemukan';
            if (productTitleElement) productTitleElement.textContent = 'Produk Tidak Ditemukan';
            if (productPriceElement) productPriceElement.textContent = 'Rp 0';
            if (productCategoryElement) productCategoryElement.textContent = '';
            if (totalPaymentElement) totalPaymentElement.textContent = 'Rp 0';
            if (paymentInstructionsDiv) paymentInstructionsDiv.classList.add('hidden'); // Sembunyikan instruksi jika error
            return;
        }

        if (pageTitleElement) pageTitleElement.textContent = `Pembayaran - ${pack.title}`;
        if (productTitleElement) productTitleElement.textContent = pack.title;
        if (productPriceElement) productPriceElement.textContent = pack.price;
        if (productCategoryElement) productCategoryElement.textContent = `Kategori: ${pack.category}`;
        if (totalPaymentElement) totalPaymentElement.textContent = pack.price;

        // Event listener untuk opsi pembayaran
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', () => {
                const method = option.getAttribute('data-method');
                instructionContentDiv.innerHTML = ''; // Bersihkan konten sebelumnya
                instructionTitleElement.textContent = 'Instruksi Pembayaran'; // Reset judul

                if (paymentInstructionsDiv) paymentInstructionsDiv.classList.remove('hidden'); // Tampilkan div instruksi

                switch (method) {
                    case 'qris':
                        instructionTitleElement.textContent = 'Bayar dengan QRIS';
                        if (pack.qrisCode) {
                            instructionContentDiv.innerHTML = `
                                <p class="text-gray-300 mb-4">Pindai QRIS ini menggunakan aplikasi pembayaran Anda (DANA, OVO, GoPay, Mobile Banking, dll.):</p>
                                <img src="${pack.qrisCode}" alt="QRIS Code for ${pack.title}" class="w-full max-w-xs mx-auto rounded-lg mb-4 border border-gray-600 p-2 bg-white">
                                <p class="text-white text-lg font-bold mb-2">${pack.price}</p>
                                <p class="text-gray-300 text-sm">Pastikan nominal yang Anda masukkan sesuai.</p>
                                <p class="text-accent text-sm mt-4">Setelah pembayaran berhasil, mohon konfirmasi ke kontak kami (melalui WhatsApp/Email) dengan bukti transfer untuk pengiriman aset.</p>
                                <p class="text-gray-400 text-sm mt-2">Kontak: +62 877 2698 1031 (WhatsApp) atau creativemedia@gmail.com</p>
                            `;
                        } else {
                            instructionContentDiv.innerHTML = `<p class="text-red-400">Maaf, QRIS untuk produk ini belum tersedia.</p>`;
                        }
                        break;
                    case 'dana':
                        instructionTitleElement.textContent = 'Bayar dengan DANA';
                        instructionContentDiv.innerHTML = `
                            <p class="text-gray-300 mb-4">Transfer ke nomor DANA kami:</p>
                            <p class="text-white text-lg font-bold">087726981031</p>
                            <p class="text-gray-300 text-sm mb-4">(Atas nama Vingki Media)</p>
                            <p class="text-white text-lg font-bold mb-2">Jumlah: ${pack.price}</p>
                            <p class="text-accent text-sm mt-4">Setelah pembayaran berhasil, mohon konfirmasi ke kontak kami (melalui WhatsApp/Email) dengan bukti transfer untuk pengiriman aset.</p>
                            <p class="text-gray-400 text-sm mt-2">Kontak: +62 877 2698 1031 (WhatsApp) atau creativemedia@gmail.com</p>
                        `;
                        break;
                    case 'ovo':
                        instructionTitleElement.textContent = 'Bayar dengan OVO';
                        instructionContentDiv.innerHTML = `
                            <p class="text-gray-300 mb-4">Transfer ke nomor OVO kami:</p>
                            <p class="text-white text-lg font-bold">087726981031</p>
                            <p class="text-gray-300 text-sm mb-4">(Atas nama Vingki Media)</p>
                            <p class="text-white text-lg font-bold mb-2">Jumlah: ${pack.price}</p>
                            <p class="text-accent text-sm mt-4">Setelah pembayaran berhasil, mohon konfirmasi ke kontak kami (melalui WhatsApp/Email) dengan bukti transfer untuk pengiriman aset.</p>
                            <p class="text-gray-400 text-sm mt-2">Kontak: +62 877 2698 1031 (WhatsApp) atau creativemedia@gmail.com</p>
                        `;
                        break;
                    case 'bca':
                        instructionTitleElement.textContent = 'Bayar dengan Transfer Bank BCA';
                        if (pack.accountDetails && pack.accountDetails.bca) {
                            instructionContentDiv.innerHTML = `
                                <p class="text-gray-300 mb-4">Transfer ke rekening BCA kami:</p>
                                <p class="text-white text-lg font-bold">Nomor Rekening: ${pack.accountDetails.bca.number}</p>
                                <p class="text-white text-lg font-bold mb-4">Atas Nama: ${pack.accountDetails.bca.name}</p>
                                <p class="text-white text-lg font-bold mb-2">Jumlah: ${pack.price}</p>
                                <p class="text-accent text-sm mt-4">Setelah pembayaran berhasil, mohon konfirmasi ke kontak kami (melalui WhatsApp/Email) dengan bukti transfer untuk pengiriman aset.</p>
                                <p class="text-gray-400 text-sm mt-2">Kontak: +62 877 2698 1031 (WhatsApp) atau creativemedia@gmail.com</p>
                            `;
                        } else {
                            instructionContentDiv.innerHTML = `<p class="text-red-400">Detail rekening BCA belum tersedia untuk produk ini.</p>`;
                        }
                        break;
                    case 'mandiri':
                        instructionTitleElement.textContent = 'Bayar dengan Transfer Bank Mandiri';
                        if (pack.accountDetails && pack.accountDetails.mandiri) {
                            instructionContentDiv.innerHTML = `
                                <p class="text-gray-300 mb-4">Transfer ke rekening Mandiri kami:</p>
                                <p class="text-white text-lg font-bold">Nomor Rekening: ${pack.accountDetails.mandiri.number}</p>
                                <p class="text-white text-lg font-bold mb-4">Atas Nama: ${pack.accountDetails.mandiri.name}</p>
                                <p class="text-white text-lg font-bold mb-2">Jumlah: ${pack.price}</p>
                                <p class="text-accent text-sm mt-4">Setelah pembayaran berhasil, mohon konfirmasi ke kontak kami (melalui WhatsApp/Email) dengan bukti transfer untuk pengiriman aset.</p>
                                <p class="text-gray-400 text-sm mt-2">Kontak: +62 877 2698 1031 (WhatsApp) atau creativemedia@gmail.com</p>
                            `;
                        } else {
                            instructionContentDiv.innerHTML = `<p class="text-red-400">Detail rekening Mandiri belum tersedia untuk produk ini.</p>`;
                        }
                        break;
                    case 'credit-card':
                        instructionTitleElement.textContent = 'Bayar dengan Kartu Kredit/Debit';
                        instructionContentDiv.innerHTML = `
                            <p class="text-gray-300 mb-4">Anda akan diarahkan ke portal pembayaran aman pihak ketiga untuk memproses pembayaran kartu kredit/debit.</p>
                            <a href="${pack.paymentLink || '#'}" target="_blank" class="btn-primary py-2 px-6 rounded-lg font-bold inline-flex items-center space-x-2 mt-4">
                                <span>Lanjutkan ke Payment Gateway</span> <i class="fas fa-external-link-alt ml-2"></i>
                            </a>
                            <p class="text-accent text-sm mt-4">Setelah pembayaran berhasil di portal tersebut, mohon konfirmasi ke kontak kami (melalui WhatsApp/Email) untuk pengiriman aset.</p>
                        `;
                        break;
                    default:
                        instructionContentDiv.innerHTML = `<p class="text-red-400">Metode pembayaran tidak dikenal.</p>`;
                        break;
                }
            });
        });

        // Event listener untuk tombol tutup instruksi
        if (closeInstructionsButton) {
            closeInstructionsButton.addEventListener('click', () => {
                if (paymentInstructionsDiv) paymentInstructionsDiv.classList.add('hidden');
                instructionContentDiv.innerHTML = '';
            });
        }
    }

    // Panggil loadCheckoutPage() jika berada di halaman checkout.html
    if (window.location.pathname.includes('checkout.html')) {
        loadCheckoutPage();
    }


    // Logika untuk memuat detail karya di work-detail.html
    function loadWorkDetail() {
        const urlParams = new URLSearchParams(window.location.search);
        const workId = urlParams.get('id');

        const work = portfolioData.find(item => item.id === workId);

        const pageTitleElement = document.getElementById('page-title');
        const workTitleElement = document.getElementById('work-title');
        const workCategoryElement = document.getElementById('work-category');
        const workClientElement = document.getElementById('work-client');
        const workMediaContainer = document.getElementById('work-media-container');
        const workDescriptionElement = document.getElementById('work-description');
        const workSkillsList = document.getElementById('work-skills');
        const workDetailsList = document.getElementById('work-details');
        const backToPortfolioLink = document.getElementById('back-to-portfolio-link');

        if (!workId || !work) {
            if (pageTitleElement) pageTitleElement.textContent = 'Karya Tidak Ditemukan';
            if (workTitleElement) workTitleElement.textContent = 'Karya Tidak Ditemukan';
            if (workCategoryElement) workCategoryElement.textContent = '';
            if (workClientElement) workClientElement.textContent = '';
            if (workMediaContainer) workMediaContainer.innerHTML = '<p class="text-red-500 text-center py-10">Maaf, detail karya ini tidak ditemukan. Silakan kembali ke <a href="index.html#portfolio" class="text-accent hover:underline">portofolio utama</a>.</p>';
            if (workDescriptionElement) workDescriptionElement.innerHTML = '';
            if (workSkillsList) workSkillsList.innerHTML = '';
            if (workDetailsList) workDetailsList.innerHTML = '';
            if (backToPortfolioLink) backToPortfolioLink.href = 'index.html#portfolio';
            return;
        }

        if (pageTitleElement) pageTitleElement.textContent = `Detail Karya - ${work.title}`;
        if (workTitleElement) workTitleElement.textContent = work.title;
        if (workCategoryElement) workCategoryElement.textContent = work.category;
        if (workClientElement) workClientElement.textContent = work.client;

        if (workMediaContainer) {
            workMediaContainer.innerHTML = '';
            if (work.mediaType === 'image') {
                const img = document.createElement('img');
                img.src = work.mediaSrc;
                img.alt = work.title;
                img.classList.add('w-full', 'h-auto', 'object-cover');
                workMediaContainer.appendChild(img);
            } else if (work.mediaType === 'video-local') {
                const video = document.createElement('video');
                video.src = work.mediaSrc;
                video.controls = true;
                video.muted = true;
                video.loop = true;
                video.playsInline = true;
                video.classList.add('w-full', 'h-auto', 'object-cover');
                workMediaContainer.appendChild(video);
            } else if (work.mediaType === 'youtube' && work.youtubeId) {
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${work.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${work.youtubeId}&controls=1`;
                iframe.frameBorder = '0';
                iframe.allow = 'autoplay; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full');

                const iframeWrapper = document.createElement('div');
                iframeWrapper.classList.add('relative', 'pt-[56.25%]');
                iframeWrapper.appendChild(iframe);
                workMediaContainer.appendChild(iframeWrapper);
            }
        }

        if (workDescriptionElement) {
            workDescriptionElement.innerHTML = work.description.replace(/\n/g, '<br>');
        }

        if (workSkillsList) {
            workSkillsList.innerHTML = '';
            work.skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                workSkillsList.appendChild(li);
            });
        }

        if (workDetailsList) {
            workDetailsList.innerHTML = '';
            work.details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = `${detail.label}: ${detail.value}`;
                workDetailsList.appendChild(li);
            });
        }
        if (backToPortfolioLink) backToPortfolioLink.href = 'index.html#portfolio';
    }

    // Panggil loadWorkDetail() jika berada di halaman work-detail.html
    if (window.location.pathname.includes('work-detail.html')) {
        loadWorkDetail();
    }
});