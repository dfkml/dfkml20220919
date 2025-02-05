
        let clickCount = 0;
        let clickPositions = [];
        const topCanvas = document.getElementById('topCanvas');
        const ctx = topCanvas.getContext('2d');
        const drawList = document.getElementById('drawList');
        const textInput = document.getElementById('originalSentence');
        
        

        // 设置画布和图片框的尺寸
        function setCanvasSize() {
            const container = document.querySelector('.img-container img');
            topCanvas.width = container.clientWidth;
            topCanvas.height = container.clientHeight;
            // document.querySelector('.canvas-container').style.width = `${container.clientWidth}px`;
            // document.querySelector('.canvas-container').style.height = `${container.clientHeight}px`;
            // 获取 scrollable-list 元素
            
        }
        
        // 获取主图片和参考列表元素
        const mainImage = document.getElementById('mainImage');
        const scrollableList = document.getElementById('referenceList');

        // 设置参考列表的高度与主图片的高度相等
        function setScrollableListHeight() {
            const mainImageRect = mainImage.getBoundingClientRect();
            scrollableList.style.maxHeight = `${mainImageRect.height}px`;
        }

        // 初始化设置高度
        setScrollableListHeight();
        window.addEventListener('resize', setCanvasSize);
        setCanvasSize();
        window.addEventListener('resize', setScrollableListHeight);
        // 标志变量以跟踪是否正在拖动
        let isDragging = false;
        let dragStartX, dragStartY;
        let draggingIndex = -1;

        

        // 鼠标按下事件
        topCanvas.addEventListener('mousedown', function (e) {
            const rect = topCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            clickPositions.forEach((position, index) => {
                const distance = Math.sqrt((x - position.x) * (x - position.x) + (y - position.y) * (y - position.y));
                if (distance <= 30) {
                    isDragging = true;
                    dragStartX = x;
                    dragStartY = y;
                    draggingIndex = index;
                }
            });
        });

        // 鼠标移动事件
        topCanvas.addEventListener('mousemove', function (e) {
            if (!isDragging) return;

            const rect = topCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            clickPositions[draggingIndex].x += x - dragStartX;
            clickPositions[draggingIndex].y += y - dragStartY;

            dragStartX = x;
            dragStartY = y;

            // 重新绘制所有连线和圆圈
            redrawAll();
            topCanvas.addEventListener('mouseup', function () {
                isDragging = false;
                draggingIndex = -1;
            });
        });

        // 鼠标释放事件
        //topCanvas.addEventListener('mouseup', function () {
          //  isDragging = false;
            //draggingIndex = -1;
        //});

        // 单击事件
        topCanvas.addEventListener('click', function (e) {
            if (isDragging) return; // 如果正在拖动，则忽略点击事件

            const rect = topCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
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

        // 2. 实现 drawLine 函数
        function drawLine(x1, y1, x2, y2) {
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.strokeStyle = 'red'; // 更改线条颜色为红色
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // 3. 为"top画布"添加鼠标移动事件监听器
        
        topCanvas.addEventListener('mousemove', function (e) {
            const rect = topCanvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
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

        // 创建垃圾桶图标
        function createTrashIcon(x, y, index) {
            const trashIcon = document.createElement('div');
            trashIcon.className = 'trash-icon';
            trashIcon.innerHTML = '<i class="bi bi-trash-fill"></i>'; // 使用 Bootstrap Icons 的垃圾桶图标
            trashIcon.style.left = `${x + 20}px`; // 调整垃圾桶图标的位置
            trashIcon.style.top = `${y - 10}px`; // 调整垃圾桶图标的位置
            topCanvas.parentNode.appendChild(trashIcon);

            // 添加垃圾桶图标点击事件监听器
            trashIcon.addEventListener('click', () => {
                removeMark(index);
                trashIcon.remove();
            });
        }
        // 创建浮动参考图片
        
        function createReferenceImage(x, y, imageUrl,prompt) {
            const referenceImage = document.createElement('div');
            referenceImage.className = 'reference-img';
            const canvasRect = topCanvas.getBoundingClientRect();            
            const imgWidth = canvasRect.width*0.2; // 假设图片宽度为 150px
            const imgHeight = canvasRect.height*0.2; // 假设图片高度为 175px
            referenceImage.style.width = '${imgWidth}px'; // 设置 referenceImage 的宽度
            referenceImage.style.height ='${imgHeight}px'; // 设置 referenceImage 的高度;
            // 创建 img 元素
            const img = document.createElement('img');
            img.src = imageUrl; // 设置图片的 URL
            img.alt = '参考图片';
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.opacity = '0.7'; // 设置图片透明度为 60%

            // 将 img 元素添加到 referenceImage 中
            referenceImage.appendChild(img);

            // 创建文本框
            const textBox = document.createElement('div');
            textBox.className = 'reference-textbox';
            textBox.textContent = prompt; // 设置文本框的内容
            textBox.style.position = 'absolute';
            textBox.style.left = '0'; // 设置文本框的位置
            textBox.style.bottom = '0'; // 设置文本框的位置，确保在 referenceImage 内部底部
            textBox.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            textBox.style.color = 'white';
            textBox.style.padding = '5px';
            textBox.style.borderRadius = '5px';
            textBox.style.zIndex = '13'; // 确保文本框在图片上方
            
            textBox.style.textAlign = 'left';
            // 设置文字溢出时显示滚动条
            textBox.style.overflow = 'auto';
            textBox.style.maxHeight = '80px'; // 设置最大高度以触发滚动条
            // 将文本框添加到 referenceImage 中
            referenceImage.appendChild(textBox);
            // 管理 textbox 的初始显示状态
            textBox.style.display = 'none';
            // 创建一个新的 div 用于鼠标悬停事件
            const hoverDiv = document.createElement('div');
            hoverDiv.className = 'hover-div';
            hoverDiv.style.cursor='zoomIn';
            hoverDiv.style.zIndex = '13';
            hoverDiv.style.position = 'absolute';
            hoverDiv.style.top = '0';
            hoverDiv.style.left = '0';
            hoverDiv.style.width = '100%';
            hoverDiv.style.height = '20px'; // 根据需要调整高度
            hoverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'; // 可选：设置背景颜色以便观察

            // 将 hoverDiv 添加到 referenceImage 中
            referenceImage.appendChild(hoverDiv);

            // 为 hoverDiv 添加鼠标悬停事件监听器
            hoverDiv.addEventListener('mouseenter', () => {
                textBox.style.display = 'block';
            });

            hoverDiv.addEventListener('mouseleave', () => {
                textBox.style.display = 'none';
            });
            
            // 计算参考图片的位置，确保不会超出画布边界
            let left = x - imgWidth-34;
            let top = y - imgHeight-34;
            if (left < 0) {
                left = 0;
            }
            if (top < 0) {
                top = 0;
                if(left==0){
                    top=y+10;
                }
            }
            if (left + imgWidth > canvasRect.width) {
                left = canvasRect.width - imgWidth;
            }
            if (top + imgHeight > canvasRect.height) {
                top = canvasRect.height - imgHeight;
            }

            // 设置 referenceImage 的位置
            referenceImage.style.left = `${left}px`;
            referenceImage.style.top = `${top}px`;

            // 将 referenceImage 添加到 canvas 的父节点中
            topCanvas.parentNode.appendChild(referenceImage);
            // 管理 textbox 的显示状态
            // let isTextBoxVisible = true;

            // // 为 textbox 添加点击事件监听器，点击时隐藏 textbox
            // textBox.addEventListener('click', () => {
            //     if (isTextBoxVisible) {
            //         textBox.style.display = 'none';
            //         isTextBoxVisible = false;
            //     }
            // });

            // 为 img 添加点击事件监听器，点击时显示 textbox
            img.addEventListener('click', () => {
                // 切换图片的放大状态
                img.classList.toggle('enlarged');
                
            });    
            // 为 referenceImage 添加点击事件监听器，点击时显示 referenceImage
            // 添加删除功能
            // referenceImage.addEventListener('click', () => {
            //     selectedImageUrl = ''; // 清除选中的图片链接
            //     referenceImage.remove();
            // });
        }
        // 创建提示文字
    
        let currentTooltip = null;

        function createPromptTooltip(x, y, prompt) {
            if (currentTooltip) {
                currentTooltip.remove();
            }
            const tooltip = document.createElement('div');
            tooltip.className = 'prompt-tooltip';

            tooltip.textContent = prompt;
            tooltip.style.position = 'absolute';
            
            tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '5px';
            tooltip.style.borderRadius = '5px';
            tooltip.style.zIndex = '11'; // 确保提示文字在最上层
            topCanvas.parentNode.appendChild(tooltip);

            // 使用 requestAnimationFrame 确保样式已应用
            requestAnimationFrame (() => {
                const tooltipWidth = tooltip.offsetWidth;
                const tooltipHeight = tooltip.offsetHeight;

                
                // 获取 topCanvas 的边界
                const canvasRect = topCanvas.getBoundingClientRect();
                

                if (x + tooltipWidth > canvasRect.width) {
                    tooltip.style.left = `${canvasRect.width - tooltipWidth}px`;
                }
                
                // 计算提示框的位置，确保不会超出画布边界
                let left = x - tooltipWidth / 2;
                let top = y - tooltipHeight - 20; // 提示框在鼠标上方 10px

                if (left < 0) {
                    left = 0;
                }
                if (top < 0) {
                    top = 0;
                }
                if (left + tooltipWidth > canvasRect.width) {
                    left = canvasRect.width - tooltipWidth;
                }
                if (top + tooltipHeight > canvasRect.height) {
                    top = canvasRect.height - tooltipHeight;
                }

                // 设置提示框的位置
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                
                currentTooltip = tooltip;
            });
        }
        function removePromptTooltip() {
            if (currentTooltip) {
                currentTooltip.remove();
                currentTooltip = null;
            }
        }     
        
            

        // 删除标记
        function removeMark(index) {
            clickPositions.splice(index, 1);
            clickCount--;

            ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);

            // 重新绘制所有连线和圆圈
            redrawAll();
        }

        // 4. 绘制圆形
        function drawCircle(x, y, number) {
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, 2 * Math.PI);
            ctx.fillStyle = 'red';
            ctx.fill();
            ctx.font = '16px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(number, x - 8, y + 5);
        }

        // 重新绘制所有连线和圆圈
        function redrawAll() {
            ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);

            // 先绘制所有连线
            for (let i = 1; i < clickPositions.length; i++) {
                drawLine(clickPositions[i - 1].x, clickPositions[i - 1].y, clickPositions[i].x, clickPositions[i].y);
            }

            // 再绘制所有圆圈和数字
            clickPositions.forEach((position, index) => {
                const circleX = position.x;
                const circleY = position.y;
                drawCircle(circleX, circleY, index + 1);
            });
        }
        
        // 声明全局变量 drawData
       
        // 6. 添加保存功能
        document.getElementById('saveDraw').addEventListener('click', function () {
            const data = {
                positions: [...clickPositions],
                notes: textInput.value,
                timestamp: new Date().toLocaleString(),
                time: selectedTime,
            };
            console.log('保存的数据:', data);

            // 将保存的数据添加到 drawData 数组中
            drawData.push(data);          
            

            
            // 保存到 IndexedDB
            saveDrawData(data);
            
        });

        // 8. 添加清除功能
        document.getElementById('clearDraw').addEventListener('click', function () {
            clickCount = 0;
            clickPositions = [];
            ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);
        });

        // 9. 添加读取按钮功能
        drawList.addEventListener('click', function (e) {
            if (e.target.tagName === 'LI') {
                const savedData = JSON.parse(e.target.dataset.drawData);
                clickPositions = savedData.positions;
                clickCount = savedData.positions.length;
                ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);

                // 重新绘制所有连线和圆圈
                redrawAll();
            }
        });
    