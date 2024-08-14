"use client";
export async function AddOuhistory(
  user : string,
  partCode: string,
  type: string,
  partName: string,
  amount: number,
  brand: string,
  costPrice: number,
  salePrice: number,
  action: string
) {

  try{
  const res = await fetch("/api/addhistory", {
    method: "POST",
    body: JSON.stringify({
      user,
      partCode,
      type,
      partName,
      amount,
      brand,
      costPrice,
      salePrice,
      action,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if(!res.ok){
  
    throw new Error("An error occured while creating history.");
  }
}catch(error){
  throw new Error("An error occured while creating history." + error);
}

}
