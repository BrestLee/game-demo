class WhackAMole {
    constructor() {
        this.score = 0;
        this.timeLeft = 60;
        this.isPlaying = false;
        this.holes = document.querySelectorAll('.hole');
        this.scoreDisplay = document.getElementById('score');
        this.timerDisplay = document.getElementById('timer');
        this.startButton = document.getElementById('startButton');
        this.modal = document.getElementById('gameOverModal');
        this.finalScoreDisplay = document.getElementById('finalScore');
        this.restartButton = document.getElementById('restartButton');
        this.buttonTimers = document.querySelectorAll('.button-timer');
        
        this.bindEvents();
    }

    bindEvents() {
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.startGame());
        this.holes.forEach(hole => {
            hole.addEventListener('click', () => this.whack(hole));
        });
    }

    startGame() {
        if (this.isPlaying) return;
        
        this.resetGame();
        this.isPlaying = true;
        this.startButton.querySelector('.button-text').textContent = '游戏进行中';
        this.startButton.disabled = true;
        this.modal.classList.remove('show');
        
        this.gameInterval = setInterval(() => this.updateTimer(), 1000);
        this.moleInterval = setInterval(() => this.showRandomMoles(), 1000);
    }

    resetGame() {
        this.score = 0;
        this.timeLeft = 60;
        this.scoreDisplay.textContent = this.score;
        this.timerDisplay.textContent = this.timeLeft;
        this.startButton.querySelector('.button-text').textContent = '开始游戏';
        this.startButton.disabled = false;
        this.holes.forEach(hole => {
            hole.classList.remove('active', 'hit');
        });
        // 清除所有积分动画
        document.querySelectorAll('.score-popup').forEach(popup => popup.remove());
    }

    updateTimer() {
        this.timeLeft--;
        this.timerDisplay.textContent = this.timeLeft;
        // 更新按钮上的倒计时
        this.buttonTimers.forEach(timer => {
            timer.textContent = `剩余时间: ${this.timeLeft}秒`;
        });
        
        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    showRandomMoles() {
        if (!this.isPlaying) return;
        
        // 清除所有活跃的地鼠
        this.holes.forEach(hole => {
            hole.classList.remove('active');
        });
        
        // 随机决定出现1-2个地鼠
        const moleCount = Math.floor(Math.random() * 2) + 1;
        const availableHoles = Array.from(this.holes);
        
        for (let i = 0; i < moleCount; i++) {
            if (availableHoles.length === 0) break;
            
            // 随机选择一个洞
            const randomIndex = Math.floor(Math.random() * availableHoles.length);
            const randomHole = availableHoles.splice(randomIndex, 1)[0];
            randomHole.classList.add('active');
            
            // 随机时间后消失
            const duration = Math.random() * 1000 + 500; // 500-1500ms
            setTimeout(() => {
                if (randomHole.classList.contains('active')) {
                    randomHole.classList.remove('active');
                }
            }, duration);
        }
    }

    createScorePopup(hole) {
        const popup = document.createElement('div');
        popup.className = 'score-popup';
        popup.textContent = '+10';
        
        // 获取地鼠洞的位置
        const rect = hole.getBoundingClientRect();
        popup.style.left = `${rect.width / 2}px`;
        popup.style.top = `${rect.height / 2}px`;
        
        // 添加动画结束后的清理
        popup.addEventListener('animationend', () => {
            popup.remove();
        });
        
        hole.appendChild(popup);
    }

    whack(hole) {
        if (!this.isPlaying || !hole.classList.contains('active')) return;
        
        hole.classList.remove('active');
        hole.classList.add('hit');
        this.score += 10;
        this.scoreDisplay.textContent = this.score;
        
        // 创建积分动画
        this.createScorePopup(hole);
        
        // 移除击中效果
        setTimeout(() => {
            hole.classList.remove('hit');
        }, 200);
    }

    endGame() {
        this.isPlaying = false;
        clearInterval(this.gameInterval);
        clearInterval(this.moleInterval);
        
        // 显示游戏结束模态框
        this.finalScoreDisplay.textContent = this.score;
        this.modal.classList.add('show');
    }
}

// 初始化游戏
const game = new WhackAMole(); 