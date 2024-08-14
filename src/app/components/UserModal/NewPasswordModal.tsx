"use client";
import {
  Box,
  Button,
  Center,
  Group,
  Modal,
  PasswordInput,
} from "@mantine/core";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import axios from "axios";

import { User } from "@/app/type";

interface ModalProps {
  opened: boolean;
  onClose: () => void;
  title: React.ReactNode;
  users: User;
}

const NewPassModal: React.FC<ModalProps> = ({
  opened,
  onClose,
  title,
  users,
}) => {
  const schema = z
    .object({
      password: z.string(),
      ConfirmPassword: z.string(),
    })
    .refine((data) => data.password == data.ConfirmPassword, {
      message: "รหัสผ่านไม่ตรงกัน",
      path: ["ConfirmPassword"],
    });
  const form = useForm({
    initialValues: {
      password: "",
      ConfirmPassword: "",
    },
    validate: zodResolver(schema),
  });

  function onClosed() {
    onClose();
    form.reset();
  }

  const handlesubmit = async (data: any, id: string) => {
    try {
      const res = await axios.patch(`/api/usersMember/${id}`, {
        password: data.password,
      });
      if (res.status === 200) {
        showNotification({
          title: "เปลี่ยนรหัสผ่านสำเร็จ",
          message: "เปลี่ยนรหัสผ่าน " + users.email + " เรียบร้อย",
          color: "green",
        });
      } else {
        showNotification({
          title: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
          message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
          color: "red",
        });
      }
      onClosed();
    } catch (error: any) {
      showNotification({
        title: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน",
        message: error.message,
        color: "red",
      });
      onClosed();
    }
  };
  return (
    <Modal opened={opened} onClose={onClosed} title={title} centered>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          form.onSubmit((data) => {
            handlesubmit(data, users._id);
            onClosed();
            form.reset();
          })();
        }}
      >
        <Box>
          <PasswordInput
            label="รหัสผ่าน"
            placeholder="กรอกรหัสผ่าน"
            mb={"xs"}
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="ยืนยันรหัสผ่าน"
            placeholder="กรอกยืนยันรหัสผ่าน"
            mb={"xs"}
            {...form.getInputProps("ConfirmPassword")}
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

export default NewPassModal;
