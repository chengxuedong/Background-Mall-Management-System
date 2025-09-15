//layout布局把一行进行24 分栏    
//把鼠标放在windcss设置的类名会解析     
//插槽引入图标 全局引入图标  line 指定了宽高但是有间隔??
//md:≥992px lg:≥1200px
<template>
  <el-row class="login-container">
    <el-col :lg="16" :md="12" class="left-box">
      <div>
        <div>欢迎光临</div>
        <div>此站点是《vue3+vite实战商城后台开发》演示地址</div>
        <div>
         账号：admin&nbsp;&nbsp;&nbsp;&nbsp;密码：admin
        </div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="right-box">
      <h2 class="title">欢迎回来</h2>
      <div>
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
      <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
        <el-form-item prop="username">
          <!-- 用插槽把单标签改成双标签,把插槽内容包起来 -->
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <User />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" show-password placeholder="请输入密码">
            <template #prefix>
              <el-icon>
                <Lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button round color="#626aef" type="primary" @click="onSubmit" :loading="loading"
            class="w-[250px]">登录</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
//进入页面渲染之后调用onMounted，页面卸载之前调用onBeforeUnmount
import { ref, reactive,onMounted,onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../store/user';
import { toast } from '../composables/util'
//ref, reactive是响应式api，通过value才能拿到值
//reactive是专门用来定义引用类型的数据比如对象，不能用于普通类型
// import { User, Lock } from '@element-plus/icons-vue'   局部引入图标
const router = useRouter();//拿到router之后才能调用push方法跳转到首页
const userStore = useUserStore();


const form = reactive({
  username:"",
  password:""
})

 //监听回车事件  
 // 如果在 setup() 函数中使用了 async，并且将生命周期钩子放在了 await 之后，会导致错误
    function onKeyUp(e)
    {
      if (e.key == "Enter")
        onSubmit();
    }

    //监听按键监听
    onMounted(() => {
      document.addEventListener("keyup", onKeyUp)
    })
    //移除键盘监听
    onBeforeUnmount(() => {
      document.removeEventListener("keyup", onKeyUp)
    })

//验证登录规则，每条验证规则都是一个对象
const rules = ({
  username: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur'//触发时机:失去焦点
    },
  ],
  password: [
     {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'//触发时机:失去焦点
    },
  ]
})
const formRef = ref(null);//拿到el-form节点
//当登录请求完后才会重新发送请求
const loading = ref(false);
const onSubmit = () => {
  //验证结果true或false
  formRef.value.validate((valid) => {
    if (!valid)
      return false

    loading.value = true;

    userStore.login(form).then(res => {
      toast("登录成功");
      router.push("/");
    }).finally(() => {
      loading.value = false;
    })

   
    
    //为什么有默认账号密码??
    //login(form.username, form.password)得到的是promise
    //then拿到请求成功的结果，catch拿到捕获请求失败的结果
//     login(form.username, form.password)
//       .then(res => {
//       //没添加响应拦截器之前
//       // console.log(res.data.data);
//       //添加响应拦截器之后，拿到的数据是一样的
//       console.log(res);
//       //提示成功框
//         toast("登录成功");

//       //登录成功存储token和用户相关信息,auth里的封装函数
//       setToken(res.token)

//       //跳到后台首页
//       router.push("/");
//     })
//   .finally(() => {
//     loading.value = false;
    // })
  })
}
</script>
//使用@apply抽离windcss样式简化代码
<style scoped>
    .login-container {
      /* style="min-width: 100vh" or min-h-screen 高占满整个屏幕 */
      @apply min-h-screen bg-indigo-500;
    }
    .login-container .left-box, 
    .login-container .right-box{
      @apply flex items-center justify-center;
    }
    .login-container .right-box{
      @apply bg-light-50  flex-col;
    }
    .left-box>div>div:first-child {
      @apply  font-bold text-light-50 text-5xl mb-4;
    }
    .left-box>div>div:not(:first-child) {
      @apply   text-gray-200 text-sm;
    }
   .right-box .title {
    @apply font-bold text-3xl text-gray-800;
   }
   .right-box>div {
    /* space-x-2里面的子元素添加左右外边距 高度取子盒子最大,items-center让.line垂直居中*/
    @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
   }
   .right-box .line {
      /* h-[1px]=height:1px */
    @apply h-[1px] w-16 bg-gray-200;
   }

</style>