const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// 初始化 Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyDQvS3NJYlGO5hAXq_ESwQcvFun8-8fkDE");

// 获取暂存区的文件列表
const getStagedFiles = () => {
  const output = execSync("git diff --cached --name-only").toString();
  return output.split("\n").filter(Boolean);
};

// 获取文件的修改内容
const getFileDiff = (filePath) => {
  try {
    return execSync(`git diff --cached --unified=0 ${filePath}`).toString();
  } catch (error) {
    return `无法获取文件 ${filePath} 的修改内容`;
  }
};

// 使用 Gemini 生成修改总结
async function generateAISummary(diffContent) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `请帮我分析以下代码修改，并给出简洁的总结。格式如下：
1. 主要修改内容
2. 修改原因（如果可以从代码中推断）
3. 潜在影响

代码修改内容：
${diffContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API 调用失败:", error);
    return "无法生成 AI 总结";
  }
}

// 生成汇总信息
const generateSummary = async () => {
  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log("没有暂存的文件");
    return;
  }

  let summary = "# 文件修改汇总\n\n";

  for (const file of stagedFiles) {
    const diffContent = getFileDiff(file);
    summary += `## ${file}\n\n`;
    summary += "### 修改内容\n\n";
    summary += "```diff\n";
    summary += diffContent;
    summary += "\n```\n\n";

    // 添加 AI 生成的总结
    summary += "### AI 分析\n\n";
    const aiSummary = await generateAISummary(diffContent);
    summary += aiSummary + "\n\n";
  }

  // 将汇总信息写入文件
  const summaryPath = path.join(process.cwd(), "commit-summary.md");
  fs.writeFileSync(summaryPath, summary);

  console.log(`汇总信息已生成到: ${summaryPath}`);
  return summaryPath;
};

// 执行生成汇总
if (!process.env.GEMINI_API_KEY) {
  console.error("错误: 未设置 GEMINI_API_KEY 环境变量");
  process.exit(1);
}

generateSummary().then((summaryPath) => {
  if (summaryPath) {
    console.log("请查看 commit-summary.md 文件获取详细的修改信息");
  }
});
