import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import 'virtual:windi.css'
import "nprogress/nprogress.css"
import { router } from './router'//"等同于./router/index.js"，router接收index.js导出的router，而不是整个文件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'  //引入所有图标
import { createPinia } from 'pinia'
import permission from './directives/permission'
//very important
import './permission'
const app = createApp(App)
const pinia = createPinia();
app.use(pinia)
app.use(router);
app.use(ElementPlus)
app.use(permission);


//全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}


app.mount('#app')

// 导入的方式取决于模块是命名导出还是默认导出

// 一个模块只能有一个默认导出。用于导出单个
// const message = () => {
// const name = "Bill";
// const age = 19;
// return `${name} is ${age} years old.`;
// };
// export default message;

// 导入默认导出时不需要使用大括号`{}，接收默认导出的变量名字可以自己起名字，
// import message from "./message.js";


// 命名导出适合导出多个值,
// 方式1：逐个内联导出
// export const name = "Bill";
// export const age = 19;

// // 方式2：在文件底部一次性导出
// const address = "123 Main St";
// const email = "bill@example.com";
// export { address, email };

// 导入命名导出时需要使用大括号`{}，必须使用导出时的名称，或者通过`as`重命名。
// import { name, age, address, email } from "./person.js";
// 使用导入的值
// console.log(`Name: ${name}`);
// console.log(`Age: ${age}`);
// console.log(`Address: ${address}`);
// console.log(`Email: ${email}`);
// console.log(message()); 

// 混合导入：同时导入默认导出和命名导出
// export default 'Hello';
// export const count = 42;
// 在另一个文件中，你可以这样导入：
// import greeting, { count as total } from './module.js';

// console.log(greeting); // 输出：Hello
// console.log(total);    // 输出：42

// 全部导入: 允许你将模块中的所有导出绑定到一个命名空间对象中
// export default 'Hello';
// export const count = 42;
// export function add(a, b) {
//     return a + b;
// }

// 在另一个文件中，你可以这样导入：
// import * as utils from './module.js';
// console.log(utils.default); // 访问默认导出
// console.log(utils.count);   // 访问命名导出
// console.log(utils.add(3, 5)); // 调用命名导出的函数

// 如果你导入了多个模块，且它们的命名导出有相同的名称，会导致冲突。例如：
// import { foo } from './module1.js';
// import { foo } from './module2.js'; // 冲突

// 解决方法：通过`as`重命名其中一个导入的变量：
// ```javascript
// import { foo as foo1 } from './module1.js';
// import { foo as foo2 } from './module2.js';
// ```