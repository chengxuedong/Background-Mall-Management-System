<template>
    <el-form-item label="规格设置">
        <table class="border">
            <thead>
                <tr>
                    <th class="border" v-for="(th,thi) in tableThs" :key="thi" :width="th.width" :rowspan="th.rowspan"
                        :colspan="th.colspan">
                        {{ th.name }}
                    </th>
                </tr>
                <tr>
                    <th class="border" v-for="(th, thi) in skuLabels" :key="thi">
                        {{ th.name }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(tr, tri) in sku_list" :key="tri">
                    <td width="100" class="border text-center" v-for="(sku,skui) in tr.skus" :key="skui">
                        {{ sku.value }}
                    </td>
                    <td class="border">
                        <el-input v-model="tr.pprice" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="tr.oprice" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="tr.cprice" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="tr.stock" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="tr.volume" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="tr.weight" size="small" type="number"></el-input>
                    </td>
                    <td class="border">
                        <el-input v-model="tr.code" size="small" type="number"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
    </el-form-item>
</template>

<script setup>
import {
    initSkuTable
} from "~/composables/useSku.js"

const {
    skuLabels,
    tableThs,
    sku_list
} = initSkuTable()
</script>