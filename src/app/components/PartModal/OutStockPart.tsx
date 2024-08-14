"use client";

import { Box, Button, Center, Group, Modal, NumberInput } from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Part } from "@/app/type";
import { AddOuhistory } from "@/app/calcu/addOuhistory";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";

interface ModalProps {
  Part: Part;
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  username: string;

}

const OutStockPartModal: React.FC<ModalProps> = ({
  Part,
  opened,
  onClose,
  title,
  username,
}) => {
  const schema = z.object({
    amount: z
      .number()
      .min(0, { message: "กรุณากรอกจำนวน" })
      .max(Part.amount, { message: "จำนวนที่เบิกมากกว่าจำนวนที่มีในคลัง" }),
  });

  const form = useForm({
    initialValues: {
      amount: 0,
    },
    validate: zodResolver(schema),
  });

  const [AmountCurrent, setAmountCurrent] = useState(0);
  const [AmountData, setAmountData] = useState(0);
  const [name, setName] = useState("");
  const queryClient = useQueryClient();
  const Outmutation = useMutation({
    mutationFn: async (id: any) => {
      await axios.put(`/api/outstock/${id}`, {
        amount: AmountCurrent - AmountData,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      await AddOuhistory(
        username,
        Part.code,
        Part.type,
        Part.name,
        AmountData,
        Part.brand,
        Part.costPrice,
        Part.sellPrice,
        "เบิกสินค้า"
      );
      showNotification({
        title: "เบิกสินค้าสำเร็จ",
        message: "เบิกสินค้า " + name + " " + AmountData + " ชิ้น",
        color: "blue",
        icon: null,
      });
    },
    onError: (error) => {
      showNotification({
        title: "เบิกสินค้าไม่สำเร็จ",
        message: "กรุณาลองใหม่อีกครั้ง",
        color: "red",
        icon: null,
      });
    },
  });

  const handlesubmit = (
    data: any,
    current: number,
    name: string,
    PartId: any
  ) => {
    setAmountCurrent(current);
    setAmountData(data.amount);
    setName(name);
    Outmutation.mutate(PartId);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data, Part.amount, Part.name, Part._id);
            onClose();
            form.reset();
          })();
        }}
      >
        <Box>
          <NumberInput
            description={"อยู่ในคลัง : " + Part?.amount + " ชิ้น"}
            label="จำนวน"
            placeholder="จำนวน"
            {...form.getInputProps("amount")}
            min={0}
          />
          <Center>
            <Group justify="space-between" mt={15}>
              <Button color="green" mt="md" type="submit">
                ยืนยัน
              </Button>
              <Button color="red" mt="md" onClick={onClose}>
                ยกเลิก
              </Button>
            </Group>
          </Center>
        </Box>
      </form>
    </Modal>
  );
};

export default OutStockPartModal;
