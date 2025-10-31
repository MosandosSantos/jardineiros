/*~~~~~~~~~~~~~~~ TOGGLE BUTTON ~~~~~~~~~~~~~~~*/
const navMenu = document.getElementById("nav-menu")
const navLink = document.querySelectorAll(".nav-link")
const hamburger = document.getElementById("hamburger")

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("left-[0]")
    hamburger.classList.toggle('ri-close-large-line')
})

navLink.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.toggle("left-[0]")
        hamburger.classList.toggle('ri-close-large-line')
    })
})


/*~~~~~~~~~~~~~~~ SHOW SCROLL UP ~~~~~~~~~~~~~~~*/
const scrollUp = () => {
    const scrollUpBtn = document.getElementById("scroll-up")

    if(this.scrollY >=250) {
        scrollUpBtn.classList.remove("-bottom-1/2")
        scrollUpBtn.classList.add("bottom-4")
    } else {
        scrollUpBtn.classList.add("-bottom-1/2")
        scrollUpBtn.classList.remove("bottom-4")
    }
}

window.addEventListener("scroll", scrollUp)


/*~~~~~~~~~~~~~~~ CHANGE BACKGROUND HEADER ~~~~~~~~~~~~~~~*/
const scrollHeader = () => {
    const header = document.getElementById("navbar")

    if(this.scrollY >=50) {
        header.classList.add("border-b", "border-yellow-500")
    } else {
        header.classList.remove("border-b", "border-yellow-500")
    }
}

window.addEventListener("scroll", scrollHeader)


/*~~~~~~~~~~~~~~~ SWIPER ~~~~~~~~~~~~~~~*/
const swiper = new Swiper('.swiper', {
    // Optional parameters
    speed: 400,
    spaceBetween: 30,
    autoplay: {
        delay: 3000,
        disableOnInteraction: false
    },

    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    grabCursor: true,
    breakpoints: {
        640: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 3
        },
    }
  });

