"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Car } from "../type";

const fetchCar = async () => {
  const { data } = await axios.get<Car[]>("/api/modelcar");
  return data;
};

export const UseCar = () => {
  return useQuery({
    queryKey: ["car"],
    queryFn: () => fetchCar(),
  });
};
