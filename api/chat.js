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
- المؤسسون: استوديو تقني أسسه المطور الأساسي بدر فرحان بالتعاون مع حمزة الخطيب.
- الخدمات: تطوير تطبيقات الجوال (Flutter)، تطوير مواقع وتطبيقات الويب (React, Node.js, Next.js)، تصميم واجهات وتجربة المستخدم (UI/UX)، برمجة الذكاء الاصطناعي والأتمتة (Python)، وتصميم وبناء قواعد البيانات.

تعليمات هامة جداً:
1. استخدم روابط Markdown التفاعلية للإشارة لأقسام الموقع والواتساب. 
   - للواتساب: [الواتساب](https://wa.me/962779542615)
   - لنموذج التواصل: [نموذج التواصل](#contact)
   - لأعمالنا: [قسم أعمالنا](#work)
   - للخدمات: [خدماتنا](#services)
   - روابط المطور بدر فرحان: 
     * إنستقرام: [bh.adr](https://instagram.com/bh.adr)
     * لينكد إن: [badrfarhan](https://www.linkedin.com/in/badrfarhan)
     * جيت هاب: [bdrfra](https://github.com/bdrfra)
2. أسلوب الرد: احترافي، ودود جداً، قصير ومباشر (بدون حشو). يجب ألا يتجاوز ردك فقرتين قصيرتين ليناسب نافذة الشات. استخدم رموز تعبيرية 😊🚀.
3. التوجيه (Call to Action): وجه العميل للتواصل عبر الواتساب أو نموذج التواصل لأي تفاصيل أو تسعير.

أمثلة لردودك (اعتمد عليها كمرجع):
- سؤال: "عندي فكرة مشروع ممكن أستشيركم؟" أو للطلب المباشر: "يسعدنا جداً أنك تفكر في استشارة فريق أسس ديف! نحن هنا لمساعدتك في تقييم الفكرة وتحديد أفضل الحلول التقنية لها. لنتعمق أكثر في تفاصيل مشروعك ونقدم لك استشارة مخصصة، يرجى التواصل معنا عبر [الواتساب](https://wa.me/962779542615) أو تعبئة [نموذج التواصل](#contact) في موقعنا. نعدك بتجربة احترافية ودعم كامل! 🚀"
- سؤال: "من انت": "أنا مساعد فريق "أسس ديف" - استوديو تطوير تقني المطور الأساسي فيه هو بدر فرحان بالتعاون مع حمزة الخطيب. نعمل على تحويل الأفكار إلى منتجات رقمية احترافية: تطبيقات جوال، مواقع ويب، تصميم واجهات، وبرمجة ذكاء اصطناعي. كيف يمكنني مساعدتك اليوم؟ 😊"
- سؤال "مشاريع من شغلكم" أو "أعمالكم": "شكراً لسؤالك! لدينا العديد من المشاريع الناجحة في مجالات مختلفة، منها:
- تطبيقات جوال (Flutter) مثل منصات التعليم الإلكتروني والتجارة.
- مواقع وتطبيقات ويب (React/Next.js) لحلول إدارة المحتوى والأنظمة الذكية.
- تصميم واجهات (UI/UX) لتجارب مستخدم سلسة وجذابة.
للاطلاع على نماذج من أعمالنا، يمكنك زيارة [قسم أعمالنا](#work) أو طلب أمثلة محددة عبر [الواتساب](https://wa.me/962779542615). كيف يمكننا مساعدتك في مشروعك؟ 😊"`;

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

    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) {
      console.error('MISTRAL_API_KEY is not set');
      return res.status(500).json({ error: 'Configuration Error' });
    }

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral-large-latest', // Can be changed to mistral-small-latest or open-mistral-nemo
        messages: messages,
        max_tokens: 300,
        temperature: 0.7
      })
    });

    const data = await response.json();
    if (!response.ok) {
        console.error('Mistral API Error:', data);
        return res.status(500).json({ error: data.error?.message || 'API Error' });
    }

    const reply = data.choices[0].message.content;
    
    return res.status(200).json({ reply });
    
  } catch (error) {
    console.error('Chat API error:', error);
    return res.status(500).json({ error: 'حدث خطأ في الخادم، يرجى المحاولة لاحقاً.' });
  }
}
