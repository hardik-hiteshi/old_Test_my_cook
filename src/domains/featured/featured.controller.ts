import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Query,
} from '@nestjs/common';

import { FeaturedDocument } from './schema/featured.schema';
import { FeaturedService } from './featured.service';
import { UpdateFeatureDTO } from './dto/updatefeatured.dto';

@Controller('featured')
export class FeaturedController {
  public constructor(public featuredServices: FeaturedService) {}

  //   @Post('create')
  //   public async create(
  //     @Headers('region') region: string,
  //     @Body() body: CreateFeatureDTO,
  //   ): Promise<FeaturedDocument> {
  //     return await this.featuredServices.create(region, body);
  //   }

  @Get('fetch')
  public async fetchFeatured(
    @Headers('region') region: string,
    @Query('type') type: string,
    @Query('search') search?: string,
  ): Promise<FeaturedDocument> {
    return await this.featuredServices.fetchFeatured(region, type, search);
  }
  @Patch('update')
  public async updateFeatured(
    @Headers('region') region: string,
    @Body() body: UpdateFeatureDTO,
  ): Promise<FeaturedDocument> {
    // console.log(region, body)
    return await this.featuredServices.updateFeatured(region, body);
  }
  @Patch('delete/:type')
  public async deleteFeatured(
    @Headers('region') region: string,
    @Param('type') type: string,
  ): Promise<FeaturedDocument> {
    return await this.featuredServices.deleteFeatured(type, region);
  }
}
