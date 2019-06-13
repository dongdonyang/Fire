/**
 * todo 全局公共函数、全局常量
 */
import { MessageBox } from "element-ui";
// todo 删除数据前的确认弹窗
export function isDelete(val = "您确定删除该数据吗？") {
  let mes = `<p>${val}</p>`;
  let pro = MessageBox.confirm(mes, "提示", {
    confirmButtonText: "确定",
    center: true,
    dangerouslyUseHTMLString: true
  });
  pro.catch(() => {});
  return pro;
}

