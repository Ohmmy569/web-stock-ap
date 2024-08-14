"use client";

import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  PasswordInput,
  Select,
  TextInput,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { User } from "@/app/type";
import { useMutation , useQueryClient} from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  Nameusers: string[];
  invlidate: () => void;
}

const AddUserModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  Nameusers,
  invlidate,

}) => {
  const [Email, setEmail] = useState("");
  const [Role, setRole] = useState("");
  const [Password, setPassword] = useState("");
  const NameUsers = Nameusers || [];
  const schema = z
    .object({
      username: z
        .string()
        .nonempty({ message: "กรุณากรอกชื่อผู้ใช้งาน" })
        .refine(
          (value) => {
            if (NameUsers.includes(value + "@gmail.com")) {
              return false;
            }
            return true;
          },
          { message: "มีผู้ใช้งานนี้อยู่แล้ว" }
        ),
      password: z
        .string()
        .nonempty({ message: "กรุณากรอกรหัสผ่าน" })
        .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
      confirm_password: z
        .string()
        .nonempty({ message: "กรุณายืนยันรหัสผ่าน" })
        .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),

      role: z.string().nonempty({ message: "กรุณาเลือกสิทธิ์การใช้งาน" }),
    })
    .refine((data) => data.password == data.confirm_password, {
      message: "รหัสผ่านไม่ตรงกัน",
      path: ["confirm_password"],
    });

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
      confirm_password: "",
      role: "user",
    },
    validate: zodResolver(schema),
  });

  const queryClient = useQueryClient();
  const addMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/api/registerMember", {
        email: Email,
        password: Password,
        role: Role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersMember"] });
      invlidate();
      
      showNotification({
        title: "เพิ่มผู้ใช้งานสำเร็จ",
        message: "เพิ่มผู้ใช้ " + Email + " เรียบร้อย",
        color: "green",
        icon: null,
      });
    },
    onError: () => {
      showNotification({
        title: "เพิ่มผู้ใช้งานไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเพิ่มผู้ใช้งาน",
        color: "red",
        icon: null,
      });
    },
  });

  const handlesubmit = async (data: any) => {
    setEmail(data.username + "@gmail.com");
    setPassword(data.password);
    setRole(data.role);
    addMutation.mutate();
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
          <TextInput
            label="ชื่อผู้ใช้"
            placeholder="กรอกชื่อผู้ใช้งาน"
            mb={"xs"}
            {...form.getInputProps("username")}
          />
          <PasswordInput
            label="รหัสผ่าน"
            placeholder="กรอกรหัสผ่าน"
            type="password"
            mb={"xs"}
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="ยืนยันรหัสผ่าน"
            placeholder="กรอกรหัสผ่านอีกครั้ง"
            type="password"
            mb={"xs"}
            {...form.getInputProps("confirm_password")}
          />
          <Select
            label="สิทธิ์การใช้งาน"
            placeholder="เลือกสิทธิ์การใช้งาน"
            data={[
              { value: "admin", label: "admin" },
              { value: "user", label: "user" },
            ]}
            {...form.getInputProps("role")}
          />
          <Center>
            <Group justify="space-between" mt={15}>
              {" "}
              <Button color="green" mt="md" type="submit">
                เพิ่ม
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

export default AddUserModal;
