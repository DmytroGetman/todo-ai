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
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'user', content: `Дай короткий совет для того чтобы начать выполнять задачу, "${taskText}" как будто я человек которому сложно начать. Уложись в 15-20 слов, два-три предложение. Учитывай дедлайны "${deadline}" . Пиши разговорным языком, на "ты", без канцелярита и пафоса — как друг, а не как инструкция. Не отвечай сразу, подумай какое-то время.` }]
        })
    });
    const data = await response.json();
    const advice = data.choices[0].message.content;
    res.json({ advice: advice });
});
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));