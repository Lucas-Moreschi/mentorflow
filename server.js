// Load env from .env (used by both Next.js and Prisma in dev)
require("dotenv").config({ path: ".env.local" });
require("dotenv").config({ path: ".env" });

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { PrismaClient } = require("@prisma/client");

const dev = process.env.NODE_ENV !== "production";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // Middleware: validate session cookie
  io.use(async (socket, next) => {
    try {
      const userId = socket.handshake.auth.userId;
      if (!userId) return next(new Error("Unauthorized"));

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, role: true },
      });

      if (!user) return next(new Error("Unauthorized"));

      socket.data.userId = user.id;
      socket.data.userName = user.name;
      socket.data.userRole = user.role;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { userId, userName } = socket.data;

    socket.on("join-room", async ({ mentorshipId }) => {
      try {
        const mentorship = await prisma.mentorship.findFirst({
          where: {
            id: mentorshipId,
            OR: [{ studentId: userId }, { mentorId: userId }],
          },
        });

        if (!mentorship) {
          socket.emit("error", { message: "Mentorship not found" });
          return;
        }

        socket.join(mentorshipId);
        socket.emit("room-joined", { mentorshipId });
      } catch (err) {
        console.error("join-room error:", err);
      }
    });

    socket.on("leave-room", ({ mentorshipId }) => {
      socket.leave(mentorshipId);
    });

    socket.on("send-message", async ({ mentorshipId, content }) => {
      try {
        if (!content?.trim()) return;

        const mentorship = await prisma.mentorship.findFirst({
          where: {
            id: mentorshipId,
            status: "ACTIVE",
            OR: [{ studentId: userId }, { mentorId: userId }],
          },
        });

        if (!mentorship) return;

        const message = await prisma.message.create({
          data: {
            mentorshipId,
            senderId: userId,
            content: content.trim(),
          },
        });

        io.to(mentorshipId).emit("message-received", {
          ...message,
          createdAt: message.createdAt.toISOString(),
        });

        // Notify the other participant
        const recipientId =
          mentorship.studentId === userId
            ? mentorship.mentorId
            : mentorship.studentId;

        io.to(`user:${recipientId}`).emit("notification", {
          type: "message",
          mentorshipId,
          message: `New message from ${userName}`,
        });
      } catch (err) {
        console.error("send-message error:", err);
      }
    });

    socket.on("typing-start", ({ mentorshipId }) => {
      socket.to(mentorshipId).emit("user-typing", {
        userId,
        name: userName,
      });
    });

    socket.on("typing-stop", ({ mentorshipId }) => {
      socket.to(mentorshipId).emit("user-stopped-typing", { userId });
    });

    // User joins their personal notification room
    socket.join(`user:${userId}`);

    socket.on("disconnect", () => {
      // cleanup handled automatically by socket.io room tracking
    });
  });

  httpServer.listen(port, () => {
    console.log(`> MentorFlow ready on http://localhost:${port}`);
  });
});
