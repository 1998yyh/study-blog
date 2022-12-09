# vue3 hooks

记录一些常用的hooks

## useList

``` ts

import { ref } from "vue";

type anyObject = Record<string, any>;

export function useList<T extends anyObject>(
	listReq: (params: anyObject) => Promise<anyObject>,
	data?: T
): anyObject {
	if (!listReq) {
		return new Error("请传入接口调用方法！");
	}

	const result = ref<Record<string, any>[]>([]);
  // 分页数据
	const pageInfo = ref({
		pageNum: 1,
		pageSize: 20,
		total: 0
	});

  // 获取列表方法
	const getList = () => {
		return listReq({
			...data,
			...pageInfo.value
		}).then(({ code, data }) => {
			if (code === 0) {
				const { list, total } = data;
				result.value = list;
				pageInfo.value.total = total;
			}
		});
	};

  // 每页显示数量变化
	const handleSizeChange = (pageSize: number) => {
		pageInfo.value.pageSize = pageSize;
		getList();
	};

  // 当前页数变化  
	const handleCurrentChange = (pageNum: number) => {
		pageInfo.value.pageNum = pageNum;
		getList();
	};

	const resetPage = () => {
		pageInfo.value.pageNum = 1;
		pageInfo.value.pageSize = 100;
	};

	getList();

	return {
		getList,
		handleSizeChange,
		handleCurrentChange,
		resetPage,
		pageInfo,
		result
	};
}

```

## BEM

