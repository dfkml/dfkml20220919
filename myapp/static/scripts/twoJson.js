// 定义一个函数来导入 profileData.json 和 poleData.json
function fetchData(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(text => {
            try {
                return JSON.parse(text);
            } catch (error) {
                throw new Error('Error parsing JSON data');
            }
        })
        .catch(error => {
            console.error(`Error fetching ${url}:`, error);
            throw error; // 重新抛出错误，以便调用者处理
        });
}

async function importTwoData(profileUrl, poleUrl) {
    try {
        const [profile, pole] = await Promise.all([
            fetchData(profileUrl),
            fetchData(poleUrl)
        ]);

        profileData = profile;
        profileData.forEach(item => saveProfileData(item));
        poleData = pole;
        poleData.forEach(item => savePoleData(item));

        console.log('Profile data imported successfully:', profileData);
        console.log('Pole data imported successfully:', poleData);
        alert('数据导入成功！');

                 
    } catch (error) {
        console.error('Error importing data:', error);
        if (error instanceof SyntaxError) {
            console.error('Invalid JSON response:', error.message);
        } else {
            console.error('An unexpected error occurred:', error.message);
        }
    }
}