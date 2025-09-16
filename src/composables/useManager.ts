import { ref, reactive } from 'vue'
import { logout, updatepassword } from '../api/manager'
import { showModal, toast } from './util';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user'



export function useRepassword() {
    //修改密码
    const router = useRouter();
    const userStore = useUserStore();
    const formDrawerRef = ref(null)
    const form = reactive({
        oldpassword: "",
        password: "",
        repassword: ""
    })

    //验证登录规则，每条验证规则都是一个对象
    const rules = ({
        oldpassword: [
            {
                required: true,
                message: '旧密码不能为空',
                trigger: 'blur'//触发时机:失去焦点
            },
        ],
        password: [
            {
                required: true,
                message: '新密码不能为空',
                trigger: 'blur'//触发时机:失去焦点
            },
        ],
        repassword: [
            {
                required: true,
                message: '确认密码不能为空',
                trigger: 'blur'//触发时机:失去焦点
            },
        ],
    })
    const formRef = ref(null);//拿到el-form节点

    const openRePasswordForm = () => formDrawerRef.value.open();

    const onSubmit = () => {
        //验证结果true或false
        formRef.value.validate((valid) => {
            if (!valid)
                return false
            formDrawerRef.value.showLoading();
            updatepassword(form)
                .then(res => {
                    toast("修改密码成功,请重新登录");
                    //清除当前用户状态vuex
                    userStore.logout();
                    //跳转回登录页
                    router.push("/login");
                }).finally(() => {
                    formDrawerRef.value.hideLoading();
                })
        })
    }
    return {
        formDrawerRef,
        form,
        rules,
        formRef,
        onSubmit,
        openRePasswordForm
    }
}

export function useLogout() {
    const router = useRouter();
    const userStore = useUserStore();
    function handleLogout() {
        showModal("是否要退出登录？").then(res => {
            logout()
                .finally(() => {
                    //清除当前用户状态vuex
                    userStore.logout();
                    //跳转回登录页
                    router.push("/login");
                    //提示退出登录成功
                    toast("退出登录成功");
                })
        })
    }
    return {
        handleLogout
    }
}



