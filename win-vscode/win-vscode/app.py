from flask import Flask, render_template, request, redirect, session

app = Flask(__name__)
app.secret_key = 'your_secret_key'  # 设置一个密钥，用于session加密

# 定义用户字典，用于验证用户名和密码
users = {
    'admin': 'admin123',
    'guest': 'guest123'
}
permission= {
    '主页': '/',
    '路由': '/routes',
    '设置': '/settings',
    '登录':'/login',
    }
# 定义用户权限字典
user_permissions = {
    'admin': ['主页', '路由', '设置', '登录'],
    'guest': ['主页', '登录']
}

@app.route('/')
def home():
    return render_template('index.html',permission=permission, page_content='Home Page Content')

@app.route('/routes')
def routes():
    return render_template('index.html',permission=permission, page_content='Routes Page Content')

@app.route('/settings')
def settings():
    return render_template('index.html',permission=permission,  page_content='Settings Page Content')

@app.route('/login', methods=['GET', 'POST'])
def login():
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        if username in users and users[username] == password:
            session['username'] = username
            return redirect('/')
        else:
            return render_template('login.html', message='Invalid credentials')
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect('/')

@app.context_processor
def inject_permissions():
    
    if 'username' in session:
        username = session['username']
        permissions = user_permissions.get(username, [])        
    else:
        permissions = user_permissions.get('guest', [])
    return dict(permissions=permissions,**permission)

if __name__ == '__main__':
    app.run(debug=True)