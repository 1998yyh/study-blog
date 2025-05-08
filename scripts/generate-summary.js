const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

// 通义千问 API 配置
const API_KEY = "sk-8ab444a60290450dbabe9fa5191a8a79";

// 调用通义千问 API
async function callQianwenAPI(prompt) {
  const data = {
    model: "qwen-plus",
    input: {
      messages: [
        {
          role: "system",
          content: "你是一个代码分析助手，请帮我分析代码变更并给出简洁的总结。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    parameters: {
      result_format: "message",
    },
  };

  try {
    console.log("正在调用通义千问 API...");
    console.log("发送的数据:", JSON.stringify(data, null, 2));

    const response = await fetch(
      "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      },
    );

    const responseData = await response.json();
    console.log("API 响应:", JSON.stringify(responseData, null, 2));

    if (!response.ok) {
      throw new Error(`API 错误: ${responseData.message || "未知错误"}`);
    }

    if (responseData.output?.choices?.[0]?.message?.content) {
      return responseData.output.choices[0].message.content;
    } else {
      throw new Error("API 响应格式不正确");
    }
  } catch (error) {
    console.error("API 调用失败:", error);
    throw error;
  }
}

// 获取暂存区的文件列表
const getStagedFiles = () => {
  const output = execSync("git diff --cached --name-only").toString();
  console.log("所有暂存的文件:", output);

  const allFiles = output.split("\n").filter(Boolean);
  console.log("处理后的文件列表:", allFiles);

  const othersFiles = allFiles.filter((file) => file.startsWith("others/"));
  console.log("others/ 目录下的文件:", othersFiles);

  return othersFiles;
};

// 获取文件的修改内容
const getFileDiff = (filePath) => {
  try {
    return execSync(`git diff --cached --unified=0 ${filePath}`).toString();
  } catch (error) {
    return `无法获取文件 ${filePath} 的修改内容`;
  }
};

// 获取提交信息
const getCommitInfo = () => {
  try {
    const author = execSync("git config user.name").toString().trim();
    const email = execSync("git config user.email").toString().trim();
    const date = new Date().toLocaleString("zh-CN", {
      timeZone: "Asia/Shanghai",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return { author, email, date };
  } catch (error) {
    console.error("获取提交信息失败:", error);
    return { author: "未知", email: "未知", date: new Date().toLocaleString() };
  }
};

// 生成汇总信息
const generateSummary = async () => {
  const stagedFiles = getStagedFiles();
  const commitInfo = getCommitInfo();

  if (stagedFiles.length === 0) {
    console.log("没有暂存的 others/ 目录下的文件");
    return;
  }

  let summary = `# others/ 目录文件修改汇总\n\n`;
  summary += `## 提交信息\n\n`;
  summary += `- 提交时间：${commitInfo.date}\n`;
  summary += `- 提交人：${commitInfo.author} <${commitInfo.email}>\n\n`;

  for (const file of stagedFiles) {
    console.log(`处理文件: ${file}`);
    const diffContent = getFileDiff(file);

    summary += `## ${file}\n\n`;
    summary += "\n```\n\n";

    try {
      // 生成 AI 分析
      const prompt = `请分析以下代码修改，并给出简洁的总结
      代码修改内容：
      ${diffContent}`;

      const aiAnalysis = await callQianwenAPI(prompt);

      summary += "### AI 分析\n\n";
      summary += aiAnalysis + "\n\n";
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error);
      summary += "### AI 分析\n\n";
      summary += `无法生成 AI 分析: ${error.message}\n\n`;
    }
  }

  // 将汇总信息写入文件
  const summaryPath = path.join(process.cwd(), "commit-summary.md");

  // 检查文件是否存在
  const fileExists = fs.existsSync(summaryPath);

  // 如果文件存在，读取现有内容
  let existingContent = "";
  if (fileExists) {
    existingContent = fs.readFileSync(summaryPath, "utf8");
    // 如果文件不为空，添加分隔符
    if (existingContent.trim()) {
      summary += "\n\n---\n\n";
    }
  }

  // 写入新内容（添加到文件开头）
  fs.writeFileSync(summaryPath, summary + existingContent);

  // 将生成的文件添加到暂存区
  try {
    execSync(`git add ${summaryPath}`);
    console.log(`已将 ${summaryPath} 添加到暂存区`);
  } catch (error) {
    console.error(`添加文件到暂存区失败:`, error);
  }

  console.log(`汇总信息已${fileExists ? "添加到" : "生成到"}: ${summaryPath}`);
  return summaryPath;
};

// 执行生成汇总
if (!API_KEY) {
  console.error("错误: 请设置 DASHSCOPE_API_KEY 环境变量");
  process.exit(1);
}

console.log("开始生成汇总...");
generateSummary()
  .then((summaryPath) => {
    if (summaryPath) {
      console.log("请查看 commit-summary.md 文件获取详细的修改信息");
    }
  })
  .catch((error) => {
    console.error("生成汇总时发生错误:", error);
    process.exit(1);
  });
