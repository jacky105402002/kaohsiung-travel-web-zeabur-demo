# 高雄旅遊網 Zeabur Demo

這個專案由 Gemini Canvas 複製出的 React 頁面整理而成，已轉換為可建置、可部署到 Zeabur 的 React + Vite 靜態網站。

## 技術棧

- React
- Vite
- Tailwind CSS
- lucide-react
- Static Website

## 本地開發

```bash
npm install
npm run dev
```

## 建置

```bash
npm run build
```

建置完成後會產生：

```txt
dist/
```

## Zeabur 部署

這個 repo 已套用 `ai-web-package-react-zeabur` profile。

Zeabur 設定：

```txt
Build Command: npm run build
Output Directory: dist
```

專案根目錄包含：

```txt
zeabur.json
```

內容為：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

部署流程：

1. 在 Zeabur 建立新 Project
2. 選擇 Deploy from GitHub
3. 選擇這個 repository
4. 確認 Build Command 為 `npm run build`
5. 確認 Output Directory 為 `dist`
6. Deploy

## Vite Base

Zeabur 靜態部署預設使用根路徑，因此本專案使用：

```js
base: '/'
```

如果未來部署到子路徑，再依實際 URL 調整。

## Gemini AI 設定

AI 客服與 AI 行程規劃會讀取：

```txt
VITE_GEMINI_API_KEY
```

請參考 `.env.example` 建立 Zeabur Environment Variable。若未設定 API Key，網站仍可建置與部署，AI 功能會顯示尚未設定的提示訊息。

## 已完成轉換項目

- 建立 React + Vite 專案結構
- 保留 Gemini Canvas 原始頁面與互動邏輯
- 將 Gemini API Key 改為使用環境變數
- 加入 `zeabur.json`
- 使用 Zeabur 靜態部署所需的 `base: '/'`
- 驗證可執行 `npm run build`
