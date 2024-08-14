"use client";
import React, { useEffect } from "react";
import {
  AppShell,
  Burger,
  Group,
  Divider,
  NavLink,
  Box,
  Image,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCar,
  IconEngine,
  IconLogout,
  IconUser,
  IconHistory,
  IconArticleFilled,
  IconBrandToyota,
} from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { showNotification } from "@mantine/notifications";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const [opened,  { toggle , close}] = useDisclosure();
  const data = [
    {
      link: "/dashboard/parts",
      label: "อะไหล่รถยนต์",
      icon: IconEngine,
    },
    {
      link: "/dashboard/typeofparts",
      label: "ประเภทอะไหล่",
      icon: IconArticleFilled,
    },
    {
      link: "/dashboard/carbrand",
      label: "ยี่ห้อรถยนต์",
      icon: IconBrandToyota,
    },
    {
      link: "/dashboard/carmodel",
      label: "รุ่นรถยนต์",
      icon: IconCar,
    },

    {
      link: "/dashboard/partHistory",
      label: "ประวัติการเบิก - เติมอะไหล่",
      icon: IconHistory,
    },
  ];

  const handleClick = (event: any, index: any) => {
    router.push(data[index].link);
    event.preventDefault();
    close();
  };

  const pathname = usePathname();
  const LogOut = () => {
    signOut();
    showNotification({
      title: "ออกจากระบบ",
      message: "ออกจากระบบแล้ว",
      color: "blue",
    });
  };

  if (status === "authenticated") {
    const thisUser = session?.user as {
      name: string;
      email: string;
      role: string;
    };
    const name = thisUser.email.replace("@gmail.com", "");
    const role = thisUser.role;

    if (role === "admin") {
      data.push({
        link: "/dashboard/user",
        label: "รายการผู้ใช้งาน",
        icon: IconUser,
      });
    }

    return (
      <section>
        <AppShell
          header={{ height: 55 }}
          navbar={{
            width: 240,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
          padding="sm"
        >
          <AppShell.Header bg={"myblue"}>
            <Group h="100%" px="xs" justify="space-between" gap="xl">
              <Group>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  hiddenFrom="sm"
                  size="md"
                  c={"white"}
                  color="white"
                />{" "}
              </Group>

              <Image
                alt="Banner"
                w="100%"
                h={54}
                radius="md"
                src="/navicon.png"
                m={0}
              />
              <Text> </Text>
            </Group>
          </AppShell.Header>

          <AppShell.Navbar>
            <AppShell.Section grow>
              <Box>
                {data.map((item, index) => {
                  const isActive = pathname?.startsWith(item.link);

                  return (
                    <NavLink
                      href={item.link}
                      key={index}
                      active={isActive}
                      label={item.label}
                      leftSection={<item.icon size="2rem" stroke={2} />}
                      onClick={(event) => handleClick(event, index)}
                      color={"#4746ED"}
                      fw={900}
                      p={10}
                    />
                  );
                })}
              </Box>
            </AppShell.Section>
            <AppShell.Section pb={5}>
              <Divider p={5} size={2} />
              <Box>
                <NavLink
                  label={name}
                  leftSection={<IconUser size="2rem" stroke={2} />}
                  color={"myblue"}
                  c={"myblue"}
                  fw={900}
                  p={10}
                />
                <NavLink
                  label={<strong>ออกจากระบบ</strong>}
                  leftSection={<IconLogout size="2rem" stroke={2} />}
                  onClick={() => LogOut()}
                  color={"red"}
                  c={"red"}
                  fw={900}
                  p={10}
                />
              </Box>
            </AppShell.Section>
          </AppShell.Navbar>
          <AppShell.Main> {children}</AppShell.Main>
        </AppShell>
      </section>
    );
  }
}

DashboardLayout.requireAuth = true;
