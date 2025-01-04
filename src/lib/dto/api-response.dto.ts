export class ApiResponse {
  constructor(status: number, message: string, data: any) {
    this.statusCode = status;
    this.message = message;
    this.data = data;
  }
  private statusCode: number;
  private message: string;
  private data: any;
}
