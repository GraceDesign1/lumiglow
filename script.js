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

const reviewMinimumCount = 0;

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

    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
    }
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    overlayMedia.innerHTML = '';
    document.body.style.overflow = 'hidden';

    if (item.type === 'video') {
        const video = document.createElement('video');
        video.controls = true;
        video.autoplay = true;
        video.muted = false;
        video.loop = false;
        video.playsInline = true;
        video.style.maxWidth = '100%';
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
        img.style.maxWidth = '100%';
        img.style.maxHeight = '84vh';
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
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        const overlayMedia = document.getElementById('overlayMedia');
        if (overlayMedia) overlayMedia.innerHTML = '';
    });

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay) {
            overlay.classList.remove('active');
            overlay.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
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

const reviewTrack = document.querySelector('#reviewTrack');
const reviewCount = document.querySelector('#reviewCount');

function normalizeReviewText(text) {
    if (typeof text !== 'string') {
        return '';
    }

    return text.replace(/^[\s"“”']+|[\s"“”']+$/g, '').trim();
}

const fallbackReviews = [
    { name: 'Ava Martin', text: 'The team made our apartment feel brand new. Our kitchen sparkled, the bathrooms looked fresh, and the whole place smelled clean and calm.' },
    { name: 'Dylan Brooks', text: 'I booked a deep clean before guests arrived and it was worth every penny. The attention to detail was beyond what I expected.' },
    { name: 'Selena Patel', text: 'Friendly, punctual, and incredibly thorough. They handled every room with care and left our home spotless without rushing.' },
    { name: 'Marcus Lee', text: 'I love that they use thoughtful products that do not leave strong fumes. My home feels cleaner and more comfortable after each visit.' },
    { name: 'Harper Nguyen', text: 'The cleaning crew was respectful, efficient, and easy to communicate with. Booking was smooth and the final result looked amazing.' },
    { name: 'Noah Walker', text: 'They cleaned our rental before move-in and everything looked perfect. The carpets, windows, and kitchen all stood out.' },
    { name: 'Nia Foster', text: 'I was nervous about stains in the bathroom, but they handled them completely. The finish was polished and the room looked brighter.' },
    { name: 'Ethan Ross', text: 'Our office felt fresh and professional again after their visit. They focused on the details that matter most for a clean, welcoming workspace.' },
    { name: 'Leah Adams', text: 'Booking was simple and the team arrived exactly on time. My living room and bedrooms looked cared for from the very start.' },
    { name: 'Julian Price', text: 'I appreciated how organized and consistent the service was. Every surface felt cleaner, and the overall atmosphere of the house improved instantly.' }
];

function createReviewCard(review) {
    const card = document.createElement('div');
    card.className = 'review-card';

    const reviewText = document.createElement('p');
    reviewText.textContent = normalizeReviewText(review.text);

    const author = document.createElement('h4');
    author.textContent = review.name;

    if (review.rating) {
        const rating = document.createElement('div');
        rating.className = 'review-rating';
        rating.textContent = '★'.repeat(Math.round(review.rating)) + '☆'.repeat(5 - Math.round(review.rating));
        card.appendChild(rating);
    }

    card.appendChild(reviewText);
    card.appendChild(author);
    return card;
}

function updateReviewCount(count) {
    if (!reviewCount) return;
    reviewCount.textContent = `${count} ${count === 1 ? 'review' : 'reviews'}`;
    reviewCount.setAttribute('aria-live', 'polite');
}

function renderReviews(reviews) {
    if (!reviewTrack) return;

    const safeReviews = (reviews || [])
        .map((review) => ({
            ...review,
            name: review && review.name ? review.name.trim() : '',
            text: normalizeReviewText(review && review.text ? review.text : '')
        }))
        .filter((review) => review && review.name && review.text);

    reviewTrack.innerHTML = '';

    safeReviews.forEach((review) => {
        reviewTrack.appendChild(createReviewCard(review));
    });

    updateReviewCount(safeReviews.length);
}

async function fetchGoogleReviews() {
    const response = await fetch('/.netlify/functions/get-google-reviews?ts=' + Date.now(), { cache: 'no-store' });

    if (!response.ok) {
        throw new Error('Unable to load Google reviews.');
    }

    const payload = await response.json();
    const reviews = payload.reviews && payload.reviews.length ? payload.reviews : fallbackReviews;
    return reviews.map((review) => ({
        ...review,
        text: normalizeReviewText(review && review.text ? review.text : '')
    }));
}

async function refreshGoogleReviews() {
    if (!reviewTrack) return;

    renderReviews(fallbackReviews);

    try {
        const reviews = await fetchGoogleReviews();
        renderReviews(reviews);
    } catch (error) {
        console.error('Unable to load Google reviews:', error);
        renderReviews(fallbackReviews);
    }
}

if (reviewTrack) {
    refreshGoogleReviews();
    setInterval(refreshGoogleReviews, 300000);
}

// Booking form uses direct form submission via FormSubmit service.

const formMessage = document.getElementById('formMessage');
if (formMessage && window.location.search.includes('success=1')) {
    formMessage.textContent = 'Thank you for booking with LumiGlow! Your request has been sent and we appreciate your trust in our cleaning services.';
    formMessage.style.display = 'block';
}

const contactFormMessage = document.getElementById('contactFormMessage');
if (contactFormMessage && window.location.search.includes('contact=success')) {
    contactFormMessage.textContent = 'Thanks for reaching out! Your message has been sent directly through our website and we will get back to you soon.';
    contactFormMessage.style.display = 'block';
}
