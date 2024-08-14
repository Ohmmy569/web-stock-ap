"use client";
import  { useState } from "react";
import { useForm } from "@mantine/form";
import { zodResolver } from "mantine-form-zod-resolver";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import {
  Card,
  Container,
  Box,
  Button,
  TextInput,
  Center,
  rem,
  PasswordInput,
  Image,
  Loader,
} from "@mantine/core";
import { IconX, IconCheck } from "@tabler/icons-react";
import { showNotification } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";

type account = {
  username: string;
  password: string;
};

export default function Page() {
  const xIcon = <IconX style={{ width: rem(20), height: rem(20) }} />;
  const checkIcon = <IconCheck style={{ width: rem(20), height: rem(20) }} />;
  const matches = useMediaQuery("(min-width: 56.25em)");

  const schema = z.object({
    username: z.string().nonempty({ message: "กรุณากรอกชื่อผู้ใช้งาน" }),
    password: z
      .string()
      .nonempty({ message: "กรุณากรอกรหัสผ่าน" })
      .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" }),
  });

  const form = useForm({
    initialValues: {
      username: "",
      password: "",
    },
    validate: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handlesubmit = async (data: account) => {
    try {
      setIsLoading(true);
      const email = data.username + "@gmail.com";
      const password = data.password;

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      
      });
      
      if (res?.error) {
        setIsLoading(false);
        showNotification({
          title: "เข้าสู่ระบบไม่สำเร็จ",
          message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
          color: "red",
          icon: xIcon,
        });
        return;
      } else {
        showNotification({
          title: "เข้าสู่ระบบสำเร็จ",
          message: "เข้าสู่ระบบสำเร็จ",
          color: "green",
          icon: checkIcon,
        });

        router.push("/dashboard/parts");
      }

    
    } catch (error) {
      showNotification({
        title: "เข้าสู่ระบบไม่สำเร็จ",
        message: "เกิดข้อผิดพลาดระหว่างเข้าสู่ระบบ",
        color: "yellow",
        icon: xIcon,
      });
    }
  };

  return (
    <Container size="responsive" py={70}>
      <Center>
        <Card bg="#F8F9FA" shadow="xs" padding="lg" withBorder w={500}>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              form.onSubmit((data) => {
                handlesubmit(data);
         
              })();
            }}
          >
            <Card.Section>
              {matches ? (
              <Image
                alt="Banner"
                w="100%"
                h={260}
                radius="md"
                src="/banner.png"
                m={0}
              />
              ) : (
              <Image
                alt="Banner"
                w="100%"
                h={200}
                radius="md"
                src="/banner.png"
                m={0}
              />
              )
}
            </Card.Section>
            <Box mt={20}>
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
              <Center>
                <Button color="#070b91" fullWidth mt="md" type="submit">
                  {isLoading ? (<Loader color="white" size={"sm"} />) : "Log In"}
                </Button>
              </Center>
            </Box>
          </form>
        </Card>
   
      </Center>
    </Container>
  );
}
