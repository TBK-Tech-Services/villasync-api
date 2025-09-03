import express from 'express';
import authRoutes from '../src/routes/auth.routes.ts';
import bookingsRoutes from '../src/routes/bookings.routes.ts';
import expensesRoutes from '../src/routes/expenses.routes.ts';
import financeRoutes from '../src/routes/finance.routes.ts';
import usersRoutes from '../src/routes/users.routes.ts';
import villasRoutes from '../src/routes/villas.routes.ts';
import adminDashboardRoutes from '../src/routes/adminDashboard.routes.ts';
import settingsRoutes from '../src/routes/settings.routes.ts';
import agentRoutes from '../src/routes/agent.routes.ts';

const app = express();

// Routes for Admin Dashboard
app.use("/auth/v1" , authRoutes);
app.use("/dashboard/v1" , adminDashboardRoutes);
app.use("/bookings/v1" , bookingsRoutes);
app.use("/villas/v1" , villasRoutes);
app.use("/expenses/v1" , expensesRoutes);
app.use("/finance/v1" , financeRoutes);
app.use("/users/v1" , usersRoutes);
app.use("/settings/v1" , settingsRoutes);

// Routes for Agent Landing Page
app.use("/agent/v1" , agentRoutes);

export default app;