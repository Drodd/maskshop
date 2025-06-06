// 游戏状态
class MaskSellerGame {
    constructor() {
        this.currentCustomer = null; // 当前客人对象
        this.availableCustomers = []; // 可用客人池
        this.servedCustomers = 0; // 已接待客人数
        this.successfulCustomers = []; // 成功处理的客人
        this.gameInProgress = false;
        this.selectedMask = null;
        
        // 倒计时相关
        this.gameTimer = null;
        this.timeRemaining = 60; // 60秒倒计时
        
        // 拖拽状态
        this.isDragging = false;
        this.dragElement = null;
        this.dragClone = null;
        this.startPos = { x: 0, y: 0 };
        this.initialPos = { x: 0, y: 0 };
        
        // 客人数据：遵循desire = want + need的故事原则
        // 每个角色都有表面的want和深层的need，以及因缺少need而产生的flaw
        // entrance基于need设计，positiveResponse基于want设计，体现假面具的隐喻
        this.customers = [
            {
                // 爱-归属感类型 - 渴望融入群体的转学生
                id: 1,
                desire_type: "爱",
                desire_subtype: "归属感",
                background: "转学生",
                character_image: "img/img_man.png", // 年轻男学生
                want: "被群体接纳，成为团体中受欢迎的一员", // 表面欲望：群体认同
                need: "学会独立自信，不依赖他人的认可来定义自己", // 真正需要：独立自信
                flaw: "过度迎合他人，害怕被排斥，缺乏独立的自我认知",
                entrance: "同学们都不太愿意跟我说话，是不是我不够优秀...", // 基于need（独立自信）的困扰
                correctMask: "love",
                positiveResponse: "我要拿到全班第一！", // 基于want（群体认同）的满足
                negativeResponse: "这个...好像不能让我更受欢迎..."
            },
            {
                // 爱-归属感类型 - 渴望融入团队的职场新人
                id: 2,
                desire_type: "爱",
                desire_subtype: "归属感",
                background: "职场新人",
                character_image: "img/img_woman.png", // 年轻女性职场新人
                want: "被同事接纳，融入公司的核心圈子", // 表面欲望：职场融入
                need: "学会独立自信，不依赖他人的认可来定义自己", // 真正需要：独立自信
                flaw: "过度迎合他人，害怕被排斥，缺乏独立的自我认知",
                entrance: "午饭时间大家聊天我总是插不上话，我是不是不够有趣...", // 基于need（独立自信）的困扰
                correctMask: "love",
                positiveResponse: "我要成为派对焦点！", // 基于want（职场融入）的满足
                negativeResponse: "这个...好像不能让我更受同事欢迎..."
            },
            {
                // 爱-安全感类型 - 渴望稳定关系的恋爱焦虑者
                id: 6,
                desire_type: "爱",
                desire_subtype: "安全感",
                background: "恋爱焦虑者",
                character_image: "img/img_woman.png", // 年轻女性
                want: "获得绝对安全的爱情，永远不会被抛弃", // 表面欲望：关系保障
                need: "学会情感独立，建立健康的自我界限", // 真正需要：情感独立
                flaw: "过度依赖他人的爱来获得安全感，害怕孤独，缺乏情感边界",
                entrance: "男朋友回信息总不及时，他似乎不太爱我...", // 基于need（情感独立）的恐惧
                correctMask: "love",
                positiveResponse: "我要吸引更多追求者！", // 基于want（关系保障）的沉醉
                negativeResponse: "这个...不能给我安全感..."
            },
            {
                // 爱-安全感类型 - 渴望工作稳定的职场焦虑者
                id: 7,
                desire_type: "爱",
                desire_subtype: "安全感",
                background: "职场焦虑者",
                character_image: "img/img_man.png", // 中年男性上班族
                want: "获得绝对的工作保障，永远不会失业", // 表面欲望：职业保障
                need: "学会情感独立，建立健康的自我界限", // 真正需要：情感独立
                flaw: "过度依赖他人的认可来获得安全感，害怕被抛弃，缺乏情感边界",
                entrance: "公司最近在裁员，我总觉得下一个就是我...", // 基于need（情感独立）的恐惧
                correctMask: "love",
                positiveResponse: "我要成为老板的女婿！", // 基于want（职业保障）的沉醉
                negativeResponse: "这个...不能给我工作保障..."
            },
            {
                // 爱-安全感类型 - 渴望财务安全的理财焦虑者
                id: 10,
                desire_type: "爱",
                desire_subtype: "安全感",
                background: "理财焦虑者",
                character_image: "img/img_man.png", // 中年男性
                want: "积累足够的财富，永远不会缺钱", // 表面欲望：财务保障
                need: "学会情感独立，建立健康的自我界限", // 真正需要：情感独立
                flaw: "过度依赖金钱来获得安全感，害怕贫穷，缺乏情感边界",
                entrance: "银行余额每天都在减少，我会不会变成穷光蛋...", // 基于need（情感独立）的恐惧
                correctMask: "love",
                positiveResponse: "我要不择手段的搞钱！", // 基于want（财务保障）的沉醉
                negativeResponse: "这个...不能保障我的财务安全..."
            },
            {
                // 虚荣-成就类型 - 渴望功名的职场精英
                id: 11,
                desire_type: "虚荣",
                desire_subtype: "成就",
                background: "职场精英",
                character_image: "img/img_man.png", // 年轻男性精英
                want: "获得显赫的职业成就和他人的仰慕", // 表面欲望：外在成就
                need: "建立内在价值感，不以成就来衡量自我价值", // 真正需要：内在价值
                flaw: "用外在成就来证明自己的价值，内心深度自卑，害怕失败",
                entrance: "为什么老板给他的朋友圈点赞，却从来不理我...", // 基于need（内在价值）的痛苦
                correctMask: "honor",
                positiveResponse: "我要成为最佳员工！", // 基于want（外在成就）的陶醉
                negativeResponse: "这个面具...似乎不能提升我的成就..."
            },
            {
                // 虚荣-成就类型 - 渴望商业成功的创业者
                id: 12,
                desire_type: "虚荣",
                desire_subtype: "成就",
                background: "创业者",
                character_image: "img/img_man.png", // 年轻男性创业者
                want: "获得巨大的商业成功，成为商界传奇", // 表面欲望：商业辉煌
                need: "建立内在价值感，不以成就来衡量自我价值", // 真正需要：内在价值
                flaw: "用外在成就来证明自己的价值，内心深度自卑，害怕失败",
                entrance: "投资人又拒绝了我，是不是我的项目不够好...", // 基于need（内在价值）的痛苦
                correctMask: "honor",
                positiveResponse: "我要成为商界传奇！", // 基于want（商业辉煌）的陶醉
                negativeResponse: "这个面具...似乎不能让我成功..."
            },
            {
                // 虚荣-成就类型 - 渴望艺术成功的艺术家
                id: 13,
                desire_type: "虚荣",
                desire_subtype: "成就",
                background: "艺术家",
                character_image: "img/img_woman.png", // 年轻女性艺术家
                want: "获得艺术界的认可，成为知名艺术家", // 表面欲望：艺术名声
                need: "建立内在价值感，不以成就来衡量自我价值", // 真正需要：内在价值
                flaw: "用外在成就来证明自己的价值，内心深度自卑，害怕失败",
                entrance: "我的作品总是没人欣赏，是不是我没有天赋...", // 基于need（内在价值）的痛苦
                correctMask: "honor",
                positiveResponse: "我要超越达·芬奇！", // 基于want（艺术名声）的陶醉
                negativeResponse: "这个面具...似乎不能让我出名..."
            },
            {
                // 虚荣-成就类型 - 渴望体育成功的运动员
                id: 14,
                desire_type: "虚荣",
                desire_subtype: "成就",
                background: "运动员",
                character_image: "img/img_man.png", // 年轻男性运动员
                want: "获得体育比赛的冠军，成为体育明星", // 表面欲望：体育荣耀
                need: "建立内在价值感，不以成就来衡量自我价值", // 真正需要：内在价值
                flaw: "用外在成就来证明自己的价值，内心深度自卑，害怕失败",
                entrance: "教练说我不够努力，是不是我真的不适合这项运动...", // 基于need（内在价值）的痛苦
                correctMask: "honor",
                positiveResponse: "我要拿下世界杯！", // 基于want（体育荣耀）的陶醉
                negativeResponse: "这个面具...似乎不能让我获胜..."
            },
            {
                // 虚荣-尊严类型 - 渴望完美形象的网红
                id: 15,
                desire_type: "虚荣",
                desire_subtype: "尊严",
                background: "网红",
                character_image: "img/img_woman.png", // 年轻女性网红
                want: "维持完美形象，获得所有人的尊重和羡慕", // 表面欲望：完美形象
                need: "接受真实的自己，不再害怕展示脆弱", // 真正需要：真实接纳
                flaw: "活在虚假的完美形象中，害怕真实的自己被发现，过度在意面子",
                entrance: "上次直播忘开美颜了，我的粉丝正在流失...", // 基于need（真实接纳）的疲惫
                correctMask: "honor",
                positiveResponse: "我要获得最美容颜！", // 基于want（完美形象）的满足
                negativeResponse: "这个面具...好像不能让我更完美..."
            },
            {
                // 虚荣-尊严类型 - 渴望维持面子的家长
                id: 16,
                desire_type: "虚荣",
                desire_subtype: "尊严",
                background: "爱面子家长",
                character_image: "img/img_woman.png", // 中年女性家长
                want: "维持完美的家长形象，让别人羡慕自己的家庭", // 表面欲望：家庭面子
                need: "接受真实的自己，不再害怕展示脆弱", // 真正需要：真实接纳
                flaw: "活在虚假的完美形象中，害怕真实的自己被发现，过度在意面子",
                entrance: "其他家长都在炫耀孩子，我家孩子成绩不够好...", // 基于need（真实接纳）的疲惫
                correctMask: "honor",
                positiveResponse: "我要让孩子考上清北！", // 基于want（家庭面子）的满足
                negativeResponse: "这个面具...好像不能让我更有面子..."
            },
            {
                // 虚荣-尊严类型 - 渴望权威形象的中层管理
                id: 17,
                desire_type: "虚荣",
                desire_subtype: "尊严",
                background: "中层管理",
                character_image: "img/img_man.png", // 中年男性管理者
                want: "维持威严的管理者形象，获得下属的敬畏", // 表面欲望：管理威严
                need: "接受真实的自己，不再害怕展示脆弱", // 真正需要：真实接纳
                flaw: "活在虚假的完美形象中，害怕真实的自己被发现，过度在意面子",
                entrance: "下属们背后议论我不够专业...", // 基于need（真实接纳）的疲惫
                correctMask: "honor",
                positiveResponse: "我要发表学术论文！", // 基于want（管理威严）的满足
                negativeResponse: "这个面具...好像不能让我更权威..."
            },
            {
                // 虚荣-尊严类型 - 渴望维持体面的中年人
                id: 18,
                desire_type: "虚荣",
                desire_subtype: "尊严",
                background: "中年人",
                character_image: "img/img_oldman.png", // 中年男性
                want: "维持体面的中年形象，不让人看不起", // 表面欲望：中年体面
                need: "接受真实的自己，不再害怕展示脆弱", // 真正需要：真实接纳
                flaw: "活在虚假的完美形象中，害怕真实的自己被发现，过度在意面子",
                entrance: "朋友们都混得比我好，聚会时我总觉得抬不起头...", // 基于need（真实接纳）的疲惫
                correctMask: "honor",
                positiveResponse: "我要贷款买法拉利！", // 基于want（中年体面）的满足
                negativeResponse: "这个面具...好像不能让我更体面..."
            },
            {
                // 控制-意义感类型 - 渴望人生意义的迷茫青年
                id: 19,
                desire_type: "控制",
                desire_subtype: "意义感",
                background: "迷茫青年",
                character_image: "img/img_man.png", // 年轻男性
                want: "找到人生的终极意义，掌控自己的命运", // 表面欲望：终极意义
                need: "学会在平凡中创造意义，接受生活的不确定性", // 真正需要：当下意义
                flaw: "逃避现实责任，总是寻找虚无缥缈的'大意义'，害怕承担具体责任",
                entrance: "感觉人生毫无意义，我需要找到真正重要的事情...", // 基于need（当下意义）的困惑
                correctMask: "control",
                positiveResponse: "我要改变世界！", // 基于want（终极意义）的兴奋
                negativeResponse: "这个面具...好像不能给我人生意义..."
            },
            {
                // 控制-意义感类型 - 渴望传承价值的文化守护者
                id: 23,
                desire_type: "控制",
                desire_subtype: "意义感",
                background: "文化守护者",
                character_image: "img/img_oldman.png", // 老年文化守护者
                want: "传承重要的文化价值，成为文明的守护者", // 表面欲望：文化传承
                need: "学会在平凡中创造意义，接受生活的不确定性", // 真正需要：当下意义
                flaw: "逃避现实责任，总是寻找虚无缥缈的'大意义'，害怕承担具体责任",
                entrance: "现代人太浮躁，我要保护这些珍贵的传统...", // 基于need（当下意义）的困惑
                correctMask: "control",
                positiveResponse: "我要复兴古代文明！", // 基于want（文化传承）的兴奋
                negativeResponse: "这个面具...好像不能给我使命感..."
            },
            {
                // 控制-权力类型 - 渴望控制的小组长
                id: 25,
                desire_type: "控制",
                desire_subtype: "权力",
                background: "小组长",
                character_image: "img/img_woman.png", // 中年女性小组长
                want: "获得对团队的控制权，让所有人听从指挥", // 表面欲望：团队控制
                need: "学会真正的领导力，通过服务他人来实现影响力", // 真正需要：服务领导
                flaw: "渴望控制他人来获得安全感，害怕被忽视，缺乏真正的领导智慧",
                entrance: "组员们总是不按我的计划执行，他们是不是看不起我...", // 基于need（服务领导）的挫败
                correctMask: "control",
                positiveResponse: "我要自己当老板！", // 基于want（团队控制）的满足
                negativeResponse: "这个面具...好像不能给我控制力..."
            },
            {
                // 控制-权力类型 - 渴望管理权的部门主管
                id: 26,
                desire_type: "控制",
                desire_subtype: "权力",
                background: "部门主管",
                character_image: "img/img_man.png", // 中年男性主管
                want: "获得更大的管理权限，控制更多下属", // 表面欲望：管理扩张
                need: "学会真正的领导力，通过服务他人来实现影响力", // 真正需要：服务领导
                flaw: "渴望控制他人来获得安全感，害怕被忽视，缺乏真正的领导智慧",
                entrance: "上级总是绕过我直接安排工作，我的权威在哪里...", // 基于need（服务领导）的挫败
                correctMask: "control",
                positiveResponse: "我要成为他的上级！", // 基于want（管理扩张）的满足
                negativeResponse: "这个面具...好像不能给我权威..."
            }
        ];
        
        this.initializeGame();
    }
    
