import multer from 'multer'

const upload = multer({ dest: 'estudios/',
    limits: {
        fileSize: 50 * 1024 * 1024 // Limitar el tamaño del archivo a 50 MB
    }
 })

export default upload