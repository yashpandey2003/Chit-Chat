const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDb = require('./utils/db');
const app = express();
const userRoutes = require('./routes/userRoutes');
const messageRoute = require('./routes/messagesRoute');
require("dotenv").config();



app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);


mongoose.connect(process.env.MONGO_URL);


const PORT = process.env.PORT || 5000;
connectDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
});