    initializeGame() {
        // 获取DOM元素
        this.elements = {
            gameScreen: document.getElementById('game-screen'),
            resultScreen: document.getElementById('result-screen'),
            customerDialogue: document.getElementById('customer-dialogue'),
            dialogueArea: document.querySelector('.dialogue-area'),
            timerDisplay: document.getElementById('timer-display'),
            timer: document.getElementById('timer'),
            timerProgressBar: document.getElementById('timer-progress-bar'),
            timerProgressFill: document.getElementById('timer-progress-fill'),
            timerText: document.getElementById('timer-text'),
            gameIntro: document.getElementById('game-intro'),
            masksContainer: document.getElementById('masks-container'),
            maskDropZone: document.getElementById('mask-drop-zone'),
            maskHint: document.getElementById('mask-hint'),
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn'),
            successCount: document.getElementById('success-count'),
            totalServed: document.getElementById('total-served'),
            accuracyRate: document.getElementById('accuracy-rate'),
            characterContainer: document.querySelector('.character-container'),
            characterImage: document.querySelector('.character-image')
        };
        
        // 绑定事件
        this.bindEvents();
        
        // 初始化界面
        this.updateUI();
    }
    
    bindEvents() {
        // 开始游戏按钮
        this.elements.startBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        // 重新开始按钮
        this.elements.restartBtn.addEventListener('click', () => {
            this.restartGame();
        });
        
        // 绑定拖拽事件
        this.bindDragEvents();
    }
    
