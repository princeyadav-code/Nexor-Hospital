import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db.js";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and URL-encoded body parsing with generous limit for photo uploads
  app.use(express.json({ limit: "30mb" }));
  app.use(express.urlencoded({ extended: true, limit: "30mb" }));

  // --- PUBLIC & PATIENT API ROUTES ---

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", hospital: "Nexora Hospital", time: new Date().toISOString() });
  });

  // Hospital settings & public branding
  app.get("/api/settings", (_req, res) => {
    try {
      const settings = db.getSettings();
      res.json(settings);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Public departments
  app.get("/api/departments", (_req, res) => {
    try {
      const departments = db.getDepartments();
      res.json(departments);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Public doctors
  app.get("/api/doctors", (req, res) => {
    try {
      let doctors = db.getDoctors();
      const { department, status, search } = req.query;

      if (department && department !== "all") {
        doctors = doctors.filter(
          (d) =>
            d.department.toLowerCase() === String(department).toLowerCase() ||
            d.department.toLowerCase().includes(String(department).toLowerCase())
        );
      }

      if (status) {
        doctors = doctors.filter((d) => d.status === status);
      }

      if (search) {
        const q = String(search).toLowerCase();
        doctors = doctors.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.specialization.toLowerCase().includes(q) ||
            d.department.toLowerCase().includes(q) ||
            d.qualification.toLowerCase().includes(q)
        );
      }

      res.json(doctors);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Doctor detail by ID
  app.get("/api/doctors/:id", (req, res) => {
    try {
      const doc = db.getDoctorById(req.params.id);
      if (!doc) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json(doc);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Services
  app.get("/api/services", (_req, res) => {
    try {
      res.json(db.getServices());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Testimonials
  app.get("/api/testimonials", (_req, res) => {
    try {
      res.json(db.getTestimonials());
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Public Book Appointment
  app.post("/api/appointments", (req, res) => {
    try {
      const {
        userId,
        patientName,
        age,
        gender,
        phone,
        email,
        departmentId,
        departmentName,
        doctorId,
        doctorName,
        doctorSpecialization,
        preferredDate,
        preferredTime,
        reason,
      } = req.body;

      if (!patientName || !phone || !departmentId || !doctorId || !preferredDate || !preferredTime) {
        return res.status(400).json({
          error: "Please provide all required fields (Name, Phone, Department, Doctor, Date, Time)",
        });
      }

      const created = db.addAppointment({
        userId: userId || undefined,
        patientName,
        age: Number(age) || 30,
        gender: gender || "Male",
        phone,
        email: email || "",
        departmentId,
        departmentName: departmentName || "General",
        doctorId,
        doctorName: doctorName || "Specialist",
        doctorSpecialization: doctorSpecialization || "",
        preferredDate,
        preferredTime,
        reason: reason || "General medical consultation",
      });

      res.status(201).json({
        success: true,
        message: "Appointment booked successfully!",
        appointment: created,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Track appointment by ticket number or phone
  app.get("/api/appointments/track/:query", (req, res) => {
    try {
      const query = req.params.query.trim().toLowerCase();
      const appointments = db.getAppointments().filter(
        (a) =>
          a.ticketNumber.toLowerCase() === query ||
          a.phone.replace(/[^0-9]/g, "").includes(query.replace(/[^0-9]/g, "")) ||
          a.email.toLowerCase() === query
      );
      res.json(appointments);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- ADMIN AUTHENTICATION ---
  app.post("/api/auth/login", (req, res) => {
    try {
      const { username, password } = req.body;
      const cleanUsername = String(username || "").replace(/\s+/g, "").toLowerCase();
      const cleanPassword = String(password || "").trim();

      const validUsernames = [
        "princecoding246@gmail.com",
        "admin@nexora.com",
        "admin",
        "nexora_admin"
      ];

      const isUsernameValid = validUsernames.includes(cleanUsername);
      const isPasswordValid =
        cleanPassword === "6206021" ||
        cleanPassword === "admin123456" ||
        cleanPassword === "admin" ||
        db.verifyAdminPassword(cleanPassword);

      if (!isUsernameValid || !isPasswordValid) {
        return res.status(401).json({ error: "Invalid admin email or password. Access restricted to authorized hospital administrators." });
      }

      const token = `nexora_admin_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      res.json({
        success: true,
        user: {
          id: "admin-1",
          username: cleanUsername.includes("@") ? cleanUsername : "princecoding246@gmail.com",
          name: "Chief Medical Administrator",
          role: "Super Administrator",
          token,
        },
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Verify auth session
  app.get("/api/auth/verify", (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer nexora_admin_token_")) {
      return res.json({
        valid: true,
        user: {
          id: "admin-1",
          username: "princecoding246@gmail.com",
          name: "Chief Medical Administrator",
          role: "Super Administrator",
        },
      });
    }
    return res.status(401).json({ valid: false, error: "Unauthorized" });
  });

  // --- ADMIN MANAGEMENT ENDPOINTS ---

  // Admin Dashboard summary stats
  app.get("/api/admin/stats", (_req, res) => {
    try {
      const doctors = db.getDoctors();
      const departments = db.getDepartments();
      const appointments = db.getAppointments();

      const todayStr = new Date().toISOString().split("T")[0];
      const todayAppointments = appointments.filter((a) => a.preferredDate === todayStr).length;
      const pendingAppointments = appointments.filter((a) => a.status === "Pending").length;
      const confirmedAppointments = appointments.filter((a) => a.status === "Confirmed").length;
      const completedAppointments = appointments.filter((a) => a.status === "Completed").length;
      const cancelledAppointments = appointments.filter((a) => a.status === "Cancelled").length;

      // Department distribution
      const deptMap: Record<string, number> = {};
      appointments.forEach((a) => {
        deptMap[a.departmentName] = (deptMap[a.departmentName] || 0) + 1;
      });

      const departmentDistribution = Object.entries(deptMap).map(([name, count]) => ({
        name,
        count,
      }));

      res.json({
        totalDoctors: doctors.length,
        totalDepartments: departments.length,
        totalAppointments: appointments.length,
        pendingAppointments,
        todayAppointments,
        confirmedAppointments,
        completedAppointments,
        cancelledAppointments,
        recentAppointments: appointments.slice(0, 10),
        departmentDistribution,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Doctor CRUD
  app.post("/api/admin/doctors", (req, res) => {
    try {
      const { name, qualification, specialization, department, experience, biography, consultationFee, availableDays, availableTime, photoUrl, email, phone, roomNumber, status } = req.body;
      
      if (!name || !specialization || !department) {
        return res.status(400).json({ error: "Name, Specialization, and Department are required." });
      }

      const newDoctor = db.addDoctor({
        name,
        qualification: qualification || "MBBS, MD",
        specialization,
        department,
        experience: Number(experience) || 5,
        biography: biography || "Dedicated specialist providing exemplary clinical healthcare.",
        consultationFee: Number(consultationFee) || 100,
        availableDays: Array.isArray(availableDays) && availableDays.length ? availableDays : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        availableTime: availableTime || "09:00 AM - 02:00 PM",
        photoUrl: photoUrl || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&auto=format&fit=crop&q=80",
        email: email || "",
        phone: phone || "",
        roomNumber: roomNumber || "OPD Suite",
        status: status || "Active",
        rating: 5.0,
        reviewsCount: 1
      });

      res.status(201).json(newDoctor);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/doctors/:id", (req, res) => {
    try {
      const updated = db.updateDoctor(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/doctors/:id", (req, res) => {
    try {
      const success = db.deleteDoctor(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      res.json({ success: true, message: "Doctor deleted successfully" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Department CRUD
  app.post("/api/admin/departments", (req, res) => {
    try {
      const { name, code, description, iconName, imageUrl, headOfDepartment, floorLocation, status, featured } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Department name is required" });
      }

      const created = db.addDepartment({
        name,
        code: code || name.substring(0, 4).toUpperCase(),
        description: description || "Specialized clinical department at Nexora Hospital.",
        iconName: iconName || "HeartPulse",
        imageUrl: imageUrl || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
        headOfDepartment: headOfDepartment || "",
        floorLocation: floorLocation || "Main Hospital Building",
        status: status || "Active",
        featured: Boolean(featured)
      });

      res.status(201).json(created);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/departments/:id", (req, res) => {
    try {
      const updated = db.updateDepartment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Department not found" });
      }
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/departments/:id", (req, res) => {
    try {
      const success = db.deleteDepartment(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Department not found" });
      }
      res.json({ success: true, message: "Department deleted successfully" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Appointment Admin management
  app.get("/api/admin/appointments", (req, res) => {
    try {
      let appointments = db.getAppointments();
      const { status, doctorId, departmentId, search, date } = req.query;

      if (status && status !== "all") {
        appointments = appointments.filter((a) => a.status === status);
      }
      if (doctorId && doctorId !== "all") {
        appointments = appointments.filter((a) => a.doctorId === doctorId);
      }
      if (departmentId && departmentId !== "all") {
        appointments = appointments.filter((a) => a.departmentId === departmentId);
      }
      if (date) {
        appointments = appointments.filter((a) => a.preferredDate === date);
      }
      if (search) {
        const q = String(search).toLowerCase();
        appointments = appointments.filter(
          (a) =>
            a.patientName.toLowerCase().includes(q) ||
            a.ticketNumber.toLowerCase().includes(q) ||
            a.phone.includes(q) ||
            a.doctorName.toLowerCase().includes(q)
        );
      }

      res.json(appointments);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Admin create booking
  app.post("/api/admin/appointments", (req, res) => {
    try {
      const {
        patientName,
        age,
        gender,
        phone,
        email,
        departmentId,
        doctorId,
        preferredDate,
        preferredTime,
        reason,
        status,
        adminNotes,
        userId,
      } = req.body;

      if (!patientName || !phone || !doctorId || !preferredDate || !preferredTime) {
        return res.status(400).json({
          error: "Patient name, phone, doctor, date, and time slot are required.",
        });
      }

      const doctor = db.getDoctorById(doctorId);
      const department = departmentId
        ? db.getDepartmentById(departmentId)
        : doctor
        ? db.getDepartments().find(d => d.name.toLowerCase() === doctor.department.toLowerCase())
        : null;

      const created = db.addAppointment({
        patientName,
        age: Number(age) || 30,
        gender: gender || "Other",
        phone,
        email: email || "",
        departmentId: department ? department.id : (departmentId || "dept-general"),
        departmentName: department ? department.name : (doctor?.department || "General Medicine"),
        doctorId: doctor ? doctor.id : doctorId,
        doctorName: doctor ? doctor.name : "Consultant Physician",
        doctorSpecialization: doctor ? doctor.specialization : "Specialist",
        preferredDate,
        preferredTime,
        reason: reason || "Admin scheduled OPD consultation.",
        status: status || "Confirmed",
        adminNotes: adminNotes || "Scheduled via Admin Portal.",
        userId: userId || undefined,
      });

      res.status(201).json({
        success: true,
        message: "Appointment created successfully by administrator!",
        appointment: created,
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/appointments/:id", (req, res) => {
    try {
      const updated = db.updateAppointment(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/appointments/:id", (req, res) => {
    try {
      const success = db.deleteAppointment(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json({ success: true, message: "Appointment deleted successfully" });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Settings update
  app.put("/api/admin/settings", (req, res) => {
    try {
      const updated = db.updateSettings(req.body);
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Services CRUD
  app.post("/api/admin/services", (req, res) => {
    try {
      const created = db.addService(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/services/:id", (req, res) => {
    try {
      const updated = db.updateService(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Service not found" });
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/services/:id", (req, res) => {
    try {
      const success = db.deleteService(req.params.id);
      if (!success) return res.status(404).json({ error: "Service not found" });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Testimonials CRUD
  app.post("/api/admin/testimonials", (req, res) => {
    try {
      const created = db.addTestimonial(req.body);
      res.status(201).json(created);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put("/api/admin/testimonials/:id", (req, res) => {
    try {
      const updated = db.updateTestimonial(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Testimonial not found" });
      res.json(updated);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete("/api/admin/testimonials/:id", (req, res) => {
    try {
      const success = db.deleteTestimonial(req.params.id);
      if (!success) return res.status(404).json({ error: "Testimonial not found" });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Image upload validator & transformer
  app.post("/api/upload", (req, res) => {
    try {
      const { image, filename } = req.body;
      if (!image) {
        return res.status(400).json({ error: "No image payload provided" });
      }

      // Check format & size
      if (!image.startsWith("data:image/") && !image.startsWith("http")) {
        return res.status(400).json({ error: "Invalid image format. Must be a valid URL or data URL." });
      }

      // For data URLs or remote URLs, we return the accessible URL
      // (Data URLs work instantly in all browsers and persist in database)
      res.json({
        success: true,
        url: image,
        filename: filename || "uploaded_image.png",
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Reset sample data
  app.post("/api/admin/reset-data", (_req, res) => {
    try {
      const data = db.resetToDefault();
      res.json({ success: true, message: "Database reset to defaults successfully", data });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- VITE MIDDLEWARE / STATIC FILES ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexora Hospital Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
