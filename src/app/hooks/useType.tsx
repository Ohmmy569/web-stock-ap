"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PartType } from "../type";

const fetchPartTypes = async () => {
  const { data } = await axios.get<PartType[]>("/api/typeofparts");
  return data;
};

export const UsePartType = () => {
  return useQuery({
    queryKey: ["PartTypes"],
    queryFn: () => fetchPartTypes(),
  });
};
