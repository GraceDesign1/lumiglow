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

const reviewForm = document.querySelector('.review-form');
const reviewTrack = document.querySelector('.review-track');
const reviewCount = document.querySelector('.review-count');

const defaultReviews = [
    { name: 'Ava Martin', text: 'The team made our apartment feel brand new. Our kitchen sparkled, the bathrooms looked fresh, and the whole place smelled clean and calm.' },
    { name: 'Dylan Brooks', text: 'I booked a deep clean before guests arrived and it was worth every penny. The attention to detail was beyond what I expected.' },
    { name: 'Selena Patel', text: 'Friendly, punctual, and incredibly thorough. They handled every room with care and left our home spotless without rushing.' },
    { name: 'Marcus Lee', text: 'I love that they use thoughtful products that do not leave strong fumes. My home feels cleaner and more comfortable after each visit.' },
    { name: 'Harper Nguyen', text: 'The cleaning crew was respectful, efficient, and easy to communicate with. Booking was smooth and the final result looked amazing.' },
    { name: 'Noah Walker', text: 'They cleaned our rental before move-in and everything looked perfect. The carpets, windows, and kitchen all stood out.' },
    { name: 'Nia Foster', text: 'I was nervous about stains in the bathroom, but they handled them completely. The finish was polished and the room looked brighter.' },
    { name: 'Ethan Ross', text: 'Our office felt fresh and professional again after their visit. They focused on the details that matter most for a clean, welcoming workspace.' },
    { name: 'Leah Adams', text: 'Booking was simple and the team arrived exactly on time. My living room and bedrooms looked cared for from the very start.' },
    { name: 'Julian Price', text: 'I appreciated how organized and consistent the service was. Every surface felt cleaner, and the overall atmosphere of the house improved instantly.' },
    { name: 'Mila Turner', text: 'The cleaners were kind, detailed, and very professional. I noticed a big difference in the dust levels and the smell of the home.' },
    { name: 'Owen Scott', text: 'They took care of the hard-to-reach places and left behind a fresh, polished finish. It felt like a full reset for our home.' },
    { name: 'Zoe Hughes', text: 'Their service is reliable and easy to trust. I scheduled a recurring clean and the quality has stayed excellent every time.' },
    { name: 'Caleb Reed', text: 'The team was efficient without feeling rushed. They even tackled the little details in my laundry room and entryway that I had forgotten about.' },
    { name: 'Ella Mitchell', text: 'I booked them for my family home and was pleasantly surprised by how warm and professional everyone was. The place felt lighter and cleaner afterward.' },
    { name: 'Isaac Palmer', text: 'Our property looked great after their move-out clean. It saved us time and stress and made the handoff much easier.' },
    { name: 'Riley Powell', text: 'The quality is consistent, and the communication is always clear. I appreciate how easy it is to work with this team.' },
    { name: 'Sofia Sanchez', text: 'I booked the service for a busy week and they made everything feel easier. The house looked pristine, especially the kitchen and bathroom.' },
    { name: 'Daniel Gray', text: 'My home felt fresh and calm after their cleaning. The team was patient, respectful, and very detail oriented.' },
    { name: 'Lily James', text: 'The final result looked better than I imagined. I would absolutely book again and recommend them to family and friends.' },
    { name: 'Benjamin Hall', text: 'They gave my office a quick refresh that made a huge difference. It felt brighter, cleaner, and more welcoming for clients.' },
    { name: 'Madison King', text: 'The cleaners arrived ready to work and did a great job without disrupting my day. Everything looked polished and complete.' },
    { name: 'Nathan Rivera', text: 'I had a deep clean scheduled before family arrived and it exceeded my expectations. The place felt comfortable and guest-ready.' },
    { name: 'Hannah Ward', text: 'I love how they pay attention to the details other cleaners miss. The baseboards, counters, and mirrors all looked spotless.' },
    { name: 'Andrew Flores', text: 'The job was done efficiently and with a lot of care. My home smelled fresh and looked brighter from the first room to the last.' },
    { name: 'Chloe Price', text: 'We needed a quick but thorough clean before a gathering, and the team delivered. Everything looked tidy, polished, and inviting.' },
    { name: 'Gabriel Bailey', text: 'The service felt personal and professional. They listened carefully and cleaned exactly where it mattered most.' },
    { name: 'Layla Baker', text: 'I appreciated the flexibility and the detail-focused work. My apartment felt cleaner than it had in months.' },
    { name: 'Samuel Diaz', text: 'Their team was courteous and precise, and the results really showed. The shower, sink, and floors looked immaculate.' },
    { name: 'Avery Cooper', text: 'I booked a recurring clean and the quality has stayed excellent every single time. It takes so much stress off my week.' },
    { name: 'Aria Murphy', text: 'The crew was kind, efficient, and surprisingly detailed. My kitchen counters and glass surfaces looked spotless.' },
    { name: 'Henry Sanders', text: 'From the first message to the final walkthrough, the service felt easy and reliable. I would definitely use them again.' },
    { name: 'Scarlett Bennett', text: 'I feel more relaxed coming home now that my place is cleaned by such a trustworthy team. The finish is always polished and consistent.' },
    { name: 'Wyatt Kelly', text: 'They did a wonderful job in my home office and guest bedroom. The attention to detail was impressive and the space felt fresh.' },
    { name: 'Maya Foster', text: 'The cleaners were punctual, respectful, and very thoughtful about how they worked around my family. Such a great experience.' },
    { name: 'Jack Coleman', text: 'Our apartment looked great after a full clean, and the team was careful with our belongings. It felt professional from start to finish.' },
    { name: 'Lucy Evans', text: 'I loved how the team handled every room. The work was thorough, efficient, and left a noticeable difference in the house.' },
    { name: 'Leo Perry', text: 'I had a busy week and they took so much pressure off. The space looked spotless, airy, and genuinely cared for.' },
    { name: 'Penelope Hughes', text: 'The service made my home feel brighter and more organized. I noticed the difference immediately and was very happy with the result.' },
    { name: 'Ryan Long', text: 'Appointment was on time, the team was friendly, and the cleaning was detailed in all the right places. Great value for the work done.' },
    { name: ' Stella Morris', text: 'Amazing communication and even better results. They left my place looking fresh and professionally cleaned from top to bottom.' },
    { name: 'Kai Brooks', text: 'Their team made the house feel calm and refreshed. I had a lot of dust and clutter, and they handled it all with care.' },
    { name: 'Vivian Kelly', text: 'I truly appreciated how neat and thoughtful the cleaners were. The finish was sparkling and the service felt more like a reset than just a clean.' },
    { name: 'David Hayes', text: 'The bathroom and kitchen looked incredible after their visit. I felt like I had a fresh, newly cleaned space without the stress of doing it myself.' },
    { name: 'Grace Stewart', text: 'This was the best cleaning experience I have had in a long time. The crew was kind, prompt, and very clear about the work being done.' },
    { name: 'Logan Ross', text: 'Everything felt polished and well cared for. My house looked brighter, cleaner, and more comfortable within just a few hours.' },
    { name: 'Bella Torres', text: 'I booked this service for a move-out clean and it made the whole process easier. The place looked spotless and ready to hand over.' },
    { name: 'Thomas Barnes', text: 'Strong communication, consistent quality, and a great final result. I definitely plan to book again.' },
    { name: 'Nora Collins', text: 'The team was efficient, respectful, and very thorough. I especially loved how clean the floors and windows looked afterward.' },
    { name: 'Oliver Ward', text: 'I was impressed by the level of detail and how calm the whole service felt. My home was left looking fresh and properly cleaned.' }
];

function createReviewCard(reviewer, text) {
    const card = document.createElement('div');
    card.className = 'review-card';

    const reviewText = document.createElement('p');
    reviewText.textContent = text;

    const author = document.createElement('h4');
    author.textContent = reviewer;

    card.appendChild(reviewText);
    card.appendChild(author);
    return card;
}

function updateReviewCount() {
    if (!reviewCount || !reviewTrack) return;
    const count = reviewTrack.querySelectorAll('.review-card').length;
    reviewCount.textContent = `${count} ${count === 1 ? 'review' : 'reviews'}`;
    reviewCount.setAttribute('aria-live', 'polite');
}

function loadSavedReviews() {
    if (!reviewTrack) return;
    reviewTrack.innerHTML = '';

    const saved = JSON.parse(localStorage.getItem('lumiGlowReviews') || '[]');
    const reviews = [...defaultReviews, ...saved.filter((review) => review && review.name && review.text)].reverse();

    reviews.forEach((review) => {
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
        reviewTrack.insertBefore(card, reviewTrack.firstChild);
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
