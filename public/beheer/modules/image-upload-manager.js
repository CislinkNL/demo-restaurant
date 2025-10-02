/**
 * 纯 JavaScript 图片上传处理器
 * Pure JavaScript Image Upload Handler - 餐厅管理系统
 * 替代 PHP 后端，使用 Firebase Storage 或其他云存储
 */

class ImageUploadManager {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedFormats = ['png', 'jpg', 'jpeg', 'webp'];
        this.compressionQuality = 0.8; // 压缩质量
        this.maxWidth = 1200; // 最大宽度
        this.maxHeight = 1200; // 最大高度
    }

    /**
     * 验证文件
     */
    validateFile(file) {
        const errors = [];

        // 检查文件类型
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (!this.allowedFormats.includes(fileExtension)) {
            errors.push(`不支持的文件格式。请上传 ${this.allowedFormats.join(', ').toUpperCase()} 文件`);
        }

        // 检查 MIME 类型
        if (!file.type.startsWith('image/')) {
            errors.push('上传的文件不是有效的图片');
        }

        // 检查文件大小
        if (file.size > this.maxFileSize) {
            errors.push(`文件大小超过限制（最大${(this.maxFileSize / (1024 * 1024)).toFixed(0)}MB）`);
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * 获取图片信息
     */
    async getImageInfo(file) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = () => {
                URL.revokeObjectURL(url);
                resolve({
                    width: img.width,
                    height: img.height,
                    aspectRatio: img.width / img.height,
                    size: file.size,
                    type: file.type,
                    name: file.name
                });
            };

            img.onerror = () => {
                URL.revokeObjectURL(url);
                reject(new Error('无法读取图片信息'));
            };

            img.src = url;
        });
    }

    /**
     * 压缩图片
     */
    async compressImage(file, quality = this.compressionQuality) {
        const imageInfo = await this.getImageInfo(file);
        
        // 如果图片已经很小，不需要压缩
        if (imageInfo.width <= this.maxWidth && 
            imageInfo.height <= this.maxHeight && 
            file.size <= this.maxFileSize / 2) {
            return file;
        }

        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // 计算新尺寸
                let { width, height } = this.calculateNewDimensions(
                    imageInfo.width, 
                    imageInfo.height
                );

                canvas.width = width;
                canvas.height = height;

                // 绘制压缩图片
                ctx.drawImage(img, 0, 0, width, height);

                // 转换为 Blob
                canvas.toBlob((blob) => {
                    if (blob) {
                        // 创建新的 File 对象
                        const compressedFile = new File([blob], file.name, {
                            type: blob.type,
                            lastModified: Date.now()
                        });
                        resolve(compressedFile);
                    } else {
                        reject(new Error('图片压缩失败'));
                    }
                }, file.type, quality);

                URL.revokeObjectURL(img.src);
            };

            img.onerror = () => {
                URL.revokeObjectURL(img.src);
                reject(new Error('图片压缩过程中发生错误'));
            };

            img.src = URL.createObjectURL(file);
        });
    }

    /**
     * 计算新尺寸
     */
    calculateNewDimensions(originalWidth, originalHeight) {
        let newWidth = originalWidth;
        let newHeight = originalHeight;

        // 按比例缩放
        if (originalWidth > this.maxWidth || originalHeight > this.maxHeight) {
            const widthRatio = this.maxWidth / originalWidth;
            const heightRatio = this.maxHeight / originalHeight;
            const ratio = Math.min(widthRatio, heightRatio);

            newWidth = Math.round(originalWidth * ratio);
            newHeight = Math.round(originalHeight * ratio);
        }

        return { width: newWidth, height: newHeight };
    }

    /**
     * 生成唯一文件名
     */
    generateUniqueFileName(originalName) {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        const extension = originalName.split('.').pop().toLowerCase();
        return `img_${timestamp}_${random}.${extension}`;
    }

    /**
     * 上传到云存储（可扩展支持多种云服务）
     */
    async uploadToCloud(file, storageService = 'firebase', restaurantId = 'asianboulevard') {
        const processedFile = await this.compressImage(file);
        const uniqueFileName = this.generateUniqueFileName(file.name);
        const imageInfo = await this.getImageInfo(processedFile);

        switch (storageService) {
            case 'firebase':
                return await this.uploadToFirebase(processedFile, uniqueFileName, imageInfo, restaurantId);
            
            case 'cloudinary':
                return await this.uploadToCloudinary(processedFile, uniqueFileName, imageInfo, restaurantId);
            
            case 'simulate':
            default:
                return await this.simulateUpload(processedFile, uniqueFileName, imageInfo);
        }
    }

    /**
     * Firebase Storage 上传
     */
    async uploadToFirebase(file, fileName, imageInfo, restaurantId = 'asianboulevard') {
        try {
            // 检查 Firebase Storage 是否可用
            if (!window.firebaseStorageUploader) {
                throw new Error('Firebase Storage 上传器未加载');
            }

            const isAvailable = await window.firebaseStorageUploader.isAvailable();
            if (!isAvailable) {
                console.warn('⚠️ Firebase Storage 不可用，回退到模拟模式');
                return await this.simulateUpload(file, fileName, imageInfo);
            }

            // 使用真实的 Firebase Storage 上传
            console.log(`🔄 使用 Firebase Storage 上传图片 [${restaurantId}]:`, fileName);
            
            const uploadResult = await window.firebaseStorageUploader.uploadImage(file, fileName, restaurantId);

            return {
                success: true,
                url: uploadResult.url,
                filename: fileName,
                original_name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
                dimensions: `${imageInfo.width}x${imageInfo.height}`,
                type: file.type,
                storage: 'firebase',
                firebase: {
                    fullPath: uploadResult.fullPath,
                    bucket: uploadResult.bucket,
                    uploadSize: uploadResult.size
                }
            };

        } catch (error) {
            console.warn('⚠️ Firebase Storage 上传失败，回退到模拟模式:', error.message);
            // 如果 Firebase 上传失败，回退到模拟模式
            return await this.simulateUpload(file, fileName, imageInfo);
        }
    }

    /**
     * Cloudinary 上传
     */
    async uploadToCloudinary(file, fileName, imageInfo) {
        // Cloudinary 上传实现
        console.log('上传到 Cloudinary:', fileName);
        
        // 这里可以添加 Cloudinary API 集成
        await new Promise(resolve => setTimeout(resolve, 1500));

        const cloudinaryUrl = `https://res.cloudinary.com/demo/image/upload/restaurant-images/${fileName}`;

        return {
            success: true,
            url: cloudinaryUrl,
            filename: fileName,
            original_name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
            dimensions: `${imageInfo.width}x${imageInfo.height}`,
            type: file.type,
            storage: 'cloudinary'
        };
    }

    /**
     * 模拟上传（开发用途）
     */
    async simulateUpload(file, fileName, imageInfo) {
        console.log('模拟上传:', fileName);
        
        // 模拟上传延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 创建本地预览 URL
        const localUrl = URL.createObjectURL(file);

        return {
            success: true,
            url: localUrl, // 本地预览 URL
            filename: fileName,
            original_name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
            dimensions: `${imageInfo.width}x${imageInfo.height}`,
            type: file.type,
            storage: 'local-simulation',
            preview: true, // 标记这是预览模式
            note: '这是本地预览，生产环境将上传到云存储'
        };
    }

    /**
     * 主要上传方法
     */
    async upload(file, restaurantId = null) {
        try {
            // 1. 验证文件
            // 获取当前餐厅ID，优先使用传入的参数，然后使用配置系统
        const currentRestaurantId = restaurantId || 
                                  (window.getRestaurantId ? window.getRestaurantId() : 'EnjoyBoxmeer');

        console.log(`🏪 上传图片到餐厅: ${currentRestaurantId}`);

        const validation = this.validateFile(file);
            if (!validation.isValid) {
                throw new Error(validation.errors.join('; '));
            }

            // 2. 检测环境并选择合适的存储服务
            const storageService = this.detectStorageService();

            // 3. 上传到云存储
            const result = await this.uploadToCloud(file, 'firebase', currentRestaurantId);

            return result;

        } catch (error) {
            console.error('图片上传错误:', error);
            throw error;
        }
    }

    /**
     * 检测应该使用的存储服务
     */
    detectStorageService() {
        // 检测是否为开发环境
        const isDevEnvironment = window.location.protocol === 'file:' || 
                                window.location.hostname === '127.0.0.1' ||
                                window.location.hostname === 'localhost';

        // 检测是否为 Firebase Hosting
        const isFirebaseHosting = window.location.hostname.includes('.web.app') ||
                                 window.location.hostname.includes('.firebaseapp.com');

        if (isDevEnvironment) {
            return 'simulate';
        } else if (isFirebaseHosting) {
            return 'firebase';
        } else {
            // 生产环境默认使用 Firebase，可以根据配置改变
            return 'firebase';
        }
    }
}

// 导出类供其他模块使用
window.ImageUploadManager = ImageUploadManager;

// 创建全局实例
window.imageUploadManager = new ImageUploadManager();

console.log('✅ JavaScript 图片上传管理器已初始化');