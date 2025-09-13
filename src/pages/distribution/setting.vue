<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form" label-width="160px" class="settingForm">
            <h5 class="bg-gray-100 p-3 rounded mb-5">基础设置</h5>
            <el-form-item label="分销启用">
                <el-radio-group v-model="form.distribution_open">
                    <el-radio :label="0" border>
                        禁用
                    </el-radio>
                    <el-radio :label="1" border>
                        开启
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="分销海报图">
                <ChooseImage :limit="9" v-model="form.spread_banners" />
            </el-form-item>
            <h5 class="bg-gray-100 p-3 rounded mb-5">返佣设置</h5>
            <el-form-item label="一级返佣比例">
                <div>
                    <el-input v-model="form.store_first_rebate" placeholder="一级返佣比例" style="width: 50%;" type="number">
                        <template #append>%</template>
                    </el-input>
                    <small class="text-gray-500 flex mt-1">订单交易成功后给上级返佣的比例0 - 100,例:5 = 反订单金额的5%</small>
                </div>
            </el-form-item>
            <el-form-item label="二级返佣比例">
                <div>
                    <el-input v-model="form.store_second_rebate" placeholder="一级返佣比例" style="width: 50%;" type="number">
                        <template #append>%</template>
                    </el-input>
                    <small class="text-gray-500 flex mt-1">订单交易成功后给上级返佣的比例0 - 100,例:5 = 反订单金额的5%</small>
                </div>
            </el-form-item>
            <el-form-item label="自购返佣">
                <div>
                    <el-radio-group v-model="form.is_self_brokerage">
                        <!-- 这个在label前面加冒号，因为is_self_brokerage是number类型，
                         使用:可以让""里面的数据自动转化为相应类型 -->
                        <el-radio :label="1" border>
                            是
                        </el-radio>
                        <el-radio :label="0" border>
                            否
                        </el-radio>
                    </el-radio-group>
                    <small class="text-gray-500 flex mt-1">是否开启自购返佣（开启：分销员自己购买商品，享受一级返佣，上级享受二级返佣；
                        关闭：分销员自己购买商品没有返佣）</small>
                </div>
            </el-form-item>
            <h5 class="bg-gray-100 p-3 rounded mb-5">结算设置</h5>
            <el-form-item label="结算时间">
                <div>
                    <el-input v-model="form.settlement_days" placeholder="结算时间" style="width: 70%;" type="number">
                        <template #prepend>
                            订单完成后
                        </template>
                        <template #append>天</template>
                    </el-input>
                    <small class="text-gray-500 flex mt-1">预估佣金结算后无法进行回收，请谨慎设置结算天数</small>
                </div>
            </el-form-item>
            <el-form-item label="佣金到账方式">
                <div>
                    <!-- 这个在label前面不加冒号，因为brokerage_method本身是String类型,不需要用-->
                    <el-radio-group v-model="form.brokerage_method">
                        <el-radio label="hand" border>
                            手动到账
                        </el-radio>
                        <el-radio label="wx" border>
                            自动到微信零钱
                        </el-radio>
                    </el-radio-group>
                    <small class="text-gray-500 flex mt-1">佣金到账方式支持线下转账和微信零钱自动转账，手动转账更安全，自动转账更方便</small>
                </div>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="default" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { getConfig, setConfig } from '~/api/distribution';
import { reactive, ref } from 'vue';
import { toast } from '~/composables/util';
import ChooseImage from '~/components/ChooseImage.vue';


const form = reactive(
    {
        "distribution_open": 1,
        "store_first_rebate": 10,
        "store_second_rebate": 20,
        "spread_banners": [
            "http://...png",
            // ...
        ],
        "is_self_brokerage": 1,
        "settlement_days": 7,
        "brokerage_method": "hand"
    }
)

const loading = ref(false)
function getData() {
    loading.value = true;
    getConfig()
        .then(res => {
            //因为res里面的有些返回的数据不需要用到，就不需要传给后端
            for (const k in form) {
                form[k] = res[k];
            }
        })
        .finally(() => {
            loading.value = false;
        })
}
getData();

const submit = () => {
    loading.value = true;
    //把password_encrypt又变回字符串格式，其他不变
    setConfig({
        ...form
    })
        .then(res => {
            toast("修改成功");
        })
        .finally(() => {
            loading.value = false;
        })
}
</script>

<style>
    .choose-image-btn {
        margin-left: 5px;
        margin-top: -17px;
    }
</style>