
        // 初始化 IndexedDB 数据库
        let db;

        function initDatabase() {
            const request = indexedDB.open('MyDatabase', 3);

            request.onupgradeneeded = function(event) {
                db = event.target.result;
                if (!db.objectStoreNames.contains('profileData')) {
                    db.createObjectStore('profileData', { keyPath: 'time' });
                }
                if (!db.objectStoreNames.contains('poleData')) {
                    db.createObjectStore('poleData', {keyPath: "id", autoIncrement: true });
                }
                if (!db.objectStoreNames.contains('drawData')) {
                    db.createObjectStore('drawData',{ keyPath: 'timestamp',autoIncrement: false });
                }
                if (!db.objectStoreNames.contains('filteredPoleData')) {
                    db.createObjectStore('filteredPoleData', { keyPath: 'time' });
                }
                if (!db.objectStoreNames.contains('imageData')) { // 新增对象存储
                    db.createObjectStore('imageData', { keyPath: 'url' });
                }
                console.log('数据库升级完成');
            };

            request.onsuccess = function(event) {
                db = event.target.result;
                loadData();
                console.log('数据库打开成功');
            };

            request.onerror = function(event) {
                console.error('数据库打开失败: ', event.target.errorCode);
            };
        }

        // 保存数据到 IndexedDB
        function saveData(storeName, data) {
            const transaction = db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = function(event) {
                console.log(`${storeName} 数据保存成功`);
            };

            request.onerror = function(event) {
                console.error(`${storeName} 数据保存失败: `, event.target.errorCode);
            };
        }

        // 从 IndexedDB 加载数据
        function loadData() {
            loadStoreData('profileData', (data) => {
                profileData = data;
                updatePalaceDataList();
            });

            loadStoreData('poleData', (data) => {
                if (Array.isArray(data)) {
                    poleData = data; // 确保数据是数组类型
                    updateMemoryPegDataList();
                } else {
                    console.error('从 IndexedDB 加载的 poleData 不是数组');
                }
            });

            loadStoreData('drawData', (data) => {
                drawData = data;
                updateDrawList(); // 更新 drawList
            });

            // filteredPoleData 不需要从数据库加载，它是根据 poleData 和 selectedTime 动态生成的
        }

        function loadStoreData(storeName, callback) {
            const transaction = db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = function(event) {
                const data = event.target.result;
                console.log(`从 ${storeName} 加载的数据:`, data); // 添加日志
                callback(event.target.result);
            };

            request.onerror = function(event) {
                console.error(`${storeName} 数据加载失败: `, event.target.errorCode);
            };
        }

        // 保存 profileData 到 IndexedDB
        function saveProfileData(data) {
            if (Array.isArray(data)) {
                data.forEach(item => {
                    saveData('profileData', item);
                });
            } else {
                saveData('profileData', data);
            }
        updatePalaceDataList(); // 更新列表框
        }

        // 保存 poleData 到 IndexedDB
        function savePoleData(data) {
            console.log('保存的 poleData 数据:', data); // 添加日志
            console.log('poleData 数组长度:', poleData.length); // 添加日志
            saveData('poleData', data);
            updateMemoryPegDataList(); // 更新列表框
        }

        // 保存 drawData 到 IndexedDB
        function saveDrawData(data) {
            saveData('drawData', data);
            updateDrawList(); // 更新 drawList
        }
        // 更新 drawList
        function updateDrawList() {
            const drawList = document.getElementById('drawList');
            drawList.innerHTML = ''; // 清空 drawList
            drawData.forEach((data, index) => {
                const listItem = document.createElement('div');
                listItem.className = 'list-item border p-2 mb-2 d-flex justify-content-between align-items-center';
                listItem.textContent = `${data.timestamp}____ ${data.notes}`; // 使用 textContent 设置文本内容

                // 创建删除图标并添加到 listItem 中
                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'bi bi-trash delete-icon';
                deleteIcon.dataset.timestamp = data.timestamp;
                listItem.appendChild(deleteIcon);

                listItem.dataset.drawData = JSON.stringify(data);
                listItem.addEventListener('click', () => {
                    const savedData = JSON.parse(listItem.dataset.drawData);
                    clickPositions = savedData.positions;
                    clickCount = savedData.positions.length;
                    ctx.clearRect(0, 0, topCanvas.width, topCanvas.height);

                    // 重新绘制所有连线和圆圈
                    redrawAll();
                });

                // 添加删除图标点击事件
                deleteIcon.addEventListener('click', (event) => {
                    event.stopPropagation(); // 阻止点击事件冒泡到 listItem
                    deleteDrawData(data.timestamp);
                });

                drawList.appendChild(listItem);
            });
        }
        // 删除 drawData
        function deleteDrawData(timestamp) {
            const index = drawData.findIndex(item => item.timestamp === timestamp);
            if (index !== -1) {
                drawData.splice(index, 1);
                const transaction = db.transaction(['drawData'], 'readwrite');
                const store = transaction.objectStore('drawData');
                store.delete(timestamp);
                updateDrawList();
            }
        }
        
        // 清空数据库
        function clearDatabase() {
        if (confirm('确定要清除数据库吗？')) {
            const transaction = db.transaction(['profileData', 'poleData', 'drawData', 'filteredPoleData'], 'readwrite');
            const profileStore = transaction.objectStore('profileData');
            const poleStore = transaction.objectStore('poleData');
            const drawStore = transaction.objectStore('drawData');
            const filteredPoleStore = transaction.objectStore('filteredPoleData');

            profileStore.clear();
            poleStore.clear();
            drawStore.clear();
            filteredPoleStore.clear();

            transaction.oncomplete = function(event) {
                console.log('数据库已成功清空');
                alert('数据库已成功清空');
                // 重新加载数据
                loadData();
            };

            transaction.onerror = function(event) {
                console.error('清空数据库时出错: ', event.target.errorCode);
                alert('清空数据库时出错');
            };
        }
    }
    
    
        window.onload = function() {
            initDatabase();
            console.log('页面加载完成，初始化数据库...');
            document.getElementById('original').addEventListener('click', importTwoData('/media/profileData.json', '/media/poleData.json'))
            // 为清除数据库按钮添加点击事件监听器
            document.getElementById('clearDatabaseButton').addEventListener('click', clearDatabase);    
            // 模糊查找功能
            document.getElementById('searchInput').addEventListener('input', function() {
                const filter = this.value.toLowerCase();
                const palaceDataListItems = document.querySelectorAll('#palaceDataList .list-item');
                const memoryPegDataListItems = document.querySelectorAll('#memoryPegDataList .list-item');
                const drawListItems = document.querySelectorAll('#drawList .list-item');
                
                palaceDataListItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    
                    if (text.includes(filter)) {
                        item.classList.remove('d-none');
                    } else {
                        item.classList.add('d-none');
                    }

                });

                memoryPegDataListItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(filter)) {
                        item.classList.remove('d-none');
                    } else {
                        item.classList.add('d-none');
                    }
                });

                drawListItems.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    console.log('Draw Item Text:', text); // 调试日志：输出每个绘制数据列表项的文本
                    if (text.includes(filter)) {
                        item.classList.remove('d-none');
                    } else {
                        item.classList.add('d-none');
                    }

                    
                });
            });
        // 页面加载时初始化数据库
        };
    