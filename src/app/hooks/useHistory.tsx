"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PartHistory } from "../type";

const fetchHistory= async () => {
  const { data } = await axios.get<PartHistory[]>("/api/addhistory");
  return data;
};

export const UseHistory= () => {
  return useQuery({
    queryKey: ["history"],
    queryFn: () => fetchHistory(),
  });
};
