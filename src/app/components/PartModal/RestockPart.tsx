"use client";
import { Box, Button, Center, Group, Modal, NumberInput } from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Part } from "@/app/type";
import { AddRehistory } from "@/app/calcu/addRehistory";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ModalProps {
  Part: Part;
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  username: string;
}

const RestockPartModal: React.FC<ModalProps> = ({
  Part,
  opened,
  onClose,
  title,
  username,
}) => {
  const schema = z.object({
    amount: z.number().min(0, { message: "กรุณากรอกจำนวน" }),
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
  const Remutation = useMutation({
    mutationFn: async (id: any) => {
      await axios.put(`/api/instock/${id}`, {
        amount: AmountCurrent + AmountData,
      });
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["parts"] });
      queryClient.invalidateQueries({ queryKey: ["history"] });
      await AddRehistory(
        username,
        Part.code,
        Part.type,
        Part.name,
        AmountData,
        Part.brand,
        Part.costPrice,
        Part.sellPrice,
        "เติมสินค้า"
      );
      showNotification({
        title: "เติมสินค้าสำเร็จ",
        message: "เติมสินค้า " + name + " " + AmountData + " ชิ้น",
        color: "blue",
        icon: null,
      });
    },
    onError: (error) => {
      showNotification({
        title: "เติมสินค้าไม่สำเร็จ",
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
    Remutation.mutate(PartId);
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

export default RestockPartModal;
