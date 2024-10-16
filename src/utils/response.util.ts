import { HttpStatus } from '@nestjs/common';

export class Response<T> {
  statusCode: number;
  success: boolean = false;
  statusMessage: string;
  data?: T;

  constructor(statusCode: number, statusMessage: string) {
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    if (statusCode === HttpStatus.OK) {
      this.success = true;
    }
  }

  // Failed responses
  static failed<T>(
    statusCode: number,
    statusMessage: string,
    data?: T,
  ): Response<T> {
    const response = new Response<T>(statusCode, statusMessage);
    response.success = false;
    response.data = data;
    return response;
  }

  // Successful responses
  static successful<T>(
    statusCode: number,
    statusMessage: string,
    data?: T,
  ): Response<T> {
    const response = new Response<T>(statusCode, statusMessage);
    response.success = true;
    response.data = data;
    return response;
  }

  static pagination<T>(
    statusCode: number,
    statusMessage: string,
    data: T[],
    total: number,
    page: number,
    limit: number,
  ) {
    return {
      statusCode,
      statusMessage,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
