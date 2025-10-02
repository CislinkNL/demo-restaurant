/**
 * 多餐厅配置管理器
 * Multi-Restaurant Configuration Manager
 */

class MultiRestaurantManager {
    constructor() {
        this.restaurants = {
            'asianboulevard': {
                name: 'Asian Boulevard',
                displayName: 'Asian Boulevard Restaurant',
                theme: {
                    primaryColor: '#d4a574',
                    secondaryColor: '#8B4513',
                    logo: '/images/asianboulevard-logo.png'
                },
                contact: {
                    phone: '+31 123 456 789',
                    email: 'info@asianboulevard.nl',
                    address: 'Amsterdam, Netherlands'
                },
                storage: {
                    path: 'restaurants/asianboulevard/images',
                    maxFileSize: 5 * 1024 * 1024, // 5MB
                    allowedFormats: ['png', 'jpg', 'jpeg', 'webp']
                }
            },
            'restaurant2': {
                name: 'Restaurant Two',
                displayName: 'Second Restaurant',
                theme: {
                    primaryColor: '#2E7D32',
                    secondaryColor: '#4CAF50',
                    logo: '/images/restaurant2-logo.png'
                },
                contact: {
                    phone: '+31 987 654 321',
                    email: 'info@restaurant2.nl',
                    address: 'Rotterdam, Netherlands'
                },
                storage: {
                    path: 'restaurants/restaurant2/images',
                    maxFileSize: 5 * 1024 * 1024, // 5MB
                    allowedFormats: ['png', 'jpg', 'jpeg', 'webp']
                }
            },
            'restaurant3': {
                name: 'Restaurant Three',
                displayName: 'Third Restaurant',
                theme: {
                    primaryColor: '#1976D2',
                    secondaryColor: '#42A5F5',
                    logo: '/images/restaurant3-logo.png'
                },
                contact: {
                    phone: '+31 456 789 123',
                    email: 'info@restaurant3.nl',
                    address: 'Utrecht, Netherlands'
                },
                storage: {
                    path: 'restaurants/restaurant3/images',
                    maxFileSize: 5 * 1024 * 1024, // 5MB
                    allowedFormats: ['png', 'jpg', 'jpeg', 'webp']
                }
            }
        };
        
        this.currentRestaurant = this.detectRestaurant();
    }

    /**
     * 从 URL 或配置检测当前餐厅
     */
    detectRestaurant() {
        // 方法1: 从 URL 参数检测
        const urlParams = new URLSearchParams(window.location.search);
        const restaurantFromUrl = urlParams.get('restaurant');
        if (restaurantFromUrl && this.restaurants[restaurantFromUrl]) {
            return restaurantFromUrl;
        }

        // 方法2: 从子域名检测
        const hostname = window.location.hostname;
        if (hostname.includes('asianboulevard')) {
            return 'asianboulevard';
        }
        if (hostname.includes('restaurant2')) {
            return 'restaurant2';
        }
        if (hostname.includes('restaurant3')) {
            return 'restaurant3';
        }

        // 方法3: 从本地存储检测
        const storedRestaurant = localStorage.getItem('currentRestaurant');
        if (storedRestaurant && this.restaurants[storedRestaurant]) {
            return storedRestaurant;
        }

        // 默认返回第一个餐厅
        return 'asianboulevard';
    }

    /**
     * 获取当前餐厅配置
     */
    getCurrentRestaurant() {
        return this.restaurants[this.currentRestaurant];
    }

    /**
     * 获取当前餐厅 ID
     */
    getCurrentRestaurantId() {
        return this.currentRestaurant;
    }

    /**
     * 设置当前餐厅
     */
    setCurrentRestaurant(restaurantId) {
        if (this.restaurants[restaurantId]) {
            this.currentRestaurant = restaurantId;
            localStorage.setItem('currentRestaurant', restaurantId);
            return true;
        }
        return false;
    }

    /**
     * 获取所有餐厅列表
     */
    getAllRestaurants() {
        return Object.keys(this.restaurants).map(id => ({
            id,
            ...this.restaurants[id]
        }));
    }

    /**
     * 获取餐厅存储配置
     */
    getStorageConfig(restaurantId = this.currentRestaurant) {
        return this.restaurants[restaurantId]?.storage;
    }

    /**
     * 获取餐厅主题配置
     */
    getTheme(restaurantId = this.currentRestaurant) {
        return this.restaurants[restaurantId]?.theme;
    }

    /**
     * 应用餐厅主题到页面
     */
    applyTheme(restaurantId = this.currentRestaurant) {
        const theme = this.getTheme(restaurantId);
        if (!theme) return;

        // 设置 CSS 变量
        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primaryColor);
        root.style.setProperty('--secondary-color', theme.secondaryColor);

        // 更新页面标题
        const restaurant = this.restaurants[restaurantId];
        if (restaurant) {
            document.title = `${restaurant.displayName} - 管理系统`;
        }

        // 更新 Logo（如果存在）
        const logoElements = document.querySelectorAll('.restaurant-logo');
        logoElements.forEach(logo => {
            logo.src = theme.logo;
            logo.alt = restaurant.displayName;
        });
    }

    /**
     * 创建餐厅切换器 UI
     */
    createRestaurantSwitcher(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const restaurants = this.getAllRestaurants();
        
        const switcherHtml = `
            <div class="restaurant-switcher">
                <label for="restaurant-select">选择餐厅:</label>
                <select id="restaurant-select" class="restaurant-select">
                    ${restaurants.map(restaurant => `
                        <option value="${restaurant.id}" ${restaurant.id === this.currentRestaurant ? 'selected' : ''}>
                            ${restaurant.displayName}
                        </option>
                    `).join('')}
                </select>
            </div>
        `;

        container.innerHTML = switcherHtml;

        // 添加切换事件
        const select = container.querySelector('#restaurant-select');
        select.addEventListener('change', (e) => {
            const newRestaurantId = e.target.value;
            this.switchRestaurant(newRestaurantId);
        });
    }

    /**
     * 切换餐厅
     */
    switchRestaurant(restaurantId) {
        if (this.setCurrentRestaurant(restaurantId)) {
            this.applyTheme(restaurantId);
            
            // 发送餐厅切换事件
            const event = new CustomEvent('restaurantChanged', {
                detail: {
                    oldRestaurant: this.currentRestaurant,
                    newRestaurant: restaurantId,
                    restaurantConfig: this.getCurrentRestaurant()
                }
            });
            window.dispatchEvent(event);

            // 可选：重新加载页面以应用所有更改
            // window.location.reload();
        }
    }
}

// 创建全局实例
window.multiRestaurantManager = new MultiRestaurantManager();

// 页面加载时应用主题
document.addEventListener('DOMContentLoaded', () => {
    window.multiRestaurantManager.applyTheme();
});

console.log('✅ 多餐厅管理器已初始化，当前餐厅:', window.multiRestaurantManager.getCurrentRestaurantId());