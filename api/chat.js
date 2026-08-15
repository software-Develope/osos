export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await req.json();
    const { message, history } = body;
    
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), { status: 400 });
    }

    const systemPrompt = `أنت مساعد ذكي ولطيف لمبيعات استوديو "أسس ديف" (Osos Dev).
معلومات عن الاستوديو:
- المؤسسون: مهندسا البرمجيات بدر فرحان وحمزة الخطيب.
- الخدمات: تطوير تطبيقات الجوال (Flutter)، تطوير مواقع وتطبيقات الويب (React, Node.js, Next.js)، تصميم واجهات وتجربة المستخدم (UI/UX)، برمجة الذكاء الاصطناعي والأتمتة (Python)، وتصميم وبناء قواعد البيانات.
- أسلوب الرد: احترافي، ودود جداً، قصير ومباشر (بدون حشو). يجب ألا يتجاوز ردك فقرتين قصيرتين ليناسب نافذة الشات. استخدم اللهجة البيضاء أو الفصحى المبسطة.
- التوجيه (Call to Action): إذا طلب العميل تسعيراً لمشروعه، أو أراد حجز استشارة أو تفاصيل تقنية عميقة، اعتذر بلباقة عن إعطاء أسعار ثابتة لأنها تعتمد على المتطلبات، ووجهه فوراً للتواصل عبر الواتساب على الرقم +962779542615 أو تعبئة نموذج التواصل (Contact Form) في الموقع.`;

    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'حسناً، فهمت من أنا وما هي التعليمات. سأجيب الآن بناءً عليها.' }] }
    ];

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return new Response(JSON.stringify({ error: 'Configuration Error' }), { status: 500 });
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: contents,
        generationConfig: { 
            maxOutputTokens: 250, 
            temperature: 0.7 
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
        console.error('Gemini API Error:', data);
        throw new Error(data.error?.message || 'API Error');
    }

    const reply = data.candidates[0].content.parts[0].text;
    
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
