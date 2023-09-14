/* eslint-disable @typescript-eslint/naming-convention */

import { Recipe, RecipeDocument } from '../schema/subSchema';
import { CreateRecipeDto } from '../dto/createRecipe/createRecipe.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QueryInterface } from './interface/recipequery.interface';
import { UpdateRecipeDto } from '../dto/updateRecipe/updateRecipe.dto';

@Injectable()
export class RecipeRepository {
  public constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
  ) {}

  public async findOne(
    region: string,
    body: CreateRecipeDto,
  ): Promise<RecipeDocument> {
    const recipe = await this.recipeModel.findOne({
      niceName: body.niceName,
      region,
      isActive: true,
    });

    return recipe;
  }

  public async createRecipe(
    region: string,
    body: CreateRecipeDto,
  ): Promise<RecipeDocument> {
    return await this.recipeModel.create({ ...body, region });
  }

  public async fetchRecipes(
    region: string,
    search: string,
  ): Promise<Array<RecipeDocument>> {
    const query: QueryInterface = {};
    const parsed = Number(search);
    const rateFilter = !isNaN(parsed) ? { rate: parsed } : {};
    const creationDateFilter = Date.parse(search)
      ? { 'info.creationDate': new Date(search).toISOString() }
      : {};
    const modificationDateFilter = Date.parse(search)
      ? { 'info.modificationDate': new Date(search).toISOString() }
      : {};
    const totalTimefilter = !isNaN(parsed) ? { totalTime: parsed } : {};
    const cookTimefilter = !isNaN(parsed) ? { cookTime: parsed } : {};
    const difficultyfilter = !isNaN(parsed) ? { difficulty: parsed } : {};
    const pricefilter = !isNaN(parsed) ? { price: parsed } : {};
    const exportableFilter = !Boolean(search)
      ? { 'status.exportable': search }
      : {};
    const verifiedFilter = !Boolean(search)
      ? { 'status.verified': search }
      : {};
    if (search) {
      query.$or = [
        { title: { $regex: search.toString(), $options: 'i' } },
        { niceName: { $regex: search, $options: 'i' } },
        { 'categories.name': { $in: [search] } },
        { 'categories.niceName': { $in: [search] } },
        rateFilter,
        { course: { $in: [search] } },
        { 'user.displayName': { $regex: search, $options: 'i' } },
        { 'user.niceName': { $regex: search, $options: 'i' } },
        { 'user.rank': { $regex: search, $options: 'i' } },
        { 'user.role': { $regex: search, $options: 'i' } },
        { 'user.web': { $regex: search, $options: 'i' } },
        { 'user.webName': { $regex: search, $options: 'i' } },
        { 'user.instagram': { $regex: search, $options: 'i' } },
        { 'user.twitter': { $regex: search, $options: 'i' } },
        creationDateFilter,
        modificationDateFilter,
        { 'info.creationSource': { $regex: search, $options: 'i' } },
        { 'info.modificationSource': { $regex: search, $options: 'i' } },
        totalTimefilter,
        cookTimefilter,
        difficultyfilter,
        pricefilter,
        exportableFilter,
        verifiedFilter,
        { 'status.idParent': { $regex: search, $options: 'i' } },
        { 'status.nutritional': { $regex: search, $options: 'i' } },
        { foodGroups: { $in: [search] } },
        { videos: { $in: [search] } },
        { tags: { $in: [search] } },
        // { 'social.favorite': { $regex: search, $options: 'i' } },
        // { "social.facebook": { $regex: search, $options: "i" } },
        // { "social.comments": { $regex: search, $options: "i" } },
        // { "social.ratings": { $regex: search, $options: "i" } },
        { 'source.url': { $regex: search, $options: 'i' } },
        { 'source.name': { $regex: search, $options: 'i' } },
        { 'grants.view': { $regex: search, $options: 'i' } },
        { 'grants.search': { $regex: search, $options: 'i' } },
        { rations: { $in: [search] } },
        { advice: { $regex: search, $options: 'i' } },
        { 'seo.title': { $regex: search, $options: 'i' } },
        { 'seo.description': { $regex: search, $options: 'i' } },
        { 'seo.canonical': { $regex: search, $options: 'i' } },
        //{ "seo.autopublishDate": { $regex: search, $options: "i" } },
        // { "seo.index": { $regex: search, $options: "i" } },
        // { "seo.follow": { $regex: search, $options: "i" } },
        { 'seo.extra.title': { $regex: search, $options: 'i' } },
        { 'seo.extra.text': { $regex: search, $options: 'i' } },
        { 'seo.keywords': { $regex: search, $options: 'i' } },
        //{ nutritionalForRation: { $regex: search, $options: "i" } },
      ];
    }
    const data = await this.recipeModel.find({
      $and: [query, { isActive: true }, { region }],
    });
    if (data.length > 0) {
      return data;
    }

    return [];
  }

  public async fetchOne(
    region: string,
    niceName: string,
  ): Promise<RecipeDocument> {
    const recipe = await this.recipeModel.findOne({
      niceName,
      region,
      isActive: true,
    });

    return recipe;
  }

  public async updateRecipe(
    region: string,
    body: UpdateRecipeDto,
    niceName: string,
  ): Promise<RecipeDocument> {
    const recipe = await this.recipeModel.findOneAndUpdate(
      // eslint-disable-next-line object-shorthand
      { region, niceName, isActive: true },
      { $set: body },
      { new: true },
    );

    return recipe;
  }

  public async deleteRecipe(
    region: string,
    niceName: string,
  ): Promise<RecipeDocument> {
    const recipe = await this.recipeModel.findOneAndUpdate(
      { $and: [{ niceName }, { isActive: true }, { region }] },
      { isActive: false },
      { new: true },
    );

    return recipe;
  }

  public async fetchAllByQuery(
    region: string,
    skip: number,
    ebook: string[],
  ): Promise<Array<RecipeDocument>> {
    const query = { region, niceName: { $in: ebook } };

    const data = await this.recipeModel
      .find(query, { __v: 0, _id: 0 })
      .skip(skip)
      .limit(10);

    if (data.length > 0) {
      return data;
    }
  }
}
