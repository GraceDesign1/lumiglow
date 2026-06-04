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

const reviewForm = document.querySelector('.review-form');
const reviewTrack = document.querySelector('.review-track');

function createReviewCard(reviewer, text) {
    const card = document.createElement('div');
    card.className = 'review-card';

    const reviewText = document.createElement('p');
    reviewText.textContent = `"${text}"`;

    const author = document.createElement('h4');
    author.textContent = `- ${reviewer}`;

    card.appendChild(reviewText);
    card.appendChild(author);
    return card;
}

function loadSavedReviews() {
    if (!reviewTrack) return;
    const saved = JSON.parse(localStorage.getItem('lumiGlowReviews') || '[]');
    saved.forEach((review) => {
        const card = createReviewCard(review.name, review.text);
        reviewTrack.appendChild(card);
    });
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
    });
}

// Booking form uses direct form submission via FormSubmit service.

const formMessage = document.getElementById('formMessage');
if (formMessage && window.location.search.includes('success=1')) {
    formMessage.textContent = 'Thank you for booking with LumiGlow! Your request has been sent and we appreciate your trust in our cleaning services.';
    formMessage.style.display = 'block';
}
