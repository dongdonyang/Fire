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

// todo 全局回调函数，主要用来筛选功能，传入page对象，和getlist函数，然后对page的所有操作在这进行
// export function setPage(page={},fun=function () {
//
// }) {
//
// }
