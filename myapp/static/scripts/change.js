
        let profileData = []; // 存储 profile 数据表数据
        let poleData = []; // 存储 pole 数据表数据
        let drawData = []; // 存储绘制数据
        let filteredPoleData = []; // 存储过滤后的 pole 数据表数据
        let selectedTime; // 记录选中的 time 值
        let selectedImageUrl = ''; // 存储选中的图片链接
        const numOrder = {
            '①': 1,
            '②': 2,
            '③': 3,
            '④': 4,
            '⑤': 5,
            '⑥': 6,
            '⑦': 7,
            '⑧': 8,
            '⑨': 9,
            '⑩': 10,
            '⑪': 11,
            '⑫': 12,
            '⑬': 13,
            '⑭': 14,
            '⑮': 15,
            '⑯': 16,
            '⑰': 17,
            '⑱': 18,
            '⑲': 19,
            '⑳': 20
        };
        
        // 添加事件监听器
        document.getElementById('productLink').addEventListener('click', function() {
            var clipboardContainer = document.getElementById('clipboardContainer');
            if (clipboardContainer.style.display === 'block') {
                clipboardContainer.style.display = 'none';
            } else {
                clipboardContainer.style.display = 'block';
            }
        });
        
        function hiddenPanel() {
            document.getElementById('clipboardContainer').style.display = 'none'; 
        }
        document.getElementById('hiddenPanelButton').addEventListener('click', hiddenPanel);
        // 检查数据格式是否符合 profile 数据表的要求
        function checkProfileDataFormat(data) {
            if (Array.isArray(data) && data.length > 0) {
                for (let item of data) {
                    if (!item.time ||!item.img ||!item.original ||!item.dis) {
                        return false;
                    }
                }
                return true;
            }
        } 
       

       
            
        // 检查数据格式是否符合 pole 数据表的要求
        function checkPoleDataFormat(data) {
            if (Array.isArray(data) && data.length > 0) {
                for (let item of data) {
                    if (!item.time ||!item.num ||!item.image_url ||!item.prompt) {
                        return false;
                    }
                }
                return true;
        }

      }
        // 从剪贴板导入数据
        async function importClipboardData() {
            try {
                const clipboardData = await navigator.clipboard.readText();
                document.getElementById('clip').value = clipboardData;
                const importedData = JSON.parse(clipboardData);
                const profileValid = checkProfileDataFormat(importedData);
                const poleValid = checkPoleDataFormat(importedData);
                const clipboardFormatStatus = document.getElementById('clipboardFormatStatus');
                if (profileValid || poleValid) {
                    clipboardFormatStatus.textContent = '';
                    document.getElementById('clip').classList.remove('invalid');
                    document.getElementById('clip').classList.add('valid');
                } else {
                    clipboardFormatStatus.textContent = '数据格式不符合要求，请检查！';
                    document.getElementById('clip').classList.remove('valid');
                    document.getElementById('clip').classList.add('invalid');
                }
            } catch (err) {
                console.error('无法导入数据: ', err);
            }
        }


        // 清空 clip 文本编辑框
        function clearClipboardTextbox() {
            document.getElementById('clip').value = '';
            document.getElementById('clip').classList.remove('valid');
            document.getElementById('clip').classList.remove('invalid');
            document.getElementById('clipboardFormatStatus').textContent = '';
        }


        // 从剪贴板导入数据到 profile 数据表
        function importProfileData() {
            const clipData = document.getElementById('clip').value;
            try {
                const importedData = JSON.parse(clipData);
                if (checkProfileDataFormat(importedData)) {
                    profileData = profileData.concat(importedData);
                    updatePalaceDataList();
                    document.getElementById('palaceDataFetchError').textContent = '数据已成功添加到 profile 数据表。';
                    importedData.forEach(item => saveProfileData(item)); // 保存到本地存储
                    document.getElementById('clip').value = ''; // 清空剪贴板文本框
                } else {
                    document.getElementById('palaceDataFetchError').textContent = '数据格式不符合 profile 数据表要求，请检查！';
                }
                clearClipboardTextbox();
            } catch (err) {
                document.getElementById('palaceDataFetchError').textContent = '数据格式错误，请检查！';
            }
        }


        // 从剪贴板导入数据到 pole 数据表
        function importPoleData() {
            const clipData = document.getElementById('clip').value;
            try {
                const importedData = JSON.parse(clipData);
                if (checkPoleDataFormat(importedData)) {
                    poleData = poleData.concat(importedData);
                    updateMemoryPegDataList();
                    document.getElementById('memoryPegDataFetchError').textContent = '数据已成功添加到 pole 数据表。';
                    importedData.forEach(item => savePoleData(item)); // 保存到本地存储
                    document.getElementById('clip').value = ''; // 清空剪贴板文本框
                } else {
                    document.getElementById('memoryPegDataFetchError').textContent = '数据格式不符合 pole 数据表要求，请检查！';
                }
                clearClipboardTextbox();
            } catch (err) {
                document.getElementById('memoryPegDataFetchError').textContent = '数据格式错误，请检查！';
            }
        }
        

            

       
        // 更新宫殿数据列表
        function updatePalaceDataList() {
            const palaceDataList = document.getElementById('palaceDataList');
            palaceDataList.innerHTML = '';
            profileData.forEach(item => {
                const listItem = document.createElement('div');
                listItem.className = 'list-item border p-2 mb-2 d-flex justify-content-between align-items-center';
                listItem.textContent = `${item.time}____${item.original}`;
                //创建删除图标并添加到 listItem 中
                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'bi bi-trash delete-icon';
                deleteIcon.style.marginLeft = '165px';
                // Bug 修复：添加了缺失的分号
                
                deleteIcon.dataset.time = item.time; // 存储时间戳以便后续删除
                listItem.appendChild(deleteIcon); // 将删除图标添加到 listItem 中
               
                listItem.addEventListener('click', (e) => {
                    if (e.target.tagName === 'I') {
                        // 如果点击的是删除图标，则不执行其他操作
                        return;
                    }
                    document.getElementById('originalSentence').value = item.original;
                    document.getElementById('mainImage').src = item.img;
                    document.querySelector('.img-container').style.display = 'block'; // 显示主图片框
                    selectedTime = item.time;
                    updateReferenceList();
                    // 从 drawData 中提取 time 值为 item.time 的数据
                    const savedData = drawData.filter(data => data.time === item.time);
                    
                    if (savedData.length > 0) {
                        // 显示浮动菜单供用户选择 timestamp
                        showTimestampMenu(e.clientX, e.clientY, savedData);
                    } else {
                        // 如果没有找到匹配的数据，重置 clickPositions 和 clickCount
                        clickPositions = [];
                        clickCount = 0;
                        ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);
                        redrawAll();
                    }
                });
                // 添加删除图标点击事件
                deleteIcon.addEventListener('click', (event) => {
                    event.stopPropagation(); // 阻止点击事件冒泡到 listItem
                    
                    deletePalaceData(deleteIcon.dataset.time);
                });

                palaceDataList.appendChild(listItem);
            });
        }
        function deletePalaceData(time) {
            console.log('Deleting data for time:', time); // 调试日志
            profileData = profileData.filter(item => item.time !== time);
            // 从 IndexedDB 的 profileData 对象存储中移除对应的记录
            const transaction = db.transaction(['profileData'], 'readwrite');
            const store = transaction.objectStore('profileData');

            const request = store.delete(time);
            request.onsuccess = function(event) {
                console.log('Data successfully deleted from IndexedDB for time:', time);
                updatePalaceDataList(); // 更新宫殿数据列表
            };

            request.onerror = function(event) {
                console.error('Error deleting data from IndexedDB for time:', time, event.target.errorCode);
            };
            
            saveProfileData();
            updatePalaceDataList(); // 更新宫殿数据列表
            // // 从 drawData 中删除对应时间戳的数据
            // drawData = drawData.filter(data => data.time !== time);
            // // 从 poleData 中删除对应时间戳的数据
            // poleData = poleData.filter(data => data.time !== time);
            // // 从 poleData 中删除对应时间戳的数据
        }
        // 显示浮动菜单供用户选择 timestamp
        function showTimestampMenu(x, y, savedData) {
            // 清除之前的浮动菜单
            Array.from(document.querySelectorAll('.timestamp-menu')).forEach(menu => menu.remove());

            const menu = document.createElement('div');
            menu.className = 'timestamp-menu';
            menu.style.position = 'fixed';
            menu.style.left = `${x}px`;
            menu.style.top = `${y}px`;
            menu.style.backgroundColor = 'white';
            menu.style.border = '1px solid #ccc';
            menu.style.padding = '5px';
            menu.style.zIndex = '1000';

            savedData.forEach(data => {
                const menuItem = document.createElement('div');
                menuItem.className = 'timestamp-menu-item';
                menuItem.textContent = data.timestamp;
                menuItem.style.cursor = 'pointer';
                menuItem.style.padding = '5px';
                menuItem.style.borderBottom = '1px solid #eee';

                menuItem.addEventListener('click', () => {
                    clickPositions = data.positions;
                    clickCount = data.positions.length;
                    ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);
                    redrawAll();
                    menu.remove(); // 移除浮动菜单
                });

                menu.appendChild(menuItem);
            });

            // 获取 fixed-height-list 容器
            const palaceDataList = document.getElementById('palaceDataList'); // 假设使用 memoryPegDataList 作为 fixed-height-list
            if (palaceDataList) {
                palaceDataList.parentNode.appendChild(menu);
            } else {
                console.error('palaceDataList 容器未找到');
            }
        }

        // 更新记忆桩数据列表
        function updateMemoryPegDataList() {
            const memoryPegDataList = document.getElementById('memoryPegDataList');
            memoryPegDataList.innerHTML = '';
            poleData.sort((a, b) => {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return numOrder[a.num] - numOrder[b.num];
            });
            if (Array.isArray(poleData)) {
                console.log('当前的 poleData 数据:', poleData); // 添加日志
                poleData.forEach(item => {
                    const listItem = document.createElement('div');
                    listItem.className = 'list-item border p-2 mb-2';
                    listItem.textContent = `${item.time}, ${item.num}`;
                    memoryPegDataList.appendChild(listItem);
                });
            } else {
                console.error('poleData 不是数组');}
        }


        // 更新参考列表
        function updateReferenceList() {
            const referenceList = document.getElementById('referenceList');
            // 获取 scrollable-list 元素
            const scrollableList = document.querySelector('.scrollable-list');

            // 设置新的 max-height
            scrollableList.style.maxHeight = document.getElementById('mainImage').height; // 例如，设置为 50%
            
            //document.querySelector('.scrollable-list').style.height = `${topCanvas.height}px`;
            referenceList.innerHTML = '';
            const filteredPoleData = poleData.filter(item => item.time === selectedTime);
            filteredPoleData.forEach(item => {
                const listItem = document.createElement('div');
                listItem.className = 'reference-list-item';
                listItem.innerHTML = `
                    <img src="${item.image_url}" alt="参考图片">
                    <input type="text" class="form-control me-2" value="${item.num}" readonly style="width: 40px;">
                    <textarea class="prompt-text form-control me-2" readonly>${item.prompt}</textarea>
                `;
            listItem.addEventListener('click', () => {
                selectedImageUrl = item.image_url;
            });
                referenceList.appendChild(listItem);
            });
            // 提取 prompt 值的前两段文字并存储在 data-prompt 属性中
            filteredPoleData.forEach((item, index) => {
                const promptSegments = item.prompt.split('. ').slice(0, 2).join('. ');
                document.querySelector(`.list-item:nth-child(${index + 1})`).dataset.prompt = promptSegments;
            });
        }


        document.getElementById('clipboardButton').addEventListener('click', importClipboardData);
        document.getElementById('clearClipboardButton').addEventListener('click', clearClipboardTextbox);
        document.getElementById('palaceDataFetchButton').addEventListener('click', importProfileData);
        document.getElementById('memoryPegDataFetchButton').addEventListener('click', importPoleData);


        // 控制底部导航栏显示和隐藏
        let timeoutId;
        document.addEventListener('mousemove', (event) => {
            const bottomNav = document.querySelector('.bottom-nav');
            if (event.clientY > window.innerHeight - 50) {
                bottomNav.classList.add('show');
                clearTimeout(timeoutId);
            } else {
                timeoutId = setTimeout(() => {
                    bottomNav.classList.remove('show');
                }, 3000);
        }
    });


        // 页面加载时的初始化操作
        window.onload = function() {
            // 这里可以添加代码从服务器端获取数据，初始化 profileData 和 poleData
            // 例如，使用 fetch 或 axios 发送请求
        };
      
       
    