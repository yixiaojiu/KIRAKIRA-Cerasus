/**
 * 在组合式 API 定义 render 函数，比如返回特定的 JSX。
 * @param render - 指定渲染函数，比如 JSX。
 */
export default function useRender(render: () => VNode): void {
	const vm = getCurrentInstance() as ComponentInternalInstance & { render: () => VNode } | null;
	if (!vm) throw new Error("[useRender] must be called from inside a setup function");
	vm.render = render;
}

/**
 * 获取父组件。
 * @param type - 父组件的类型筛选。
 * @returns 父组件或 null（如果没有）。
 */
export function useParent<T extends ComponentInternalInstance>(type?: ConcreteComponent | unknown) {
	let parent = getCurrentInstance()?.parent;
	while (!(!parent || type === undefined || parent.type === type))
		parent = parent.parent;
	return parent as T | null || null;
}

/**
 * 获取父组件的作用域样式 ID。
 * @returns 父组件的作用域样式 ID。
 */
export function useParentScopeId() { // TODO: [兰音] 某些时候可能计算不准确，由于目前仅在一个使用地方测试，不能保证所有情况都能正常工作。需要增加更多测试场景。
	let parent = getCurrentInstance()?.parent;
	while (parent) {
		if ("__scopeId" in parent.type && typeof parent.type.__scopeId === "string")
			return parent.type.__scopeId;
		parent = parent.parent;
	}
	return null;
}

/**
 * 为父组件创建插槽子组件映射表。
 * @deprecated
 * @returns - 插槽子组件。
 */
export function useSlotChildren() {
	const children = {} as Record<string | number | symbol, ComponentInternalInstance>; // T: ComponentInternalInstance
	// getCurrentInstance()!.exposed ??= {};
	// getCurrentInstance()!.exposed!.children = children;
	return children;
}

/**
 * 插槽内子组件绑定父组件。
 * @deprecated
 * @param id - 子组件的唯一标识符。
 * @param type - 父组件的类型筛选。
 */
export function bindParent(id: string | number | symbol, type?: ConcreteComponent | unknown) {
	const me = getCurrentInstance();
	const parent = useParent(type);

	onMounted(() => {
		if (!me || !parent?.exposed?.children) return;
		parent.exposed.children[id] = me;
	});

	onUnmounted(() => {
		if (!me || !parent?.exposed?.children) return;
		delete parent.exposed.children[id];
	});
}
