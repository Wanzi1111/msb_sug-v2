###
 # @Author: yelei
 # @Date: 2021-03-02 18:50:30
 # @LastEditors: yelei
 # @LastEditTime: 2021-03-02 18:53:24
 # @Description: 检查是否存在未合并的及当前分支是否落后于主分支.
### 

#!/usr/bin

# 工程信息
PROJECT_ID=777
PRIVATE_TOKEN="hwvhfSZ2cJkNb1D1Bsjt"

# 钉钉
DD_AT_ALL="false"
DD_TITLE="合并请求通知"
DD_REASON="Merge_Request_待合并至主分支"
CI_MERGE_REQUESTS_URL="${CI_PROJECT_URL}/-/merge_requests"
DD_AT_MOBILES_STRING="@13782683626@18301307570"
DD_ELSE_REASON="当前部署Tag落后于Master分支，请更新上线分支后部署新Tag"
DD_AT_MOBILES_ARRAY="['13782683626','18301307570']"
DD_TOKEN="5db33f2369be2505bc21939f62ef18cc2e3f74a22915150bac8b9ab4a3b77375"


parse_json(){
  echo "${1//\"/}" | sed "s/.*$2:\([^,}]*\).*/\1/"
}

# 拉取MR
MR_RESULT=$(curl --request GET --header "PRIVATE-TOKEN: ${PRIVATE_TOKEN}" "${CI_API_V4_URL}/projects/${PROJECT_ID}/merge_requests?state=opened&target_branch=master")
DIVERGED_COMMITS=$(curl --request GET --header "PRIVATE-TOKEN: ${PRIVATE_TOKEN}" "${CI_API_V4_URL}/projects/${PROJECT_ID}/repository/compare?from=$1&to=master")
DIVERGED_COMMITS_VALUE=$(parse_json $DIVERGED_COMMITS "commits")
EMPTY="[]"

# 判断是否为空，不为空中断build
if [ "$MR_RESULT" != "$EMPTY" ];then
  echo 'MR扫描: 扫描到当前项目存在opened的MR，请先将MR合并至master主分支，再拉取最新代码生成Tag重新上线！(ERROR)'
  # DD data
  DATA="{'msgtype': 'markdown','markdown': {'title':'${DD_TITLE}','text': '#### **[${CI_PROJECT_NAME}](${CI_PROJECT_URL})**\n --- \n > - 构建任务: ${CI_BUILD_NAME} \n > -  构建分支: [${CI_COMMIT_TAG}](${CI_MERGE_REQUESTS_URL}) \n > - 报错原因: ${DD_REASON} \n > - 执行人: ${GITLAB_USER_NAME} \n > - 提交信息: ${CI_COMMIT_MESSAGE} \n\n ${DD_AT_MOBILES_STRING}'},'at': {'isAtAll': ${DD_AT_ALL}, 'atMobiles':${DD_AT_MOBILES_ARRAY}}}"
  # DD WEBHOOK
  curl -X POST -d "${DATA}" -H "Content-Type: application/json" "https://oapi.dingtalk.com/robot/send?access_token=${DD_TOKEN}"
  # 中断！
  exit 1;
elif [ "$DIVERGED_COMMITS_VALUE" != "$EMPTY" ];then
  echo '分支对比: 当前部署tag落后于master分支，请将代码更新至上线分支后重新打Tag部署！(ERROR)'
  # DD data
  DATA="{'msgtype': 'markdown','markdown': {'title':'${DD_TITLE}','text': '#### **[${CI_PROJECT_NAME}](${CI_PROJECT_URL})**\n --- \n > - 构建任务: ${CI_BUILD_NAME} \n > -  构建分支: [${CI_COMMIT_TAG}](${CI_JOB_URL}) \n > - 报错原因: ${DD_ELSE_REASON} \n > - 执行人: ${GITLAB_USER_NAME} \n > - 提交信息: ${CI_COMMIT_MESSAGE} \n\n ${DD_AT_MOBILES_STRING}'},'at': {'isAtAll': ${DD_AT_ALL}, 'atMobiles':${DD_AT_MOBILES_ARRAY}}}"
  # DD WEBHOOK
  curl -X POST -d "${DATA}" -H "Content-Type: application/json" "https://oapi.dingtalk.com/robot/send?access_token=${DD_TOKEN}"
  # 中断！
  exit 1;
else
  echo 'MR扫描: 未扫描到待合并MR，MR检查通过！(SUCCESS)'
fi
