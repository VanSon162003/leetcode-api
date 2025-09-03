const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { submissionRoutes } = require("./routes/submission.routes.js");
const { problemRoutes } = require("./routes/problem.routes.js");
const { categoryRoutes } = require("./routes/category.routes.js");
const { authRoutes } = require("./routes/auth.routes.js");
const { userProblemRoutes } = require("./routes/user-problem.routes.js");
const { sequelize } = require("./models/index.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDatabase = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');
        
        // Sync database (create tables if they don't exist)
        await sequelize.sync({ force: false });
        console.log('Database synchronized successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
};

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/user-problems", userProblemRoutes);

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Start server
const startServer = async () => {
    await connectDatabase();
    
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
};

startServer();
