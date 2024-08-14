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
import { useEffect, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  brandCarName: string[] | undefined;
  modelCarName: string[] | undefined;
  Cars: Car | undefined;
}

const EditCarModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  modelCarName,
  brandCarName,
  Cars,
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
      brand: Cars?.brand || "",
      model: Cars?.name || "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    form.setFieldValue("brand", Cars?.brand || "");
    form.setFieldValue("model", Cars?.name || "");
  }, [Cars]);

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const queryClient = useQueryClient();
  const editMuntation = useMutation({
    mutationFn: async (id: any) => {
      await axios.put(`/api/modelcar/${id}`, {
        brand: brand,
        model: model,
      });
    },
    onSuccess: () => {
      showNotification({
        title: "แก้ไขยี่ห้อรถยนต์สำเร็จ",
        message: "แก้ไขยี่ห้อรถยนต์ " + brand + " " + model + " เรียบร้อย",
        color: "green",
        icon: null,
      });
      queryClient.invalidateQueries({ queryKey: ["car"] });
    },
    onError: () => {
      showNotification({
        title: "แก้ไขยี่ห้อรถยนต์ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างแก้ไขยี่ห้อรถยนต์",
        color: "red",
        icon: null,
      });
    },
  });

  const handlesubmit = async (data: any, carID: any) => {
    setBrand(data.brand);
    setModel(data.model);
    editMuntation.mutate(carID);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data, Cars?._id);
            form.reset();
            onClose();
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

export default EditCarModal;
