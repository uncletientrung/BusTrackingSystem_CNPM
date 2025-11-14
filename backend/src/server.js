const express = require('express'); // framework giúp tạo web server(dùng để định nghĩa route, nhận request, gửi response, v.v.).
const cors = require('cors');
const { connectDB } = require('./config/connectDB');
const StopRoutes = require('./Routes/StopRoutes');
const UserRoutes = require('./Routes/UserRoutes');
const AcountRoutes = require('./Routes/AccountRoutes');
const StudentRoutes = require('./Routes/StudentRoutes');
const BusRoutes = require('./Routes/BusRoutes');
const RouteRoutes = require('./Routes/RouteRoutes');
const ScheduleRoutes = require('./Routes/ScheduleRoutes');
const NotificationRoutes = require('./Routes/NotificationRoutes');
const CTRoutes = require('./Routes/CTRouteRoutes');
    
const app = express(); // là đối tượng Express chính, đại diện cho server.
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use('/api/Stop', StopRoutes);
app.use('/api/User', UserRoutes);
app.use('/api/Account', AcountRoutes);
app.use('/api/Student', StudentRoutes);
app.use('/api/Bus', BusRoutes);
app.use('/api/Route', RouteRoutes);
app.use('/api/Schedule', ScheduleRoutes);
app.use('/api/Notification', NotificationRoutes);
app.use('/api/CTRoute', CTRoutes);

const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`Đang chạy ở Port ${PORT}`);
    });
};

startServer();