    bindDragEvents() {
        const maskItems = document.querySelectorAll('.mask-item');
        
        maskItems.forEach(maskItem => {
            // 鼠标事件
            maskItem.addEventListener('mousedown', (e) => this.startDrag(e, maskItem));
            
            // 触摸事件
            maskItem.addEventListener('touchstart', (e) => this.startDrag(e, maskItem), { passive: false });
        });
        
        // 全局拖拽事件 - 优化响应速度
        document.addEventListener('mousemove', (e) => this.drag(e), { passive: false });
        document.addEventListener('mouseup', (e) => this.endDrag(e));
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', (e) => this.endDrag(e));
    }
    
    startDrag(e, maskItem) {
        if (!this.gameInProgress || this.selectedMask) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        this.isDragging = true;
        this.dragElement = maskItem;
        
        // 获取初始位置
        const rect = maskItem.getBoundingClientRect();
        this.initialPos = { x: rect.left, y: rect.top };
        
        // 获取触摸/鼠标位置
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        this.startPos = { x: clientX, y: clientY };
        
        // 显示原位置的占位符（保持布局）
        maskItem.style.visibility = 'hidden';
        
        // 创建跟随鼠标的拖拽元素
        this.createDragClone(maskItem, clientX, clientY);
        
        // 显示提示
        this.elements.maskHint.classList.add('show');
    }
    
