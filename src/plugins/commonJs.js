/**
 * todo 全局公共函数、全局常量
 */
import { MessageBox } from "element-ui";
// todo 删除数据前的确认弹窗
export function isDelete(val = "该数据") {
  let mes = `<p>确定要删除<strong style="color: #E6A23C; margin: 0 6px;">${val}</strong>吗?</p>`;
  let pro = MessageBox.confirm(mes, "提示", {
    confirmButtonText: "删除",
    center: true,
    dangerouslyUseHTMLString: true
  });
  pro.catch(() => {});
  return pro;
}
