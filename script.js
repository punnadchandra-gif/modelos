document.addEventListener('DOMContentLoaded', () => {
    /**
     * Senior UX - Gallery Slider & Local Data Logic
     */
    const cards = document.querySelectorAll('.card');

    cards.forEach((card) => {
        const slider = card.querySelector('.main-img-wrapper');
        const dots = card.querySelectorAll('.dot');
        const slides = slider.querySelectorAll('.main-img');
        const prevBtn = card.querySelector('.nav-btn.prev');
        const nextBtn = card.querySelector('.nav-btn.next');
        const currentCounter = card.querySelector('.gallery-counter .current');
        
        // 1. Data Loading from Global Window Objects (info.js)
        const modelId = card.getAttribute('data-model-id');
        const data = window[`modelData${modelId}`];

        // VALIDATION: If no data found for this model, hide the card
        if (!data) {
            card.style.display = 'none';
            return;
        }

        // VALIDATION: If the first image fails to load, assume no photos and hide
        const firstImg = slides[0];
        if (firstImg) {
            firstImg.addEventListener('error', () => {
                console.warn(`Card ${modelId} hidden: Main image not found.`);
                card.style.display = 'none';
            });
            
            // Check if it's already broken (cached error)
            if (firstImg.naturalWidth === 0 && firstImg.src !== "") {
                // We'll give it a bit of time to load before deciding
                setTimeout(() => {
                    if (firstImg.naturalWidth === 0) card.style.display = 'none';
                }, 500);
            }
        }

        // Populate Card Data
        card.querySelector('.model-name').textContent = data.nombre;
        const stats = card.querySelectorAll('.stat .value');
        if (stats.length >= 2) {
            stats[0].textContent = data.edad || data.medidas || "...";
            stats[1].textContent = data.contextura || data.altura || "...";
        }
        card.querySelector('.bio p').textContent = data.bio;

        // 2. Arrow Navigation
        prevBtn.addEventListener('click', () => {
            const slideWidth = slides[0].offsetWidth;
            slider.scrollBy({ left: -slideWidth, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const slideWidth = slides[0].offsetWidth;
            slider.scrollBy({ left: slideWidth, behavior: 'smooth' });
        });

        // 3. Sync Dots -> Slider
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const slideWidth = slides[0].offsetWidth;
                slider.scrollTo({
                    left: slideWidth * index,
                    behavior: 'smooth'
                });
                updateGalleryUI(index);
            });
        });

        // 4. Sync Slider -> Dots & Counter
        let isScrolling;
        slider.addEventListener('scroll', () => {
            window.clearTimeout(isScrolling);
            isScrolling = setTimeout(() => {
                const slideWidth = slides[0].offsetWidth;
                const scrollLeft = slider.scrollLeft;
                const activeIndex = Math.round(scrollLeft / slideWidth);
                
                updateGalleryUI(activeIndex);
            }, 100);
        });

        function updateGalleryUI(activeIndex) {
            if (currentCounter) currentCounter.textContent = activeIndex + 1;

            dots.forEach((dot, i) => {
                if (i === activeIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            prevBtn.style.visibility = activeIndex === 0 ? 'hidden' : 'visible';
            nextBtn.style.visibility = activeIndex === slides.length - 1 ? 'hidden' : 'visible';
        }

        updateGalleryUI(0);

        /**
         * WhatsApp Direct Link Logic
         */
        const waBtn = card.querySelector('.whatsapp-btn');
        const agencyPhone = '59162114422'; 
        
        waBtn.addEventListener('click', () => {
            const modelName = data ? data.nombre : "Modelo";
            const message = `Hola, me gustaría más información sobre ${modelName}`;
            const encodedMessage = encodeURIComponent(message);
            const waUrl = `https://wa.me/${agencyPhone}?text=${encodedMessage}`;
            window.open(waUrl, '_blank');
        });
    });
});
