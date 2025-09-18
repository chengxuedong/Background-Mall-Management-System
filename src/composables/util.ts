import { ElNotification, ElMessageBox } from 'element-plus'//提醒框
import nprogress from 'nprogress';
import type { VNode } from 'vue'

// 消息框类型字面量，兼容 Element Plus MessageBox 的可选类型
type MessageBoxTypeLiteral = '' | 'success' | 'warning' | 'info' | 'error'

//消息提示
//dangerouslyUseHTMLString:是否将message属性作为HTML片段处理
//type="success"=type没有传值默认成功提示
export function toast(message: string | VNode, type = "success", dangerouslyUseHTMLString = true) {
    const options = {
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 3000
    } as any
    ElNotification(options)
}

//消息弹出框
export function showModal(content = "提示内容", type: MessageBoxTypeLiteral = "warning", title = "") {
    return ElMessageBox.confirm(
        content,
        title,
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type,
        }
    )
}

//显示全屏loading
export function showFullLoading() {
    nprogress.start();
}

//隐藏全屏loading
export function hideFullLoading() {
    nprogress.done();
}
//弹出输入框
export function showPrompt(tip: string, value = "") {
    return ElMessageBox.prompt(tip, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: value
    })
}

//将query对象转成url参数
export function queryParams(query: any) {
    let q = [];
    for (const key in query) {
        if (query[key]) {
            q.push(`${key}=${encodeURIComponent(query[key])}`)
        }
    }
    // 把推进q数组的元素之间拼接&
    let r = q.join("&");
    r = r ? ("?" + r) : "";
    return r;
}

//上移
export function useArrayMoveUp(arr: any, index: number) {
    swapArray(arr, index, index - 1);
}

//下移
export function useArrayMoveDown(arr: any, index: number) {
    swapArray(arr, index, index + 1);
}

//交换数组中2个元素的位置 [1,2,3]交换1和2=>[2,2,3]=>[2,1,3]
export function swapArray(arr: any, index1: number, index2: number) {
    // splice(删除元素的索引,删除的个数,要插入的新值)改原数组,并返回被删除的元素组成的数组
    // 从index2索引开始删除一个元素后紧接着在这个位置插入arr[index1]
    // arr.splice(index2, 1, arr[index1])结果相当于arr[index2]=arr[index1]
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}

// sku排列算法
export function cartesianProductOf<T = any>(...args: T[][]): T[][] {
    return (args as any[]).reduce(
        function (a: T[][], b: T[]) {
            const ret: T[][] = [];
            a.forEach(function (ai: T[]) {
                (b as T[]).forEach(function (bi: T) {
                    ret.push((ai as T[]).concat([bi]))
                });
            });
            return ret;
        },
        [[]] as unknown as T[][]
    );
}
