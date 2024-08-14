"use client";

import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  Select,
  TextInput,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { Car } from "@/app/type";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  brandCarName: string[] | undefined;
  modelCarName: string[] | undefined;
}

const AddCarModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  modelCarName,
  brandCarName,
}) => {
  const BrandCarName = brandCarName || [];
  const ModelCarName = modelCarName || [];

  const schema = z.object({
    model: z
      .string()
      .nonempty({ message: "กรุณากรอกรุ่นรถยนต์" })
      .refine(
        (value) => {
          if (ModelCarName.includes(value)) {
            return false; // Invalid if the name already exists in Partname
          }
          return true; // Valid if the name doesn't exist in Partname
        },
        { message: "รุ่นรถยนต์ซ้ำ" }
      ),
    brand: z.string().nonempty({ message: "กรุณาเลือกยี่ห้อรถยนต์" }),
  });

  const form = useForm({
    initialValues: {
      brand: "",
      model: "",
    },
    validate: zodResolver(schema),
  });

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const queryClient = useQueryClient();
  const addMuntation = useMutation({
    mutationFn: async () => {
      await axios.post("/api/modelcar", {
        brand: brand,
        model: model,
      });
    },
    onSuccess: () => {
      showNotification({
        title: "เพิ่มยี่ห้อรถยนต์สำเร็จ",
        message: "เพิ่มยี่ห้อรถยนต์ " + brand + " " + model + " เรียบร้อย",
        color: "green",
        icon: null,
      });
      queryClient.invalidateQueries({ queryKey: ["car"] });
    },
    onError: () => {
      showNotification({
        title: "เพิ่มยี่ห้อรถยนต์ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มยี่ห้อรถยนต์",
        color: "red",
        icon: null,
      });
    },
  });

  const handlesubmit = async (data: any) => {
    setBrand(data.brand);
    setModel(data.model);
    addMuntation.mutate();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data);
            onClose();
            form.reset();
          })();
        }}
      >
        <Box>
          <Select
            data={[
              ...BrandCarName.map((brand) => ({ label: brand, value: brand })),
            ]}
            placeholder="เลือกยี่ห้อรถยนต์"
            mb={"xs"}
            {...form.getInputProps("brand")}
          />
          <TextInput
            label="ยี่ห้อรถยนต์"
            placeholder="กรอกยี่ห้อรถยนต์"
            mb={"xs"}
            {...form.getInputProps("model")}
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

export default AddCarModal;
