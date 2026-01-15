const userModel = require('../models/userModel')
const bcrypt = require('bcryptjs')
const path = require('path')
const fs = require('fs')

const uploadImagesDir = path.join(__dirname, '..', 'uploads', 'images')

const resolveExistingAvatarPath = (avatar) => {
    if(!avatar || typeof avatar !== 'string') return null

    const normalized = avatar.replace(/\\/g, '/').trim()
    // Solo permitimos borrar archivos ubicados en uploads/images
    if(!normalized.includes('uploads/images/')) return null

    const filename = path.posix.basename(normalized)
    if(!filename || filename === '.' || filename === '..') return null

    return path.join(uploadImagesDir, filename)
}

const getAll = async(req,res)=>{
    try{
        const users = await userModel.getAll()
        if(users.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No hay usuarios registrados'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            usuarios:users
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener los usuarios'
        })
    }
}

const getById = async(req,res)=>{
    try{
        const {id} = req.params
        const id_user = id
        const user = await userModel.getById(id_user)
        if(!user){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este usuario'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            usuario:user
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el usuario'
        })
    }
}

const getByDocument = async(req,res)=>{
    try{
        const {document} = req.body
        const user = await userModel.getByDocument(document)
        if(!user){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe un usuario asociado a este numero de documento'
            })
        }

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            usuario:user
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el usuario'
        })
    }
}

const getByName = async(req,res)=>{
    try{
        const {name} = req.body
        if(!name){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const user = await userModel.getByName(name)
        if(user.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este usuario'
            })
        }
        return res.status(200).json({
            status:'Error',
            mensaje:'Consulta exitosa',
            usuario:user
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el usuario'
        })
    }
}

const getByLastName = async(req,res)=>{
    try{
        const {lastname} = req.body
        if(!lastname){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const user = await userModel.getByLastName(lastname)
        if(user.length === 0){
            return res.status(404).json({
                status:'Error',
                mensaje:'No existe este usuario'
            })
        }
        return res.status(200).json({
            status:'Error',
            mensaje:'Consulta exitosa',
            usuario:user
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener el usuario'
        })
    }
}

const getByUserActive = async(req,res)=>{
    try{
        const {id} = req.user
        const id_user = id
        const user = await userModel.getById(id_user)
        if(!user){
            return res.status(404).json({
                status:'Error',
                mensaje:'Usuario no existente'
            })
        }
        const { document, password, created_at, updated_at, ...safeUser } = user

        return res.status(200).json({
            status:'Success',
            mensaje:'Consulta exitosa',
            usuario:safeUser
        })
    }catch(error){ 
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo obtener la informacion de este usuario'
        })
    }
}

const create = async(req,res) =>{
    try{
        const {name,lastname,document,password,id_role} = req.body
        if(!name || !lastname || !document || !password) {
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsDocument = await userModel.getByDocument(document)
        if(existsDocument){
            return res.status(400).json({
                status:'Error',
                mensaje:'Documento asociado a otro usuario'
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const user = await userModel.create(name,lastname,document,hashedPassword,id_role || 8)
        return res.status(200).json({
            status:'Success',
            mensaje:'Usuario creado exitosamente',
            usuario:user
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo crear el usuario'
        })
    }
}

const update = async(req,res)=>{
    try{
        const {id} = req.params
        const id_user = id
        const {name,lastname,document,password,id_role} = req.body
        if(!name || !lastname || !document || !password || !id_role){
            return res.status(400).json({
                status:'Error',
                mensaje:'Es requerida toda la informacion'
            })
        }

        const existsUser = await userModel.getById(id_user)
        if(!existsUser){
            return res.status(404).json({
                status:'Error',
                mensaje:'Este usuario no existe'
            })
        }

        const existsDocument = await userModel.getByDocument(document)

        // Validar que el documento sea el mismo del usuario o que no esté asociado a otro usuario
        if(existsDocument && existsDocument.id_user !== existsUser.id_user){
            return res.status(400).json({
                status:'Error',
                mensaje:'Documento asociado a otro usuario'
            })
        }

        const hashedPassword = await bcrypt.hash(password,10)

        const updatedUser = await userModel.update(name,lastname,document,hashedPassword,id_role,id_user)
        return res.status(200).json({
            status:'Success',
            mensaje:'Usuario actualizado exitosamente',
            usuario:updatedUser
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo actualizar el usuario'
        })
    }
}

const updateByUser = async(req,res)=>{
    try{
        const { id } = req.user
        const id_user = id

        const existsUser = await userModel.getById(id_user)
        if(!existsUser){
            return res.status(404).json({
                status:'Error',
                mensaje:'Usuario no existente'
            })
        }

        const uploadedFile = req.file || (req.files?.avatar?.[0] || req.files?.image?.[0])
        if(!uploadedFile){
            return res.status(400).json({
                status:'Error',
                mensaje:'Debes enviar una imagen'
            })
        }

        const avatarPath = path.posix.join('uploads', 'images', uploadedFile.filename)

        const oldAvatarDiskPath = resolveExistingAvatarPath(existsUser.avatar)
        const newAvatarDiskPath = uploadedFile.path || path.join(uploadImagesDir, uploadedFile.filename)

        let updatedUser
        try{
            updatedUser = await userModel.updateImage(avatarPath, id_user)
        }catch(dbError){
            try{
                await fs.promises.unlink(newAvatarDiskPath)
            }catch(_cleanupError){
                // Ignorar
            }
            throw dbError
        }
        if(!updatedUser){
            return res.status(500).json({
                status:'Error',
                mensaje:'No se pudo actualizar la imagen'
            })
        }

        if(oldAvatarDiskPath){
            const oldFilename = path.basename(oldAvatarDiskPath)
            if(oldFilename && oldFilename !== uploadedFile.filename){
                try{
                    await fs.promises.unlink(oldAvatarDiskPath)
                }catch(error){
                    if(error?.code !== 'ENOENT'){
                        console.log('No se pudo borrar el avatar anterior:', error.message)
                    }
                }
            }
        }

        const { password, document, created_at, updated_at, ...safeUser } = updatedUser

        return res.status(200).json({
            status:'Success',
            mensaje:'Imagen actualizada exitosamente',
            usuario:safeUser
        })
    }catch(error){
        console.log(error)
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo actualizar la imagen'
        })
    }
}

const deleteUser = async(req,res)=>{
    try{
        const {id} = req.params
        const id_user = id
        const existsUser = await userModel.getById(id_user)
        if(!existsUser){
            return res.status(400).json({
                status:'Error',
                mensaje:'No existe este usuario'
            })
        }

        const user = await userModel.deleteUser(id_user)
        return res.status(200).json({
            status:'Success',
            mensaje:'Usuario eliminado con exito',
            usuario:user
        })
    }catch(error){
        return res.status(500).json({
            status:'Error',
            mensaje:'No se pudo eliminar el usuario'
        })
    }
}

module.exports = {
    getAll,
    getById,
    getByDocument,
    getByName,
    getByLastName,
    getByUserActive,
    create,
    update,
    updateByUser,
    deleteUser
}