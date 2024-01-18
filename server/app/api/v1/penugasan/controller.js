const { StatusCodes } = require("http-status-codes");
const {
  createPenugasan,
  getAllPenugasan,
  getOnePenugasan,
  deletePenugasan,
  updatePenugasan,
} = require("../../../services/mongoose/penugasan");
const path = require("path");

class PenugasanController {
  async createPenugasan(req, res, next) {
    try {
      const result = await createPenugasan(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAllPenugasan(req, res, next) {
    try {
      const result = await getAllPenugasan(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getOnePenugasan(req, res, next) {
    try {
      const result = await getOnePenugasan(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async download(req, res, next) {
    const { filename } = req.params;
    const file = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "public",
      "uploads",
      filename
    );

    let contentType = "";

    // Determine content type based on file extension
    if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
      contentType = "image/jpeg";
    } else if (filename.endsWith(".png")) {
      contentType = "image/png";
    } else if (filename.endsWith(".gif")) {
      contentType = "image/gif";
    } else if (filename.endsWith(".doc")) {
      contentType = "application/msword";
    } else if (filename.endsWith(".docx")) {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else if (filename.endsWith(".pdf")) {
      contentType = "application/pdf";
    } // Add other file types as needed

    // Set the determined content type
    res.set("Content-Type", contentType);

    res.download(file, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res.status(404).json({ message: "File not found" });
      }
    });
  }

  async updatePenugasan(req, res, next) {
    try {
      const result = await updatePenugasan(req);

      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async deletePenugasan(req, res, next) {
    try {
      const result = await deletePenugasan(req);
      res.status(StatusCodes.OK).json({
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PenugasanController();
