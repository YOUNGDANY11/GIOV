const multer = require('multer')
const path = require('path')
const fs = require('fs')

const baseUploadDir = path.join(__dirname, '..', 'uploads')
const imageDir = path.join(baseUploadDir, 'images')
const documentDir = path.join(baseUploadDir, 'documents')

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

ensureDir(baseUploadDir)
ensureDir(imageDir)
ensureDir(documentDir)

const buildFilename = (file) => {
  const timestamp = Date.now()
  const safeOriginal = file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')
  return `${timestamp}-${safeOriginal}`
}

const imageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, imageDir)
  },
  filename: (_req, file, cb) => {
    cb(null, buildFilename(file))
  }
})

const documentStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, documentDir)
  },
  filename: (_req, file, cb) => {
    cb(null, buildFilename(file))
  }
})

const imageFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
    return
  }
  cb(new Error('Solo se permiten archivos de imagen'))
}

const allowedDocs = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
])

const documentFilter = (_req, file, cb) => {
  if (allowedDocs.has(file.mimetype)) {
    cb(null, true)
    return
  }
  cb(new Error('Solo se permiten documentos PDF o Word'))
}

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

const documentUpload = multer({
  storage: documentStorage,
  fileFilter: documentFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
})

module.exports = {
  imageUpload,
  documentUpload
}