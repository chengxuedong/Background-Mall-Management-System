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


//当前商品ID
export const goodsId = ref(0)

//规格选项列表
export const sku_card_list = ref([])

export const sku_list = ref([])

//初始化规格选项列表  row是当前对象
export function initSkuCardList(row) {
    sku_card_list.value = row.goodsSkusCard.map(item => {
        //先加一个新的属性来临时放要修改的值，解决修改失败的事值都没有变回没有修改的数据了
        item.text = item.name;
        //防止看不见状态一直提交
        item.loading = false;
        //o.goodsSkusCardValue是一个属性值数组
        item.goodsSkusCardValue.map(v => {
            v.text = v.value || "属性值";
            return v;
        })
        return item;
    })

    //拿到表格里面的要放的数据
    sku_list.value = row.goodsSkus;
}

//添加规格选项
export const btnLoading = ref(false)
export function addSkusCard() {
    btnLoading.value = true;
    createGoodsSkusCard({
        goods_id: goodsId.value,
        name: "规格选项",
        order: 50,
        type: 0
    })
        .then((res) => {
            {
                sku_card_list.value.push({
                    ...res,
                    text: res.name,
                    loading: false,
                    goodsSkusCardValue: []
                })
            }
        })
        .finally(() => {
            btnLoading.value = false;
        })
}

//修改规格选项
export function handleUpdate(item) {
    item.loading = true;
    updateGoodsSkusCard(item.id, {
        goods_id: item.goods_id,
        name: item.text,
        order: item.order,
        type: 0
    })
        .then((res) => {
            //请求成功把当前对象的name进行修改
            item.name = item.text;
            toast("修改规格选项成功");
        })
        .catch(err => {
            //请求失败把当前对象的text改回去
            item.text = item.name;
            toast("修改规格选项失败:", "error");
        })
        .finally(() => {
            item.loading = false;
        })
}

//删除规格选项
export function handleDelete(item) {
    item.loading = true;
    deleteGoodsSkusCard(item.id)
        .then((res) => {
            {
                let i = sku_card_list.value.findIndex(o => o.id == item.id);
                if (i != -1) {
                    //删除一个索引为i的元素
                    sku_card_list.value.splice(i, 1);
                    toast("删除规格选项成功");
                }
                //刷新表格数据
                getTableData();
            }
        })
        .finally(() => {
            item.loading = false;
        })
}

//排序规格选项
export const bodyLoading = ref(false)
export function sortCart(action, index) {
    //通过创建一个深拷贝,你可以对tempList进行操作,而不会影响原始的sku_card_list.value。
    let tempList = JSON.parse(JSON.stringify(sku_card_list.value));
    let func = action == "up" ? useArrayMoveUp : useArrayMoveDown;
    //把要传给后端的data参数值整理到sortData
    let sortData = tempList.map((o, index) => {
        return {
            id: o.id,
            order: index + 1
        };
    })

    bodyLoading.value = true;
    sortGoodsSkusCard({ sortdata: sortData })
        .then((res) => {
            func(sku_card_list.value, index);
            //刷新表格数据
            getTableData();
        })
        .finally(() => {
            bodyLoading.value = false;
        })
}

