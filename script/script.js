// script.js

// 视频解析功能
function parseVideo() {
    const videoUrl = document.getElementById('url').value;
    const api = document.getElementById('jk').value;
    const statusText = document.getElementById('statusText');

    if(videoUrl && api) {
        statusText.textContent = "正在解析中...";
        document.getElementById('player').src = api + encodeURIComponent(videoUrl);
    } else {
        statusText.textContent = "请输入有效视频地址";
        setTimeout(() => {
            statusText.textContent = "输入链接后，等待解析...";
        }, 2000);
    }
}

// 动态背景初始化
function initDynamicBackground() {
    const canvas = document.getElementById('netBackground');
    const ctx = canvas.getContext('2d');

    // 设置画布尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // 节点类
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
            this.radius = 2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#9AD7F4';
            ctx.fill();
        }
    }

    // 创建节点
    let nodeCount = window.matchMedia("(max-width: 768px)").matches ? 45 : 300;
    const nodes = Array.from({ length: nodeCount }, () => 
        new Node(Math.random() * canvas.width, Math.random() * canvas.height)
    );

    // 绘制连线
    function drawLines() {
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(154, 215, 244, ${1 - dist / 150})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        drawLines();
        requestAnimationFrame(animate);
    }

    // 事件监听
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate();
}

// 播放器控制
function initPlayerControls() {
    const player = document.getElementById('player');
    
    player.onload = function() {
        document.getElementById('statusText').style.display = 'none';
        postPlayerSize();
    };

    window.addEventListener('resize', postPlayerSize);

    function postPlayerSize() {
        if(player.contentWindow) {
            player.contentWindow.postMessage({
                event: 'command',
                func: 'setSize',
                args: [player.offsetWidth, player.offsetHeight]
            }, '*');
        }
    }
}

// 初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    initDynamicBackground();
    initPlayerControls();
});
// 在DOMContentLoaded事件中初始化所有功能
document.addEventListener('DOMContentLoaded', () => {
    // 确保canvas元素存在
    if(document.getElementById('netBackground')) {
        initDynamicBackground();
    }
    
    // 绑定按钮事件
    document.querySelector('button').addEventListener('click', parseVideo);
    
    // 初始化播放器
    initPlayerControls();
});

// 增强视频解析函数
function parseVideo() {
    const statusText = document.getElementById('statusText');
    try {
        const videoUrl = document.getElementById('url').value.trim();
        const api = document.getElementById('jk').value;
        
        if(!videoUrl) throw new Error('视频地址不能为空');
        if(!api) throw new Error('请选择解析接口');

        statusText.textContent = "正在解析中...";
        statusText.style.display = 'block';
        document.getElementById('player').src = api + encodeURIComponent(videoUrl);
    } catch (error) {
        statusText.textContent = error.message;
        setTimeout(() => {
            statusText.textContent = "输入链接后，等待解析...";
        }, 2000);
    }
}