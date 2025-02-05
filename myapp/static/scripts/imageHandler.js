// 保存图片数据到IndexedDB
function saveImageData(url, imageData) {
    const transaction = db.transaction(['imageData'], 'readwrite');
    const store = transaction.objectStore('imageData');
    const request = store.put({ url, imageData });
    request.onsuccess = function (event) {
        console.log('图片数据保存成功');
    };
    request.onerror = function (event) {
        console.error('图片数据保存失败: ', event.target.errorCode);
    };
}

// 从IndexedDB加载图片数据
function loadImageData(url, callback) {
    const transaction = db.transaction(['imageData'], 'readonly');
    const store = transaction.objectStore('imageData');
    const request = store.get(url);
    request.onsuccess = function (event) {
        const data = event.target.result;
        console.log(`从imageData加载的数据:`, data);
        callback(data ? data.imageData : null);
    };
    request.onerror = function (event) {
        console.error('imageData数据加载失败: ', event.target.errorCode);
    };
}
// 下载图片并保存到IndexedDB
async function downloadAndSaveImage(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64Data = event.target.result;
            saveImageData(url, base64Data);
        };
        reader.readAsDataURL(blob);
    } catch (error) {
        console.error('下载图片失败:', error);
    }
}

// 更新图片链接
function updateImageLinks(data) {
    data.forEach(item => {
        if (item.image_url) {
            loadImageData(item.image_url, (imageData) => {
                if (imageData) {
                    item.image_url = imageData;
                } else {
                    downloadAndSaveImage(item.image_url);
                }
            });
        }
    });
}

document.getElementById('alterPalaceUrl').addEventListener('click', () => {
    loadStoreData('profileData', (data) => {
        profileData = data;
        updateImageLinks(profileData); // 更新图片链接
        saveProfileData(profileData);
    });
});

document.getElementById('alterMemoryUrl').addEventListener('click', () => {
    loadStoreData('poleData', (data) => {
        poleData = data;
        updateImageLinks(poleData); // 更新图片链接
        savePoleData(poleData);
    });
});

// 初始化数据库
initDatabase();