//选择设置规格
export function handleChoosesetGoodsSkusCard(id, data) {
    let item = sku_card_list.value.find(o => o.id);
    item.loading = true;
    //把点击的内容替换成选择的对应内容
    setGoodsSkusCardValue(id, data)
        .then(res => {
            item.name = item.text = res.goods_skus_card_id.name;
            item.goodsSkusCardValue = res.goods_skus_card_value.map(o => {
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
export function initSkuCardItem(id) {
    const item = sku_card_list.value.find(o => o.id == id);


    const inputValue = ref('')
    const inputVisible = ref(false)
    const InputRef = ref()

    //删除规格选项值
    const handleClose = (tag) => {
        loading.value = true;
        deleteGoodsSkusCardValue(tag.id)
            .then((res) => {
                let i = item.goodsSkusCardValue.findIndex(o => o.id == tag.id);
                if (i != -1) {
                    item.goodsSkusCardValue.splice(i, 1);
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
            InputRef.value.input.focus()
        })
    }

    const loading = ref(false)
    //回车触发
    const handleInputConfirm = () => {
        //如果输入框没有值
        if (!inputValue.value) {
            inputVisible.value = false;
            return
        }

        //添加规格选项值
        loading.value = true;
        createGoodsSkusCardValue({
            goods_skus_card_id: id,
            name: item.name,
            order: 50,
            value: inputValue.value,
        })
            .then((res) => {
                item.goodsSkusCardValue.push({
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
    const handleChange = (value, tag) => {
        loading.value = true
        updateGoodsSkusCardValue(tag.id, {
            goods_skus_card_id: id,
            name: item.name,
            order: tag.order,
            value: value
        })
            .then((res) => {
                tag.value = value;
                toast("修改规格选项值成功");
                //刷新表格数据
                getTableData();
            })
            .catch(err => {
                //请求失败把当前对象的text改回去
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
export function initSkuTable(id) {
    //每个表头对应的列
    const skuLabels = computed(() => sku_card_list.value.filter(v => v.goodsSkusCardValue.length > 0))
    //获取所有的表头
    const tableThs = computed(() => {
        let length = skuLabels.value.length;
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
export function getTableData(id) {
    setTimeout(() => {

        //返回[]不渲染表格数据
        if (sku_card_list.value.length === 0) return []

        let list = []

        sku_card_list.value.forEach(o => {
            if (o.goodsSkusCardValue && o.goodsSkusCardValue.length > 0) {
                list.push(o.goodsSkusCardValue)
            }
        })
        console.log("~~转前list=", list);
        let arr = cartesianProductOf(...list);
        console.log("~~转后arr=", arr);
        // 然后我还是有点不理解这个，为什么其他选项会没掉了呢，明明排列组合有数据，直接用这个数据不行嘛
        // 但是，用户之前输入的价格和库存信息会丢失。

        //获取之前的规格列表,将规格ID排序之后转化为字符串,先转化为字符串再转化为数组拷贝一份数据
        let beforeSkuList = JSON.parse(JSON.stringify(sku_list.value)).map(o => {
            console.log("~~前o=", o);
            //   如果o.skus是对象不是数组就转为数组 
            if (!Array.isArray(o.skus)) {
                // []和.都可以用来获取属性值，但是[]可以使用变量名获取而.方式不可以
                o.skus = Object.keys(o.skus).map(k => o.skus[k])
            }

            //="290,282"拼接成字符串
            o.skusId = o.skus.sort((a, b) => a.id - b.id).map(s => s.id).join(",");
            console.log("~~后o=", o);
            return o;
        })

        sku_list.value = []
        sku_list.value = arr.map(skus => {
            console.log("~~beforeSkuList=", beforeSkuList);
            console.log("~~skus=", skus);
            let o = getBeforeSkuItem(JSON.parse(JSON.stringify(skus)), beforeSkuList)
            console.log("~~后o=", o);
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
function getBeforeSkuItem(skus, beforeSkuList) {
    console.log("~~skus, beforeSkuList=", skus, beforeSkuList);
    //用来比对
    let skusId = skus.sort((a, b) => a.id - b.id).map(s => s.id).join(",");
    return beforeSkuList.find(o => {
        console.log("~~o=", o);
        //新的数据大于老的数据长度,判断新的数据包含不包含旧数据的id,包含就是匹配成功
        // 新的规格组合扩展了旧的规格项：
        // 比如你原来只有颜色和尺码，现在增加了袖长。新的规格组合包含了旧的规格项的所有信息，并且还增加了新的信息。
        if (skus.length > o.skus.length) {
            console.log("~~skus=", skus);
            console.log("~~skusId.indexOf(o.skusId)=", skusId.indexOf(o.skusId));
            return skusId.indexOf(o.skusId) != -1;
        }
        //判断旧的数据包含不包含新数据的id, 包含就是匹配成功
        // 旧的规格项包含了新的规格组合：
        // 比如你原来有颜色、尺码和袖长，现在你决定去掉袖长这个规格。新的规格组合只包含颜色和尺码，
        // 而旧的规格项可能还包含袖长这个信息。
        console.log("~~o.skusId.indexOf(skusId)=", o.skusId.indexOf(skusId));
        return o.skusId.indexOf(skusId) != -1;
    })
}
