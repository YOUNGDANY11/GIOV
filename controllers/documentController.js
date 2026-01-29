const documentModel = require('../models/documentModel')
const fs = require('fs')
const path = require('path')

const isAdminRole = (role) => [1, 2, 3].includes(Number(role))

const safeDownloadName = (value) => {
    const raw = String(value ?? '').trim()
    const normalized = raw.replace(/[^a-zA-Z0-9 _.-]/g, '_')
    return normalized || 'documento'
}

const safeUnlink = async (absolutePath) => {
    try {
        await fs.promises.unlink(absolutePath)
    } catch (err) {
        if (err && err.code === 'ENOENT') return
        throw err
    }
}

const getAll = async(req,res)=>{
    try{
        const documents = await documentModel.getAll()
        if(documents.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay documentos registrados aun'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            documentos:documents
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los documentos'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_document = id
        const document = await documentModel.getById(id_document)
        if(!document){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este documento'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            documento:document
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el documento'
        })
    }
}

const getByUserDocument = async(req,res)=>{
    try{
        const document = req.query?.document ?? req.body?.document
        if(!document){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerido el numero de documento'
            })
        }
        
        const documents = await documentModel.getByUserDocument(document)
        if(documents.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay documentos asociados a este usuario'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            documentos:documents
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los documentos'
        })
    }
}

const create = async (req, res) => {
    try {
        const {id} = req.user
        const id_user = id  
        const { name, description } = req.body
        const file = req.file

        if (!id_user) {
            return res.status(400).json({
                status: 'Error',
                mensaje: 'Falta el id del usuario'
            })
        }

        if (!name || !file) {
            return res.status(400).json({
                status: 'Error',
                mensaje: 'Nombre, descripción y archivo son requeridos'
            })
        }

        const documentPath = `uploads/documents/${file.filename}`
        const newDocument = await documentModel.create(id_user, name, description || null, documentPath)

        return res.status(200).json({
            status: 'Success',
            mensaje: 'Documento creado exitosamente',
            documento: newDocument
        })
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            mensaje: 'No se pudo crear el documento'
        })
    }
}

const update = async (req, res) => {
    const newFile = req.file

    try {
        const { id } = req.params
        const id_document = id
        const { name, description } = req.body

        const existing = await documentModel.getById(id_document)
        if (!existing) {
            if (newFile) {
                const newAbs = path.join(__dirname, '..', 'uploads', 'documents', newFile.filename)
                await safeUnlink(newAbs)
            }
            return res.status(404).json({
                status: 'Error',
                mensaje: 'No existe este documento'
            })
        }

        const nextName = name ?? existing.name
        const nextDescription = (description !== undefined) ? description : existing.description

        let nextDocumentPath = existing.document
        if (newFile) {
            nextDocumentPath = `uploads/documents/${newFile.filename}`
        }

        const updated = await documentModel.update(nextName, nextDescription, nextDocumentPath, id_document)

        if (newFile && existing.document && existing.document !== nextDocumentPath) {
            const oldAbs = path.isAbsolute(existing.document)
                ? existing.document
                : path.join(__dirname, '..', existing.document)
            await safeUnlink(oldAbs)
        }

        return res.status(200).json({
            status: 'Success',
            mensaje: 'Documento actualizado exitosamente',
            documento: updated
        })
    } catch (error) {
        if (newFile) {
            try {
                const newAbs = path.join(__dirname, '..', 'uploads', 'documents', newFile.filename)
                await safeUnlink(newAbs)
            } catch (_cleanupError) {
                console.log(_cleanupError)
            }
        }

        return res.status(500).json({
            status: 'Error',
            mensaje: 'No se pudo actualizar el documento'
        })
    }
}

const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params
        const id_document = id

        const existing = await documentModel.getById(id_document)
        if (!existing) {
            return res.status(404).json({
                status: 'Error',
                mensaje: 'No existe este documento'
            })
        }

        const deleted = await documentModel.deleteDocument(id_document)
        if (!deleted) {
            return res.status(404).json({
                status: 'Error',
                mensaje: 'No existe este documento'
            })
        }

        if (existing.document) {
            const oldAbs = path.isAbsolute(existing.document)
                ? existing.document
                : path.join(__dirname, '..', existing.document)
            await safeUnlink(oldAbs)
        }

        return res.status(200).json({
            status: 'Success',
            mensaje: 'Documento eliminado exitosamente',
            documento: deleted
        })
    } catch (error) {
        return res.status(500).json({
            status: 'Error',
            mensaje: 'No se pudo eliminar el documento'
        })
    }
}


const downloadById = async (req, res) => {
    try {
        const { id } = req.params
        const id_document = id

        const existing = await documentModel.getById(id_document)
        if (!existing) {
            return res.status(404).json({
                status: 'Error',
                mensaje: 'No existe este documento'
            })
        }

        const requesterId = req.user?.id
        const requesterRole = req.user?.role

        const isOwner = Number(existing.id_user) === Number(requesterId)
        if (!isOwner && !isAdminRole(requesterRole)) {
            return res.status(403).json({
                status: 'Error',
                mensaje: 'No autorizado para descargar este documento'
            })
        }

        const storedPath = String(existing.document ?? '').replace(/\\/g, '/').trim()
        if (!storedPath || !storedPath.startsWith('uploads/documents/')) {
            return res.status(400).json({
                status: 'Error',
                mensaje: 'Ruta de documento inválida'
            })
        }

        const uploadsDocumentsDir = path.resolve(__dirname, '..', 'uploads', 'documents')
        const diskPath = path.resolve(__dirname, '..', storedPath)

        if (!diskPath.startsWith(uploadsDocumentsDir + path.sep)) {
            return res.status(400).json({
                status: 'Error',
                mensaje: 'Ruta de documento inválida'
            })
        }

        try {
            await fs.promises.access(diskPath, fs.constants.R_OK)
        } catch (_err) {
            return res.status(404).json({
                status: 'Error',
                mensaje: 'Archivo no encontrado en el servidor'
            })
        }

        const ext = path.extname(diskPath)
        const base = safeDownloadName(existing.name)
        const filename = base.toLowerCase().endsWith(ext.toLowerCase()) ? base : `${base}${ext}`

        return res.download(diskPath, filename)
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 'Error',
            mensaje: 'No se pudo descargar el documento'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByUserDocument,
    create,
    update,
    deleteDocument,
    downloadById
}