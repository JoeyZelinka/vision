export async function POST(request) {
  try {
    const { input } = await request.json();
    if (!input) throw new Error('Missing input in request body');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Replace with your fine-tuned F.R.I.D.A.Y. model ID if applicable
        messages: [{ role: 'user', content: input }],
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return Response.json({ response: data.choices[0].message.content });
  } catch (error) {
    console.error('Friday API error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}