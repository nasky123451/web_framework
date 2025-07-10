export default class DashboardController {
    async fetchData(): Promise<string[]> {
      // 模擬 async 請求
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(["Chart A", "Chart B", "Chart C"]);
        }, 1000);
      });
    }
  }
  