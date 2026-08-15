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
      console.error('GEMINI_API_KEY is not set');
      return res.status(500).json({ error: 'Configuration Error' });
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
        return res.status(500).json({ error: data.error?.message || 'API Error' });
    }

    const reply = data.candidates[0].content.parts[0].text;
    
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً.' });
  }
}
