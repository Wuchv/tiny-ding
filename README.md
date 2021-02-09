# tiny-ding
迷你钉钉，基于 electron + react + typescript + antd 的即时通讯软件

# 命令
```bash
npm run dev:server	//开发环境下运行应用，渲染进程支持热更新

npm run dev:render	//webpack-dev-server运行渲染线程的网页

npm run dev:file	//打包主进程和渲染进程后运行

npm run dll	//抽离不变的第三方模块
```

# 项目目录
```
tiny-ding
├─ .babelrc
├─ .gitignore
├─ README.md
├─ app  // electron主进程文件夹
│  ├─ browser-window
│  │  ├─ index.ts
│  │  └─ windows
│  │     ├─ login-register-window.ts
│  │     └─ main-window.ts
│  ├─ constants
│  │  └─ index.ts
│  ├─ dialog
│  │  └─ index.ts
│  ├─ global.d.ts
│  ├─ main.ts
│  ├─ preload
│  │  └─ index.ts
│  └─ webpack
│     ├─ webpack.config.base.js
│     ├─ webpack.config.main.js
│     └─ webpack.config.preload.js
├─ gulpfile.js  // 热更新，监听electron主进程文件修改
├─ package.json
├─ postcss.config.js
├─ src  // electron渲染进程文件，react前端页面
│  ├─ components
│  │  ├─ Avatar
│  │  │  ├─ index.tsx
│  │  │  └─ style.less
│  │  ├─ ChatList
│  │  │  ├─ index.tsx
│  │  │  └─ style.less
│  │  └─ Header
│  │     ├─ index.tsx
│  │     └─ style.less
│  ├─ constants
│  │  └─ index.ts
│  ├─ index.tsx
│  ├─ mock
│  │  ├─ index.ts
│  │  └─ login.ts
│  ├─ modules
│  │  └─ Http.ts
│  ├─ pages
│  │  ├─ Login.less
│  │  ├─ Login.tsx
│  │  ├─ Main.less
│  │  └─ Main.tsx
│  ├─ public
│  │  └─ index.html
│  ├─ redux // redux-observable + redux-toolkit
│  │  ├─ epics
│  │  │  ├─ counterEpic.ts
│  │  │  └─ index.ts
│  │  ├─ index.ts
│  │  └─ reducers
│  │     ├─ counterReducer.ts
│  │     └─ index.ts
│  ├─ services  // 接口定义
│  │  ├─ index.ts
│  │  └─ login.ts
│  ├─ utils.ts
│  └─ webpack   // 打包配置
│     ├─ webpack.config.base.js
│     ├─ webpack.config.dev.js
│     ├─ webpack.config.dll.js
│     └─ webpack.config.prod.js
└─ tsconfig.json

```