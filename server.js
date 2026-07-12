const express = require('express');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
const PORT = 3000;
app.post('/ask-ai', async (req, res) => {
    const taskText = req.body.taskText;
    const deadline = req.body.deadline;
    const lang = req.body.lang;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: `Ты — тёплый, поддерживающий друг. Помоги мне начать задачу "${taskText}" (дедлайн: ${deadline}). Дай короткий совет с одним конкретным первым действием — не общими словами, а что именно сделать прямо сейчас. Пиши на "ты", простыми словами, без канцелярита и без вступлений вроде "конечно" или "хорошо". Уложись в 15-20 слов, 1-2 предложения. Отвечай на языке с кодом "${lang}"  .` }]
        })
    });
    const data = await response.json();
    const advice = data.choices[0].message.content;
    res.json({ advice: advice });
});
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));