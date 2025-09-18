// 处理多规格逻辑

import { ref, nextTick, computed } from "vue";
import {
    createGoodsSkusCard,
    updateGoodsSkusCard,
    deleteGoodsSkusCard,
    sortGoodsSkusCard,
    createGoodsSkusCardValue,
    deleteGoodsSkusCardValue,
    updateGoodsSkusCardValue,
    setGoodsSkusCardValue
} from "../api/goods";
import {
    toast,
    useArrayMoveUp,
    useArrayMoveDown,
    cartesianProductOf
} from "./util";

// 基本类型占位，后续可替换为更精确业务类型
type AnyObject = Record<string, any>

//当前商品ID
export const goodsId = ref<number>(0)

//规格选项列表
export const sku_card_list = ref<AnyObject[]>([])

export const sku_list = ref<AnyObject[]>([])

//初始化规格选项列表  row是当前对象
export function initSkuCardList(row: any) {
    sku_card_list.value = row.goodsSkusCard.map((item: any) => {
        item.text = item.name;
        item.loading = false;
        item.goodsSkusCardValue.map((v: any) => {
            v.text = v.value || "属性值";
            return v;
        })
        return item;
    })

    //拿到表格里面的要放的数据
    sku_list.value = row.goodsSkus;
}

//添加规格选项
export const btnLoading = ref<boolean>(false)
export function addSkusCard() {
    btnLoading.value = true;
    createGoodsSkusCard({
        goods_id: goodsId.value,
        name: "规格选项",
        order: 50,
        type: 0
    })
        .then((res: any) => {
            sku_card_list.value.push({
                ...res,
                text: res.name,
                loading: false,
                goodsSkusCardValue: []
            })
        })
        .finally(() => {
            btnLoading.value = false;
        })
}

//修改规格选项
export function handleUpdate(item: any) {
    item.loading = true;
    updateGoodsSkusCard(item.id, {
        goods_id: item.goods_id,
        name: item.text,
        order: item.order,
        type: 0
    })
        .then(() => {
            item.name = item.text;
            toast("修改规格选项成功");
        })
        .catch(() => {
            item.text = item.name;
            toast("修改规格选项失败:", "error");
        })
        .finally(() => {
            item.loading = false;
        })
}

//删除规格选项
export function handleDelete(item: any) {
    item.loading = true;
    deleteGoodsSkusCard(item.id)
        .then(() => {
            const i = sku_card_list.value.findIndex((o: any) => o.id == item.id);
            if (i != -1) {
                sku_card_list.value.splice(i, 1);
                toast("删除规格选项成功");
            }
            //刷新表格数据
            getTableData();
        })
        .finally(() => {
            item.loading = false;
        })
}

//排序规格选项
export const bodyLoading = ref<boolean>(false)
export function sortCart(action: 'up' | 'down', index: number) {
    const tempList: AnyObject[] = JSON.parse(JSON.stringify(sku_card_list.value));
    const func: (arr: AnyObject[], idx: number) => void = action == "up" ? useArrayMoveUp : useArrayMoveDown;
    const sortData = tempList.map((o: AnyObject, i: number) => ({
        id: o.id,
        order: i + 1
    }));

    bodyLoading.value = true;
    sortGoodsSkusCard({ sortdata: sortData })
        .then(() => {
            func(sku_card_list.value, index);
            //刷新表格数据
            getTableData();
        })
        .finally(() => {
            bodyLoading.value = false;
        })
}

//选择设置规格
export function handleChoosesetGoodsSkusCard(id: number, data: any) {
    const item = sku_card_list.value.find((o: any) => o.id == id)
    if (!item) return
    item.loading = true;
    setGoodsSkusCardValue(id, data)
        .then((res: any) => {
            item.name = item.text = res.goods_skus_card_id?.name
            item.goodsSkusCardValue = (res.goods_skus_card_value || []).map((o: any) => {
                o.text = o.value || "属性值";
                return o;
            })
            //刷新表格数据
            getTableData();
        })
        .finally(() => {
            item.loading = false;
        })
}

