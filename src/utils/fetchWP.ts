type FetchOptions = {
  timeout?: number;
  retries?: number;
};

// Hàm fetchWP với cơ chế chống treo (Timeout), thử lại (Retry) và an toàn kiểu dữ liệu (Generics)
export async function fetchWP<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T | []> {
  const { timeout = 5000, retries = 2 } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id); // Dọn dẹp bộ đếm giờ nếu lấy dữ liệu thành công

      if (!res.ok) {
        throw new Error(`HTTP error: ${res.status}`);
      }

      const data = await res.json();
      return data as T; // Trả về dữ liệu chuẩn

    } catch (err: any) {
      clearTimeout(id); // Dọn dẹp bộ đếm giờ nếu lỗi
      
      // Nếu chưa hết số lần thử, nghỉ 500ms rồi thử lại
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 500));
        continue;
      }

      // In log lỗi ra console để Dev dễ debug
      if (err.name === 'AbortError') {
        console.error(`[Timeout ${timeout}ms] Fetch failed:`, url);
      } else {
        console.error(`[API Error] Fetch failed:`, url, err.message);
      }

      // Trả về mảng rỗng để web không bị crash (vẫn chạy tiếp được)
      return [];
    }
  }
  
  return [];
}