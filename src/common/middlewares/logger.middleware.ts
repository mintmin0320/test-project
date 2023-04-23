import { NextFunction, Request, Response } from 'express';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP'); // HTTP요청에서만 실행됨

  use(req: Request, res: Response, next: NextFunction): void {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {  // res가 완료 됐을 때 'finish'는 이벤트임
      const { statusCode } = res;
      this.logger.log(`${method} ${originalUrl} ${statusCode} - ${userAgent} ${ip}`);
    })
    next();
  }
}
