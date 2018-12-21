const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year].map(formatNumber).join('年') + [month].map(formatNumber).join('月') + [day].map(formatNumber);
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//时间戳转换时间
const toDate =number=> {
  var date = new Date(number);
  var Y = date.getFullYear() + '年';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)+"日"
}
module.exports = {
  formatTime: formatTime,
  toDate :toDate
}
