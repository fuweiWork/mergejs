/**
 *
 * @param {Object} params span-method默认参数
 * @param {Array} needMergeArr 需聚合的列名数组
 * @param {Array} tableData 表格数据
 * @returns
 */
function merge(params, needMergeArr, tableData) {
    const { row, column, rowIndex, columnIndex } = { ...params }
    const rowMergeArrs = rowMergeHandle(needMergeArr, tableData)
    for (let res in needMergeArr) {
        if (needMergeArr[res] == column.property) {
            return mergeAction(
                rowMergeArrs,
                column.property,
                rowIndex,
                columnIndex
            )
        }
    }
}

function rowMergeHandle(arr, data) {
    if (!Array.isArray(arr) && !arr.length) return false
    if (!Array.isArray(data) && !data.length) return false
    let needMerge = {}
    arr.forEach((i, idx) => {
        /** 需聚合列记录每列聚合几条数据数组rowArr，
         * rowArr长度和数据长度一样
         * 与上条数据一样数据 +=1，数组后面push0占位，记录下标不变
         * 与上条数据不一样，数组后面push1，记录下标变为刚push1的下标
         * rowMergeNum是计算rowArr下标
         */
        needMerge[i] = {
            rowArr: [],
            rowMergeNum: 0,
        }
        // 需聚合列数组的第一列
        if (idx == 0) {
            // table数据遍历
            data.forEach((item, index) => {
                // 表格首个数据单独处理，rowArr=[1]，rowMergeNum=0
                if (index === 0) {
                    needMerge[i].rowArr.push(1)
                    needMerge[i].rowMergeNum = 0
                } else {
                    if (item[i] === data[index - 1][i]) {
                        needMerge[i].rowArr[needMerge[i].rowMergeNum] += 1
                        needMerge[i].rowArr.push(0)
                    } else {
                        needMerge[i].rowArr.push(1)
                        needMerge[i].rowMergeNum = index
                    }
                }

                // console.log(
                //   i + '---' + needMerge[i].rowArr + '---' + needMerge[i].rowMergeNum
                // )
            })
        } else {
            let firstRowArr = needMerge[arr[0]].rowArr
            let firstRowArrDeal = []
            firstRowArr.forEach((item, index) => {
                if (item > 0) {
                    firstRowArrDeal.push(index)
                }
            })
            data.forEach((item, index) => {
                let sign = false
                if (firstRowArrDeal.indexOf(index) > 0) {
                    needMerge[i].rowMergeNum = index
                    sign = true
                }
                // 表格首个数据单独处理
                if (index === 0) {
                    needMerge[i].rowArr.push(1)
                    needMerge[i].rowMergeNum = 0
                } else {
                    if (item[i] === data[index - 1][i]) {
                        if (sign) {
                            needMerge[i].rowArr.push(1)
                        } else {
                            needMerge[i].rowArr[needMerge[i].rowMergeNum] += 1
                            needMerge[i].rowArr.push(0)
                        }
                    } else {
                        needMerge[i].rowArr.push(1)
                        needMerge[i].rowMergeNum = index
                    }
                }
                // console.log(
                //   i + '---' + needMerge[i].rowArr + '---' + needMerge[i].rowMergeNum
                // )
            })
        }
    })
    return needMerge
}

function mergeAction(rowMergeArrs, val, rowIndex) {
    let _row = rowMergeArrs[val].rowArr[rowIndex]
    let _col = _row > 0 ? 1 : 0
    return [_row, _col]
}

export default merge
