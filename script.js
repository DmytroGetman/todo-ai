let tasks = [];

const saved = localStorage.getItem('tasks');
if (saved) {
    tasks = JSON.parse(saved);
}

function save() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function render() {
    const list = document.getElementById('task-list');
    list.innerHTML = '';

    for (let i = 0; i < tasks.length; i++) {
        const li = document.createElement('li');
        const d = new Date(tasks[i].deadline);
        const formatted = d.toLocaleString('en-GB', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
        li.textContent = tasks[i].text + ' — ' + formatted;
        list.appendChild(li);

        const del = document.createElement('button');
        del.textContent = "✖";
        del.addEventListener("click", function () {
            tasks.splice(i, 1);
            save();
            render();
        });
        li.appendChild(del);

       advice.addEventListener("click", async function () {
            const advice2 = document.getElementById('advice-box');
            const adviceText = document.getElementById('advice-text');

            advice.disabled = true;
            advice.textContent = "⏳";
            adviceText.textContent = "Thinking...";
            advice2.classList.add("visible");

            try {
                const response = await fetch('/ask-ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ taskText: tasks[i].text, deadline: tasks[i].deadline, lang: navigator.language })
                });

                if (!response.ok) {
                    throw new Error('Server error');
                }

                const data = await response.json();
                adviceText.textContent = data.advice;
            } catch (error) {
                adviceText.textContent = "Couldn't get advice. Please try again later.";
            } finally {
                advice.disabled = false;
                advice.textContent = "🧠";
            }
        });
        li.appendChild(advice);
    }
}


const btn = document.getElementById("add-btn");
btn.addEventListener("click", function () {
    const input = document.getElementById("task-input");
    const deadlineInput = document.getElementById("deadline-input");
    tasks.push({ text: input.value, deadline: deadlineInput.value, });
    save();
    render();
    input.value = '';
});

render();

setInterval(function () {
    const now = new Date();
    for (let i = 0; i < tasks.length; i++) {
        const deadline = new Date(tasks[i].deadline);
        const minutes = Math.floor((deadline - now) / 1000 / 60)
        if (minutes < 60 && minutes > 0) {
            new Notification(tasks[i].text + ' — ' + minutes + ' min left!');
        }
        console.log(tasks[i].text, minutes);
    }
}, 10000);

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

Notification.requestPermission();
