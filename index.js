const express = require('express');
const os = require('os');

const app = express();
const port = 3000;

// Route to get system usage data
app.get('/system-usage', (req, res) => {
    // Get CPU usage
    const cpuUsage = os.cpus();
    const cpuInfo = cpuUsage.map((cpu, index) => {
        const total = Object.values(cpu.times).reduce((acc, time) => acc + time, 0);
        const idle = cpu.times.idle;
        const usage = ((1 - idle / total) * 100).toFixed(2);
        return {
            core: index,
            usage: usage + '%'
        };
    });

    // Get memory usage
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const memoryUsage = ((1 - freeMemory / totalMemory) * 100).toFixed(2);

    // Get system uptime
    const uptime = os.uptime();

    // Prepare response data
    const systemUsageData = {
        cpuUsage: cpuInfo,
        memoryUsage: memoryUsage + '%',
        totalMemory: totalMemory / (1024 * 1024 * 1024) + ' GB',  // in GB
        freeMemory: freeMemory / (1024 * 1024 * 1024) + ' GB',    // in GB
        uptime: (uptime / 60).toFixed(2) + ' minutes'  // in minutes
    };

    // Send the response as JSON
    res.json(systemUsageData);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