//初始化规格值
export function initSkuCardItem(id: any) {
    const item = sku_card_list.value.find((o: any) => o.id == id);

    const inputValue = ref<string>('')
    const inputVisible = ref<boolean>(false)
    const InputRef = ref<{ input: { focus: () => void } } | null>(null)

    //删除规格选项值
    const handleClose = (tag: any) => {
        const target = item
        if (!target) return
        loading.value = true;
        deleteGoodsSkusCardValue(tag.id)
            .then(() => {
                const i = (target.goodsSkusCardValue || []).findIndex((o: any) => o.id == tag.id);
                if (i != -1) {
                    target.goodsSkusCardValue.splice(i, 1);
                }
                //刷新表格数据
                getTableData();
            })
            .finally(() => {
                loading.value = false;
            })
    }

    const showInput = () => {
        inputVisible.value = true
        nextTick(() => {
            InputRef.value?.input.focus()
        })
    }

    const loading = ref<boolean>(false)
    //回车触发
    const handleInputConfirm = () => {
        if (!inputValue.value) {
            inputVisible.value = false;
            return
        }

        //添加规格选项值
        loading.value = true;
        createGoodsSkusCardValue({
            goods_skus_card_id: id,
            name: item?.name,
            order: 50,
            value: inputValue.value,
        })
            .then((res: any) => {
                item && item.goodsSkusCardValue && item.goodsSkusCardValue.push({
                    ...res,
                    text: res.value
                })
                //刷新表格数据
                getTableData();
            })
            .finally(() => {
                inputVisible.value = false
                inputValue.value = ''
                loading.value = false;
            })
    }

    //修改规格选项值
    const handleChange = (value: any, tag: any) => {
        loading.value = true
        updateGoodsSkusCardValue(tag.id, {
            goods_skus_card_id: id,
            name: item?.name,
            order: tag.order,
            value: value
        })
            .then(() => {
                tag.value = value;
                toast("修改规格选项值成功");
                //刷新表格数据
                getTableData();
            })
            .catch(() => {
                tag.text = tag.value;
            })
            .finally(() => {
                inputVisible.value = false
                inputValue.value = ''
                loading.value = false;
            })
    }

    return {
        item,
        inputValue,
        inputVisible,
        InputRef,
        handleClose,
        showInput,
        handleInputConfirm,
        loading,
        handleChange
    }
}

//初始化表格数据
export function initSkuTable(id: any) {
    //每个表头对应的列
    const skuLabels = computed(() => sku_card_list.value.filter((v: any) => v.goodsSkusCardValue.length > 0))
    //获取所有的表头
    const tableThs = computed(() => {
        let length = (skuLabels.value as AnyObject[]).length;
        return [{
            name: "商品规格",
            //合并列
            colspan: length,
            width: "",
            //合并行
            rowspan: length > 0 ? 1 : 2
        }, {
            name: "销售价",
            width: "100",
            rowspan: 2
        }, {
            name: "市场价",
            width: "100",
            rowspan: 2
        }, {
            name: "成本价",
            width: "100",
            rowspan: 2
        }, {
            name: "库存",
            width: "100",
            rowspan: 2
        }, {
            name: "体积",
            width: "100",
            rowspan: 2
        }, {
            name: "重量",
            width: "100",
            rowspan: 2
        }, {
            name: "编码",
            width: "100",
            rowspan: 2
        }]
    })
    getTableData();
    return {
        skuLabels,
        tableThs,
        sku_list
    }
}

//获取规格表格数据(修改规格值表格的数据也会刷新)
export function getTableData(id?: any) {
    setTimeout(() => {

        //返回[]不渲染表格数据
        if (sku_card_list.value.length === 0) return []

        // 二维数组，每个元素是一组规格值数组
        let list: any[][] = []

        sku_card_list.value.forEach((o: any) => {
            if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
                list.push(o.goodsSkusCardValue as any[])
            }
        })
        const arr = cartesianProductOf<any>(...list);

        //获取之前的规格列表
        const beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map((o: any) => {
            if (!Array.isArray(o.skus)) {
                o.skus = Object.keys(o.skus).map(k => o.skus[k])
            }
            o.skusId = o.skus.sort((a: any, b: any) => a.id - b.id).map((s: any) => s.id).join(",");
            return o;
        })

        sku_list.value = arr.map((skus: any) => {
            const o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList as AnyObject[])
            return {
                code: o?.code || "",
                cprice: o?.cprice || "0.00",
                goods_id: goodsId.value,
                image: o?.image || "",
                oprice: o?.oprice || "0.00",
                pprice: o?.pprice || "0.00",
                skus,
                stock: o?.stock || 0,
                volume: o?.volume || 0,
                weight: o?.weight || 0,
            }
        })
    }, 200);
}
// beforeSkuList中找到一个对象,使得它的skusId与skus的id列表在某种包含关系下匹配。
function getBeforeSkuItem(skus: any[], beforeSkuList: AnyObject[]) {
    let skusId = skus.sort((a: any, b: any) => a.id - b.id).map((s: any) => s.id).join(",");
    return beforeSkuList.find((o: AnyObject) => {
        if (skus.length > o.skus.length) {
            return skusId.indexOf(o.skusId) != -1;
        }
        return o.skusId.indexOf(skusId) != -1;
    })
}
