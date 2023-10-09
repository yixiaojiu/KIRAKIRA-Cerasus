type HeadersObject = { [key: string]: string };

/**
 * 带有超时停止的 fetch
 * @param resource 请求的目标
 * @param options 请求中附带的内容
 * @param timeout 请求超时时间（毫秒），默认：30000ms
 * @returns 请求结果
 */
async function fetchWithTimeout(resource: RequestInfo, options: RequestInit = {}, timeout = 30000) {
	const controller = new AbortController();
	const id = setTimeout(() => controller.abort(), timeout);

	const response = await fetch(resource, {
		...options,
		signal: controller.signal,
	});

	clearTimeout(id);

	if (!response.ok)
		throw new Error(`HTTP error! Status: ${response.status}`);

	return response;
}

/**
 * 发送 GET 请求
 * @param url 请求的网址
 * @param headers 请求携带的 Header 内容
 * @param timeout 请求超时时间（毫秒），默认：30000ms
 * @returns 请取结果
 */
export async function get(url: string, headers?: HeadersObject, timeout?: number): Promise<unknown> {
	try {
		const response = await fetchWithTimeout(url, {
			method: "GET",
			headers,
		}, timeout);
		return response.json();
	} catch (error) {
		console.error("ERROR", `something wrong in 'get', URL: ${url}`, error);
		throw error;
	}
}

/**
 * 发送 POST 请求
 * @param url 请求的网址
 * @param body 请求的 body 内容
 * @param headers 请求携带的 Header 内容
 * @param timeout 请求超时时间（毫秒），默认：30000ms
 * @returns 请求结果
 */
export async function post(url: string, body: unknown, headers?: HeadersObject, timeout?: number): Promise<unknown> {
	try {
		const response = await fetchWithTimeout(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...headers,
			},
			body: JSON.stringify(body),
		}, timeout);
		return response.json();
	} catch (error) {
		console.error("ERROR", `something wrong in 'post', URL: ${url}`, error);
		throw error;
	}
}