/*~~~~~~~~~~~~~~~ POPULAR SWIPER ~~~~~~~~~~~~~~~*/
const popularSwiper = new Swiper('.popularSwiper', {
    speed: 600,
    spaceBetween: 30,
    loop: true,
    loopedSlides: 7, // Total de slides para garantir que todos apareçam no loop
    autoplay: {
        delay: 4000,
        disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    grabCursor: true,
    slidesPerView: 1,
    slidesPerGroup: 1,
    breakpoints: {
        640: {
            slidesPerView: 2,
            slidesPerGroup: 1,
            spaceBetween: 20
        },
        768: {
            slidesPerView: 3,
            slidesPerGroup: 1,
            spaceBetween: 30
        },
        1024: {
            slidesPerView: 4,
            slidesPerGroup: 1,
            spaceBetween: 30
        }
    }
});


/*~~~~~~~~~~~~~~~ SCROLL SECTIONS ACTIVE LINK ~~~~~~~~~~~~~~~*/
const activeLink = () => {
    const sections = document.querySelectorAll('section')
    const navLinks = document.querySelectorAll(".nav-link")

    let current = "home"

    sections.forEach(section => {
        const sectionTop = section.offsetTop;

        if(this.scrollY >= sectionTop - 60) {
            current = section.getAttribute("id")
        }
    })

    navLinks.forEach(item => {
        item.classList.remove("active")

        if(item.href.includes(current)) {
            item.classList.add("active")
        }
    })
}

window.addEventListener("scroll", activeLink)


/*~~~~~~~~~~~~~~~ SCROLL REVEAL ANIMATION ~~~~~~~~~~~~~~~*/
const sr = ScrollReveal({
    origin: "top",
    distance: "60px",
    duration: 2500,
    delay: 300,
    reset: true
})

sr.reveal(`.home__data, .about__top, .popular__top, .review__top, .review__swiper, .copy__right`)
sr.reveal(`.home__image`, {delay: 500, scale: 0.5})
sr.reveal(`.footer__icon, .footer__content`, {delay: 200})

sr.reveal(`.service__card, .popular__card`, {interval: 100})

sr.reveal(`.about__leaf`, {delay: 1000, origin: "right"})
sr.reveal(`.about__item__1-content, .about__item__2-img`, {origin: "right"})
sr.reveal(`.about__item__2-content, .about__item__1-img`, {origin: "left"})

sr.reveal(`.review__leaf, .footer__floral`, {delay: 1000, origin: "left"})


/*~~~~~~~~~~~~~~~ DYNAMIC GALLERY LOADER ~~~~~~~~~~~~~~~*/
// Configuração da galeria
const GALLERY_CONFIG = {
    path: 'assets/img/gallery/',
    prefix: 'gallery-',
    extension: '.jpg',
    maxImages: 20,
    startFrom: 1
};

// Array para armazenar imagens válidas
let galleryImages = [];
let currentImageIndex = 0;
let gallerySwiper = null;

// Função para verificar se a imagem existe
function imageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Função para carregar imagens dinamicamente
async function loadGalleryImages() {
    const galleryCarousel = document.getElementById('gallery-carousel');
    const loadingIndicator = document.getElementById('gallery-loading');

    if (!galleryCarousel || !loadingIndicator) return;

    galleryImages = [];

    // Verificar as últimas 20 imagens (de maior para menor)
    for (let i = GALLERY_CONFIG.maxImages; i >= GALLERY_CONFIG.startFrom; i--) {
        const imagePath = `${GALLERY_CONFIG.path}${GALLERY_CONFIG.prefix}${i}${GALLERY_CONFIG.extension}`;
        const exists = await imageExists(imagePath);

        if (exists) {
            galleryImages.push({
                src: imagePath,
                number: i
            });
        }
    }

    // Ordenar por número (maior primeiro)
    galleryImages.sort((a, b) => b.number - a.number);

    // Limitar a 20 imagens
    galleryImages = galleryImages.slice(0, 20);

    // Criar os slides da galeria
    galleryImages.forEach((image, index) => {
        const slide = createGallerySlide(image.src, index);
        galleryCarousel.appendChild(slide);
    });

    // Esconder indicador de carregamento
    loadingIndicator.style.display = 'none';

    // Inicializar Swiper para a galeria
    initGallerySwiper();
}

// Criar slide individual da galeria
function createGallerySlide(imageSrc, index) {
    const slide = document.createElement('div');
    slide.className = 'swiper-slide';

    slide.innerHTML = `
        <div class="gallery__card group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-white border-2 border-green-100">
            <div class="relative overflow-hidden bg-gray-50" style="height: 350px;">
                <img
                    src="${imageSrc}"
                    alt="Galeria ${index + 1}"
                    style="width: 100%; height: 100%; object-fit: contain;"
                    class="transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                >
                <div class="absolute inset-0 bg-gradient-to-t from-green-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div class="text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 bg-yellow-500 rounded-full w-16 h-16 flex items-center justify-center">
                        <i class="ri-eye-line text-3xl text-green-900"></i>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Adicionar evento de clique para abrir lightbox
    slide.querySelector('.gallery__card').addEventListener('click', () => openLightbox(index));

    return slide;
}

// Inicializar Swiper da galeria
function initGallerySwiper() {
    gallerySwiper = new Swiper('.gallerySwiper', {
        speed: 600,
        spaceBetween: 20,
        loop: false,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        grabCursor: true,
        slidesPerView: 1,
        breakpoints: {
            640: {
                slidesPerView: 2,
                spaceBetween: 15
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 20
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 25
            }
        }
    });
}

// Abrir lightbox
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const imageCounter = document.getElementById('image-counter');

    if (!lightbox || !lightboxImage) return;

    lightboxImage.src = galleryImages[currentImageIndex].src;
    imageCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    document.body.style.overflow = 'hidden';

    // Adicionar animação de entrada
    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.8)';
    setTimeout(() => {
        lightboxImage.style.transition = 'all 0.3s ease';
        lightboxImage.style.opacity = '1';
        lightboxImage.style.transform = 'scale(1)';
    }, 10);
}

// Fechar lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');

    if (!lightbox || !lightboxImage) return;

    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.8)';

    setTimeout(() => {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Navegar para imagem anterior
function previousImage() {
    if (galleryImages.length === 0) return;

    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

// Navegar para próxima imagem
function nextImage() {
    if (galleryImages.length === 0) return;

    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

// Atualizar imagem no lightbox com animação
function updateLightboxImage() {
    const lightboxImage = document.getElementById('lightbox-image');
    const imageCounter = document.getElementById('image-counter');

    if (!lightboxImage) return;

    // Animação de saída
    lightboxImage.style.opacity = '0';
    lightboxImage.style.transform = 'scale(0.9)';

    setTimeout(() => {
        lightboxImage.src = galleryImages[currentImageIndex].src;
        imageCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;

        // Animação de entrada
        setTimeout(() => {
            lightboxImage.style.opacity = '1';
            lightboxImage.style.transform = 'scale(1)';
        }, 10);
    }, 150);
}

// Event Listeners para o lightbox
document.addEventListener('DOMContentLoaded', () => {
    // Carregar imagens da galeria
    loadGalleryImages();

    // Botão fechar
    const closeBtn = document.getElementById('close-lightbox');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Botões de navegação
    const prevBtn = document.getElementById('prev-image');
    const nextBtn = document.getElementById('next-image');

    if (prevBtn) prevBtn.addEventListener('click', previousImage);
    if (nextBtn) nextBtn.addEventListener('click', nextImage);

    // Fechar ao clicar fora da imagem
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Atalhos de teclado
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (!lightbox || lightbox.classList.contains('hidden')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                previousImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });

    // Inicializar o formulário de contato
    initContactForm();
})


/*~~~~~~~~~~~~~~~ CONTACT FORM ~~~~~~~~~~~~~~~*/
function initContactForm() {
    const contactForm = document.getElementById('contactForm');

    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnIcon = document.getElementById('btnIcon');
        const btnSpinner = document.getElementById('btnSpinner');
        const formMessage = document.getElementById('formMessage');

        // Obter dados do formulário
        const formData = new FormData(contactForm);

        // Validação adicional do celular
        const celular = formData.get('celular');
        const celularLimpo = celular.replace(/\D/g, '');

        if (celularLimpo.length < 10 || celularLimpo.length > 11) {
            showMessage('Celular inválido. Digite no formato (DDD) 00000-0000', 'error');
            return;
        }

        // Desabilitar botão durante o envio
        submitBtn.disabled = true;
        btnText.textContent = 'Enviando...';
        btnIcon.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        formMessage.classList.add('hidden');

        try {
            // Enviar dados para o PHP
            const response = await fetch('send-email.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                showMessage(result.message, 'success');
                contactForm.reset();

                // Scroll suave para a mensagem de sucesso
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                showMessage(result.message, 'error');
            }
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            showMessage('Erro ao enviar mensagem. Verifique sua conexão e tente novamente.', 'error');
        } finally {
            // Reabilitar botão
            submitBtn.disabled = false;
            btnText.textContent = 'Enviar Mensagem';
            btnIcon.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
        }
    });

    // Função para exibir mensagens
    function showMessage(message, type) {
        const formMessage = document.getElementById('formMessage');

        formMessage.textContent = message;
        formMessage.classList.remove('hidden', 'bg-green-600', 'bg-red-600');

        if (type === 'success') {
            formMessage.classList.add('bg-green-600');
        } else {
            formMessage.classList.add('bg-red-600');
        }

        // Auto-ocultar mensagem após 8 segundos
        setTimeout(() => {
            formMessage.classList.add('hidden');
        }, 8000);
    }

    // Máscara para o campo de celular
    const celularInput = document.getElementById('celular');
    if (celularInput) {
        celularInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');

            if (value.length <= 11) {
                if (value.length <= 2) {
                    value = value.replace(/(\d{0,2})/, '($1');
                } else if (value.length <= 6) {
                    value = value.replace(/(\d{2})(\d{0,4})/, '($1) $2');
                } else if (value.length <= 10) {
                    value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
                } else {
                    value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
                }
            }

            e.target.value = value;
        });
    }

    // Validação em tempo real
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateInput(input);
        });

        input.addEventListener('input', () => {
            if (input.classList.contains('border-red-500')) {
                validateInput(input);
            }
        });
    });

    function validateInput(input) {
        const value = input.value.trim();
        let isValid = true;

        // Validação por tipo
        switch (input.type) {
            case 'email':
                isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                break;
            case 'tel':
                const celularLimpo = value.replace(/\D/g, '');
                isValid = celularLimpo.length >= 10 && celularLimpo.length <= 11;
                break;
            default:
                isValid = value.length >= parseInt(input.getAttribute('minlength') || 0);
        }

        // Aplicar classes visuais
        if (isValid) {
            input.classList.remove('border-red-500', 'focus:ring-red-500');
            input.classList.add('focus:ring-yellow-500');
        } else if (value.length > 0) {
            input.classList.add('border-red-500', 'focus:ring-red-500');
            input.classList.remove('focus:ring-yellow-500');
        }

        return isValid;
    }
}
