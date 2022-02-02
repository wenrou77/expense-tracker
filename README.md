# 老爸的私房錢

## Description

This is a website created by node.js Express. 
使用者可以：

1. 註冊帳號
- 註冊之後，可以登入/登出
- 只有登入狀態的使用者可以看到 app 內容，否則一律被導向登入頁
2. 在首頁一次瀏覽所有支出的清單
- 使用者只能看到自己建立的資料
3. 在首頁看到所有支出清單的總金額
4. 新增一筆支出 (資料屬性參見下方規格說明)
5. 編輯支出的屬性 (一次只能編輯一筆)
6. 刪除任何一筆支出 (一次只能刪除一筆)
7. 根據「類別」篩選支出；總金額的計算只會包括被篩選出來的支出總和

### Executing program

1. Open terminal and git clone
```
git clone https://github.com/wenrou77/expense-tracker.git
```

2. Initialization
- install packages
```
npm install
```

3. Execute
- To add data seeders
```
npm run seed
```

- To run on the index page
```
npm run dev
```
- Login using testing account
```
email: 'root@example.com'
password: '12345678'
```

## Authors

Wendy (wendy@gmail.com)
