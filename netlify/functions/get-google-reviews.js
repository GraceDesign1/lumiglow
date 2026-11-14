const sanitizeReviewText = (text) => {
  if (typeof text !== 'string') {
    return 'Google review';
  }

  const cleaned = text.replace(/^[\s"“”']+|[\s"“”']+$/g, '').trim();
  return cleaned || 'Google review';
};

const fallbackReviews = [
  { name: 'Eunice Ekua Oppong', text: 'I had a wonderful experience with this cleaning service! The owner personally …', rating: 5 },
  { name: 'Eunice Valentina Kumi', text: 'I was moving so needed a cleaning team and I contact LumiGlow and they did a very great job for me so don’t hesitate to contact them for all your cleaning needs because you won’t regret it …' },
  { name: 'Samuel Osei', text: 'I’m extremely impressed with the cleaning service. My home was left spotless, fresh, and beautifully organized. The attention to detail was outstanding, and the level of professionalism and customer care exceeded my expectations. I highly recommend their services to anyone looking for quality, reliability, and exceptional results.' },
  { name: 'Maame Adomah', text: 'We had LumiGlow clean our new restaurant space and they did a great job. Everything looked fresh, spotless, and ready for the opening.Professional and thorough,i highly recommended! …' },
  { name: 'Sreekumar Nair', text: 'I had a good experience with Lumiglow. They were very detail oriented before beginning the cleaning and did a good job. Highly recommended!' },
  { name: 'Quinn Lanier', text: 'Booked a move out clean and they did a great job. Got my damage deposit back.' },
  { name: 'Matt Turner', text: 'I’m very pleased with the results. The kitchen, bathrooms, and floors were cleaned beautifully, and the whole house looked spotless. Great job!' }
];

exports.handler = async () => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ reviews: fallbackReviews })
    };
  }

  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,reviews&key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Google Places request failed: ${response.status}`);
    }

    const payload = await response.json();
    const reviews = (payload.result?.reviews || []).slice(0, 12).map((review) => ({
      name: review.author_name || 'Google Reviewer',
      text: sanitizeReviewText(review.text),
      rating: review.rating || 5
    }));
    const reviewsByAuthor = new Map(fallbackReviews.map((review) => [review.name.toLowerCase(), review]));

    reviews.forEach((review) => {
      const author = review.name.toLowerCase();
      if (!reviewsByAuthor.has(author)) {
        reviewsByAuthor.set(author, review);
      }
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ reviews: Array.from(reviewsByAuthor.values()).slice(0, 12) })
    };
  } catch (error) {
    console.error('Google reviews fetch failed:', error);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ reviews: fallbackReviews })
    };
  }
};
