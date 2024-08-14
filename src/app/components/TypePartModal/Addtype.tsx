"use client";

import { Box, Button, Center, Group, Modal, TextInput } from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  typeName: string[] | undefined;
}

const AddTypePartModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  typeName,
}) => {
  const TypeName = typeName || [];
  const schema = z.object({
    name: z
      .string()
      .nonempty({ message: "กรุณากรอกชื่อประเภท" })
      .refine(
        (value) => {
          if (TypeName.includes(value)) {
            return false; // Invalid if the name already exists in Partname
          }
          return true; // Valid if the name doesn't exist in Partname
        },
        { message: "ชื่อประเภทซ้ำ" }
      ),
  });

  const form = useForm({
    initialValues: {
      name: "",
    },
    validate: zodResolver(schema),
  });

  const [name , setName] = useState("");
  const queryClient = useQueryClient();
  const addMuntation = useMutation({
    mutationFn: async (name: any) => {
      await axios.post("/api/typeofparts", { name });
    },
    onSuccess: () => {
      showNotification({
        title: "เพิ่มประเภทอ่ะไหล่สำเร็จ",
        message: "เพิ่มประเภท " + name + " เรียบร้อย",
        color: "green",
        icon: null,
      });
      queryClient.invalidateQueries({ queryKey: ["PartTypes"] });
    },
    onError: () => {
      showNotification({
        title: "เพิ่มประเภทอ่ะไหล่ไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มประเภทอ่ะไหล่",
        color: "red",
        icon: null,
      });
    },
  });

  const handlesubmit = async (data: any) => {
    setName(data.name);
    addMuntation.mutate(data.name);
  };

  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data);
            form.reset();
            onClose();
          })();
        }}
      >
        <Box>
          <TextInput
            label="ชื่อประเภทอ่ะไหล่"
            placeholder="กรอกประเภทอ่ะไหล่"
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

export default AddTypePartModal;
