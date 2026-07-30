const menuBtn = document.getElementById('menuBtn');
const navLinks = document.getElementById('navLinks');

if (menuBtn && navLinks) {
    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    // Close menu when clicking on a nav link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });
}

const slides = document.querySelectorAll('.slides');
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
let currentSlide = 0;

const reviewMinimumCount = 87;

function renderGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    if (typeof galleryItems === 'undefined' || !galleryItems.length) {
        galleryGrid.innerHTML = '<p class="gallery-empty">No gallery items found. Add entries to the galleryItems array in gallery-data.js to populate this page.</p>';
        return;
    }

    galleryItems.forEach((item) => {
        const card = document.createElement('article');
        card.className = 'gallery-card' + (item.type === 'video' ? ' gallery-video-card' : ' gallery-image-card');

        const badge = document.createElement('span');
        badge.className = 'gallery-card-badge';
        badge.textContent = item.type === 'video' ? 'Video' : (item.label || 'Gallery');
        card.appendChild(badge);

        if (item.type === 'video') {
            const video = document.createElement('video');
            video.controls = true;
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            if (item.poster) video.poster = item.poster;
            const source = document.createElement('source');
            source.src = item.src;
            source.type = 'video/mp4';
            video.appendChild(source);
            card.appendChild(video);
        } else {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt || item.title || 'Gallery image';
            card.appendChild(img);
        }

        const copy = document.createElement('div');
        copy.className = 'gallery-card-copy';

        const heading = document.createElement('h3');
        heading.textContent = item.title;

        const description = document.createElement('p');
        description.textContent = item.description;

        copy.appendChild(heading);
        copy.appendChild(description);
        card.appendChild(copy);
        galleryGrid.appendChild(card);

        card.addEventListener('click', () => {
            openGalleryOverlay(item);
        });
    });
}

function openGalleryOverlay(item) {
    const overlay = document.getElementById('galleryOverlay');
    const overlayMedia = document.getElementById('overlayMedia');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayDescription = document.getElementById('overlayDescription');
    const overlayDownload = document.getElementById('overlayDownload');

    if (!overlay || !overlayMedia || !overlayTitle || !overlayDescription || !overlayDownload) return;

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    overlayMedia.innerHTML = '';

    if (item.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.muted = false;
        video.loop = false;
        video.playsInline = true;
        video.style.maxHeight = '84vh';
        if (item.poster) video.poster = item.poster;
        const source = document.createElement('source');
        source.src = item.src;
        source.type = 'video/mp4';
        video.appendChild(source);
        overlayMedia.appendChild(video);
        overlayDownload.href = item.src;
        overlayDownload.setAttribute('download', 'LumiGlow-video.mp4');
    } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.alt || item.title || 'Gallery image preview';
        overlayMedia.appendChild(img);
        overlayDownload.href = item.src;
        overlayDownload.setAttribute('download', item.src.split('/').pop() || 'LumiGlow-image.jpg');
    }

    overlayTitle.textContent = item.title;
    overlayDescription.textContent = item.description;
}

const overlayClose = document.getElementById('overlayClose');
const overlay = document.getElementById('galleryOverlay');

if (overlayClose && overlay) {
    overlayClose.addEventListener('click', () => {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        const overlayMedia = document.getElementById('overlayMedia');
        if (overlayMedia) overlayMedia.innerHTML = '';
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            const overlayMedia = document.getElementById('overlayMedia');
            if (overlayMedia) overlayMedia.innerHTML = '';
        }
    });
}

function showSlide(index) {
    if (!slides.length) return;
    slides.forEach((slide) => slide.classList.remove('active'));
    slides[index].classList.add('active');
}

if (nextBtn && prevBtn && slides.length) {
    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    });

    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }, 4000);
}

const aboutImage = document.getElementById('aboutImage');
const aboutImageSources = [
    'Images/booking.jpg',
    'Images/b4.jpg',
    'Images/after.jpg',
    'Images/after2.jpg'
];
let aboutImageIndex = 0;

function cycleAboutImage() {
    if (!aboutImage || aboutImageSources.length === 0) return;
    aboutImageIndex = (aboutImageIndex + 1) % aboutImageSources.length;
    aboutImage.style.opacity = '0';
    setTimeout(() => {
        aboutImage.src = aboutImageSources[aboutImageIndex];
        aboutImage.style.opacity = '1';
    }, 250);
}

if (aboutImage) {
    setInterval(cycleAboutImage, 5000);
}

if (typeof renderGallery === 'function') {
    renderGallery();
}

const reviewForm = document.querySelector('.review-form');
const reviewTrack = document.querySelector('.review-track');
const reviewCount = document.querySelector('.review-count');

function createReviewCard(reviewer, text) {
    const card = document.createElement('div');
    card.className = 'review-card';

    const reviewText = document.createElement('p');
    reviewText.textContent = `"${text}"`;

    const author = document.createElement('h4');
    author.textContent = reviewer;

    card.appendChild(reviewText);
    card.appendChild(author);
    return card;
}

function updateReviewCount() {
    if (!reviewCount || !reviewTrack) return;
    const count = Math.max(reviewMinimumCount, reviewTrack.querySelectorAll('.review-card').length);
    reviewCount.textContent = `${count} review${count === 1 ? '' : 's'}`;
}

function loadSavedReviews() {
    if (!reviewTrack) return;
    const saved = JSON.parse(localStorage.getItem('lumiGlowReviews') || '[]');
    saved.forEach((review) => {
        const card = createReviewCard(review.name, review.text);
        reviewTrack.appendChild(card);
    });
    updateReviewCount();
}

function saveReview(review) {
    const saved = JSON.parse(localStorage.getItem('lumiGlowReviews') || '[]');
    saved.push(review);
    localStorage.setItem('lumiGlowReviews', JSON.stringify(saved));
}

if (reviewForm && reviewTrack) {
    loadSavedReviews();

    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = reviewForm.querySelector('input[name="reviewer"]').value.trim();
        const text = reviewForm.querySelector('textarea[name="reviewText"]').value.trim();

        if (!name || !text) return;

        const card = createReviewCard(name, text);
        reviewTrack.appendChild(card);
        saveReview({ name, text });
        reviewForm.reset();
        updateReviewCount();
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    });
}

// Booking form uses direct form submission via FormSubmit service.

const formMessage = document.getElementById('formMessage');
if (formMessage && window.location.search.includes('success=1')) {
    formMessage.textContent = 'Thank you for booking with LumiGlow! Your request has been sent and we appreciate your trust in our cleaning services.';
    formMessage.style.display = 'block';
}
