export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = searchParams.get('target');

  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing target URL' }), { status: 400 });
  }

  const url = new URL(target);
  url.searchParams.set('key', process.env.GOOGLE_MAPS_KEY);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Proxy failed', detail: error.message }), { status: 500 });
  }
}