    createDragClone(maskItem, x, y) {
        // 移除之前的克隆
        if (this.dragClone) {
            this.dragClone.remove();
        }
        
        const maskImage = maskItem.querySelector('.mask-image');
        const clone = document.createElement('img');
        clone.src = maskImage.src;
        clone.alt = maskImage.alt;
        clone.className = 'drag-clone';
        
        // 直接设置位置，避免transform导致的延迟
        clone.style.left = (x - 48) + 'px';
        clone.style.top = (y - 48) + 'px';
        clone.style.width = '96px';
        clone.style.height = 'auto';
        
        document.body.appendChild(clone);
        this.dragClone = clone;
    }
    
    drag(e) {
        if (!this.isDragging || !this.dragClone) return;
        
        e.preventDefault();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // 直接更新位置，提高响应速度
        this.dragClone.style.left = (clientX - 48) + 'px';
        this.dragClone.style.top = (clientY - 48) + 'px';
        
        // 检查是否在拖放区域上方
        const dropZone = this.elements.maskDropZone;
        const dropRect = dropZone.getBoundingClientRect();
        
        if (clientX >= dropRect.left && clientX <= dropRect.right &&
            clientY >= dropRect.top && clientY <= dropRect.bottom) {
            dropZone.classList.add('drag-over');
        } else {
            dropZone.classList.remove('drag-over');
        }
    }
    
