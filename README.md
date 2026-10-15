# meta-1021-predict

中文Meta Q3 2026财报前瞻，公开信息截点2026-10-15 12:24:21 Asia/Shanghai。

## 阅读和复算

- `index.html` 为完整静态报告。无第三方依赖、API或用户数据采集。
- `model.js` 包含历史基数、全部情景输入与计算函数，可直接通过Node复算。
- `data.json` 保存输入、结果、口径说明和25份来源。
- `app.js` 提供互动；修改模型请同步更新正文中的静态基准说明。
- 所有Q3值均为假设预测；法律费用的税收利益尚未确认；资产负债表未作完整预测。

## 发布到 GitHub Pages

1. 把源码包解压后全部文件放到名为 `meta-1021-predict` 的GitHub仓库根目录；同时上传原始 `meta-1021-predict.zip`，供网页的源码下载按钮使用。
2. 在仓库 Settings → Pages 中选择 Deploy from a branch。
3. 选择 main 分支和 / (root)，保存。若账户/仓库不支持该部署方式，按GitHub界面可用选项配置。
4. 报告所有资源使用相对路径，支持项目子路径。不要删掉来源、预测和税务口径说明。

此源码包不含账户信息、密钥或Sites配置。不包含自动更新功能。当前交付使用独立网站托管，不能把它称为已发布的GitHub Pages。

GitHub Pages 官方说明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
