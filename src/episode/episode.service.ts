import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Episode} from "./entities/episode.entity";
import {Repository} from "typeorm";
import {PurChaseHistory} from "./entities/purchaseHistory.entity";
import {PurChaseHistoryInput, PurchaseHistoryOutput} from "./dtos/purchase-history.dto";
import * as moment from 'moment';

@Injectable()
export class EpisodeService {
    constructor(
        @InjectRepository(Episode)
        private readonly episode : Repository<Episode>,
        @InjectRepository(PurChaseHistory)
        private readonly purchaseHistory : Repository<PurChaseHistory>
    ) {
    }


    async findByIdEpisode(id: number): Promise<Episode> {
        return await this.episode.findOne({id})
    }



    async seriesDashBoardData(purChaseHistoryInput : PurChaseHistoryInput) : Promise<PurchaseHistoryOutput> {
        try {
            const purchaseHistory = await this.purchaseHistory
                .createQueryBuilder('purchaseHistory')
                .where(`purchaseHistory.seriesId = :seriesId`, {seriesId: purChaseHistoryInput.seriesId})
                .andWhere(`purchaseHistory.createDate >= :startDate`, {startDate: purChaseHistoryInput.startDate})
                .andWhere(`purchaseHistory.createDate <= :endDate`, {endDate: purChaseHistoryInput.endDate})
                .select(`purchaseHistory.createDate`)
                .addSelect('COUNT(*) AS count')
                .groupBy('purchaseHistory.createDate')
                .orderBy('purchaseHistory.createDate', 'ASC')
                .getRawMany();


            const date = [];
            const count = [];

            purchaseHistory.forEach((item) => {
                date.push(item.purchaseHistory_createDate);
                count.push(+item.count)
            })

            return {
                date,
                count
            }
        }catch (e) {
            console.log(e);
            return null
        }
    }


    async totalPurchase(seriesId : number) : Promise<number> {
        try{
            const seriesTotalPurchase = await this.purchaseHistory
                .createQueryBuilder('purchaseHistory')
                .where(`purchaseHistory.seriesId = :seriesId`, {seriesId})
                .select(`purchaseHistory.seriesId`)
                .addSelect('COUNT(*) AS count')
                .groupBy('purchaseHistory.seriesId')
                .getRawOne();

            return seriesTotalPurchase.count;
        }catch (e) {
            console.log(e);
            return null
        }
    }

}