// 触摸屏按下事件
topCanvas.addEventListener('touchstart', function (e) {
    e.preventDefault();
    if (isDragging) return; // 如果正在拖动，则忽略点击事件
    const rect = topCanvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;  

    
    console.log(x,y);
    console.log(`y = e.clientY${e.clientY} - rect.top${rect.top} = ${y}`);
    // 检查点击位置是否在已有的圆圈内
    let isOnCircle = false;
    clickPositions.forEach((position) => {
        const distance = Math.sqrt((x - position.x) * (x - position.x) + (y - position.y) * (y - position.y));
        if (distance <= 30) {
            isOnCircle = true;
            
        }
    });

    if (!isOnCircle) {
        clickCount++;
        clickPositions.push({ x, y });
        // 绘制红色圆圈数字序号
         drawCircle(x, y, clickCount);

        // 绘制连线
        if (clickCount > 1) {
            drawLine(clickPositions[clickCount - 2].x, clickPositions[clickCount - 2].y, x, y);
        }
        redrawAll();
    }

});

// 触摸屏移动事件
topCanvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    if (!isDragging) return;

    const rect = topCanvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    clickPositions[draggingIndex].x += x - dragStartX;
    clickPositions[draggingIndex].y += y - dragStartY;

    dragStartX = x;
    dragStartY = y;

    // 重新绘制所有连线和圆圈
    redrawAll();
});

// 触摸屏释放事件
topCanvas.addEventListener('touchend', function () {
    isDragging = false;
    draggingIndex = -1;
});


// 3. 为"top画布"添加触摸屏移动事件监听器
topCanvas.addEventListener('touchmove', function (e) {
    e.preventDefault();
    const rect = topCanvas.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;
    const filteredPoleData = poleData.filter(item => item.time === selectedTime);
    const symbolMap = new Map([
        [1, '①'], [2, '②'], [3, '③'], [4, '④'], [5, '⑤'], [6, '⑥'], [7, '⑦'], [8, '⑧'], [9, '⑨'],
        [10, '⑩'], [11, '⑪'], [12, '⑫'], [13, '⑬'], [14, '⑭'], [15, '⑮'], [16, '⑯'], [17, '⑰'],
        [18, '⑱'], [19, '⑲'], [20, '⑳']
        // 可以继续添加更多的映射
    ]);

    // 清除之前的垃圾桶图标
    Array.from(document.querySelectorAll('.trash-icon')).forEach(icon => icon.remove());
    // 清除之前的浮动图片
    Array.from(document.querySelectorAll('.reference-img')).forEach(img => img.remove());
    // 清除之前的提示文字
    Array.from(document.querySelectorAll('.prompt-tooltip')).forEach(tooltip => tooltip.remove());

    let isOnCircle = false;

    // 检查鼠标是否在圆圈数字1.5倍范围内
    clickPositions.forEach((position, index) => {
        const circleX = position.x;
        const circleY = position.y;

        const nextpoleItem = filteredPoleData.find(item => {
            const symbol = symbolMap.get(index + 2) || '';
            return item.num === symbol;
        });

        const distance = Math.sqrt((x - circleX) * (x - circleX) + (y - circleY) * (y - circleY));

        if (distance <= 30) {
            isOnCircle = true;
            createTrashIcon(circleX, circleY, index);

            // 根据圆圈数字获取对应的 image_url 和 prompt
            const poleItem = filteredPoleData.find(item => {
                const symbol = symbolMap.get(index + 1) || '';
                return item.num === symbol;
            });

            if (poleItem) {
                createReferenceImage(circleX, circleY, poleItem.image_url, poleItem.prompt.split('\n').slice(0, 2).join('\n'));
            }
        }
    });

    // 如果鼠标不在任何圆圈数字内，则显示 promptTooltip
    if (!isOnCircle) {
        if (clickPositions.length === 0) {
            const poleItem = filteredPoleData.find(item => item.num === '①');
            if (poleItem) {
                createPromptTooltip(x, y, poleItem.prompt.split('\n').slice(0, 2).join('\n'));
            }
        } else {
            const nextpoleItem = filteredPoleData.find(item => {
                const symbol = symbolMap.get(clickPositions.length + 1) || '';
                return item.num === symbol;
            });

            if (nextpoleItem) {
                createPromptTooltip(x, y, nextpoleItem.prompt.split('\n').slice(0, 2).join('\n'));
            }
        }
    }
});