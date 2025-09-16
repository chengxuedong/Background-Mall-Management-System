import { ElNotification, ElMessageBox } from 'element-plus'//提醒框
import nprogress from 'nprogress';

//消息提示
//dangerouslyUseHTMLString:是否将message属性作为HTML片段处理
//type="success"=type没有传值默认成功提示
export function toast(message: string, type = "success", dangerouslyUseHTMLString = true) {
    ElNotification({
        message,//<=>message:message
        type,
        dangerouslyUseHTMLString,
        duration: 3000
    })
}

//消息弹出框
export function showModal(content = "提示内容", type = "warning", title = "") {
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
export function showPrompt(tip, value = "") {
    return ElMessageBox.prompt(tip, '', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputValue: value
    })
}

//将query对象转成url参数
export function queryParams(query) {
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
export function useArrayMoveUp(arr, index) {
    swapArray(arr, index, index - 1);
}

//下移
export function useArrayMoveDown(arr, index) {
    swapArray(arr, index, index + 1);
}

//交换数组中2个元素的位置 [1,2,3]交换1和2=>[2,2,3]=>[2,1,3]
export function swapArray(arr, index1, index2) {
    // splice(删除元素的索引,删除的个数,要插入的新值)改原数组,并返回被删除的元素组成的数组
    // 从index2索引开始删除一个元素后紧接着在这个位置插入arr[index1]
    // arr.splice(index2, 1, arr[index1])结果相当于arr[index2]=arr[index1]
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
}

// sku排列算法
export function cartesianProductOf() {
    // arguments是一个类数组对象,而reducce方法只能直接作用于数组对象
    // 直接调用 reduce 会导致错误，因为 arguments 上没有这个方法。
    // 通过 call,可以将 reduce 方法绑定到 arguments上，从而在 arguments 上调用 reduce。
    // call和apply都可以改变函数的上下文，call在这个场景中更简洁，适合传递少量参数的情况。
    // call传递参数时，需要将参数逐个列出。apply传递参数时，需要将参数作为一个数组传递。
    return Array.prototype.reduce.call(arguments,
        function (a, b) {
            var ret = [];
            console.log(a, b);

            a.forEach(function (a) {
                b.forEach(function (b) {
                    ret.push(a.concat([b]));
                });
            });

            return ret;
        }, [
        []
    ]);
}
