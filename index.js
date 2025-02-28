const express = require("express");
const os = require("os");

const app = express();
const port = 3000;

// Route to get system usage data
app.get("/system-usage", (req, res) => {
    const cpuUsage = os.cpus().map((cpu, index) => {
        const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
        const idle = cpu.times.idle;
        const usage = ((1 - idle / total) * 100).toFixed(2);
        return { core: `Core ${index}`, usage: usage };
    });

    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsage = ((1 - freeMemory / totalMemory) * 100).toFixed(2);

    res.json({
        cpuUsage,
        memoryUsage: memoryUsage,
        totalMemory: (totalMemory / (1024 * 1024 * 1024)).toFixed(2),
        freeMemory: (freeMemory / (1024 * 1024 * 1024)).toFixed(2),
        uptime: (os.uptime() / 60).toFixed(2),
    });
});

// Serve the GUI from the same file
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>System Usage V1.0.4</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    text-align: center;
                    margin: 20px;
                }
                .container {
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                }
                .card {
                    background: #f3f3f3;
                    padding: 15px;
                    margin: 10px;
                    border-radius: 10px;
                    width: 300px;
                    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
                }
                .bar {
                    height: 20px;
                    background: green;
                    border-radius: 5px;
                }
            </style>
        </head>
        <body>
            <h1>System Usage V1.0.4</h1>
            <div class="container">
                <div class="card">
                    <h2>Memory Usage</h2>
                    <p><strong id="memoryUsage">Loading...</strong>%</p>
                    <p>Total: <span id="totalMemory"></span> GB</p>
                    <p>Free: <span id="freeMemory"></span> GB</p>
                </div>

                <div class="card">
                    <h2>CPU Usage</h2>
                    <div id="cpuContainer"></div>
                </div>

                <div class="card">
                    <h2>System Uptime</h2>
                    <p><strong id="uptime">Loading...</strong> minutes</p>
                </div>
            </div>

            <script>
                async function fetchSystemUsage() {
                    try {
                        const response = await fetch("/system-usage");
                        const data = await response.json();

                        document.getElementById("memoryUsage").innerText = data.memoryUsage;
                        document.getElementById("totalMemory").innerText = data.totalMemory;
                        document.getElementById("freeMemory").innerText = data.freeMemory;
                        document.getElementById("uptime").innerText = data.uptime;

                        const cpuContainer = document.getElementById("cpuContainer");
                        cpuContainer.innerHTML = "";
                        data.cpuUsage.forEach(cpu => {
                            const cpuBar = document.createElement("div");
                            cpuBar.style.width = cpu.usage + "%";
                            cpuBar.className = "bar";
                            cpuContainer.appendChild(cpuBar);

                            const cpuLabel = document.createElement("p");
                            cpuLabel.innerText = \`\${cpu.core}: \${cpu.usage}%\`;
                            cpuContainer.appendChild(cpuLabel);
                        });

                    } catch (error) {
                        console.error("Error fetching data:", error);
                    }
                }

                fetchSystemUsage();
                setInterval(fetchSystemUsage, 5000);
            </script>
        </body>
        </html>
    `);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
