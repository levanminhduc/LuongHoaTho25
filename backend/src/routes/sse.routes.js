const express = require("express");
const { authenticateToken, requireRole } = require("../middlewares/auth");
const sseService = require("../services/sseService");

const router = express.Router();

/**
 * @swagger
 * /api/sse/connect:
 *   get:
 *     summary: Establish SSE connection for real-time updates (Admin only)
 *     tags: [SSE]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SSE connection established
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get("/connect", (req, res) => {
  console.log("📡 SSE: Received connection request");
  try {
    // Get token from query parameter for SSE (EventSource doesn't support headers)
    const token =
      req.query.token || req.headers.authorization?.replace("Bearer ", "");
    console.log("🔑 SSE: Token received:", token ? "Yes" : "No");

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Token required for SSE connection",
      });
    }

    // Manually verify token and role
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin access required",
      });
    }

    const userId = decoded.username;

    // Add SSE connection
    sseService.addConnection(userId, res);

    console.log(`📡 SSE: Admin ${userId} connected successfully`);
  } catch (error) {
    console.error("❌ SSE connection error:", error.message);
    res.status(500).json({
      error: "SSE Connection Failed",
      message: "Unable to establish SSE connection",
    });
  }
});

/**
 * @swagger
 * /api/sse/stats:
 *   get:
 *     summary: Get SSE connection statistics (Admin only)
 *     tags: [SSE]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SSE statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 activeConnections:
 *                   type: number
 *                 connectedAdmins:
 *                   type: array
 *                   items:
 *                     type: string
 *                 eventHistorySize:
 *                   type: number
 *                 uptime:
 *                   type: number
 */
router.get("/stats", authenticateToken, requireRole(["admin"]), (req, res) => {
  try {
    const stats = sseService.getStats();
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("❌ Error getting SSE stats:", error.message);
    res.status(500).json({
      error: "Stats Error",
      message: "Unable to retrieve SSE statistics",
    });
  }
});

/**
 * @swagger
 * /api/sse/history:
 *   get:
 *     summary: Get SSE event history (Admin only)
 *     tags: [SSE]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of events to retrieve
 *     responses:
 *       200:
 *         description: Event history
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 */
router.get(
  "/history",
  authenticateToken,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const history = await sseService.getEventHistoryFromDB(limit);

      res.json({
        success: true,
        data: history,
        count: history.length,
      });
    } catch (error) {
      console.error("❌ Error getting SSE history:", error.message);
      res.status(500).json({
        error: "History Error",
        message: "Unable to retrieve event history",
      });
    }
  }
);

/**
 * @swagger
 * /api/sse/test:
 *   post:
 *     summary: Send test SSE event (Admin only - for testing)
 *     tags: [SSE]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: "Test notification"
 *     responses:
 *       200:
 *         description: Test event sent
 */
router.post("/test", authenticateToken, requireRole(["admin"]), (req, res) => {
  try {
    const { message = "Test SSE event" } = req.body;

    sseService.broadcast({
      type: "test",
      message: message,
      sender: req.user.username,
    });

    res.json({
      success: true,
      message: "Test event broadcasted to all connected admins",
    });
  } catch (error) {
    console.error("❌ Error sending test SSE event:", error.message);
    res.status(500).json({
      error: "Test Error",
      message: "Unable to send test event",
    });
  }
});

/**
 * @swagger
 * /api/sse/performance:
 *   get:
 *     summary: Get SSE performance metrics (Admin only)
 *     tags: [SSE]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance metrics
 */
router.get(
  "/performance",
  authenticateToken,
  requireRole(["admin"]),
  (req, res) => {
    try {
      const metrics = sseService.getPerformanceMetrics();
      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      console.error("❌ Error getting SSE performance metrics:", error.message);
      res.status(500).json({
        error: "Performance Error",
        message: "Unable to retrieve performance metrics",
      });
    }
  }
);

module.exports = router;
