"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Part } from "../type";

const fetchParts = async () => {
  const { data } = await axios.get<Part[]>("/api/parts");
  return data;
};

export const UsePart = () => {
  return useQuery({
    queryKey: ["parts"],
    queryFn: () => fetchParts(),
  });
};
