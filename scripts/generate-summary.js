const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const https = require("https");

// 通义千问 API 配置
const API_KEY = "sk-8ab444a60290450dbabe9fa5191a8a79	"; // 请替换为你的 API 密钥
const API_URL =
  "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation";

// 调用通义千问 API
async function callQianwenAPI(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: "qwen-max",
      input: {
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      },
    });

    const options = {
      hostname: "dashscope.aliyuncs.com",
      path: "/api/v1/services/aigc/text-generation/generation",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        "Content-Length": data.length,
      },
    };

    const req = https.request(options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        try {
          const result = JSON.parse(responseData);
          if (result.output && result.output.text) {
            resolve(result.output.text);
          } else {
            reject(new Error("API 响应格式不正确"));
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

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

// 生成汇总信息
const generateSummary = async () => {
  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log("没有暂存的文件");
    return;
  }

  let summary = "# 文件修改汇总\n\n";

  for (const file of stagedFiles) {
    console.log(`处理文件: ${file}`);
    const diffContent = getFileDiff(file);

    summary += `## ${file}\n\n`;
    summary += "### 修改内容\n\n";
    summary += "```diff\n";
    summary += diffContent;
    summary += "\n```\n\n";

    try {
      // 生成 AI 分析
      const prompt = `请帮我分析以下代码修改，并给出简洁的总结。格式如下：
1. 主要修改内容
2. 修改原因（如果可以从代码中推断）
3. 潜在影响

代码修改内容：
${diffContent}`;

      console.log("正在调用通义千问 API...");
      const aiAnalysis = await callQianwenAPI(prompt);

      summary += "### AI 分析\n\n";
      summary += aiAnalysis + "\n\n";
    } catch (error) {
      console.error(`处理文件 ${file} 时出错:`, error);
      summary += "### AI 分析\n\n";
      summary += "无法生成 AI 分析，请检查 API 配置和网络连接\n\n";
    }
  }

  // 将汇总信息写入文件
  const summaryPath = path.join(process.cwd(), "commit-summary.md");
  fs.writeFileSync(summaryPath, summary);

  console.log(`汇总信息已生成到: ${summaryPath}`);
  return summaryPath;
};

// 执行生成汇总
if (!API_KEY || API_KEY === "你的通义千问API密钥") {
  console.error("错误: 请设置有效的通义千问 API 密钥");
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
