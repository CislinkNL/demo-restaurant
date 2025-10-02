// 自动菜单类型切换脚本
// 每天16:00之前设置所有桌台为lunch，16:00之后设置为dinner

// Enhanced initialization check
function isSystemReady() {
    try {
        return !!(
            typeof firebase !== 'undefined' && 
            firebase.auth && 
            firebase.database
        ); // ✅ 去掉 currentUser 限制，避免未登录时死循环
    } catch (error) {
        console.warn('System readiness check failed:', error);
        return false;
    }
}

class AutoMenuTypeScheduler {
    constructor() {
        // 使用配置系统获取餐厅名称，如果配置未加载则使用默认值
        this.restaurantName = window.getRestaurantPath ? window.getRestaurantPath() : 'AsianBoulevard';
        this.database = firebase.database();
        this.tableNames = [
            'Tafel-1','Tafel-2','Tafel-3','Tafel-4','Tafel-5','Tafel-5A','Tafel-6','Tafel-7','Tafel-8','Tafel-9','Tafel-10','Tafel-10A',
            'Tafel-11','Tafel-12','Tafel-13','Tafel-14','Tafel-15','Tafel-16','Tafel-17','Tafel-18','Tafel-19','Tafel-21','Tafel-22',
            'Tafel-23','Tafel-24','Tafel-25','Tafel-25A','Tafel-31','Tafel-31A','Tafel-32','Tafel-32A','Tafel-33','Tafel-34',
            'Tafel-35','Tafel-35A','Tafel-36','Tafel-41','Tafel-42','Tafel-43','Tafel-44','Tafel-45','Tafel-46','Tafel-47',
            'Tafel-51','Tafel-52','Tafel-53','Tafel-54','Tafel-55','Tafel-56','Tafel-61','Tafel-62','Tafel-63','Tafel-64',
            'Tafel-65','Tafel-65A','Tafel-66','Tafel-66A','Tafel-67','Tafel-67A','Tafel-68','Tafel-69','Tafel-71','Tafel-72',
            'Tafel-73','Tafel-74','Tafel-75','Tafel-76','Tafel-76A','Tafel-77','Tafel-78','Tafel-79','Tafel-81','Tafel-82',
            'Tafel-83','Tafel-84','Tafel-85','Tafel-91','Tafel-92'
        ];
    }

    // 获取当前应该使用的菜单类型
    getCurrentMenuType() {
        const now = new Date();
        const hour = now.getHours();
        return hour < 16 ? 'lunch' : 'dinner';
    }

    // 批量更新所有桌台的菜单类型
    async updateAllTableMenuTypes(menuType) {
        try {
            const updates = {};
            
            // 为所有桌台设置相同的菜单类型
            this.tableNames.forEach(tableName => {
                updates[`${this.restaurantName}/tafel/${tableName}/menuType`] = menuType;
            });
            
            // 同时更新全局activeMenuType
            updates[`${this.restaurantName}/config/activeMenuType`] = menuType;
            
            await this.database.ref().update(updates);
            console.log(`Successfully updated ${this.tableNames.length} tables to ${menuType} mode`);
            return true;
        } catch (error) {
            console.error('Error updating menu types:', error);
            return false;
        }
    }

    // 执行自动切换逻辑
    async executeAutoSwitch() {
        const currentMenuType = this.getCurrentMenuType();
        const now = new Date();
        const timeString = now.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
        
        console.log(`[${timeString}] Auto-switching to ${currentMenuType} mode`);
        
        const success = await this.updateAllTableMenuTypes(currentMenuType);
        if (success) {
            console.log(`[${timeString}] Auto-switch completed successfully`);
        } else {
            console.error(`[${timeString}] Auto-switch failed`);
        }
        
        return success;
    }

    // 启动定时任务（每10分钟检查一次）
    startScheduler() {
        console.log('Starting Auto Menu Type Scheduler...');
        
        // 立即执行一次
        this.executeAutoSwitch();
        
        // 设置定时任务，每10分钟执行一次
        setInterval(() => {
            this.executeAutoSwitch();
        }, 10 * 60 * 1000); // 10分钟 = 10 * 60 * 1000毫秒
        
        console.log('Auto Menu Type Scheduler is running (checking every 10 minutes)');
    }
}

// Replace the window load event listener at the bottom with this:
window.addEventListener('load', () => {
    console.log('🕒 Auto Menu Scheduler: 页面加载完成，检查系统状态...');
    
    // Wait for system to be ready
    function tryInitializeScheduler() {
        if (!isSystemReady()) {
            console.log('🕒 系统尚未就绪，等待认证...');
            setTimeout(tryInitializeScheduler, 2000);
            return;
        }
        
        console.log('🕒 系统就绪，启动自动菜单调度器...');
        try {
            const scheduler = new AutoMenuTypeScheduler();
            scheduler.startScheduler();
            console.log('✅ 自动菜单调度器启动成功');
        } catch (error) {
            console.error('❌ 自动菜单调度器启动失败:', error);
        }
    }
    
    // Start checking after a delay to allow main app to initialize
    setTimeout(tryInitializeScheduler, 3000);
});

// 导出给其他脚本使用
window.AutoMenuTypeScheduler = AutoMenuTypeScheduler;