    endDrag(e) {
        if (!this.isDragging || !this.dragElement) return;
        
        const clientX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const clientY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        
        // 移除拖拽克隆
        if (this.dragClone) {
            this.dragClone.remove();
            this.dragClone = null;
        }
        
        // 检查是否放置在拖放区域
        const dropZone = this.elements.maskDropZone;
        const dropRect = dropZone.getBoundingClientRect();
        
        let wasDropped = false;
        if (clientX >= dropRect.left && clientX <= dropRect.right &&
            clientY >= dropRect.top && clientY <= dropRect.bottom) {
            this.selectMask(this.dragElement.dataset.mask);
            wasDropped = true;
        }
        
        // 如果没有成功放置，恢复原面具的可见性
        if (!wasDropped) {
            this.dragElement.style.visibility = 'visible';
        }
        
        // 重置状态
        dropZone.classList.remove('drag-over');
        this.elements.maskHint.classList.remove('show');
        this.isDragging = false;
        this.dragElement = null;
    }
    
    showMaskOnFace(maskType) {
        // 移除之前的面具
        const existingMask = this.elements.characterContainer.querySelector('.face-mask');
        if (existingMask) {
            existingMask.remove();
        }
        
        // 根据面具类型获取图片路径
        let maskSrc;
        switch (maskType) {
            case 'love':
                maskSrc = 'img/img_mask_1.png';
                break;
            case 'honor':
                maskSrc = 'img/img_mask_2.png';
                break;
            case 'control':
                maskSrc = 'img/img_mask_3.png';
                break;
            default:
                return;
        }
        
        // 创建面具元素
        const faceMask = document.createElement('img');
        faceMask.src = maskSrc;
        faceMask.className = `face-mask face-mask-${maskType}`; // 添加特定类型的CSS类
        faceMask.alt = '选中的面具';
        
        // 添加到人物容器
        this.elements.characterContainer.appendChild(faceMask);
    }
    
