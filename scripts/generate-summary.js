const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

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
const generateSummary = () => {
  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log("没有暂存的文件");
    return;
  }

  let summary = "# 文件修改汇总\n\n";

  stagedFiles.forEach((file) => {
    summary += `## ${file}\n\n`;
    summary += "```diff\n";
    summary += getFileDiff(file);
    summary += "\n```\n\n";
  });

  // 将汇总信息写入文件
  const summaryPath = path.join(process.cwd(), "commit-summary.md");
  fs.writeFileSync(summaryPath, summary);

  console.log(`汇总信息已生成到: ${summaryPath}`);
  return summaryPath;
};

// 执行生成汇总
const summaryPath = generateSummary();
if (summaryPath) {
  console.log("请查看 commit-summary.md 文件获取详细的修改信息");
}
