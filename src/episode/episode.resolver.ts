import {Args, Int, Mutation, Query, Resolver} from "@nestjs/graphql";
import {EpisodeService} from "./episode.service";
import {Episode} from "./entities/episode.entity";
import {PurChaseHistoryInput, PurchaseHistoryOutput} from "./dtos/purchase-history.dto";
import {AuthUser} from "../auth/auth-user.decorator";
import {User} from "../user/entities/user.entity";
import {Roles} from "../auth/role.decorator";
import {CoreOutput} from "../common/dtos/core.dto";
import {CreateEpisodeInput, EpisodeInput} from "./dtos/episodeInput.dto";



@Resolver()
export class EpisodeResolver {
    constructor(
        private readonly episodeService: EpisodeService
    ) {
    }

    @Roles(['Novelist', 'Cartoonist'])
    @Query(() => Episode , {nullable : true})
    async adminFindByIdEpisode(
        @Args('seriesId') seriesId : number,
        @Args('episodeId') episodeId : number,
        @AuthUser() authUser: User,
    ) : Promise<Episode | null> {
        return await this.episodeService.adminFindByIdEpisode(seriesId, episodeId, authUser);
    }


    @Roles(['Novelist', 'Cartoonist'])
    @Mutation(() => CoreOutput)
    async updateEpisode(
        @Args('episodeInput') episodeInput : EpisodeInput,
        @AuthUser() authUser : User
    ) : Promise<CoreOutput> {
        return await this.episodeService.updateEpisode(episodeInput , authUser)
    }

    @Roles(['Novelist', 'Cartoonist'])
    @Mutation(() => CoreOutput)
    async createEpisode(
        @Args('episodeCreateInput') createEpisodeInput : CreateEpisodeInput,
        @AuthUser() authUser : User
    ) : Promise<CoreOutput> {
        return await this.episodeService.createEpisode(createEpisodeInput , authUser)
    }



    @Roles(['Novelist', 'Cartoonist'])
    @Query(() => PurchaseHistoryOutput)
    async seriesDashBoardData(
        @AuthUser() authUser: User,
        @Args('purChaseInput') purChaseHistoryInput : PurChaseHistoryInput
    ) : Promise<PurchaseHistoryOutput> {
        return await this.episodeService.seriesDashBoardData(purChaseHistoryInput,authUser)
    }

    


}