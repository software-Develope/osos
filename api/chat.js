module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `أنت مساعد ذكي ولطيف لمبيعات استوديو "أسس ديف" (Osos Dev).
معلومات عن الاستوديو:
- المؤسسون: مهندسا البرمجيات بدر فرحان وحمزة الخطيب.
- الخدمات: تطوير تطبيقات الجوال (Flutter)، تطوير مواقع وتطبيقات الويب (React, Node.js, Next.js)، تصميم واجهات وتجربة المستخدم (UI/UX)، برمجة الذكاء الاصطناعي والأتمتة (Python)، وتصميم وبناء قواعد البيانات.
- أسلوب الرد: احترافي، ودود جداً، قصير ومباشر (بدون حشو). يجب ألا يتجاوز ردك فقرتين قصيرتين ليناسب نافذة الشات. استخدم اللهجة البيضاء أو الفصحى المبسطة.
- التوجيه (Call to Action): إذا طلب العميل تسعيراً لمشروعه، أو أراد حجز استشارة أو تفاصيل تقنية عميقة، اعتذر بلباقة عن إعطاء أسعار ثابتة لأنها تعتمد على المتطلبات، ووجهه فوراً للتواصل عبر الواتساب على الرقم +962779542615 أو تعبئة نموذج التواصل (Contact Form) في الموقع.`;

    const messages = [
      { role: 'system', content: systemPrompt }
    ];

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.text
        });
      });
    }

    messages.push({ role: 'user', content: message });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API Key is not set');
      return res.status(500).json({ error: 'Configuration Error' });
    }

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://osos.dev', // Required by OpenRouter
        'X-Title': 'Osos Dev Chatbot'       // Required by OpenRouter
      },
      body: JSON.stringify({
        model: 'google/gemini-1.5-flash', // You can change this to any OpenRouter model
        messages: messages,
        max_tokens: 250,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
        console.error('OpenRouter API Error:', data);
        return res.status(500).json({ error: data.error?.message || 'API Error' });
    }

    const reply = data.choices[0].message.content;
    
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً.' });
  }
}
