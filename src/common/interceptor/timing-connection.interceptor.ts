import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { tap } from "rxjs";

export class TimingConnectionInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler<any>) {
        const startTime = Date.now()

        // const callContext = context.getArgByIndex(0)
        // const metadata = callContext.map(url => {
        //     method: url
        // })

        return next.handle().pipe(
            tap(() => {
                const finalTime = Date.now()
                const elapsedTime = finalTime - startTime
                console.log(`This call took ${elapsedTime}ms to execute.`)
                // console.log(callContext)
                // console.log(`The medtada is: ${metadata}`)
            })
        )
    }
}