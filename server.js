const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());

// Database Connection
mongoose.connect('mongodb+srv://testuser:testpassword@cluster0.mongodb.net/taskDB?retryWrites=true&w=majority');

// Task Schema
const Task = mongoose.model('Task', { title: String, assignedTo: String, status: { type: String, default: 'Pending' } });

// Frontend
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial; padding: 40px; text-align: center; background: #f0f2f5;">
        <h1 style="color: #1a73e8;">✅ Team Task Manager</h1>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: inline-block;">
          <input id="t" placeholder="Task Title" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;"> 
          <input id="a" placeholder="Assign To" style="padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
          <button onclick="add()" style="padding: 10px 20px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Task</button>
        </div>
        <div id="list" style="margin-top: 30px; display: flex; flex-direction: column; align-items: center;"></div>
        <script>
          async function load() {
            const r = await fetch('/api/tasks');
            const data = await r.json();
            document.getElementById('list').innerHTML = data.map(t => 
              '<div style="background: white; margin: 5px; padding: 10px; width: 300px; border-radius: 4px; border-left: 5px solid #1a73e8; text-align: left;">' + 
              '<b>' + t.title + '</b> <br> <small>Assigned to: ' + t.assignedTo + '</small></div>'
            ).join('');
          }
          async function add() {
            const t = document.getElementById('t').value;
            const a = document.getElementById('a').value;
            if(!t || !a) return alert('Dono fields bharo bhai!');
            await fetch('/api/tasks', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ title: t, assignedTo: a })
            });
            document.getElementById('t').value = '';
            document.getElementById('a').value = '';
            load();
          }
          load();
        </script>
      </body>
    </html>
  `);
});

app.get('/api/tasks', async (req, res) => res.json(await Task.find()));
app.post('/api/tasks', async (req, res) => res.json(await new Task(req.body).save()));

// Isse replace karo niche wali 2 lines se
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
