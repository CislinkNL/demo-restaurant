/**
 * 管理后台配置管理器
 * Asian Boulevard Restaurant Management System
 * 
 * 功能：
 * - 加载和管理配置文件
 * - 提供配置访问接口
 * - 支持运行时配置更新
 * - 环境特定配置覆盖
 */

class BeheerConfigManager {
    constructor() {
        this.config = null;
        this.isLoaded = false;
        this.loadPromise = null;
    }

    /**
     * 加载配置文件
     * @returns {Promise<Object>} 配置对象
     */
    async load() {
        if (this.loadPromise) {
            return this.loadPromise;
        }

        this.loadPromise = this._loadConfig();
        return this.loadPromise;
    }

    async _loadConfig() {
        try {
            // 尝试多个可能的路径
            const possiblePaths = [
                './beheer-config.json',           // 相对路径（相对于当前页面）
                '../beheer/beheer-config.json',   // 从其他目录访问
                '/beheer/beheer-config.json'      // 绝对路径（生产环境）
            ];
            
            let response = null;
            let loadedFromPath = null;
            
            // 依次尝试各个路径
            for (const path of possiblePaths) {
                try {
                    response = await fetch(path);
                    if (response.ok) {
                        loadedFromPath = path;
                        break;
                    }
                } catch (e) {
                    // 继续尝试下一个路径
                    continue;
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(`Failed to load config from any path. Tried: ${possiblePaths.join(', ')}`);
            }
            
            this.config = await response.json();
            this.isLoaded = true;
            
            // 检查环境变量覆盖
            this._applyEnvironmentOverrides();
            
            console.log(`🔧 Beheer配置已加载 (from: ${loadedFromPath}):`, this.config);
            return this.config;
        } catch (error) {
            console.error('❌ 配置加载失败:', error);
            // 返回默认配置
            this.config = this._getDefaultConfig();
            this.isLoaded = true;
            return this.config;
        }
    }

    /**
     * 获取配置值
     * @param {string} path - 配置路径，如 'api.baseUrl'
     * @param {*} defaultValue - 默认值
     * @returns {*} 配置值
     */
    get(path, defaultValue = null) {
        if (!this.isLoaded) {
            console.warn('⚠️ 配置尚未加载，返回默认值');
            return defaultValue;
        }

        const keys = path.split('.');
        let value = this.config;
        
        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }
        
        return value;
    }

    /**
     * 设置配置值（运行时）
     * @param {string} path - 配置路径
     * @param {*} value - 新值
     */
    set(path, value) {
        if (!this.isLoaded) {
            console.warn('⚠️ 配置尚未加载，无法设置值');
            return;
        }

        const keys = path.split('.');
        let current = this.config;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
        console.log(`🔧 配置更新: ${path} = ${value}`);
    }

    /**
     * 获取 API 完整 URL
     * @param {string} endpoint - 端点名称
     * @returns {string} 完整URL
     */
    getApiUrl(endpoint) {
        const baseUrl = this.get('api.baseUrl');
        const endpointPath = this.get(`api.endpoints.${endpoint}`);
        
        if (!baseUrl || !endpointPath) {
            console.error(`❌ API配置不完整: baseUrl=${baseUrl}, endpoint=${endpointPath}`);
            return null;
        }
        
        return baseUrl + endpointPath;
    }

    /**
     * 检查功能是否启用
     * @param {string} feature - 功能名称
     * @returns {boolean} 是否启用
     */
    isFeatureEnabled(feature) {
        return this.get(`features.${feature}`, false);
    }

    /**
     * 获取 Cloudflare 配置
     * @returns {Object} Cloudflare 配置
     */
    getCloudflareConfig() {
        return {
            policyId: this.get('cloudflare.policyId'),
            defaultAccountId: this.get('cloudflare.defaultAccountId'),
            region: this.get('cloudflare.region')
        };
    }

    /**
     * 应用环境变量覆盖
     */
    _applyEnvironmentOverrides() {
        // 检查 URL 参数中的环境覆盖
        const urlParams = new URLSearchParams(window.location.search);
        
        if (urlParams.has('debug')) {
            this.set('ui.showAdvancedOptions', true);
            console.log('🐛 调试模式启用');
        }
        
        if (urlParams.has('env')) {
            const env = urlParams.get('env');
            if (env === 'development') {
                this.set('api.baseUrl', 'http://localhost:5001/cislink/us-central1/app');
                console.log('🚧 开发模式：使用本地API');
            }
        }
    }

    /**
     * 获取默认配置
     * @returns {Object} 默认配置
     */
    _getDefaultConfig() {
        return {
            app: {
                name: "Asian Boulevard Restaurant Management",
                version: "2.0.0",
                environment: "production"
            },
            api: {
                baseUrl: "https://europe-west1-cislink-351208.cloudfunctions.net/app",
                endpoints: {
                    cloudflareUpdatePolicy: "/api/cloudflare/update-policy",
                    cloudflareGetPolicy: "/api/cloudflare/get-policy"
                },
                timeout: 30000
            },
            cloudflare: {
                policyId: "a36225ae-ed11-41e0-b942-55356ed563da",
                defaultAccountId: "611b75fe657af4f68068d2572d196c17",
                region: "europe-west1"
            },
            features: {
                cloudflareIntegration: true,
                whatsappNotifications: true,
                menuScheduling: true,
                orderManagement: true,
                multiLanguage: true
            }
        };
    }

    /**
     * 导出当前配置
     * @returns {string} JSON 格式的配置
     */
    exportConfig() {
        return JSON.stringify(this.config, null, 2);
    }

    /**
     * 重新加载配置
     * @returns {Promise<Object>} 新配置
     */
    async reload() {
        this.isLoaded = false;
        this.loadPromise = null;
        return await this.load();
    }
}

// 创建全局配置管理器实例
window.BeheerConfig = new BeheerConfigManager();

// 自动加载配置（如果在DOM加载后）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.BeheerConfig.load();
    });
} else {
    window.BeheerConfig.load();
}

// 导出到模块系统（如果支持）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BeheerConfigManager;
}