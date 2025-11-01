const express = require('express'); // framework giúp tạo web server(dùng để định nghĩa route, nhận request, gửi response, v.v.).
const cors = require('cors');
const { connectDB } = require('./config/connectDB');
const StopRoutes = require('./Routes/StopRoutes');

const app = express(); // là đối tượng Express chính, đại diện cho server.
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/Stop', StopRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Đang chạy ở Port ${PORT}`);
    });
};

startServer();


// test connect
// app.get('/', (req, res) => {
//     res.send('Kết nối thành công')
// })

// app.listen(PORT, () => {
//     console.log(`Đang chạy ở Port: ${PORT}`)
// })

