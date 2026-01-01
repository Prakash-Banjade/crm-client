import { PaginatedResponse } from ".";

export type TLearningResource = {
id: string;
parent: {id: string} | null;
title: string;
files: string[];
description: string;
createdAt: string;
}

export type TSingleLearningResource = TLearningResource & {
    children: TLearningResource[];
}

export type TLearningResourcesResponse = PaginatedResponse<TLearningResource>;