    removeFaceMask() {
        const faceMask = this.elements.characterContainer.querySelector('.face-mask');
        if (faceMask) {
            faceMask.remove();
        }
    }
    
    startGame() {
        this.gameInProgress = true;
        this.currentCustomer = null;
        this.availableCustomers = [...this.customers]; // 复制所有客人到可用池
        this.servedCustomers = 0;
        this.successfulCustomers = [];
        this.selectedMask = null;
        
        // 隐藏游戏介绍界面
        this.elements.gameIntro.classList.add('hidden');
        
        // 隐藏开始按钮，启动倒计时
        this.elements.startBtn.style.display = 'none';
        this.startTimer();
        
        // 显示人物和面具容器
        this.elements.characterContainer.style.display = 'block';
        
        // 步骤1: 游戏初始化时不显示气泡（已通过CSS实现）
        // 步骤2: 开始游戏后，人物淡入，然后显示第一位客人
        this.showFirstCustomer();
    }
    
    showFirstCustomer() {
        // 生成随机客人
        this.currentCustomer = this.generateRandomCustomer();
        if (!this.currentCustomer) {
            return;
        }
        
        // 更新人物形象
        this.updateCharacterImage();
        
        // 步骤2: 人物走路入场动画
        this.elements.characterContainer.classList.remove('fade-out', 'fade-in', 'walking');
        this.elements.characterContainer.classList.add('walk-in');
        
        // 显示面具选择区域
        this.elements.masksContainer.style.display = 'flex';
        this.elements.maskDropZone.style.display = 'flex';
        this.resetMasks();
        
        // 步骤3: 1秒后（走路动画结束）显示气泡
        setTimeout(() => {
            if (this.gameInProgress) {
                this.elements.characterContainer.classList.remove('walk-in');
                this.showBubbleWithText(this.currentCustomer.entrance);
            }
        }, 1000);
        
        this.updateUI();
    }

    showCurrentCustomer() {
        if (!this.gameInProgress) return;
        
        // 生成随机客人
        this.currentCustomer = this.generateRandomCustomer();
        if (!this.currentCustomer) {
            return;
        }

        // 更新人物形象
        this.updateCharacterImage();

        // 步骤8: 人物走路入场动画
        this.elements.characterContainer.classList.remove('fade-out', 'fade-in', 'walking');
        this.elements.characterContainer.classList.add('walk-in');
        
        // 显示面具选择区域
        this.elements.masksContainer.style.display = 'flex';
        this.elements.maskDropZone.style.display = 'flex';
        this.removeFaceMask();
        this.resetMasks();
        
        // 步骤3: 1秒后（走路动画结束）显示气泡
        setTimeout(() => {
            if (this.gameInProgress) {
                this.elements.characterContainer.classList.remove('walk-in');
                this.showBubbleWithText(this.currentCustomer.entrance);
            }
        }, 1000);
        
        this.updateUI();
    }
    
