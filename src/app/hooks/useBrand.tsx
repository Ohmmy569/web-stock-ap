"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { CarBrand } from "../type";

const fetchBrandCar = async () => {
  const { data } = await axios.get<CarBrand[]>("/api/brandcar");
  return data;
};

export const UseBrandCar = () => {
  return useQuery({
    queryKey: ["brandcars"],
    queryFn: () => fetchBrandCar(),
  });
};
