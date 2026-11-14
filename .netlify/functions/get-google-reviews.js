const fallbackReviews = [
  { name: 'Ava Martin', text: 'The team made our apartment feel brand new. Our kitchen sparkled, the bathrooms looked fresh, and the whole place smelled clean and calm.' },
  { name: 'Dylan Brooks', text: 'I booked a deep clean before guests arrived and it was worth every penny. The attention to detail was beyond what I expected.' },
  { name: 'Selena Patel', text: 'Friendly, punctual, and incredibly thorough. They handled every room with care and left our home spotless without rushing.' },
  { name: 'Marcus Lee', text: 'I love that they use thoughtful products that do not leave strong fumes. My home feels cleaner and more comfortable after each visit.' }
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
      text: review.text || 'Google review',
      rating: review.rating || 5
    }));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify({ reviews: reviews.length ? reviews : fallbackReviews })
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