    showBubbleWithText(text, isCorrectFeedback = false) {
        // 清除之前的动画类
        this.elements.dialogueArea.classList.remove('bubble-enter', 'bubble-exit', 'fade-out', 'fade-in');
        this.elements.customerDialogue.classList.remove('horror-effect');
        
        // 获取气泡元素并清除之前的效果
        const speechBubble = this.elements.customerDialogue.parentElement;
        speechBubble.classList.remove('horror-bubble');
        
        // 设置文本内容
        this.elements.customerDialogue.textContent = text;
        
        // 清除内联样式，让CSS类生效
        this.elements.dialogueArea.style.opacity = '';
        this.elements.dialogueArea.style.visibility = '';
        
        // 强制重绘
        this.elements.dialogueArea.offsetHeight;
        
        // 添加入场动画
        this.elements.dialogueArea.classList.add('bubble-enter');
        
        // 如果是正确反馈，添加惊悚特效
        if (isCorrectFeedback) {
            setTimeout(() => {
                this.elements.customerDialogue.classList.add('horror-effect');
                speechBubble.classList.add('horror-bubble');
            }, 300); // 等待气泡入场动画进行一半时开始
        }
    }
    
    hideBubble() {
        // 清除所有效果并添加消失动画
        this.elements.customerDialogue.classList.remove('horror-effect');
        const speechBubble = this.elements.customerDialogue.parentElement;
        speechBubble.classList.remove('horror-bubble');
        
        this.elements.dialogueArea.classList.remove('bubble-enter');
        this.elements.dialogueArea.classList.add('bubble-exit');
    }

    selectMask(selectedMask) {
        if (this.selectedMask || !this.currentCustomer || !this.gameInProgress) return;
        
        this.selectedMask = selectedMask;
        
        // 在人物脸上显示选中的面具
        this.showMaskOnFace(selectedMask);
        
        // 隐藏面具选择区域
        this.elements.masksContainer.style.display = 'none';
        this.elements.maskDropZone.style.display = 'none';
        
        // 准备反馈内容
        let response;
        let isCorrect = false;
        
        if (selectedMask === this.currentCustomer.correctMask) {
            response = this.currentCustomer.positiveResponse;
            isCorrect = true;
            this.successfulCustomers.push(this.currentCustomer);
        } else {
            response = this.currentCustomer.negativeResponse;
        }
        
        this.servedCustomers++;
        
        // 步骤4: 戴上面具后，气泡消失
        this.hideBubble();
        
        // 步骤4: 0.5秒后显示气泡入场动画（回复内容）
        setTimeout(() => {
            if (this.gameInProgress) {
                this.showBubbleWithText(response, isCorrect);
                
                // 步骤5: 等待1.5秒后，气泡消失
                setTimeout(() => {
                    if (this.gameInProgress) {
                        this.hideBubble();
                        
                        // 步骤6: 气泡消失后，人物淡出
                        setTimeout(() => {
                            if (this.gameInProgress) {
                                this.elements.characterContainer.classList.remove('fade-in', 'walking');
                                this.elements.characterContainer.classList.add('fade-out');
                                
                                // 步骤7: 等待0.5秒后，显示下一位客人
                                setTimeout(() => {
                                    if (this.gameInProgress) {
                                        this.showCurrentCustomer(); // 步骤8: 下个人物淡入
                                    }
                                }, 500);
                            }
                        }, 300); // 等待气泡消失动画完成
                    }
                }, 1500);
            }
        }, 500);
        
        this.updateUI();
    }
    
    transitionToNextCustomer() {
        // 这个方法现在被新的流程替代，保留以防需要
        if (!this.gameInProgress) return;
        this.showCurrentCustomer();
    }

    endGame() {
        this.gameInProgress = false;
        this.stopTimer();
        
        // 隐藏游戏界面
        this.elements.gameScreen.style.display = 'none';
        
        // 显示结果界面
        this.elements.resultScreen.style.display = 'flex';
        
        // 更新结果统计
        const accuracy = this.servedCustomers > 0 ? 
            Math.round((this.successfulCustomers.length / this.servedCustomers) * 100) : 0;
        
        this.elements.successCount.textContent = this.successfulCustomers.length;
        this.elements.totalServed.textContent = this.servedCustomers;
        this.elements.accuracyRate.textContent = accuracy + '%';
    }
    
