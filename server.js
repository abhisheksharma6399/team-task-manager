const express = require('express');
const app = express();

app.use(express.json());

// DATABASE JUGAD: Hum temporary memory use karenge taaki error na aaye
let tasks = [
  { id: 1, title: "Setup Project", assignedTo: "Admin", status: "Done" },
  { id: 2, title: "Deploy on Railway", assignedTo: "Abhishek", status: "In-Progress" }
];

// Frontend HTML
app.get('/', (req, res) => {
  res.send(`
    <html>
      <body style="font-family: Arial; padding: 40px; text-align: center; background: #f0f2f5;">
        <h1 style="color: #1a73e8;">✅ Team Task Manager</h1>
        <p>Status: <span style="color: green; font-weight: bold;">Connected & Live</span></p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: inline-block; margin-bottom: 20px;">
          <input id="t" placeholder="Task Title" style="padding: 10px; border: 1px solid #ccc;"> 
          <input id="a" placeholder="Assign To" style="padding: 10px; border: 1px solid #ccc;">
          <button onclick="add()" style="padding: 10px 20px; background: #1a73e8; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Task</button>
        </div>

        <div id="list" style="display: flex; flex-direction: column; align-items: center;"></div>

        <script>
          async function load() {
            const r = await fetch('/api/tasks');
            const data = await r.json();
            document.getElementById('list').innerHTML = data.map(t => 
              '<div style="background: white; margin: 5px; padding: 15px; width: 350px; border-left: 5px solid #1a73e8; text-align: left; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">' + 
              '<b>' + t.title + '</b> <br> <small>Assigned to: ' + t.assignedTo + ' | Status: ' + (t.status || "Pending") + '</small></div>'
            ).join('');
          }

          async function add() {
            const title = document.getElementById('t').value;
            const assignedTo = document.getElementById('a').value;
            if(!title || !assignedTo) return alert("Bhai dono bharo!");
            
            await fetch('/api/tasks', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ title, assignedTo })
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

// API Routes
app.get('/api/tasks', (req, res) => res.json(tasks));
app.post('/api/tasks', (req, res) => {
  const newTask = { id: tasks.length + 1, ...req.body, status: "Pending" };
  tasks.push(newTask);
  res.json(newTask);
});

// Port Setup for Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Server is running on port ' + PORT);
});
