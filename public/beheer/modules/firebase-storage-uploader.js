/**
 * Firebase Storage 集成模块
 * Firebase Storage Integration Module
 */

class FirebaseStorageUploader {
    constructor() {
        this.storage = null;
        this.initialized = false;
        this.initializationPromise = null;
    }

    /**
     * 初始化 Firebase Storage
     */
    async initialize() {
        if (this.initialized) {
            return this.storage;
        }

        if (this.initializationPromise) {
            return await this.initializationPromise;
        }

        this.initializationPromise = this._doInitialize();
        return await this.initializationPromise;
    }

    async _doInitialize() {
        try {
            // 检查 Firebase 是否已加载
            if (typeof firebase === 'undefined') {
                throw new Error('Firebase SDK 未加载');
            }

            // 检查是否已经初始化
            if (!firebase.apps.length) {
                // Firebase 配置 - 从现有配置中读取
                const firebaseConfig = {
                    apiKey: "AIzaSyDMKX5sM-Yc-w3zQlEGvhQ-GpQNzVV5cQk",
                    authDomain: "cislink.firebaseapp.com",
                    projectId: "cislink",
                    storageBucket: "cislink.appspot.com",
                    messagingSenderId: "123456789012",
                    appId: "1:123456789012:web:abcdef123456"
                };

                // 初始化 Firebase
                firebase.initializeApp(firebaseConfig);
            }

            // 获取 Storage 实例
            this.storage = firebase.storage();
            this.initialized = true;

            console.log('✅ Firebase Storage 已初始化');
            return this.storage;

        } catch (error) {
            console.error('❌ Firebase Storage 初始化失败:', error);
            this.initialized = false;
            throw error;
        }
    }

    /**
     * 上传图片到 Firebase Storage
     */
    async uploadImage(file, fileName, restaurantId = null) {
        try {
            await this.initialize();

            // 获取当前餐厅ID，优先使用传入的参数，然后使用配置系统
            const currentRestaurantId = restaurantId || 
                                      (window.getRestaurantId ? window.getRestaurantId() : 'EnjoyBoxmeer');

            console.log(`🏪 当前餐厅ID: ${currentRestaurantId}`);

            // 创建文件引用 - 支持多餐厅路径结构
            const storageRef = this.storage.ref();
            const imagePath = `restaurants/${currentRestaurantId}/images/${fileName}`;
            const imageRef = storageRef.child(imagePath);

            // 设置元数据
            const metadata = {
                contentType: file.type,
                customMetadata: {
                    'uploadTime': new Date().toISOString(),
                    'originalName': file.name,
                    'source': 'restaurant-management-system'
                }
            };

            // 开始上传
            console.log(`🔄 开始上传图片到 Firebase Storage: ${fileName}`);
            const uploadTask = imageRef.put(file, metadata);

            // 监听上传进度
            return new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    // 进度回调
                    (snapshot) => {
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log(`📊 上传进度: ${progress.toFixed(1)}%`);
                        
                        // 可以发送进度事件给 UI
                        if (window.uploadProgressCallback) {
                            window.uploadProgressCallback(progress);
                        }
                    },
                    // 错误回调
                    (error) => {
                        console.error('❌ Firebase Storage 上传错误:', error);
                        reject(error);
                    },
                    // 完成回调
                    async () => {
                        try {
                            // 获取下载 URL
                            const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                            console.log('✅ 图片上传成功:', downloadURL);
                            
                            resolve({
                                url: downloadURL,
                                fullPath: uploadTask.snapshot.ref.fullPath,
                                bucket: uploadTask.snapshot.ref.bucket,
                                size: uploadTask.snapshot.totalBytes,
                                metadata: uploadTask.snapshot.metadata
                            });
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });

        } catch (error) {
            console.error('❌ Firebase Storage 上传失败:', error);
            throw error;
        }
    }

    /**
     * 删除图片
     */
    async deleteImage(imagePath) {
        try {
            await this.initialize();
            
            const imageRef = this.storage.ref(imagePath);
            await imageRef.delete();
            
            console.log('✅ 图片已从 Firebase Storage 删除:', imagePath);
            return true;
        } catch (error) {
            console.error('❌ Firebase Storage 删除失败:', error);
            throw error;
        }
    }

    /**
     * 获取图片 URL
     */
    async getImageURL(imagePath) {
        try {
            await this.initialize();
            
            const imageRef = this.storage.ref(imagePath);
            const url = await imageRef.getDownloadURL();
            
            return url;
        } catch (error) {
            console.error('❌ 获取图片 URL 失败:', error);
            throw error;
        }
    }

    /**
     * 列出所有图片
     */
    async listImages(restaurantId = null, maxResults = 100) {
        try {
            await this.initialize();
            
            // 获取当前餐厅ID，优先使用传入的参数，然后使用配置系统
            const currentRestaurantId = restaurantId || 
                                      (window.getRestaurantId ? window.getRestaurantId() : 'EnjoyBoxmeer');
            
            const listRef = this.storage.ref(`restaurants/${currentRestaurantId}/images`);
            const result = await listRef.list({ maxResults });
            
            const images = await Promise.all(
                result.items.map(async (itemRef) => {
                    const url = await itemRef.getDownloadURL();
                    const metadata = await itemRef.getMetadata();
                    
                    return {
                        name: itemRef.name,
                        fullPath: itemRef.fullPath,
                        url: url,
                        size: metadata.size,
                        contentType: metadata.contentType,
                        timeCreated: metadata.timeCreated,
                        customMetadata: metadata.customMetadata || {}
                    };
                })
            );
            
            return images;
        } catch (error) {
            console.error('❌ 获取图片列表失败:', error);
            throw error;
        }
    }

    /**
     * 检查服务是否可用
     */
    async isAvailable() {
        try {
            await this.initialize();
            return true;
        } catch (error) {
            console.warn('⚠️ Firebase Storage 不可用:', error.message);
            return false;
        }
    }
}

// 导出类
window.FirebaseStorageUploader = FirebaseStorageUploader;

// 创建全局实例
window.firebaseStorageUploader = new FirebaseStorageUploader();

console.log('✅ Firebase Storage 上传器已准备就绪');