import { Session } from "next-auth";

export type User = {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
  role: string;
};

export type Car = {
  _id: string;
  brand: string;
  name: string;
};

export type CarBrand = {
  _id: string;
  brand: string;
};

export type Part = {
  _id: string;
  code: string;
  name: string;
  type: string;
  brand: string;
  model: string;
  costPrice: number;
  sellPrice: number;
  amount: number;
};

export type PartType = {
  _id: string;
  name: string;
};

export type PartHistory = {
  _id: string;
  createdAt: Date;
  user: string;
  action: string;
  partCode: string;
  partName: string;
  type: string;
  amount: number;
  brand: string;
  costPrice: number;
  salePrice: number;
};


