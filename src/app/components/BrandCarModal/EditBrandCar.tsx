"use client";

import { Box, Button, Center, Group, Modal, TextInput } from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { CarBrand } from "@/app/type";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  BrandCarName: string[] | undefined;
  BrandCar: CarBrand;
}

const EditBrandCarModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  BrandCarName,
  BrandCar,
}) => {
  const TypeName = BrandCarName || [];

  const schema = z.object({
    name: z
      .string()
      .nonempty({ message: "กรุณากรอกยี่ห้อรถยนต์" })
      .refine(
        (value) => {
          if (TypeName.includes(value)) {
            return false; // Invalid if the name already exists in Partname
          }
          return true; // Valid if the name doesn't exist in Partname
        },
        { message: "ยี่ห้อรถยนต์ซ้ำ" }
      ),
  });

  const form = useForm({
    initialValues: {
      name: BrandCar?.brand || "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    form.setFieldValue("name", BrandCar?.brand || "");
  }, [BrandCar]);

  const [name, setName] = useState("");

  const queryClient = useQueryClient();
  const editMuntation = useMutation({
    mutationFn: async (id: any) => {
      await axios.put(`/api/brandcar/${id}`, {
        brand: name,
      });
    },
    onSuccess: () => {
      showNotification({
        title: "แก้ไขยี่ห้อรถยนต์สำเร็จ",
        message: "แก้ไขยี่ห้อรถยนต์ " + name + " เรียบร้อย",
        color: "green",
        icon: null,
      });
      queryClient.invalidateQueries({ queryKey: ["brandcars"] });
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

  const handlesubmit =  (data: any, brandID: any) => {
    setName(data.name);
    editMuntation.mutate(brandID);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data, BrandCar._id);
            form.reset();
            onClose();
          })();
        }}
      >
        <Box>
          <TextInput
            label="ยี่ห้อรถยนต์"
            placeholder="กรอกยี่ห้อรถยนต์"
            mb={"xs"}
            {...form.getInputProps("name")}
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

export default EditBrandCarModal;
