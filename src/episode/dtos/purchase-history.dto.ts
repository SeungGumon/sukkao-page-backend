import {Field, InputType, Int, ObjectType} from "@nestjs/graphql";


@InputType()
export class PurChaseHistoryInput {
    @Field(() => Int)
    seriesId: number

    @Field(() => String)
    startDate: string

    @Field(() => String)
    endDate: string
}


@ObjectType()
export class PurchaseHistoryOutput {
    @Field(() => [String])
    date: string[]

    @Field(() => [Int])
    count: number[]
}