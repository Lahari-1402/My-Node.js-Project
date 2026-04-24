const Brand = require("../models/Brand");
const Note = require("../models/Note");

// CREATE BRAND
exports.createBrand = async (req, res) => {
  try {
    const { brand_name, founder_name, category, monthly_revenue, website } = req.body;

    // validation
    if (!brand_name || !founder_name || !category) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    if (monthly_revenue < 0) {
      return res.status(400).json({ error: "Revenue must be >= 0" });
    }

    const brand = new Brand({
      brand_name,
      founder_name,
      category,
      monthly_revenue,
      website
    });

    await brand.save();

    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 2. GET BRANDS (FILTER)
exports.getBrands = async (req, res) => {
  try {
    const { status, category } = req.query;

    let filter = {};

    if (status) filter.status = status;
    if (category) filter.category = category;

    const brands = await Brand.find(filter);

    res.json(brands);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 3. GET SINGLE BRAND + NOTES
exports.getBrandById = async (req, res) => {
  try {
    const brand = await Brand.findById(req.params.id);

    if (!brand) {
      return res.status(404).json({ error: "Brand not found" });
    }

    const notes = await Note.find({ brand_id: brand._id });

    res.json({
      ...brand.toObject(),
      notes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 4. STATUS MANAGEMENT
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const brand = await Brand.findById(req.params.id);
    if (!brand) return res.status(404).json({ error: "Brand not found" });

    const flow = ["SUBMITTED", "UNDER_REVIEW", "SHORTLISTED", "ACCEPTED", "REJECTED"];

    const currentIndex = flow.indexOf(brand.status);
    const newIndex = flow.indexOf(status);

    if (
      newIndex !== currentIndex + 1 &&
      !(brand.status === "SHORTLISTED" &&
        (status === "ACCEPTED" || status === "REJECTED"))
    ) {
      return res.status(400).json({ error: "Invalid status transition" });
    }

    if (["ACCEPTED", "REJECTED"].includes(brand.status)) {
      return res.status(400).json({ error: "Final status cannot be changed" });
    }

    brand.status = status;
    brand.updated_at = Date.now();

    await brand.save();

    res.json(brand);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 5. ADD NOTE
exports.addNote = async (req, res) => {
  try {
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ error: "Note cannot be empty" });
    }

    const newNote = new Note({
      brand_id: req.params.id,
      note
    });

    await newNote.save();

    res.status(201).json(newNote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// 6. DASHBOARD SUMMARY
exports.getSummary = async (req, res) => {
  try {
    const total = await Brand.countDocuments();

    const summary = {
      total,
      submitted: await Brand.countDocuments({ status: "SUBMITTED" }),
      under_review: await Brand.countDocuments({ status: "UNDER_REVIEW" }),
      shortlisted: await Brand.countDocuments({ status: "SHORTLISTED" }),
      accepted: await Brand.countDocuments({ status: "ACCEPTED" }),
      rejected: await Brand.countDocuments({ status: "REJECTED" })
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
