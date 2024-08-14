"use client";
import { useEffect, useState } from "react";

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

import { User } from "@/app/type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  users: User;
  Nameusers: string[] | undefined;
  Users : User[];
  invlidate: () => void;
}

const EditUserModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  users,
  Nameusers,
  Users,
  invlidate,
}) => {
  const [Email, setEmail] = useState("");
  const [Role, setRole] = useState("");
  const [id , setId] = useState("");
  const schema = z.object({
    username: z
      .string()
      .nonempty({ message: "กรุณากรอกชื่อผู้ใช้งาน" })
      .refine(
        (value) => {
          if (Nameusers?.includes(value)) {
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

    role: z.string().nonempty({ message: "กรุณาเลือกสิทธิ์การใช้งาน" }),
  });

  const form = useForm({
    initialValues: {
      username: users?.email || "",
      password: users?.password || "",
      role: users?.role || "",
    },
    validate: zodResolver(schema),
  });

  useEffect(() => {
    form.setValues({
      username: users?.email || "",
      password: users?.password || "",
      role: users?.role || "",
    });
  }, [users]);

  function onClosed() {
    onClose();
    form.reset();
  }

  const queryClient = useQueryClient();
  const editMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.put(`/api/usersMember/${id}`, {
        email: Email,
        role: Role,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["usersMember"] });
      invlidate();
      showNotification({
        title: "แก้ไขผู้ใช้งานสำเร็จ",
        message: "แก้ไขผู้ใช้งาน " + Email + " สำเร็จ",
        color: "green",
      });
    },
    onError: () => {
      showNotification({
        title: "แก้ไขผู้ใช้งานไม่สำเร็จ",
        message: "แก้ไขผู้ใช้งานไม่สำเร็จ",
        color: "red",
      });
    },
  })

  const handlesubmit = async (data: any , UserId : string) => {
    setEmail(data.username);
    setRole(data.role);
    setId(UserId);
  };
  return (
    <Modal opened={opened} onClose={onClosed} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data , users._id);
            editMutation.mutate();
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
              <Button color="green" mt="md" type="submit">
                ยืนยัน
              </Button>{" "}
              <Button color="red" mt="md" onClick={onClosed}>
                ยกเลิก
              </Button>
            </Group>
          </Center>
        </Box>
      </form>
    </Modal>
  );
};

export default EditUserModal;