    restartGame() {
        // 停止计时器
        this.stopTimer();
        
        // 重置游戏状态
        this.currentCustomer = null;
        this.availableCustomers = [...this.customers];
        this.servedCustomers = 0;
        this.successfulCustomers = [];
        this.gameInProgress = false;
        this.selectedMask = null;
        this.timeRemaining = 60;
        
        // 移除面具
        this.removeFaceMask();
        
        // 重置界面
        this.elements.gameScreen.style.display = 'flex';
        this.elements.resultScreen.style.display = 'none';
        this.elements.startBtn.style.display = 'block';
        this.elements.masksContainer.style.display = 'none';
        this.elements.maskDropZone.style.display = 'none';
        this.elements.characterContainer.style.display = 'none';
        this.elements.maskHint.classList.remove('show');
        this.elements.timerDisplay.style.display = 'none';
        this.elements.timerProgressBar.style.display = 'none';
        
        // 显示游戏介绍界面
        this.elements.gameIntro.classList.remove('hidden');
        
        // 重置动画状态
        this.elements.characterContainer.classList.remove('fade-out', 'fade-in', 'walk-in', 'walking');
        
        // 重置气泡状态
        this.elements.dialogueArea.classList.remove('bubble-enter', 'bubble-exit', 'fade-out', 'fade-in');
        this.elements.customerDialogue.classList.remove('horror-effect');
        
        // 清除气泡的惊悚效果
        const speechBubble = this.elements.customerDialogue.parentElement;
        speechBubble.classList.remove('horror-bubble');
        
        // 重置倒计时样式
        this.elements.timerDisplay.style.background = 'rgba(255, 107, 107, 0.9)';
        this.elements.timerDisplay.style.animation = 'pulse 2s infinite';
        
        // 重置对话
        this.elements.customerDialogue.textContent = '欢迎来到面具商店！点击开始游戏';
        
        // 重置面具
        this.resetMasks();
        
        this.updateUI();
    }
    
    updateUI() {
        // 由于移除了客人计数器，这里可以为空或用于其他UI更新
    }

    startTimer() {
        this.timeRemaining = 60;
        this.elements.timerProgressBar.style.display = 'block';
        this.updateTimer();
        
        this.gameTimer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimer();
            
            if (this.timeRemaining <= 0) {
                this.endGame();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
        this.elements.timerProgressBar.style.display = 'none';
    }
    
    updateTimer() {
        const progress = (this.timeRemaining / 60) * 100;
        this.elements.timerProgressFill.style.width = progress + '%';
        this.elements.timerText.textContent = this.timeRemaining + 's';
        
        // 时间不足10秒时添加警告效果
        if (this.timeRemaining <= 10) {
            this.elements.timerProgressFill.style.background = '#ff6b6b';
        } else {
            this.elements.timerProgressFill.style.background = '#ffd93d';
        }
    }
    
    generateRandomCustomer() {
        if (this.availableCustomers.length === 0) {
            this.endGame();
            return null;
        }
        
        const randomIndex = Math.floor(Math.random() * this.availableCustomers.length);
        const customer = this.availableCustomers[randomIndex];
        
        // 从可用池中移除这个客人
        this.availableCustomers.splice(randomIndex, 1);
        
        return customer;
    }

    resetMasks() {
        const maskItems = document.querySelectorAll('.mask-item');
        maskItems.forEach(mask => {
            mask.style.visibility = 'visible';
            mask.style.display = 'block';
            mask.classList.remove('hidden', 'dragging');
        });
        
        this.selectedMask = null;
    }

    // 新增方法：更新人物形象
    updateCharacterImage() {
        if (!this.currentCustomer || !this.currentCustomer.character_image) {
            return;
        }
        
        if (this.elements.characterImage) {
            this.elements.characterImage.src = this.currentCustomer.character_image;
            this.elements.characterImage.alt = this.currentCustomer.background;
        }
    }
}

// 当页面加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', () => {
    new MaskSellerGame();
});

// 防止页面缩放和滚动
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

document.addEventListener('touchmove', function (e) {
    if (e.target.closest('.draggable') || e.target.closest('.result-content')) {
        return;
    }
    e.preventDefault();
}, { passive: false });

// 防止双击缩放
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false); 